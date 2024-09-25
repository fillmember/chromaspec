"use client";

import { allColors, ScaleDataWithComputedData } from "@/atoms/userdata";
import { DtDd } from "@/components/DtDd";
import chroma from "chroma-js";
import { useAtom } from "jotai";
import { round } from "lodash";
import { ReactNode, useMemo } from "react";

interface Combination {
  bg: chroma.Color;
  bgLevel: number;
  fg: chroma.Color;
  fgLevel: number;
  contrast: number;
}

const getCombosWithContrastRatioOrMore = (
  scale: ScaleDataWithComputedData,
  minContrast: number,
  maxContrast = 21
): Combination[] => {
  const { colors } = scale;
  const result: Combination[] = [];
  colors.forEach((bg, bgIndex) => {
    colors.forEach((fg, fgIndex) => {
      const contrast = chroma.contrast(bg, fg);
      if (contrast >= minContrast && contrast < maxContrast) {
        result.push({
          bg,
          bgLevel: scale.levels[bgIndex],
          fg,
          fgLevel: scale.levels[fgIndex],
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
  combinations: Combination[];
}) => {
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

export default function PageCombinations() {
  const [scales] = useAtom(allColors);
  const combos = useMemo(
    () =>
      scales.map((scale) => ({
        scale,
        "7": getCombosWithContrastRatioOrMore(scale, 7),
        "4.5": getCombosWithContrastRatioOrMore(scale, 4.5, 7),
        "3": getCombosWithContrastRatioOrMore(scale, 3, 4.5),
      })),
    [scales]
  );
  return (
    <section className="space-y-8 my-8">
      {combos.map(({ scale, ...combo }) => {
        return (
          <section>
            <h2 className="text-2xl font-medium">combos within {scale.name}</h2>
            <Combinations
              title="7:1"
              desc="normal text AAA"
              combinations={combo["7"]}
            />
            <Combinations
              title="4.5:1"
              desc="normal text AA, large text AAA"
              combinations={combo["4.5"]}
            />
            <Combinations
              title="3:1"
              desc="large text AA, graphics AA"
              combinations={combo["3"]}
            />
          </section>
        );
      })}
    </section>
  );
}
