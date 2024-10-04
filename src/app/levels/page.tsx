"use client";

import { atomLevels } from "@/atoms/userdata";
import { Input } from "@headlessui/react";
import { formatCss } from "culori";
import { produce } from "immer";
import { useAtom } from "jotai/react";

export default function PageLevels() {
  const [levels, setLevels] = useAtom(atomLevels);
  return (
    <section>
      <ol className="grid grid-cols-2 gap-2">
        <li className="contents">
          <span>level</span>
          <span>luminance</span>
        </li>
        {levels.map((level, index) => (
          <Level key={index} index={index} level={level} />
        ))}
      </ol>
    </section>
  );
}

const Level = (props: { index: number; level: number }) => {
  const { index, level } = props;
  const [levels, setLevels] = useAtom(atomLevels);
  const luminance = 100 - level;
  return (
    <li className="contents">
      <Input
        type="number"
        min={0}
        max={100}
        step={1}
        value={level}
        className="border p-2 w-20"
        onChange={(evt) => {
          const newLevelValue = parseInt(evt.target.value);
          setLevels(
            produce<number[]>(levels, (draftState) => {
              draftState[index] = newLevelValue;
            })
          );
        }}
      />
      <output className="p-1 flex gap-1 items-center">
        <div
          className="size-4 rounded-full"
          style={{
            background: formatCss({
              mode: "oklch",
              l: luminance / 100,
              c: 0,
              h: 0,
            }),
          }}
        />
        <span>{luminance}%</span>
      </output>
    </li>
  );
};
