import Tuner from'$lib/tuner-module/tuner';
import { getByteFrequencyData } from'./tuner-module/config';


type NoteDictionary = {
  [key: string]: string[]
};

export const noteDictionary: NoteDictionary = {
'solfege': [
    "SOL",
    "LA",
    "SI",
    "DO",
    "RE",
    "MI",
    "FA",
    "FA#",
    "SOl",
    "SOl#",
    "LA",
    "LA#",
    "SI",
    "DO",
    "RE",
    "MI",
    "FA",
    "SOL",
    "LA",
    "SI",
    "DO",
    "RE",
  ],
'abc': [
    "G,",
    "A,",
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
    "d",
    "e",
    "f",
    "g",
    "a",
    "b",
    "c'",
    "d'"
  ]
};

export const notePitch = {
'C,':'',
'^C,':'',
'D,':'',
'E,':'',
'F,':'',
'G,':'',
'A,':'',
'B,':'',
'C':'DO',
'D':'RE',
'E':'MI',
'F':'',
'G':'',
'A':'',
'B':'',
'c':'',
'd':'',
'e':'',
'f':'',
'g':'',
'a':'',
'b':'DO'
}



export const notePitchAbcParse = {
  'G,':'E3',
  '^G,':'E#3',
  'A,':'F#3',
  '^A,':'?',
  'B,':'G#3',
  'C':'C4',
  '^C':'G,4',

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
}

export const convertAbcNotation = (note: string) => {
  console.info(note)
  const abcIndex = noteDictionary.abc.findIndex((abcNote) => abcNote === note)
  return noteDictionary.solfege[abcIndex];
}



/**
 * ABC -> Solfege -> Pitch / Scientific name
 * G, -> Sol -> E3
 * A, -> La -> F#3
 * B, -> Si -> G#3
 * C  -> Do -> 
 * D  -> Re ->
 */