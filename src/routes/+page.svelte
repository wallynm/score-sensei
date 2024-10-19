<script lang="ts">
  
  // import * as scoreMusic from './score/index';
  // import scoreMusic from './score/score-basic';
  import { convertAbcNotation, notePitchAbcParse } from '$lib/noteDictionary';
  import Tuner from '$lib/tuner-module/tuner.js';
  import { getByteFrequencyData } from '$lib/tuner-module/config';
  
  import 'abcjs/abcjs-audio.css';
  import './score/index.css';
  import { onMount } from 'svelte'
  import { scoreNames } from './score/index';
  
  const DEFAULT_BPM = 120
  const CLASSNAME_CURRENT_NOTE = 'abcjs-note_selected';
  const CLASSNAME_CORRECT_NOTE = 'abcjs-note_correct';
  const CLASSNAME_NOTES = '.abcjs-note';
  const CLASSNAME_NOTE_HEAD = 'abcjs-notehead';
  const CLASSNAME_NOTE_REST = '.abcjs-rest';
  const CLASSNAME_TOOLTIP = 'tooltip';

  let abcjs = null;
  let scoreAbcJS = null;
  let tuner = null;
  let tooltipStyle='';
  $: selected = scoreNames[0];
  let nextTimingNote:any = null;
  let bpm = DEFAULT_BPM
  let parsedNotes: any[] | null = null;
  let notesWithDurations = [];

  type NoteScore = {
    abcNotation: string;
    solfegeNotation: string;
    domNode: HTMLElement;
    pitches: any;
    duration: any;
    startBeam: boolean;
    startChar: any;
    endChar: any;
  }
  
  type Score = {
    currentNotePositon: number;
    lastNotePosition: number;
    selectedNote: NoteScore | null;
    notes: NoteScore[];  
  };  
  
  let score:Score = {
    currentNotePositon: 0,
    lastNotePosition: 0,
    selectedNote: null,
    notes: []
  }

  function getNoteDuration(note:number) {
  
  // Calculate the duration of one beat (quarter note) in milliseconds
  const millisecondsPerBeat = (60 * 1000) / bpm;

  // A half note is 2 beats
  const halfNoteDuration = millisecondsPerBeat * (note * 8);

  return halfNoteDuration;
}

  
  const configureAbcJS = async () => {
    try {
      abcjs = await import("abcjs");
      const importedScore = await import(`./score/${selected}.js`);
      const score = importedScore.default;
      var myContext = new AudioContext();
      var synth = new abcjs.synth.CreateSynth();
  
      parsedNotes = abcjs.parseOnly(score);
      bpm = parsedNotes[0].metaText?.tempo?.bpm ?? DEFAULT_BPM;
      scoreAbcJS = abcjs.renderAbc("paper", score, {
        responsive: "resize",
        add_classes: true,
        clickListener: onUserInteractWithNote,
        // tablature: [
        //   {
        //     instrument: "violin",
        //     tuning: ["G,", "D", "A", "e"],
        //   },
        // ],
      });
      
      await configureSynth(abcjs, scoreAbcJS);
      await configureScore();
      await updateNoteTooltip(getCurrentNote());
      return;
    } catch (error) {
      console.error('error', error)
    }
  }
  
  
  const configureSynth = (abcjs, visualObj) => {
    var CursorControl = function() {
      this.beatSubdivisions = 2;
      this.onStart = function() {
        console.log("The tune has started playing.");
      }
      this.onFinished = function() {
        console.log("The tune has stopped playing.");
      }
      this.onBeat = function(beatNumber) {
        console.log("Beat " + beatNumber + " is happening.");
      }
      this.onEvent = function(event) {
        console.log("An event is happening", event);
      }
    }
    var cursorControl = new CursorControl();
    if (abcjs.synth.supportsAudio()) {
      var synthControl = new abcjs.synth.SynthController();



      synthControl.load("#audio", 
      cursorControl, 
      {
        displayLoop: true, 
        displayRestart: true, 
        displayPlay: true, 
        displayProgress: true, 
        displayWarp: true
      }
      );
      var audioParams = { chordsOff: true };
      var createSynth = new abcjs.synth.CreateSynth();
      createSynth.init({
        visualObj: visualObj[0],
        // options: {
        //   soundFontUrl: "https://localhost:5173/sounds/",
        //   pan: [ -0.3, 0.3 ] 
        // }
      }).then(function () {
        synthControl.setTune(visualObj[0], false, audioParams).then(function () {
          console.log("Audio successfully loaded.")
        }).catch(function (error) {
          console.warn("Audio problem:", error);
        });
      }).catch(function (error) {
        console.warn("Audio problem:", error);
      });
    } else {
      document.querySelector("#audio").innerHTML = 
      "Audio is not supported in this browser.";
    }
  
}

