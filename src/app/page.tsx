"use client";

import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import chroma from "chroma-js";
import clsx from "clsx";
import { produce } from "immer";
import { atom } from "jotai";
import { useAtom } from "jotai/react";
import { atomWithStorage } from "jotai/utils";
import { padStart, round } from "lodash";
import { CSSProperties, ReactNode } from "react";
import { LuCheck, LuCopy, LuEye, LuPlusCircle, LuShare } from "react-icons/lu";

interface ScaleData {
  hue: number;
  chromaMultiplier: number;
  chromaMaxPerLevel: number[];
}

const defaultChromasMaxPerLevel = [
  10, 25, 45, 70, 85, 95, 100, 97, 85, 65, 45, 30,
];
const defaultLevels = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95];

const atomLevels = atomWithStorage("chromaspec-levels", defaultLevels);

const atomUserData = atomWithStorage<ScaleData[]>("chromaspec-scales-2", []);

interface ScaleDataWithComputedData extends ScaleData {
  colors: chroma.Color[];
}

const allColors = atom<ScaleDataWithComputedData[]>((get) =>
  get(atomUserData).map(({ hue, chromaMultiplier, chromaMaxPerLevel }) => {
    return {
      hue,
      chromaMultiplier,
      chromaMaxPerLevel,
      colors: get(atomLevels).map((level, i) => {
        const lightness = 100 - level;
        const chromaValue = Math.max(
          0.5,
          Math.min((chromaMaxPerLevel ?? defaultChromasMaxPerLevel)[i], 100) *
            chromaMultiplier
        );
        return chroma.lch(lightness, chromaValue, hue);
      }),
    };
  })
);

enum EnumViewDataPoint {
  ScaleLevel,
  LCH_L,
  LCH_C,
  LCH_H,
  Hex,
  WCAG2_Luminance,
}

const uiDataEnumViewDataPoint = [
  { type: EnumViewDataPoint.ScaleLevel, label: "Scale Level" },
  { type: EnumViewDataPoint.LCH_L, label: "LCH Luminance" },
  { type: EnumViewDataPoint.LCH_C, label: "LCH Chroma" },
  { type: EnumViewDataPoint.LCH_H, label: "LCH Hue" },
  { type: EnumViewDataPoint.Hex, label: "Hex" },
  { type: EnumViewDataPoint.WCAG2_Luminance, label: "Relative Luminance" },
];

const atomDataPointVisibility = atomWithStorage<EnumViewDataPoint[]>(
  "chromaspec-display-settings-datapoint",
  [EnumViewDataPoint.LCH_L, EnumViewDataPoint.Hex]
);

const useGridSettings = (): {
  gap: number;
  columns: number;
  containerStyle: CSSProperties;
} => {
  const gap = 2; // dp
  const columns = defaultLevels.length;
  return {
    gap,
    columns,
    containerStyle: {
      gap: gap,
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    },
  };
};

