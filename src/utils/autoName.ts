export const listAscending = [
  { name: "rose", rangeMax: 15 },
  { name: "red", rangeMax: 30 },
  { name: "amber", rangeMax: 45 },
  { name: "orange", rangeMax: 60 },
  { name: "yellow", rangeMax: 75 },
  { name: "bronze", rangeMax: 90 },
  { name: "olive", rangeMax: 105 },
  { name: "sage", rangeMax: 120 },
  { name: "green", rangeMax: 135 },
  { name: "forest", rangeMax: 150 },
  { name: "emerald", rangeMax: 165 },
  { name: "turquoise", rangeMax: 180 },
  { name: "teal", rangeMax: 195 },
  { name: "cyan", rangeMax: 225 },
  { name: "sky", rangeMax: 240 },
  { name: "blue", rangeMax: 255 },
  { name: "indigo", rangeMax: 278 },
  { name: "purple", rangeMax: 320 },
  { name: "violet", rangeMax: 340 },
  { name: "pink", rangeMax: 360 },
];

const listDescending = listAscending.map((x) => x).reverse();

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
