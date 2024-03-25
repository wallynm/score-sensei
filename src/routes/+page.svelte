<script lang="ts">
  import basicScore from './score/score-basic';  
  import { convertAbcNotation, notePitchAbcParse } from '$lib/noteDictionary';
  import Tuner from '$lib/tuner-module/tuner.js';
  import { getByteFrequencyData } from '$lib/tuner-module/config';

  import 'abcjs/abcjs-audio.css';
  import './score/index.css';
	import { onMount } from 'svelte'

  let abcjs = null;
  let scoreAbcJS = null;
  let tuner = null;
  let tooltipStyle='';


  const CLASSNAME_CURRENT_NOTE = 'abcjs-note_selected';
  const CLASSNAME_CORRECT_NOTE = 'abcjs-note_correct';
  const CLASSNAME_NOTES = 'abcjs-note';
  const CLASSNAME_NOTE_HEAD = 'abcjs-notehead';
  const CLASSNAME_TOOLTIP = 'tooltip';

  type NoteScore = {
      abcNotation: string;
      solfegeNotation: string;
      domNode: HTMLElement;
    }

  type Score = {
    currentNotePositon: number;
    lastNotePosition: number;
    notes: NoteScore[];  
  };  
  
  let score:Score = {
    currentNotePositon: 0,
    lastNotePosition: 0,
    notes: []
  }

  const configureAbcJS = async () => {
    abcjs = await import("abcjs");

    scoreAbcJS = abcjs.renderAbc("paper", basicScore, {
      add_classes: true,
      clickListener: onUserInteractWithNote
    });
    return;
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
  }

  const onNoteDetected = (note: NoteScore) => {
    const abcNote = getCurrentNodeAbcNotation();
    console.info('note', note)

    if (abcNote === note.nameNotation) {
      score.lastNotePosition = score.currentNotePositon;
      markNoteAsCorrect(getNoteIndex(score.lastNotePosition));
      score.currentNotePositon = ++score.currentNotePositon;
      const currentNote = getNoteIndex(score.currentNotePositon);
      selectNote(currentNote);
      updateNoteTooltip(currentNote);
    }
  }

  const start = () => {
    tuner.init();
  }

  const getCurrentNote = (): NoteScore => {
    return score.notes[score.currentNotePositon];
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
    domNode.classList.add(CLASSNAME_CORRECT_NOTE);
  }

  const getCurrentNodeAbcNotation = (): string => {
    return notePitchAbcParse[getCurrentNote().abcNotation];
  }

  const deselectNote = (note: NoteScore) => {
    note.domNode.classList.remove(CLASSNAME_CURRENT_NOTE);
  }

  const updateNoteVisual = (note:NoteScore) => {
    note.domNode.classList.add(CLASSNAME_CURRENT_NOTE);
  }

  const updateNoteTooltip = (note:NoteScore) => {
    const tooltipEl = document.getElementsByClassName(CLASSNAME_TOOLTIP)[0];
    const tooltipBoundingBox = tooltipEl.getBoundingClientRect()

    const paddingLeft = tooltipEl.style.paddingLeft;
    const paddingRight = tooltipEl.style.paddingRight;
    const compensation = parseInt( paddingLeft, 10 ) + parseInt( paddingRight, 10 );

    console.info('tooltipEl.style', tooltipEl.style)

    console.info('>', paddingLeft)
    const offsetLeftCompensantion = (
      tooltipBoundingBox.width = (tooltipBoundingBox.width/2) - compensation
    );

    const offset = getElementOffset(note.domNode)
    const x = offset.top - 50;
    const y = offset.left - 5//offsetLeftCompensantion;


    tooltipStyle = `top: ${x}px; left: ${y}px; position: absolute; background-color: #f9f9f9; border: 1px solid #000; padding: 5px;`
  }

  const selectNote = (note:NoteScore) => {
    deselectNote(getNoteIndex(score.lastNotePosition))
    updateNoteVisual(note)
  }

  const prepareScoreNotes = () => {
    const notes = document.getElementsByClassName(CLASSNAME_NOTES);

    for (let i = 0; i < notes.length; i++) {
      const noteDataName = notes[i].getElementsByClassName(CLASSNAME_NOTE_HEAD)[0].getAttribute('data-name')
      const scoreNote = noteDataName ? noteDataName : "";
      score.notes[i] = {
        domNode: notes[i] as HTMLElement,
        abcNotation: scoreNote,
        solfegeNotation: convertAbcNotation(scoreNote)
      }
    }
  }

  const configureScore = async () => {
    await prepareScoreNotes();
    updateNoteVisual(getCurrentNote())
  }

  onMount(async () => {
    await configureAbcJS();
    await configureTuner();
    await configureScore();
    await updateNoteTooltip(getCurrentNote());
	})

</script>

<div id="paper"></div>

<div class={CLASSNAME_TOOLTIP} style={tooltipStyle}>{score.notes[score.currentNotePositon] && (
  score.notes[score.currentNotePositon].solfegeNotation
)}</div>

<div>
  Partitura: {score.notes[score.currentNotePositon] && getCurrentNodeAbcNotation()}
</div>

<button on:click={start}>Start</button>
