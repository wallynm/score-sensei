import { PitchDetector } from "pitchy";
import { noteDictionary } from "$lib/noteDictionary";
import { CONFIG_CLARITY_THRESHOLD, CONFIG_MINIMUM_DECIBEIS } from "./config";
import { note } from "./note";



const Tuner = function ({
  a4,
  notation,
  onNoteDetected
}) {
  this.notation = notation || "abc";
  this.middleA = a4 || 440;
  this.semitone = 69;
  this.bufferSize = 4096;
  this.noteStrings = noteDictionary[this.notation];
  this.notesMap = [];
  this.onNoteDetected = onNoteDetected;

  this.generateNotePitch();
  this.initGetUserMedia();
};


Tuner.prototype.generateNotePitch = function () {
  const scoreNotation = "abc";
  const a4 = this.middleA;

  const noteStrings = noteDictionary[scoreNotation];
  this.notesMap = [];
  const minOctave = 1;
  const maxOctave = 8;

  for (var octaveControl = minOctave; octaveControl <= maxOctave; octaveControl += 1) {
    for (var n = 0; n < 12; n += 1) {
      const value = 12 * (octaveControl + 1) + n;
      const octave = octaveControl.toString();
      const frequency = this.getStandardFrequency(
        value
      );
      this.notesMap.push(note({ frequency, value, octave }));
    }
  }
}


Tuner.prototype.initGetUserMedia = function () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!window.AudioContext) {
    return alert("AudioContext not supported");
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert("getUserMedia is not implemented in this browser");
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
};


function updatePitch(analyserNode, detector, input, sampleRate) {
  analyserNode.getFloatTimeDomainData(input);
  const [pitch, clarity] = detector.findPitch(input, sampleRate, CONFIG_MINIMUM_DECIBEIS);
  return {
    pitch: Math.round(pitch * 10) / 10,
    clarity
  }
}

Tuner.prototype.startRecord = function () {
  const self = this;

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      self.audioContext.createMediaStreamSource(stream).connect(self.analyser);
      self.analyser.connect(self.scriptProcessor);
      self.scriptProcessor.connect(self.audioContext.destination);
      self.scriptProcessor.addEventListener("audioprocess", 
      function (event) {

      const input = new Float32Array(self.detector.inputLength);
      const freq = updatePitch(self.analyser, self.detector, input, self.audioContext.sampleRate);
      
      if (freq.pitch) {
        const note = self.getNote(freq.pitch);

        self.onNoteDetected({
          name: self.noteStrings[note % 12],
          nameNotation: `${self.noteStrings[note % 12]}${parseInt(note / 12) - 1}`,
          value: note,
          cents: self.getCents(freq.pitch, note),
          octave: parseInt(note / 12) - 1,
          frequency: freq.pitch,
        });
      }
    });
  })
  .catch(function (error) {
    alert(error.name + ": " + error.message);
  });
};

Tuner.prototype.init = function () {
  this.audioContext = new window.AudioContext();
  this.analyser = this.audioContext.createAnalyser();
  this.scriptProcessor = this.audioContext.createScriptProcessor(
    this.bufferSize,
    1,
    1
  );

  this.detector = PitchDetector.forFloat32Array(this.analyser.fftSize);
  this.detector.minVolumeDecibels = CONFIG_MINIMUM_DECIBEIS;
  this.detector.clarityThreshold = CONFIG_CLARITY_THRESHOLD;
  this.startRecord();
};

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Tuner.prototype.getNote = function (frequency) {
  const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
  return Math.round(note) + this.semitone;
};

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Tuner.prototype.getStandardFrequency = function (note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12);
};

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Tuner.prototype.getCents = function (frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
  );
};

/**
 * play the musical note
 *
 * @param {number} frequency
 */
Tuner.prototype.play = function (frequency) {
  if (!this.oscillator) {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.audioContext.destination);
    this.oscillator.start();
  }
  this.oscillator.frequency.value = frequency;
};

Tuner.prototype.stopOscillator = function () {
  if (this.oscillator) {
    this.oscillator.stop();
    this.oscillator = null;
  }
};

export default Tuner;