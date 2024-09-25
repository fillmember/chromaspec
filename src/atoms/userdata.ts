import chroma from "chroma-js";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface ScaleData {
  name: string;
  hue: number;
  chromaMultiplier: number;
  chromaMaxPerLevel: number[];
}

export const defaultChromasMaxPerLevel = [
  10, 25, 45, 70, 85, 95, 100, 97, 85, 65, 45, 30,
];
export const defaultLevels = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95];

export const atomLevels = atomWithStorage("chromaspec-levels", defaultLevels);

export const atomUserData = atomWithStorage<ScaleData[]>(
  "chromaspec-scales-2",
  []
);

export interface ScaleDataWithComputedData extends ScaleData {
  levels: number[];
  colors: chroma.Color[];
}

export const allColors = atom<ScaleDataWithComputedData[]>((get) => {
  const levels = get(atomLevels);
  return get(atomUserData).map(
    ({ name, hue, chromaMultiplier, chromaMaxPerLevel }) => {
      return {
        name,
        hue,
        chromaMultiplier,
        chromaMaxPerLevel,
        levels,
        colors: levels.map((level, i) => {
          const lightness = 100 - level;
          const chromaValue = Math.max(
            0.5,
            Math.min((chromaMaxPerLevel ?? defaultChromasMaxPerLevel)[i], 100) *
              chromaMultiplier
          );
          return chroma.lch(lightness, chromaValue, hue);
        }),
      };
    }
  );
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
        }" width="100" height="100" x="${x}" y="${y}" fill="${c.hex()}" />`;
      });
      return `<g id="Scale with Hue ${scale.hue}" y="${groupY}">${content}</g>`;
    })
    .join("\n")}</svg>`;
