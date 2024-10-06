"use client";

import {
  atomDataPointVisibility,
  EnumViewDataPoint,
} from "@/atoms/applicationState";
import {
  ScaleDataWithComputedData,
  ScaleData,
  atomLevels,
  exportScalesAsSVG,
} from "@/atoms/userdata";
import { useGridSettings } from "@/utils/useGridSettings";
import {
  Field,
  Label,
  Input,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { padStart, round } from "lodash";
import { LuCheck, LuCopy, LuShare, LuSparkles, LuTrash } from "react-icons/lu";
import { DtDd } from "./DtDd";
import { RowWithLevelGrid } from "./RowWithLevelGrid";
import { autoName } from "@/utils/autoName";
import {
  filterContrast,
  filterInvert,
  formatCss,
  formatHex,
  Oklch,
  oklch,
  wcagLuminance,
} from "culori";
import { Slider } from "./Slider";
import { CurveVisualizer } from "./CurveVisualizer";

const clsHeaderField =
  "flex items-center gap-2 rounded-lg bg-black/5 px-2 py-1.5 text-sm";

export interface IRowScaleField {
  scale: ScaleData;
  updateScale: (s: Partial<ScaleData>) => void;
  deleteScale: () => void;
}

export interface IRowScale {
  scale: ScaleDataWithComputedData;
  updateScale: (s: Partial<ScaleData>) => void;
  deleteScale: () => void;
}

export function RowScale(props: IRowScale) {
  const { scale, updateScale, deleteScale } = props;
  const { colors, chroma } = scale;
  const [levels] = useAtom(atomLevels);
  const [dataPointVisibility] = useAtom(atomDataPointVisibility);
  const { containerStyle } = useGridSettings();
  return (
    <RowWithLevelGrid>
      <header className="space-y-1">
        <FieldName {...props} />
        <FieldHue {...props} />
        <Popover>
          <PopoverButton className={clsx(clsHeaderField, "w-full")}>
            Chroma Settings
          </PopoverButton>
          <PopoverPanel
            anchor="bottom start"
            transition
            className="grid w-96 grid-cols-7 gap-1 space-y-1 rounded-lg border bg-white p-3 text-sm shadow-lg transition duration-150 data-[closed]:scale-90 data-[closed]:opacity-0"
          >
            <CurveVisualizer
              className="col-span-full flex h-24 items-end"
              {...chroma}
            />
            <Slider
              label="Peak"
              min={0}
              max={1}
              step={0.01}
              value={chroma.peak}
              setValue={(newValue) =>
                updateScale({ chroma: { ...chroma, peak: newValue } })
              }
              clsLabel="col-span-2"
              clsField="contents"
              clsInput="col-span-4"
              clsOutput="text-right"
            />
            <Slider
              label="Curvature"
              min={0}
              max={1}
              step={0.01}
              value={chroma.steepness}
              setValue={(newValue) =>
                updateScale({ chroma: { ...chroma, steepness: newValue } })
              }
              clsLabel="col-span-2"
              clsField="contents"
              clsInput="col-span-4"
              clsOutput="text-right"
            />
            <Slider
              label="Multiplier"
              min={0}
              max={1.5}
              step={0.05}
              value={chroma.multiplier}
              setValue={(newValue) =>
                updateScale({ chroma: { ...chroma, multiplier: newValue } })
              }
              clsLabel="col-span-2"
              clsField="contents"
              clsInput="col-span-4"
              clsOutput="text-right"
            />
          </PopoverPanel>
        </Popover>

        <div className="flex flex-wrap gap-1">
          <button
            className="btn btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(exportScalesAsSVG([scale]));
            }}
          >
            <LuShare /> Copy SVG
          </button>
          <Popover className="contents">
            <PopoverButton className="btn btn-sm">
              <LuTrash />
              Delete
            </PopoverButton>
            <PopoverPanel
              anchor="bottom start"
              transition
              className="flex items-center gap-1 rounded-lg bg-zinc-300 p-2 text-sm text-red-900 shadow-lg data-[closed]:scale-95"
            >
              Confirm Delete Scale?
              <PopoverButton className="hover:text-green-500">No</PopoverButton>
              /
              <PopoverButton
                className="hover:text-red-500"
                onClick={deleteScale}
              >
                Yes
              </PopoverButton>
            </PopoverPanel>
          </Popover>
        </div>
      </header>
      <ol className="contents">
        {levels.map((level, i) => {
          const color = colors[i];
          const hex = formatHex(color);
          const cssOKLCH = formatCss(color);
          const relativeLuminance = round(wcagLuminance(color), 2);
          const onSurface: Oklch = {
            mode: "oklch",
            l: color.l > 0.5 ? 0 : 1,
            c: 0,
          };
          return (
            <li className="flex flex-col space-y-1 text-sm" key={level}>
              <div>
                <button
                  className="group flex min-h-9 w-full flex-grow touch-none items-center justify-center rounded-t border border-b-0 text-xs"
                  style={{
                    background: cssOKLCH,
                    color: formatCss(onSurface),
                  }}
                  onClick={() => navigator.clipboard.writeText(cssOKLCH)}
                >
                  <span className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <LuCopy /> OKLCH
                  </span>
                </button>
                <button
                  className="group flex min-h-9 w-full flex-grow touch-none items-center justify-center rounded-b border border-t-0 text-xs"
                  style={{
                    background: hex,
                    color: formatHex(onSurface),
                  }}
                  onClick={() => navigator.clipboard.writeText(hex)}
                >
                  <span className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <LuCopy /> HEX
                  </span>
                </button>
              </div>
              {dataPointVisibility.length > 0 && (
                <dl
                  className={clsx(
                    "grid grid-cols-3 gap-1 px-2 font-mono [&_dd]:col-span-2 [&_dd]:text-right [&_dt]:text-gray-500",
                    "select-none",
                  )}
                >
                  {dataPointVisibility.includes(
                    EnumViewDataPoint.ScaleLevel,
                  ) && <DtDd term="lv." desc={level} />}
                  {dataPointVisibility.includes(EnumViewDataPoint.LCH_L) && (
                    <DtDd
                      term="L"
                      desc={round(color.l, 2)}
                      copyString={cssOKLCH}
                    />
                  )}
                  {dataPointVisibility.includes(EnumViewDataPoint.LCH_C) && (
                    <DtDd
                      term="C"
                      desc={round(color.c, 2)}
                      copyString={cssOKLCH}
                    />
                  )}
                  {dataPointVisibility.includes(EnumViewDataPoint.LCH_H) && (
                    <DtDd term="H" desc={color.h} copyString={cssOKLCH} />
                  )}
                  {dataPointVisibility.includes(EnumViewDataPoint.Hex) && (
                    <DtDd
                      term="#"
                      desc={hex.replace("#", "")}
                      copyString={hex}
                    />
                  )}
                  {dataPointVisibility.includes(
                    EnumViewDataPoint.WCAG2_Luminance,
                  ) && (
                    <DtDd
                      term={
                        <>
                          L<sup>rel</sup>
                        </>
                      }
                      desc={relativeLuminance}
                    />
                  )}
                </dl>
              )}
            </li>
          );
        })}
      </ol>
    </RowWithLevelGrid>
  );
}

export function FieldHue(props: IRowScaleField) {
  const {
    scale: { hue },
    updateScale,
  } = props;
  return (
    <Field className={clsHeaderField}>
      <Label>Hue</Label>
      <Input
        type="range"
        className="w-full"
        value={hue}
        onChange={(evt) => {
          const newValue = parseFloat(evt.target.value);
          updateScale({ hue: newValue });
        }}
        min={0}
        max={360}
        step={1}
      />
      <span className="font-mono">{padStart(hue.toFixed(0), 3, "0")}</span>
    </Field>
  );
}

export function FieldName(props: IRowScaleField) {
  const {
    scale: {
      name,
      hue,
      chroma: { multiplier: chromaMultiplier },
    },
    updateScale,
  } = props;
  return (
    <Field className={clsHeaderField}>
      <Label>Name</Label>
      <Input
        className="py-.5 w-full border-b border-zinc-300 bg-transparent px-1"
        value={name}
        onChange={(evt) => updateScale({ name: evt.target.value })}
      />
    </Field>
  );
}
