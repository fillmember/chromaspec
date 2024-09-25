"use client";

import { allColors, ScaleDataWithComputedData } from "@/atoms/userdata";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import chroma from "chroma-js";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { round } from "lodash";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

interface Combination {
  bg: chroma.Color;
  bgLevel: number;
  fg: chroma.Color;
  fgLevel: number;
  contrast: number;
}

const getCombosWithContrastRatioOrMore = (
  bgScale: ScaleDataWithComputedData,
  fgScale: ScaleDataWithComputedData,
  minContrast: number,
  maxContrast = 21
): Combination[] => {
  const result: Combination[] = [];
  bgScale.colors.forEach((bg, bgIndex) => {
    fgScale.colors.forEach((fg, fgIndex) => {
      const contrast = chroma.contrast(bg, fg);
      if (contrast >= minContrast && contrast < maxContrast) {
        result.push({
          bg,
          bgLevel: bgScale.levels[bgIndex],
          fg,
          fgLevel: fgScale.levels[fgIndex],
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
        <h3 className="font-bold my-4 text-lg w-24">{title}</h3>
        <span className="text-zinc-700 flex-grow">{desc}</span>
        <span>{combinations.length} combos</span>
      </header>
      <ul className="flex flex-wrap gap-2">
        {combinations.map(({ bg, bgLevel, fg, fgLevel, contrast }, index) => (
          <li
            key={index}
            className="p-1 pt-2 rounded w-24 text-center"
            style={{ backgroundColor: bg.hex(), color: fg.hex() }}
          >
            <div className="text-lg font-bold mb-1">
              <span>lv.{fgLevel}</span>
              <hr style={{ borderColor: fg.hex() }} />
              <span>lv.{bgLevel}</span>
            </div>
            <span className="text-xs">{round(contrast, 1)}</span>
          </li>
        ))}
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
  const index = Math.floor(colors.length / 2);
  const color = colors[index];
  return (
    <div
      className={clsx("rounded-full", className)}
      style={{ backgroundColor: color.hex() }}
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
        className="pb-1 px-2 border-b border-zinc-700 inline-flex items-center gap-4"
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
        className="rounded-lg border text-lg bg-white shadow-lg"
      >
        {scales.map((candidate: ScaleDataWithComputedData, index) => (
          <ListboxOption
            key={index}
            value={candidate.name}
            className="flex items-center gap-4 py-2 px-4 hover:bg-zinc-100 cursor-pointer"
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
  ""
);
const atomSelectedFGScaleName = atomWithStorage<string>(
  "chromaspec-combo-fg-scale",
  ""
);

export default function PageCombinations() {
  const [scales] = useAtom(allColors);
  const [bgScaleName, setBGScaleName] = useAtom(atomSelectedBGScaleName);
  const [fgScaleName, setFGScaleName] = useAtom(atomSelectedFGScaleName);
  const combos = useMemo(() => {
    if (!bgScaleName || !fgScaleName) return {};
    const bgScale = scales.find((s) => s.name === bgScaleName);
    const fgScale = scales.find((s) => s.name === fgScaleName);
    console.log({ bgScaleName, bgScale, fgScaleName, fgScale });
    if (!bgScale || !fgScale) return {};
    return {
      "7": getCombosWithContrastRatioOrMore(bgScale, fgScale, 7),
      "4.5": getCombosWithContrastRatioOrMore(bgScale, fgScale, 4.5, 7),
      "3": getCombosWithContrastRatioOrMore(bgScale, fgScale, 3, 4.5),
    };
  }, [bgScaleName, fgScaleName]);
  return (
    <section className="space-y-8 my-8">
      <h2 className="text-2xl font-medium flex items-center gap-1">
        combos:{" "}
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
          <Link href="/" className="text-lg underline text-blue-800">
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
