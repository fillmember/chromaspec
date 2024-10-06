"use client";

import { atomLevels } from "@/atoms/userdata";
import { Slider } from "@/components/Slider";
import { bellShapeCurve } from "@/utils/bellShapeCurve";
import { formatCss, formatHex, Oklch } from "culori";
import { useAtom } from "jotai";
import { round } from "lodash";
import { useMemo, useState } from "react";

export default function PageDebugGaussian() {
  const [h, setHue] = useState<number>(80);
  const [mean, setMean] = useState<number>(0.7);
  const [variance, setVariance] = useState<number>(0.64);
  const [count, setCount] = useState<number>(12);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [levels] = useAtom(atomLevels);
  const arr = useMemo(
    () =>
      Array.from(levels, (_, index) => index / count).map(
        (v) =>
          multiplier *
          bellShapeCurve(mean, 0.001 * Math.pow(1000, variance), v),
      ),
    [count, mean, multiplier, variance, levels],
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <Slider
        min={1}
        max={20}
        step={1}
        label="Count"
        value={count}
        setValue={setCount}
      />
      <Slider
        min={0}
        max={1}
        step={0.01}
        label="Mean"
        value={mean}
        setValue={setMean}
      />
      <Slider
        min={0.01}
        max={1}
        step={0.01}
        label="Variance"
        value={variance}
        setValue={setVariance}
      />
      <Slider
        min={0}
        max={360}
        step={1}
        label="Hue"
        value={h}
        setValue={setHue}
      />
      <Slider
        min={0.01}
        max={2}
        step={0.01}
        label="Multiplier"
        value={multiplier}
        setValue={setMultiplier}
      />
      <ol className="col-span-2 flex h-[240px] items-end border p-2 text-center font-mono text-xs">
        {arr.map((c, index) => {
          const l = (100 - levels[index]) / 100;
          const color: Oklch = { mode: "oklch", l, c, h };
          return (
            <li
              key={index}
              style={{ width: round(100 / count, 2) + "%" }}
              className="grid gap-2"
            >
              <div style={{ height: c * 100 }} className="w-full bg-black" />
              <span>lv.{levels[index]}</span>
              <span>c:{round(c * 100, 2)}%</span>
              <span>l:{l}</span>
              <div
                className="h-8 rounded-t"
                style={{ background: formatCss(color) }}
              />
              <div
                className="-mt-2 h-8 rounded-b"
                style={{ background: formatHex(color) }}
              />
              <span>{formatHex(color)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