const setupScore = async () => {
  scoreAbcJS.render()
  return score;
}

const configureTuner = async () => {
  const notation = "abc";
  const a4 = getByteFrequencyData();
  tuner = new Tuner({
    a4,
    notation,
    onNoteDetected
  });
}

const onUserInteractWithNote = (note) => {
  if(note.el_type !== 'note') {
    return;
  }
  

  deselectNote(getCurrentNote());
  selectNote(getCurrentDomNode().getAttribute('data-index'))
  // selectNote(note)
}

const onNoteDetected = (note: NoteScore) => {
  const abcNote = getCurrentNodeAbcNotation();
  console.info('noteeee', abcNote, note)
  if(note.frequency < 100) {
    return;
  }
  
  const tempoNoteDetected = (nextTimingNote === null) || (Date.now() - nextTimingNote > 0);
  console.info('tempoNoteDetected', Date.now() - nextTimingNote)
  
  const restNotes = ['z']
  console.info('tempo', Date.now() - nextTimingNote, nextTimingNote,  Date.now())

  console.info('verification', abcNote)

  if ((abcNote === note.nameNotation || restNotes.includes(abcNote))) {
    let currentNote = getNoteIndex(score.currentNotePositon);
    nextTimingNote = Date.now() + getNoteDuration(currentNote.duration);
    console.info(currentNote)
    score.lastNotePosition = score.currentNotePositon;
    markNoteAsCorrect(getNoteIndex(score.lastNotePosition));
    score.currentNotePositon = ++score.currentNotePositon;
    currentNote = getNoteIndex(score.currentNotePositon);
    console.info('currentNote', currentNote)
    selectNote(currentNote);
    updateNoteTooltip(currentNote);
  }
}

const start = () => {
  tuner.init();
}

const getNoteByPosition =(position:number): NoteScore => {
  return score.notes[position];
}

const getCurrentNote = (): NoteScore => {
  return getNoteByPosition(score.currentNotePositon);
}

const getNoteIndex = (index:number) => {
  return score.notes[index];
}

const getElementOffset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

const getCurrentDomNode = (): HTMLElement => {
  return document.getElementsByClassName(CLASSNAME_CURRENT_NOTE)[0]
}

const markNoteAsCorrect = (note:NoteScore) => {
  if(!note) {
    return null;
  }
  const domNode = Array.isArray(note.domNode) ? note.domNode[0] : note.domNode;
  console.info('domNode', domNode)
  domNode.classList.add(CLASSNAME_CORRECT_NOTE);
}

const getCurrentNodeAbcNotation = (): string => {
  return notePitchAbcParse[getCurrentNote().abcNotation];
}

const getCurrentNodeSolfegeNotation = (notesAhead = 0): string => {
  console.info('wtf', getCurrentNote().solfegeNotation)
  return getCurrentNote().solfegeNotation
}

const deselectNote = (note: NoteScore) => {
  console.info('domNode', note.domNode)
  note.domNode.classList.remove(CLASSNAME_CURRENT_NOTE);
}

const updateNoteVisual = (note:NoteScore) => {
  console.info('domNode', note)
  note.domNode.classList.add(CLASSNAME_CURRENT_NOTE);
}

const updateNoteTooltip = (note:NoteScore) => {
  const tooltipEl = document.getElementsByClassName(CLASSNAME_TOOLTIP)[0];
  const tooltipBoundingBox = tooltipEl.getBoundingClientRect()
  
  const paddingLeft = tooltipEl.style.paddingLeft;
  const paddingRight = tooltipEl.style.paddingRight;
  const compensation = parseInt( paddingLeft, 10 ) + parseInt( paddingRight, 10 );
  
  
  const offsetLeftCompensantion = (
  tooltipBoundingBox.width = (tooltipBoundingBox.width/2) - compensation
  );
  
  const offset = getElementOffset(note.domNode)
  const x = offset.top - 50;
  const y = offset.left - 5//offsetLeftCompensantion;
  
  
  tooltipStyle = `top: ${x}px; left: ${y}px; position: absolute; background-color: #f9f9f9; border: 1px solid #000; padding: 5px;`
}

