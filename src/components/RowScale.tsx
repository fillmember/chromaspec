import {
  atomDataPointVisibility,
  EnumViewDataPoint,
} from "@/atoms/applicationState";
import {
  ScaleDataWithComputedData,
  ScaleData,
  atomLevels,
  defaultChromasMaxPerLevel,
  exportScalesAsSVG,
} from "@/atoms/userdata";
import { useGridSettings } from "@/hooks/useGridSettings";
import {
  Field,
  Label,
  Input,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { padStart, round } from "lodash";
import { LuCheck, LuShare } from "react-icons/lu";
import { DtDd } from "./DtDd";
import { RowWithLevelGrid } from "./RowWithLevelGrid";

const clsHeaderField =
  "flex items-center gap-2 rounded-lg bg-black/5 px-2 py-1.5 text-sm";

export function RowScale({
  scale,
  updateScale,
  methodDeleteScale,
}: {
  scale: ScaleDataWithComputedData;
  updateScale: (s: Partial<ScaleData>) => void;
  methodDeleteScale: () => void;
}) {
  const { name, hue, chromaMultiplier, colors, chromaMaxPerLevel } = scale;
  const [levels] = useAtom(atomLevels);
  const [dataPointVisibility] = useAtom(atomDataPointVisibility);
  const { containerStyle } = useGridSettings();
  return (
    <RowWithLevelGrid>
      <header className="space-y-1">
        <Field className={clsHeaderField}>
          <Label>Name</Label>
          <Input
            className="bg-transparent border-b border-zinc-300 w-full px-1 py-.5"
            value={name}
            onChange={(evt) => updateScale({ name: evt.target.value })}
          />
        </Field>
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
        <Field className={clsHeaderField}>
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
        <Popover>
          <PopoverButton className={clsx(clsHeaderField, "w-full")}>
            Max Saturation Per Step...
          </PopoverButton>
          <PopoverPanel
            anchor="bottom start"
            transition
            className="bg-white border rounded-lg p-3 space-y-1 text-sm w-96 shadow-lg transition duration-150 data-[closed]:scale-90 data-[closed]:opacity-0"
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
              className="w-full border p-1 px-2 rounded-md"
              onClick={() => {
                updateScale({ chromaMaxPerLevel: defaultChromasMaxPerLevel });
              }}
            >
              reset to default
            </button>
          </PopoverPanel>
        </Popover>

        <div className="flex flex-wrap gap-1">
          <button
            className="text-sm py-1.5 px-2 bg-black/5 rounded-lg hover:bg-black/10 flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(exportScalesAsSVG([scale]));
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
              transition
              className="flex items-center gap-1 bg-zinc-300 text-red-900 p-2 text-sm shadow-lg rounded-lg data-[closed]:scale-95"
            >
              Confirm Delete Scale?
              <PopoverButton className="hover:text-green-500">No</PopoverButton>
              /
              <PopoverButton
                className="hover:text-red-500"
                onClick={methodDeleteScale}
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
          const hex = color.hex().toUpperCase();
          const colorLCH = color.lch();
          const strLCH = colorLCH
            .map((x) => round(x, 1))
            .map((x) => padStart(x.toFixed(1), 2, " "));
          // @ts-ignore
          const copyStringLCH = color.css("lch");
          const relativeLuminance = round(color.luminance(), 2);
          return (
            <li className="text-sm space-y-1 flex flex-col" key={level}>
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
    </RowWithLevelGrid>
  );
}
