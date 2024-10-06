import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { defaultScales } from "./defaultScales";
import { clampChroma, formatHex, type Oklch } from "culori";
import { bellShapeCurve } from "@/utils/bellShapeCurve";
import { round } from "lodash";

export interface ScaleData {
  name: string;
  hue: number;
  chroma: {
    multiplier: number;
    peak: number;
    steepness: number;
  };
}

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
  return userData.map(({ name, hue, chroma }) => {
    const { peak, steepness, multiplier } = chroma;
    return {
      name,
      hue,
      chroma,
      levels,
      colors: levels.map((level, i) => {
        const l = (100 - level) / 100;
        const c =
          bellShapeCurve(
            peak,
            0.001 * Math.pow(1000, steepness),
            i / levels.length,
          ) * multiplier;
        const h = hue;
        const color = clampChroma({ mode: "oklch", l, c, h }, "oklch", "p3");
        color.c = round(color.c, 5);
        return color;
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
