import Tuner from'$lib/tuner-module/tuner';
import { getByteFrequencyData } from'./tuner-module/config';


type NoteDictionary = {
  [key: string]: string[]
};

export const noteDictionary: NoteDictionary = {
'solfege': [
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
    "SI"
  ],
'abc': [
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
    "B"
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
'b':''
}



export const notePitchAbcParse = {
  'G,':'G3',
  '^G,':'G3#',
  'A,':'A3',
  '^A,':'A3#',
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
}

export const convertAbcNotation = (note: string) => {

  const abcIndex = noteDictionary.abc.findIndex((abcNote) => abcNote === note)
  console.info(note)
  return noteDictionary.solfege[abcIndex];
}
