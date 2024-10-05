import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { defaultScales } from "./defaultScales";
import { formatHex, type Oklch } from "culori";

export interface ScaleData {
  name: string;
  hue: number;
  chromaMultiplier: number;
  chromaMaxPerLevel: number[];
}

export const defaultChromasMaxPerLevel = [
  0.02, 0.05, 0.09, 0.14, 0.17, 0.19, 0.2, 0.2, 0.17, 0.13, 0.09, 0.06,
];
export const defaultLevels = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95];

export const atomLevels = atomWithStorage("chromaspec-levels", defaultLevels);

export const atomUserData = atomWithStorage<ScaleData[]>(
  "chromaspec-scales-2",
  defaultScales,
);

export interface ScaleDataWithComputedData extends ScaleData {
  levels: number[];
  colors: Oklch[];
}

export const allColors = atom<ScaleDataWithComputedData[]>((get) => {
  const levels = get(atomLevels);
  const userData = get(atomUserData);
  return userData.map(({ name, hue, chromaMultiplier, chromaMaxPerLevel }) => {
    return {
      name,
      hue,
      chromaMultiplier,
      chromaMaxPerLevel,
      levels,
      colors: levels.map((level, i) => {
        const l = (100 - level) / 100;
        const c = chromaMaxPerLevel[i] * chromaMultiplier;
        const h = hue;
        return { mode: "oklch", l, c, h };
      }),
    };
  });
});

/* - - - - */

export const exportScalesAsSVG = (scales: ScaleDataWithComputedData[]) =>
  `<svg>${scales
    .map((scale, i) => {
      const { levels } = scale;
      const groupY = i * 120;
      const content = scale.colors.map((c, i) => {
        const x = i * 100;
        const y = 0;
        return `<rect id="level ${
          levels[i]
        }" width="100" height="100" x="${x}" y="${y}" fill="${formatHex(
          c,
        )}" />`;
      });
      return `<g id="Scale with Hue ${scale.hue}" y="${groupY}">${content}</g>`;
    })
    .join("\n")}</svg>`;
