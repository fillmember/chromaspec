"use client";

import { ScaleData } from "@/atoms/userdata";
import { FieldName } from "@/components/RowScale";
import { Slider } from "@/components/Slider";
import { useUserData } from "@/utils/useUserData";
import { clampChroma, formatCss } from "culori";

const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
const fnHueToCSSLCHString = (hue: number, saturation = 1) =>
  formatCss(
    clampChroma(
      { mode: "oklch", c: 0.4 * saturation, l: 0.66, h: hue },
      "oklch",
    ),
  );

const styleLCHGradient = {
  background: `conic-gradient(${hues
    .map((hue) => `${fnHueToCSSLCHString(hue)} ${hue}deg`)
    .join(",")})`,
};

export default function PageInfo() {
  const { scales, updateScale, deleteScale } = useUserData();
  return (
    <div className="m-8 grid gap-8 md:grid-cols-2">
      <figure
        style={styleLCHGradient}
        className="flex aspect-square items-center justify-center rounded-full"
      >
        <div className="relative size-[95%] rounded-full bg-white">
          {scales.map((scale, index) => (
            <ColorScale key={index} {...scale} index={index} />
          ))}
        </div>
      </figure>
      <ol className="grid gap-4">
        {scales.map((scale, index) => {
          const props = {
            scale,
            updateScale: (partialData: Partial<ScaleData>) =>
              updateScale(index, partialData),
            deleteScale: () => deleteScale(index),
          };
          return (
            <li
              className="grid grid-cols-7 gap-2 rounded-xl border p-2"
              key={index}
            >
              <FieldName
                className="col-span-full flex items-baseline gap-4 text-lg"
                {...props}
              />
              <Slider
                clsField="contents"
                clsInput="col-span-5"
                clsOutput="text-right"
                label="Hue"
                value={props.scale.hue}
                setValue={(newValue) => props.updateScale({ hue: newValue })}
                min={0}
                max={360}
                step={1}
              />
              <Slider
                clsField="contents"
                clsInput="col-span-5"
                clsOutput="text-right"
                label={
                  <span>
                    x<sup>chroma</sup>
                  </span>
                }
                min={0}
                max={1.5}
                step={0.05}
                value={props.scale.chroma.multiplier}
                setValue={(multiplier) =>
                  props.updateScale({
                    chroma: { ...props.scale.chroma, multiplier },
                  })
                }
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const ColorScale = (props: ScaleData & { index: number }) => {
  const {
    hue,
    name,
    chroma: { multiplier: chromaMultiplier },
  } = props;
  const rotation = hue - 90;
  return (
    <div
      className="group absolute left-[50%] top-[50%] flex w-1/2 items-center"
      style={{
        transformOrigin: "0% 50%",
        transform: `translateY(-50%) rotate(${rotation}deg)`,
      }}
    >
      <div
        className="flex-shrink-0 bg-zinc-400 group-hover:bg-zinc-800"
        style={{ width: `${chromaMultiplier * 50}%`, height: 1 }}
      />
      <div
        className="size-8 flex-shrink-0 rounded-full border border-zinc-400 group-hover:border-zinc-800"
        style={{
          background: fnHueToCSSLCHString(hue, chromaMultiplier),
        }}
      />
      <span
        className="pointer-events-none invisible ml-1 group-hover:visible"
        style={{ transform: `rotate(${-rotation}deg)` }}
      >
        {name}
      </span>
    </div>
  );
};
