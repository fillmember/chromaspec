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
import {
  Field,
  Label,
  Input,
  Popover,
  PopoverButton,
  PopoverPanel,
  Fieldset,
} from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { round } from "lodash";
import { LuCopy, LuShare, LuTrash } from "react-icons/lu";
import { DtDd } from "./DtDd";
import { formatCss, formatHex, Oklch, wcagLuminance } from "culori";
import { Slider } from "./Slider";
import { CurveVisualizer } from "./CurveVisualizer";
import styles from "./RowScale.module.css";

const clsHeaderField =
  "flex items-center gap-2 rounded-lg bg-zinc-100 hover:bg-zinc-50 px-2 py-1.5";

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
  const { colors } = scale;
  const [levels] = useAtom(atomLevels);
  const [dataPointVisibility] = useAtom(atomDataPointVisibility);
  return (
    <section className={clsx(styles.row, "my-6 grid gap-4 border-b pb-6")}>
      <header className={clsx(styles.header, "space-y-1")}>
        <FieldName className={clsHeaderField} {...props} />
        <Slider
          label="Hue"
          value={props.scale.hue}
          setValue={(newValue) => updateScale({ hue: newValue })}
          min={0}
          max={360}
          step={1}
          clsField={clsHeaderField}
          clsInput="w-full"
          clsLabel="w-10"
          clsOutput="font-mono w-10 text-right"
        />
        <Popover>
          <PopoverButton className={clsx(clsHeaderField, "w-full")}>
            Chroma Settings
          </PopoverButton>
          <PopoverPanel
            anchor="bottom start"
            transition
            className="rounded-lg border bg-white p-3 shadow-lg transition duration-150 [--anchor-gap:4px] data-[closed]:scale-90 data-[closed]:opacity-0 max-md:w-[calc(100vw-4rem)]"
          >
            <ChromaCurveEditor {...props} />
          </PopoverPanel>
        </Popover>

        <div className="flex flex-wrap gap-1">
          <button
            className="btn"
            onClick={() => {
              navigator.clipboard.writeText(exportScalesAsSVG([scale], levels));
            }}
          >
            <LuShare /> Copy SVG
          </button>
          <Popover className="contents">
            <PopoverButton className="btn">
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
      <ol
        className={
          (styles.levels, "-mb-3 flex max-w-full gap-px overflow-auto pb-3")
        }
      >
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
            <li className="grid min-w-20 gap-1 text-sm" key={level}>
              <div className="grid grid-rows-2 self-stretch">
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
                    "grid select-none grid-cols-3 px-2 font-mono [&_dd]:col-span-2 [&_dd]:text-right [&_dt]:text-gray-500",
                  )}
                >
                  {dataPointVisibility.includes(
                    EnumViewDataPoint.ScaleLevel,
                  ) && <DtDd term="lv." desc={level} />}
                  {dataPointVisibility.includes(EnumViewDataPoint.LCH_L) && (
                    <DtDd term="L" desc={round(color.l, 2)} />
                  )}
                  {dataPointVisibility.includes(EnumViewDataPoint.LCH_C) && (
                    <DtDd term="C" desc={round(color.c, 2)} />
                  )}
                  {dataPointVisibility.includes(EnumViewDataPoint.LCH_H) && (
                    <DtDd term="H" desc={color.h} />
                  )}
                  {dataPointVisibility.includes(EnumViewDataPoint.Hex) && (
                    <DtDd
                      term="#"
                      desc={hex.replace("#", "").toUpperCase()}
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
    </section>
  );
}

export function FieldName(props: IRowScaleField & { className?: string }) {
  const {
    scale: { name },
    updateScale,
  } = props;
  return (
    <Field className={props.className}>
      <Label>Name</Label>
      <Input
        className="py-.5 w-full border-b border-zinc-300 bg-transparent px-1"
        value={name}
        onChange={(evt) => updateScale({ name: evt.target.value })}
      />
    </Field>
  );
}

export function ChromaCurveEditor(props: IRowScaleField) {
  const {
    scale: { chroma },
    updateScale,
  } = props;
  return (
    <Fieldset className="grid grid-cols-7 gap-1 text-sm">
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
        step={0.01}
        value={chroma.multiplier}
        setValue={(newValue) =>
          updateScale({ chroma: { ...chroma, multiplier: newValue } })
        }
        clsLabel="col-span-2"
        clsField="contents"
        clsInput="col-span-4"
        clsOutput="text-right"
      />
    </Fieldset>
  );
}
