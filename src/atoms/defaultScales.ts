import { ScaleData } from "./userdata";

export const defaultScales: ScaleData[] = [
  {
    name: "red",
    hue: 25,
    chroma: { peak: 0.66, steepness: 0.68, multiplier: 1 },
  },
  {
    name: "orange",
    hue: 55,
    chroma: { peak: 0.59, steepness: 0.55, multiplier: 1 },
  },
  {
    name: "yellow",
    hue: 85,
    chroma: { peak: 0.48, steepness: 0.56, multiplier: 1 },
  },
  {
    name: "green",
    hue: 150,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.85 },
  },
  {
    name: "blue",
    hue: 243,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.5 },
  },
  {
    name: "purple",
    hue: 305,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.75 },
  },
  {
    name: "neutral",
    hue: 235,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.01 },
  },
];
