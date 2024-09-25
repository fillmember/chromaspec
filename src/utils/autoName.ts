export const listAscending = [
  { name: "red", rangeMax: 15 },
  { name: "scarlet", rangeMax: 30 },
  { name: "orange", rangeMax: 45 },
  { name: "amber", rangeMax: 60 },
  { name: "brown", rangeMax: 75 },
  { name: "bronze", rangeMax: 90 },
  { name: "olive", rangeMax: 105 },
  { name: "lime", rangeMax: 120 },
  { name: "green", rangeMax: 135 },
  { name: "forest", rangeMax: 150 },
  { name: "teal", rangeMax: 165 },
  { name: "turquoise", rangeMax: 180 },
  { name: "cyan", rangeMax: 195 },
  { name: "sky", rangeMax: 210 },
  { name: "azure", rangeMax: 225 },
  { name: "blue", rangeMax: 240 },
  { name: "indigo", rangeMax: 255 },
  { name: "violet", rangeMax: 270 },
  { name: "purple", rangeMax: 285 },
  { name: "fuchsia", rangeMax: 300 },
  { name: "magenta", rangeMax: 315 },
  { name: "rose", rangeMax: 330 },
  { name: "blush", rangeMax: 345 },
  { name: "crimson", rangeMax: 360 },
];

const listDescending = listAscending.toReversed();

export const autoName = (hue: number, chromaMultiplier: number): string => {
  let prefix = "";
  if (chromaMultiplier < 0.1) {
    if (hue < 105 || hue > 314) {
      prefix = "warm-";
    } else {
      prefix = "cool-";
    }
    return prefix + "neutral";
  } else if (chromaMultiplier < 0.3) {
    prefix = "pale-";
  }
  let result = listAscending[0].name;
  for (const { name, rangeMax } of listDescending) {
    if (hue > rangeMax) {
      result = name;
      break;
    }
  }
  return prefix + result;
};
