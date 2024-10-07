"use client";

import {
  allColors,
  atomLevels,
  ScaleDataWithComputedData,
} from "@/atoms/userdata";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { type Oklch, wcagContrast, formatCss } from "culori";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { round } from "lodash";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { LuChevronDown } from "react-icons/lu";

interface Combination {
  bg: Oklch;
  bgLevel: number;
  fg: Oklch;
  fgLevel: number;
  contrast: number;
}

const getCombosWithContrastRatioOrMore = (
  levels: number[],
  bgScale: ScaleDataWithComputedData,
  fgScale: ScaleDataWithComputedData,
  minContrast: number,
  maxContrast = 21,
): Combination[] => {
  const result: Combination[] = [];
  bgScale.colors.forEach((bg, bgIndex) => {
    fgScale.colors.forEach((fg, fgIndex) => {
      const contrast = wcagContrast(bg, fg);
      if (contrast >= minContrast && contrast < maxContrast) {
        result.push({
          bg,
          bgLevel: levels[bgIndex],
          fg,
          fgLevel: levels[fgIndex],
          contrast,
        });
      }
    });
  });
  return result;
};

const Combinations = ({
  title,
  desc,
  combinations,
}: {
  title: ReactNode;
  desc: ReactNode;
  combinations?: Combination[];
}) => {
  if (!combinations) return null;
  return (
    <section>
      <header className="flex items-center gap-2">
        <h3 className="my-4 w-24 text-lg font-bold">{title}</h3>
        <span className="flex-grow text-zinc-700">{desc}</span>
        <span>{combinations.length} combos</span>
      </header>
      <ul className="flex flex-wrap gap-2">
        {combinations.map(({ bg, bgLevel, fg, fgLevel, contrast }, index) => {
          const hexBg = formatCss(bg);
          const hexFg = formatCss(fg);
          return (
            <li
              key={index}
              className="w-24 rounded p-1 pt-2 text-center"
              style={{ backgroundColor: hexBg, color: hexFg }}
            >
              <div className="mb-1 text-lg font-bold">
                <span>lv.{fgLevel}</span>
                <hr style={{ borderColor: hexFg }} />
                <span>lv.{bgLevel}</span>
              </div>
              <span className="text-xs">{round(contrast, 1)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const ScaleDisplay = ({
  scale,
  className = "size-6",
}: {
  scale: ScaleDataWithComputedData;
  className?: string;
}) => {
  const { colors } = scale;
  const index = Math.floor((colors.length - 1) / 2);
  const color = colors[index];
  return (
    <div
      className={clsx("rounded-full", className)}
      style={{ backgroundColor: formatCss(color) }}
    />
  );
};

const ScaleSelect = ({
  value = "",
  onChange,
  scales,
}: {
  value?: string;
  onChange: (newScale: string) => void;
  scales: ScaleDataWithComputedData[];
}) => {
  const selectedScale = scales.find((s) => s.name === value);
  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className="inline-flex items-center gap-4 border-b border-zinc-700 px-2 pb-1"
        disabled={scales.length === 0}
      >
        {!selectedScale && <div className="h-8 text-zinc-600">empty</div>}
        {!!selectedScale && (
          <>
            <ScaleDisplay scale={selectedScale} />
            {selectedScale.name}
          </>
        )}
        <LuChevronDown />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom start"
        className="rounded-lg border bg-white text-lg shadow-lg"
      >
        {scales.map((candidate: ScaleDataWithComputedData, index) => (
          <ListboxOption
            key={index}
            value={candidate.name}
            className="flex cursor-pointer items-center gap-4 px-4 py-2 hover:bg-zinc-100"
          >
            <ScaleDisplay scale={candidate} />
            {candidate.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

const atomSelectedBGScaleName = atomWithStorage<string>(
  "chromaspec-combo-bg-scale",
  "",
);
const atomSelectedFGScaleName = atomWithStorage<string>(
  "chromaspec-combo-fg-scale",
  "",
);

export default function PageCombinations() {
  const [levels] = useAtom(atomLevels);
  const [scales] = useAtom(allColors);
  const [bgScaleName, setBGScaleName] = useAtom(atomSelectedBGScaleName);
  const [fgScaleName, setFGScaleName] = useAtom(atomSelectedFGScaleName);
  const combos = useMemo(() => {
    if (!bgScaleName || !fgScaleName) return {};
    const bgScale = scales.find((s) => s.name === bgScaleName);
    const fgScale = scales.find((s) => s.name === fgScaleName);
    if (!bgScale || !fgScale) return {};
    return {
      "7": getCombosWithContrastRatioOrMore(levels, bgScale, fgScale, 7),
      "4.5": getCombosWithContrastRatioOrMore(levels, bgScale, fgScale, 4.5, 7),
      "3": getCombosWithContrastRatioOrMore(levels, bgScale, fgScale, 3, 4.5),
    };
  }, [scales, bgScaleName, fgScaleName, levels]);
  return (
    <section className="my-8 space-y-8">
      <h2 className="flex flex-wrap items-center gap-1 text-2xl font-medium">
        <span className="max-sm:mb-2 max-sm:block max-sm:w-full">combos:</span>
        <ScaleSelect
          scales={scales}
          value={fgScaleName}
          onChange={setFGScaleName}
        />{" "}
        on{" "}
        <ScaleSelect
          scales={scales}
          value={bgScaleName}
          onChange={setBGScaleName}
        />
      </h2>
      {scales.length === 0 && (
        <section>
          <h2 className="text-xl">No Scales Available</h2>
          <Link href="/" className="text-lg text-blue-800 underline">
            Go back to Scales
          </Link>
        </section>
      )}
      <Combinations
        title="7:1"
        desc="normal text AAA"
        combinations={combos["7"]}
      />
      <Combinations
        title="4.5:1"
        desc="normal text AA, large text AAA"
        combinations={combos["4.5"]}
      />
      <Combinations
        title="3:1"
        desc="large text AA, graphics AA"
        combinations={combos["3"]}
      />
    </section>
  );
}
