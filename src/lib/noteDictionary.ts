import Tuner from'$lib/tuner-module/tuner';
import { getByteFrequencyData } from'./tuner-module/config';


type NoteDictionary = {
  [key: string]: string[]
};

export const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const noteDictionary: NoteDictionary = {
  'solfege': [
    "DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI",
    "DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI",
    "DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "z (pausa)"
  ],
  'abc': [
    "C,", "^C,", "D,", "^D,", "E,", "F,", "^F,", "G,", "^G,", "A,", "^A,", "B,",
    "C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B",
    "c", "^c", "d", "^d", "e", "f", "^f", "g", "^g", "z"
  ]
};

export const notePitchAbcParse = {
 'C,':'C3',
  '^C,':'C#3',
  'D,':'D3',
  '^D,':'D#3',
  'E,':'E3',
  'F,':'F3',
  '^F,':'F#3',
  'G,':'G3',
  '^G,':'G#3',
  'A,':'A3',
  '^A,':'A#3',
  'B,':'B3',
  'C':'C4',
  '^C':'C#4',
  'D':'D4',
  '^D':'D#4',
  'E':'E4',
  'F':'F4',
  '^F':'F#4',
  'G':'G4',
  '^G':'G#4',
  'A':'A4',
  '^A':'A#4',
  'B':'B4',
  'c':'C5',
  '^c':'C#5',
  'd':'D5',
  '^d':'D#5',
  'e':'E5',
  'f':'F5',
  '^f':'F#5',
  'g':'G5',
  '^g':'G#5',
  'a':'A5',
  '^a':'A#5',
  'b':'B5',
  "c'":'C6',
  "^c'":'C#6',
  "d'":'D6',
  "^d'":'D#6',
  "e'":'E6',
  "f'":'F6',
  "^f'":'F#6',
  "g'":'G6',
  "^g'":'G#6',
  "z":'z',
}

export const convertAbcNotation = (note: string) => {
  const abcIndex = noteDictionary.abc.findIndex((abcNote) => abcNote === note);
  // if (abcIndex === -1) {
  //   throw new Error(`ABC notation for note "${note}" not found.`);
  // }
  return noteDictionary.solfege[abcIndex];
}