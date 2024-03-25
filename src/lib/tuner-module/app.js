import sweetalert2 from 'sweetalert2';
import throttle from 'lodash.throttle';

import Tuner from '$lib/tuner-module/tuner';
import Notes from '$lib/tuner-module/notes';
import Meter from '$lib/tuner-module/meter';
import FrequencyBars from '$lib/tuner-module/frequency-bars';
import { getByteFrequencyData } from './config';


const Application = function () {
  this.initA4();
  this.tuner = new Tuner({
    a4: this.a4,
    notation: "abc"
  });

  this.notes = new Notes(".notes", this.tuner);
  this.meter = new Meter(".meter");

  this.frequencyBars = new FrequencyBars(".frequency-bars");
  this.update({
    name: "A",
    frequency: this.a4,
    octave: 4,
    value: 69,
    cents: 0,
  });
};

Application.prototype.initA4 = function () {
  this.$a4 = document.querySelector(".a4 span");
  this.a4 = getByteFrequencyData();
  this.$a4.innerHTML = this.a4;
};

Application.prototype.start = function () {
  const self = this;

  this.tuner.onNoteDetected = function (note) {
    
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note);
      } else {
        self.lastNote = note.name;
      }
    }
  };

  this.tuner.trottledOnNoteDetected = throttle(this.tuner.onNoteDetected, 100, { 'trailing': false });


  sweetalert2.fire("Welcome to online tuner!").then(function () {
    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
  });

  this.$a4.addEventListener("click", function () {
    sweetalert2
      .fire({ input: "number", inputValue: self.a4 })
      .then(function ({ value: a4 }) {
        if (!parseInt(a4) || a4 === self.a4) {
          return;
        }
        self.a4 = a4;
        self.$a4.innerHTML = a4;
        self.tuner.middleA = a4;
        self.notes.createNotes();
        self.update({
          name: "A",
          frequency: self.a4,
          octave: 4,
          value: 69,
          cents: 0,
        });
        localStorage.setItem("a4", a4);
      });
  });

  this.updateFrequencyBars();

  document.querySelector(".auto input").addEventListener("change", () => {
    this.notes.toggleAutoMode();
  });
};

Application.prototype.updateFrequencyBars = function () {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData);
    this.frequencyBars.update(this.frequencyData);
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this));
};

Application.prototype.update = function (note) {
  this.notes.update(note);
  this.meter.update((note.cents / 50) * 45);
};

const app = new Application();
app.start();
