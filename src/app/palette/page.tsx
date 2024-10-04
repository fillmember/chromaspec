"use client";

import { atomUserData, ScaleData } from "@/atoms/userdata";
import {
  FieldChromaMultiplier,
  FieldHue,
  FieldName,
} from "@/components/RowScale";
import { useUserData } from "@/utils/useUserData";
import { clamp, round } from "lodash";

const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
const fnHueToCSSLCHString = (hue: number, saturation = 1) =>
  `lch(75% ${round(clamp(saturation * 100, 0, 100))}% ${hue}deg)`;

const styleLCHGradient = {
  background: `conic-gradient(${hues
    .map((hue) => `${fnHueToCSSLCHString(hue)} ${hue}deg`)
    .join(",")})`,
};

export default function PageInfo() {
  const { scales, updateScale, deleteScale } = useUserData();
  return (
    <div className="grid md:grid-cols-2 gap-8 m-8">
      <figure
        style={styleLCHGradient}
        className="rounded-full flex items-center justify-center aspect-square"
      >
        <div className="size-[95%] rounded-full bg-white relative">
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
            <li className="grid gap-1" key={index}>
              <FieldName key={index} {...props} />
              <FieldHue key={index} {...props} />
              <FieldChromaMultiplier key={index} {...props} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const ColorScale = (props: ScaleData & { index: number }) => {
  const { hue, name, chromaMultiplier } = props;
  const rotation = hue - 90;
  return (
    <div
      className="w-1/2 absolute top-[50%] left-[50%] flex items-center group"
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
        className="size-8 border border-zinc-400 flex-shrink-0 rounded-full group-hover:border-zinc-800"
        style={{
          background: fnHueToCSSLCHString(hue, chromaMultiplier),
        }}
      />
      <span
        className="pointer-events-none invisible group-hover:visible ml-1"
        style={{ transform: `rotate(${-rotation}deg)` }}
      >
        {name}
      </span>
    </div>
  );
};
