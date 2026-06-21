import { ScaleData } from "./userdata";

export const defaultScales: ScaleData[] = [
  {
    id: "default-red",
    name: "red",
    hue: 25,
    chroma: { peak: 0.66, steepness: 0.68, multiplier: 1 },
  },
  {
    id: "default-orange",
    name: "orange",
    hue: 55,
    chroma: { peak: 0.52, steepness: 0.6, multiplier: 1 },
  },
  {
    id: "default-yellow",
    name: "yellow",
    hue: 85,
    chroma: { peak: 0.48, steepness: 0.56, multiplier: 1 },
  },
  {
    id: "default-green",
    name: "green",
    hue: 150,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.85 },
  },
  {
    id: "default-blue",
    name: "blue",
    hue: 243,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.5 },
  },
  {
    id: "default-purple",
    name: "purple",
    hue: 305,
    chroma: { peak: 0.43, steepness: 0.55, multiplier: 0.75 },
  },
  {
    id: "default-neutral",
    name: "neutral",
    hue: 235,
    chroma: { peak: 0.63, steepness: 0.8, multiplier: 0.02 },
  },
];
