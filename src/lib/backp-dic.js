import Tuner from'$lib/tuner-module/tuner';
import { getByteFrequencyData } from'./tuner-module/config';


type NoteDictionary = {
  [key: string]: string[]
};

export const noteDictionary: NoteDictionary = {
'solfege': [
    "SOL",
    "SOL#",
    
    "LA",
    "LA",

    "SI",

    "DO",
    "DO#",
    "RE",
    "RE#",
    "MI",
    "FA",
    "FA#",
    "SOl",
    "SOl#",
    "LA",
    "LA#",
    "SI",

    "DO",
    "DO#",

    "RE",
    "RE#",

    "MI",

    "FA",
    "FA#",

    "SOL",
    "SOL#",

    "LA",
    "LA#",

    "SI",
    
    "DO",
    "DO#",
    "RE",
    "RE#",
  ],
'abc': [
    "G,",
    "^G,",
    "A,",
    "^A,",
    "B,",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",

    "c",
    "^c",

    "d",
    "^d",

    "e",

    "f",
    "^f",

    "g",
    "^g",

    "a",
    "^a",

    "b",

    "c'",
    "^c'",
    "d'",
    "^d'"
  ]
};



export const notePitchAbcParse = {
    // Octave 3
  'C,': 'C3',
  '^C,': 'C#3',
  'D,': 'D3',
  '^D,': 'D#3',
  'E,': 'E3',
  'F,': 'F3',
  '^F,': 'F#3',
  'G,': 'G3',
  '^G,': 'G#3',
  'A,': 'A3',
  '^A,': 'A#3',
  'B,': 'B3',
  
  // Octave 4
  'C': 'C4',
  '^C': 'C#4',
  'D': 'D4',
  '^D': 'D#4',
  'E': 'E4',
  'F': 'F4',
  '^F': 'F#4',
  'G': 'G4',
  '^G': 'G#4',
  'A': 'A4',
  '^A': 'A#4',
  'B': 'B4',
  
  // Octave 5
  'c': 'C5',
  '^c': 'C#5',
  'd': 'D5',
  '^d': 'D#5',
  'e': 'E5',
  'f': 'F5',
  '^f': 'F#5',
  'g': 'G5',
  '^g': 'G#5',
  'a': 'A5',
  '^a': 'A#5',
  'b': 'B5',

  // Octave 6
  'c\'': 'C6',
  '^c\'': 'C#6',
  'd\'': 'D6',
  '^d\'': 'D#6',
  'e\'': 'E6',
  'f\'': 'F6',
  '^f\'': 'F#6',
  'g\'': 'G6',
  '^g\'': 'G#6',
  'a\'': 'A6',
  '^a\'': 'A#6',
  'b\'': 'B6',

  // Optional - Adding direct C6, D6 keys for direct mapping
  'C6': 'C6',
  '^C6': 'C#6',
  'D6': 'D6',
  '^D6': 'D#6',
  'E6': 'E6',
  'F6': 'F6',
  '^F6': 'F#6',
  'G6': 'G6',
  '^G6': 'G#6',
  
  // Rest
  "z": '-'
}

export const convertAbcNotation = (note: string) => {
  console.info(note)
  const abcIndex = noteDictionary.abc.findIndex((abcNote) => abcNote === note)
  return noteDictionary.solfege[abcIndex];
}
