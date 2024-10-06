import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { defaultScales } from "./defaultScales";
import { clampChroma, formatCss, formatHex, type Oklch } from "culori";
import { bellShapeCurve } from "@/utils/bellShapeCurve";
import { keyBy, mapValues, round, zipObject } from "lodash";

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

export const atomSVGAllScales = atom<string>((get) => {
  const scales = get(allColors);
  const levels = get(atomLevels);
  return `<svg>${scales
    .map((scale, i) => {
      const groupY = i * 120;
      const rects = scale.colors.map((c, i) => {
        const x = i * 100;
        const y = 0;
        return `\n    <rect id="level ${
          levels[i]
        }" width="100" height="100" x="${x}" y="${y}" fill="${formatHex(
          c,
        )}" />`;
      });
      return `\n  <g id="${scale.name}" y="${groupY}">${rects.join("")}\n  </g>`;
    })
    .join("")}\n</svg>`;
});

export const atomTailwindConfig = atom<string>((get) => {
  const scales = get(allColors);
  const levels = get(atomLevels);
  return JSON.stringify(
    mapValues(keyBy(scales, "name"), (scale) =>
      zipObject(
        levels,
        scale.colors.map((color) => formatHex(color)),
      ),
    ),
    null,
    2,
  );
});

export const atomJSONDesignTokens = atom<string>((get) => {
  const scales = get(allColors);
  const levels = get(atomLevels);
  return JSON.stringify(
    mapValues(keyBy(scales, "name"), (scale) =>
      zipObject(
        levels,
        scale.colors.map((color) => ({
          lightness: color.l,
          chroma: color.c,
          hue: color.h,
          css: formatCss(color),
          hex: formatHex(color),
        })),
      ),
    ),
    null,
    2,
  );
});

export const atomCSSVariables = atom<string>((get) => {
  const scales = get(allColors);
  const levels = get(atomLevels);
  return scales
    .flatMap((scale) =>
      scale.colors.map(
        (color, index) =>
          `--color-${scale.name}-${levels[index]}: ${formatCss(color)};`,
      ),
    )
    .join("\n");
});

export const sharableLinkQueryString = atom<string>((get) => {
  const scales = get(atomUserData);
  const levels = get(atomLevels);
  const str = `${window.location.origin}?d=${btoa(JSON.stringify({ scales, levels }))}`;
  return str;
});

//

export const exportScalesAsSVG = (
  scales: ScaleDataWithComputedData[],
  levels: number[],
) => {
  return `<svg>${scales
    .map((scale, i) => {
      const groupY = i * 120;
      const rects = scale.colors.map((c, i) => {
        const x = i * 100;
        const y = 0;
        return `<rect id="level ${levels[i]}" width="100" height="100" x="${x}" y="${y}" fill="${formatHex(
          c,
        )}" />`;
      });
      return `<g id="Scale with Hue ${scale.hue}" y="${groupY}">${rects.join("")}</g>`;
    })
    .join("\n")}</svg>`;
};
