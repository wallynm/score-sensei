export const CONFIG_MINIMUM_DECIBEIS = -40;
export const CONFIG_CLARITY_THRESHOLD = 0.8;
export const DEFAULT_NOTATION = 'solfege';

export const getByteFrequencyData = () => {
  return parseInt(localStorage.getItem("a4")) || 440;
}