function UIScale({
  hue,
  chromaMultiplier,
  colors,
  chromaMaxPerLevel,
  updateScale,
  methodDeleteScale,
}: ScaleDataWithComputedData & {
  updateScale: (s: Partial<ScaleData>) => void;
  methodDeleteScale: () => void;
}) {
  const [levels] = useAtom(atomLevels);
  const [dataPointVisibility] = useAtom(atomDataPointVisibility);
  const { containerStyle } = useGridSettings();
  return (
    <section className="flex gap-2">
      <header className="w-64 space-y-1">
        <Field className="flex items-center gap-2 rounded-lg bg-black/5 px-2 py-1.5 text-sm">
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
        <Popover>
          <PopoverButton className="flex items-center gap-2 rounded-lg bg-black/5 px-2 py-1.5 text-sm w-full">
            Saturation Curve
          </PopoverButton>
          <PopoverPanel
            anchor="bottom start"
            className="bg-white border rounded-lg p-3 space-y-1 text-sm w-96"
          >
            <div className="grid" style={containerStyle}>
              {chromaMaxPerLevel.map((value, index) => {
                return (
                  <Field
                    key={index}
                    className="flex flex-col text-sm items-center justify-between"
                  >
                    <Label className="text-zinc-700">{levels[index]}</Label>
                    <Input
                      type="range"
                      className="slider-vertical"
                      min={0}
                      max={100}
                      step={1}
                      value={value}
                      onChange={(evt) => {
                        const newArray = chromaMaxPerLevel.map(
                          (originalValue, _index) => {
                            return _index === index
                              ? parseFloat(evt.target.value)
                              : originalValue;
                          }
                        );
                        updateScale({ chromaMaxPerLevel: newArray });
                      }}
                    />
                    <output className="font-mono">{value}</output>
                  </Field>
                );
              })}
            </div>
            <button
              className="w-full border p-1 px-2"
              onClick={() => {
                updateScale({ chromaMaxPerLevel: defaultChromasMaxPerLevel });
              }}
            >
              reset to default
            </button>
          </PopoverPanel>
        </Popover>
        <Field className="flex items-center gap-2 rounded-lg bg-black/5 px-2 py-1.5 text-sm">
          <Label>
            Sat<sup>x</sup>
          </Label>
          <Input
            type="range"
            className="w-full"
            value={chromaMultiplier}
            onChange={(evt) => {
              const newValue = parseFloat(evt.target.value);
              updateScale({ chromaMultiplier: newValue });
            }}
            min={0}
            max={2.5}
            step={0.01}
          />
          <Listbox
            value={chromaMultiplier}
            onChange={(newValue) => {
              updateScale({ chromaMultiplier: newValue });
            }}
          >
            <ListboxButton
              className={clsx(
                "relative block text-left text-sm/6 text-black font-mono",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
              )}
            >
              {padStart(round(chromaMultiplier * 100, 1).toString(), 3, "0")}%
            </ListboxButton>
            <ListboxOptions
              transition
              className={clsx(
                "rounded-xl border border-black/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
              )}
              anchor="bottom"
            >
              {[0.01, 0.05, 0.5, 1, 1.5, 2].map((value) => {
                return (
                  <ListboxOption
                    key={value}
                    value={value}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
                  >
                    <LuCheck className="invisible size-4 text-black group-data-[selected]:visible" />
                    <div className="text-sm/6 text-black">{value * 100}%</div>
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </Listbox>
        </Field>
        <div className="flex flex-wrap gap-1">
          <button
            className="text-sm py-1.5 px-2 bg-black/5 rounded-lg hover:bg-black/10 flex items-center gap-2"
            onClick={() => {
              const svgFragment = `<svg>${colors
                .map((color) => color.hex().toUpperCase())
                .map((fill, i) => {
                  const id = `level ${defaultLevels[i]}`;
                  const y = i * 96;
                  return `<rect id="${id}" width="96" height="96" x="0" y="${y}" fill="${fill}" />`;
                })
                .join("\n")}</svg>`;
              navigator.clipboard.writeText(svgFragment);
            }}
          >
            <LuShare className="inline" /> Copy SVG
          </button>
          <Popover className="contents">
            <PopoverButton className="text-sm py-1.5 px-2 bg-black/5 rounded-lg hover:bg-black/10 flex items-center gap-2">
              Delete
            </PopoverButton>
            <PopoverPanel
              anchor="bottom start"
              className="flex items-center gap-1 bg-zinc-300 text-red-900 p-2 text-sm"
            >
              Confirm Delete Scale?
              <PopoverButton className="hover:text-green-500">No</PopoverButton>
              /
              <button
                className="hover:text-red-500"
                onClick={methodDeleteScale}
              >
                Yes
              </button>
            </PopoverPanel>
          </Popover>
        </div>
      </header>
      <div className="relative w-full flex flex-col">
        <ol className="w-full grid flex-grow" style={containerStyle}>
          {defaultLevels.map((level, i) => {
            const color = colors[i];
            const hex = color.hex().toUpperCase();
            const colorLCH = color.lch();
            const strLCH = colorLCH
              .map((x) => round(x, 1))
              .map((x) => padStart(x.toFixed(1), 2, " "));
            // @ts-ignore
            const copyStringLCH = color.css("lch");
            const relativeLuminance = round(color.luminance(), 2);
            return (
              <li className="text-sm space-y-1 flex flex-col">
                <div
                  className="w-full min-h-9 flex-grow rounded border touch-none"
                  style={{ background: `lch(${strLCH.join(" ")})` }}
                />
                {dataPointVisibility.length > 0 && (
                  <dl
                    className={clsx(
                      "grid grid-cols-3 gap-1 [&_dd]:text-right font-mono px-2 [&_dt]:text-gray-500 [&_dd]:col-span-2",
                      "select-none"
                    )}
                  >
                    {dataPointVisibility.includes(
                      EnumViewDataPoint.ScaleLevel
                    ) && <DtDd term="lv." desc={level} />}
                    {dataPointVisibility.includes(EnumViewDataPoint.LCH_L) && (
                      <DtDd
                        term="L"
                        desc={strLCH[0]}
                        copyString={copyStringLCH}
                      />
                    )}
                    {dataPointVisibility.includes(EnumViewDataPoint.LCH_C) && (
                      <DtDd
                        term="C"
                        desc={strLCH[1]}
                        copyString={copyStringLCH}
                      />
                    )}
                    {dataPointVisibility.includes(EnumViewDataPoint.LCH_H) && (
                      <DtDd
                        term="H"
                        desc={strLCH[2]}
                        copyString={copyStringLCH}
                      />
                    )}
                    {dataPointVisibility.includes(EnumViewDataPoint.Hex) && (
                      <DtDd
                        term="#"
                        desc={hex.replace("#", "")}
                        copyString={hex}
                      />
                    )}
                    {dataPointVisibility.includes(
                      EnumViewDataPoint.WCAG2_Luminance
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
      </div>
    </section>
  );
}

const DtDd = ({
  term,
  desc,
  copyString,
}: {
  term: ReactNode;
  desc: ReactNode;
  copyString?: string;
}) => {
  return (
    <>
      <dt>{term}</dt>
      <dd
        className={clsx("group relative", !!copyString && "cursor-pointer")}
        onClick={() => {
          if (copyString) {
            navigator.clipboard.writeText(copyString);
          }
        }}
      >
        {desc}
        {!!copyString && (
          <LuCopy className="absolute right-0 top-0 bottom-0 bg-white opacity-0 group-hover:opacity-100" />
        )}
      </dd>
    </>
  );
};

export default function Page() {
  const [dataPointVisibility, setDataPointVisibility] = useAtom(
    atomDataPointVisibility
  );
  const [scales, setScales] = useAtom(atomUserData);
  const [data] = useAtom(allColors);
  return (
    <main className="p-8 pt-4">
      <header className="pb-1 mb-2 border-b border-zinc-700">
        <h1 className="font-mono text-sm font-bold text-zinc-700 uppercase">
          Chromaspec
        </h1>
      </header>
      <section className="mb-4 flex gap-4 justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            className="border p-2 border-zinc-200 bg-zinc-100 text-zinc-800 text-sm flex gap-1 items-center rounded-lg hover:bg-zinc-200 active:bg-zinc-100"
            onClick={() =>
              setScales([
                ...scales,
                {
                  hue: 0,
                  chromaMultiplier: 1,
                  chromaMaxPerLevel: defaultChromasMaxPerLevel,
                },
              ])
            }
          >
            <LuPlusCircle />
            add scale
          </button>
        </div>
        <Fieldset className="flex gap-2 items-center">
          <Legend>
            <LuEye />
          </Legend>
          {uiDataEnumViewDataPoint.map(({ type, label }) => {
            const checked = dataPointVisibility.includes(type);
            return (
              <Field className="flex gap-1 items-center">
                <Input
                  type="checkbox"
                  checked={checked}
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      setDataPointVisibility([...dataPointVisibility, type]);
                    } else {
                      setDataPointVisibility(
                        dataPointVisibility.filter((item) => item !== type)
                      );
                    }
                  }}
                />
                <Label>{label}</Label>
              </Field>
            );
          })}
        </Fieldset>
      </section>
      <section className="space-y-4">
        {data.map((props, index) => {
          return (
            <UIScale
              key={index}
              {...props}
              updateScale={(partialData) =>
                setScales(
                  produce<ScaleData[]>(scales, (draftState) => {
                    draftState[index] = {
                      ...draftState[index],
                      ...partialData,
                    };
                  })
                )
              }
              methodDeleteScale={() => {
                setScales(
                  produce<ScaleData[]>(scales, (draftState) => {
                    draftState.splice(index, 1);
                  })
                );
              }}
            />
          );
        })}
      </section>
    </main>
  );
}