const selectNote = (note:NoteScore) => {
  score.selectedNote = note;
  deselectNote(getNoteIndex(score.lastNotePosition))
  updateNoteVisual(note)
}

const prepareScoreNotes= () => {
  const notes = document.querySelectorAll(`${CLASSNAME_NOTES},${CLASSNAME_NOTE_REST}`);
  const notesArray = Array.from(notes);
  
  if (!parsedNotes) {
    console.error('parsedNotes is null');
    return;
  }

  const tune = parsedNotes[0];

  tune.lines.forEach(function (line:any) {
      if (line.staff) {
        line.staff.forEach(function (staff:any) {
          if (staff.voices) {
            staff.voices.forEach(function (voice:any) {
              voice.forEach(function (element:any) {
                if (element.el_type === 'note') {
                  let currentDomNode = score.notes.length;
                  let noteDataName = notesArray[currentDomNode].getElementsByClassName(CLASSNAME_NOTE_HEAD)[0]?.getAttribute('data-name')
                  let scoreNote = noteDataName ? noteDataName : "";

                  if(element.rest) {
                    scoreNote = 'z';
                  }

                  score.notes = [
                    ...score.notes, {
                      domNode: notesArray[currentDomNode] as HTMLElement,
                      pitches: element.pitches,
                      duration: element.duration,
                      startBeam: element.startBeam ? true : false,
                      startChar: element.startChar,
                      endChar: element.endChar,
                      abcNotation: scoreNote,
                      solfegeNotation: convertAbcNotation(scoreNote)
                  }]
                }
              });
            });
          }
        });
      }
    });

    console.info('score.notes', score.notes)



  // for(let note of notesArray){
  //   const i = notesArray.indexOf(note)
  //   console.info(i)
  //   const noteDataName = note.getElementsByClassName(CLASSNAME_NOTE_HEAD)[0]?.getAttribute('data-name')
  //   const scoreNote = noteDataName ? noteDataName : "";
  //   var tune = parsedNotes[0];
  //   score.notes[i] = {
  //     domNode: notes[i] as HTMLElement,
  //     abcNotation: scoreNote,
  //     solfegeNotation: convertAbcNotation(scoreNote)
  //   }
  // };
  
  // for (let i = 0; i < notes.length; i++) {
  //   const noteDataName = notes[i].getElementsByClassName(CLASSNAME_NOTE_HEAD)[0].getAttribute('data-name')
  //   const scoreNote = noteDataName ? noteDataName : "";
  //   score.notes[i] = {
  //     domNode: notes[i] as HTMLElement,
  //     abcNotation: scoreNote,
  //     solfegeNotation: convertAbcNotation(scoreNote)
  //   }
  // }
}

const configureScore = async () => {
  await prepareScoreNotes();
  updateNoteVisual(getCurrentNote())
}

onMount(async () => {
  await configureAbcJS();
  await configureTuner();
})

</script>

<div id="audio"></div>
<select id="score-selection" bind:value={selected} on:change={configureAbcJS}>
  {#each scoreNames as name}
    <option value={name}>{name}</option>
  {/each}
</select>

<div style="max-width: 800px;margin: auto;">
  <div id="paper"></div>
</div>

  {#key [score.notes, score]}
  <div class={CLASSNAME_TOOLTIP} style={tooltipStyle}>
    {score.notes[score.currentNotePositon] && getCurrentNodeSolfegeNotation()}
  </div>
  {/key}

  
  <div>
    Partitura: {score.notes[score.currentNotePositon] && getCurrentNodeSolfegeNotation()}
  </div>
  <div>
    Próxima: {score.notes[score.currentNotePositon] && getNoteByPosition(score.currentNotePositon+1).solfegeNotation }
  </div>
  <div>
    Selected: {score.selectedNote && getNoteByPosition(score.selectedNote).solfegeNotation }
  </div>
  
  
  <button on:click={start}>Start</button>
  
  
  <!-- d4e4|f4g4|a4b4|c'4d'4d'4|b4a4|g4f4|e4d4|c4B4|A4G4|F4E4|D4C4|B,4A, -->