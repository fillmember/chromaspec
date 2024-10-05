"use client";

import { atomLevels, defaultLevels } from "@/atoms/userdata";
import { Input } from "@headlessui/react";
import { formatCss } from "culori";
import { produce } from "immer";
import { useAtom } from "jotai/react";
import sortedUniq from "lodash/sortedUniq";
import { LuListOrdered, LuPlusCircle, LuRefreshCcw } from "react-icons/lu";

export default function PageLevels() {
  const [levels, setLevels] = useAtom(atomLevels);
  return (
    <section className="my-8 grid grid-cols-12 gap-8">
      <header className="prose col-span-4">
        <h2>Levels</h2>
        <p>
          Change the level value of each step of the color scales here. Level
          defines the step&apos;s color with the following formula:
          <pre>
            <code>lightness = 100 - level</code>
          </pre>
          level 0 will have 100% lightness and results in white (
          <code>#FFFFFF</code>), while level 100 will result in pitch black (
          <code>#000000</code>)
        </p>
      </header>
      <table className="col-span-5">
        <thead className="text-left">
          <tr>
            <th>level</th>
            <th>luminance</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((level, index) => (
            <Level key={index} index={index} level={level} />
          ))}
        </tbody>
      </table>
      <aside className="col-span-3 space-y-1">
        <button
          className="btn btn-full"
          onClick={() => setLevels([...levels, 100])}
        >
          <LuPlusCircle /> add level
        </button>
        <button
          className="btn btn-full"
          onClick={() => {
            const newLevels = levels.map((x) => x);
            newLevels.sort((a, b) => a - b);
            setLevels(sortedUniq(newLevels));
          }}
        >
          <LuListOrdered /> sort & dedupe
        </button>
        <button
          className="btn btn-full"
          onClick={() => {
            setLevels(defaultLevels);
          }}
        >
          <LuRefreshCcw /> reset to default
        </button>
      </aside>
    </section>
  );
}

const Level = (props: { index: number; level: number }) => {
  const { index, level } = props;
  const [levels, setLevels] = useAtom(atomLevels);
  const luminance = 100 - level;
  return (
    <tr>
      <td>
        <Input
          type="number"
          min={0}
          max={100}
          step={1}
          value={level}
          className="w-20 border p-2"
          onChange={(evt) => {
            const newLevelValue = parseInt(evt.target.value);
            setLevels(
              produce<number[]>(levels, (draftState) => {
                draftState[index] = newLevelValue;
              }),
            );
          }}
        />
      </td>
      <td>
        <output className="flex items-center gap-1">
          <div
            className="size-6 rounded-full"
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
      </td>
    </tr>
  );
};
