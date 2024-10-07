import { atomWithStorage } from "jotai/utils";

export enum EnumViewDataPoint {
  ScaleLevel,
  LCH_L,
  LCH_C,
  LCH_H,
  Hex,
  WCAG2_Luminance,
}

export const uiDataEnumViewDataPoint = [
  { type: EnumViewDataPoint.ScaleLevel, label: "Scale Level" },
  { type: EnumViewDataPoint.LCH_L, label: "LCH Lightness" },
  { type: EnumViewDataPoint.LCH_C, label: "LCH Chroma" },
  { type: EnumViewDataPoint.LCH_H, label: "LCH Hue" },
  { type: EnumViewDataPoint.Hex, label: "Hex" },
  { type: EnumViewDataPoint.WCAG2_Luminance, label: "Relative Luminance" },
];

export const atomDataPointVisibility = atomWithStorage<EnumViewDataPoint[]>(
  "chromaspec-display-settings-datapoint",
  [
    EnumViewDataPoint.ScaleLevel,
    EnumViewDataPoint.LCH_C,
    EnumViewDataPoint.Hex,
  ],
);
