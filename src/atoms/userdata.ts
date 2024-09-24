import chroma from "chroma-js";
import { atomWithStorage } from "jotai/utils";

// const seed = atomWithStorage('chromaspecUserData', )

export type LCH = chroma.ColorSpaces["lch"];

export type Seed = { scale: string; color: LCH; fixed?: boolean };

export type UserData = {
  scales: string[];
  lightnessLevels: number[];
  seeds: Seed[];
};

export const scales = atomWithStorage<UserData["scales"]>("chromaspec-scales", [
  "neutral",
  "brand-primary",
  "brand-secondary",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "purple",
]);
export const lightnessLevels = atomWithStorage<UserData["lightnessLevels"]>(
  "chromaspec-lightness-levels",
  [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95].map((x) => 100 - x)
);
export const seeds = atomWithStorage<UserData["seeds"]>("chromaspec-seeds", []);

export type CMatrix = {
  name: string;
  colors: { level: number; color: LCH };
}[];

export const data = atomWithStorage<CMatrix>("chromaspeck-matrix", []);
