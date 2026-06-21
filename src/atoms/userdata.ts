import { bellShapeCurve } from "@/utils/bellShapeCurve";
import * as urlStorage from "@/utils/searchStringStorage";
import * as culori from "culori";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import * as jsoncrush from "jsoncrush";
import _ from "lodash";
import * as purify from "purify-ts";
import { defaultScales } from "./defaultScales";

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

const finiteNumber = purify.Codec.custom<number>({
  decode: (input) =>
    typeof input === "number" && Number.isFinite(input)
      ? purify.Either.of(input)
      : purify.Left(`Expected a finite number, got ${String(input)}`),
  encode: (input) => input,
});

const chromaCodec = purify.Codec.interface({
  multiplier: purify.number,
  peak: purify.number,
  steepness: purify.number,
});

const scaleDataCodec = purify.Codec.interface({
  name: purify.string,
  hue: purify.number,
  chroma: chromaCodec,
});

const arrEncoder = (x: number[]) => x.join("_");
const arrDecode = (raw: string): purify.Either<string, number[]> =>
  purify.array(finiteNumber).decode(raw.split("_").map((x) => parseInt(x)));

const objEncoder = (x: object) =>
  encodeURIComponent(jsoncrush.default.crush(JSON.stringify(x)));
const objDecode = (raw: string): purify.Either<string, ScaleData[]> =>
  purify.Either.encase(() =>
    JSON.parse(jsoncrush.default.uncrush(decodeURIComponent(raw))),
  )
    .mapLeft((err) => (err as Error).message)
    .chain((parsed) => purify.array(scaleDataCodec).decode(parsed));

export const atomLevels = atomWithStorage("l", defaultLevels, {
  getItem(key, initialValue) {
    return urlStorage.getItem<number[]>(key, initialValue, {
      encode: arrEncoder,
      decode: arrDecode,
    });
  },
  setItem(key, value) {
    urlStorage.setItem(key, arrEncoder(value));
  },
  removeItem: urlStorage.remove,
});

export const atomUserData = atomWithStorage<ScaleData[]>("s", defaultScales, {
  getItem(key, initialValue) {
    return urlStorage.getItem<ScaleData[]>(key, initialValue, {
      encode: objEncoder,
      decode: objDecode,
    });
  },
  setItem(key, value) {
    urlStorage.setItem(key, objEncoder(value));
  },
  removeItem: urlStorage.remove,
});

export interface Swatch {
  level: number;
  oklch: culori.Oklch;
  hex: string;
  css: string;
  luminance: number;
}

export interface ScaleDataWithComputedData extends ScaleData {
  swatches: Swatch[];
}

const computeSwatch = (
  level: number,
  index: number,
  count: number,
  hue: number,
  chroma: ScaleData["chroma"],
): Swatch => {
  const { peak, steepness, multiplier } = chroma;
  const l = (100 - level) / 100;
  const c =
    bellShapeCurve(peak, 0.001 * Math.pow(1000, steepness), index / count) *
    multiplier;
  const oklch = culori.clampChroma(
    { mode: "oklch", l, c, h: hue },
    "oklch",
    "p3",
  );
  oklch.c = _.round(c * 0.25 + oklch.c * 0.75, 5);
  oklch.h = oklch.h ?? 0;
  return {
    level,
    oklch,
    hex: culori.formatHex(oklch),
    css: culori.formatCss(oklch),
    luminance: _.round(culori.wcagLuminance(oklch), 2),
  };
};

export const allColors = atom<ScaleDataWithComputedData[]>((get) => {
  const levels = get(atomLevels);
  const userData = get(atomUserData);
  return userData.map(({ name, hue, chroma }) => ({
    name,
    hue,
    chroma,
    swatches: levels.map((level, index) =>
      computeSwatch(level, index, levels.length, hue, chroma),
    ),
  }));
});

/* - - - - */

export const atomSVGAllScales = atom<string>((get) => {
  const scales = get(allColors);
  return `<svg>${scales
    .map((scale, i) => {
      const groupY = i * 120;
      const rects = scale.swatches.map((swatch, j) => {
        const x = j * 100;
        const y = 0;
        return `\n    <rect id="level ${swatch.level}" width="100" height="100" x="${x}" y="${y}" fill="${swatch.hex}" />`;
      });
      return `\n  <g id="${scale.name}" y="${groupY}">${rects.join("")}\n  </g>`;
    })
    .join("")}\n</svg>`;
});

export const atomTailwindConfig = atom<string>((get) => {
  const scales = get(allColors);
  return JSON.stringify(
    _.mapValues(_.keyBy(scales, "name"), (scale) =>
      _.zipObject(
        scale.swatches.map((swatch) => swatch.level),
        scale.swatches.map((swatch) => swatch.hex),
      ),
    ),
    null,
    2,
  );
});

export const atomJSONDesignTokens = atom<string>((get) => {
  const scales = get(allColors);
  return JSON.stringify(
    _.mapValues(_.keyBy(scales, "name"), (scale) =>
      _.zipObject(
        scale.swatches.map((swatch) => swatch.level),
        scale.swatches.map(({ oklch, css, hex }) => ({
          lightness: oklch.l,
          chroma: oklch.c,
          hue: oklch.h,
          css,
          hex,
        })),
      ),
    ),
    null,
    2,
  );
});

export const atomCSSVariables = atom<string>((get) => {
  const scales = get(allColors);
  return scales
    .flatMap((scale) =>
      scale.swatches.map(
        (swatch) => `--color-${scale.name}-${swatch.level}: ${swatch.css};`,
      ),
    )
    .join("\n");
});

//

export const exportScalesAsSVG = (scales: ScaleDataWithComputedData[]) => {
  return `<svg>${scales
    .map((scale, i) => {
      const groupY = i * 120;
      const rects = scale.swatches.map((swatch, j) => {
        const x = j * 100;
        const y = 0;
        return `<rect id="level ${swatch.level}" width="100" height="100" x="${x}" y="${y}" fill="${swatch.hex}" />`;
      });
      return `<g id="Scale with Hue ${scale.hue}" y="${groupY}">${rects.join("")}</g>`;
    })
    .join("\n")}</svg>`;
};
