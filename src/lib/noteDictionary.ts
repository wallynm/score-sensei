import Tuner from'$lib/tuner-module/tuner';
import { getByteFrequencyData } from'./tuner-module/config';


type NoteDictionary = {
  [key: string]: string[]
};

export const noteDictionary: NoteDictionary = {
'solfege': [
    // "SOL",
    // "SOL#",
    
    // "LA",
    // "LA",

    // "SI",

    "DO",
    // "DO#",
    "RE",
    // "RE#",
    "MI",
    "FA",
    // "FA#",
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
    "-"
  ],
'abc': [
    // "G,",
    // "^G,",
    // "A,",
    // "^A,",
    // "B,",

    "C",
    // "C#",
    "D",
    // "D#",
    "E",
    "F",
    // "F#",
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
    "^d'",
    "z",
  ]
};



export const notePitchAbcParse = {
  'G,':'G4',
  '^G,':'E3#',
  'A,':'A3',
  '^A,':'?',
  'B,':'B3',
  'C':'C4',
  '^C':'C4#',
  'D':'D4',
  '^D':'D4#',
  'E':'E4',
  'F':'F4',
  '^F':'F4#',
  'G':'G4',
  '^G':'G4#',
  'A':'A4',
  '^A':'A4#',
  'B':'B4',
  'c':'C5',
  '^c':'C5#',
  'd':'D5',
  '^d':'D5#',

  'e':'E5',
  'f':'F5',
  '^f':'F5#',
  'g':'G5',
  '^g':'G5#',
  'a':'A5',
  '^a':'A5#',

  'b':'B5',
  "c'":'C6',
  "d'":'D6',
  "z":'-',
}

export const convertAbcNotation = (note: string) => {
  console.info(note)
  const abcIndex = noteDictionary.abc.findIndex((abcNote) => abcNote === note)
  return noteDictionary.solfege[abcIndex];
}
