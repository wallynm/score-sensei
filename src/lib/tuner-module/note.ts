import { noteDictionary } from "$lib/noteDictionary";
import { DEFAULT_NOTATION } from "./config";

interface noteType {
  frequency: number,
  value: number,
  octave: string,
  name: () => string
}

export const note = ({
  frequency = 0,
  value = 0,
  octave = '1'
}): noteType => {
  const getName = () => {
    console.info(noteDictionary, noteDictionary[DEFAULT_NOTATION])
    return noteDictionary[DEFAULT_NOTATION][value % 12]
  }

  return {
    frequency,
    value,
    octave,
    name: getName
  }
}