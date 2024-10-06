"use client";

import { allColors, ScaleData } from "@/atoms/userdata";
import { FieldName } from "@/components/RowScale";
import { Slider } from "@/components/Slider";
import { useUserData } from "@/utils/useUserData";
import { DragConfig, useDrag } from "@use-gesture/react";
import { clampChroma, formatCss } from "culori";
import { useAtom } from "jotai";
import { clamp, round } from "lodash";
import { useMemo } from "react";
import { useMeasure } from "react-use";

const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
const fnHueToCSSLCHString = (hue: number, saturation = 1) =>
  formatCss(
    clampChroma(
      { mode: "oklch", c: 0.7 * saturation, l: 0.66, h: hue },
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
      <div className="space-y-8">
        <ColorWheel />
        <MiniColorScales />
      </div>
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
              className="grid grid-cols-7 gap-2 rounded-xl border px-4 py-2"
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

const CONST_HANDLE_R = 20;

const ColorWheel = () => {
  const { scales, updateScale } = useUserData();
  const [ref, size] = useMeasure<SVGSVGElement>();
  const bag = useMemo(() => {
    const unitR = (size.width - CONST_HANDLE_R * 2) / 3;
    const originX = size.width / 2;
    const originY = size.height / 2;
    const bounds = {
      left: CONST_HANDLE_R,
      top: CONST_HANDLE_R,
      right: size.width - CONST_HANDLE_R * 2,
      bottom: size.height - CONST_HANDLE_R * 2,
    };
    return { unitR, originX, originY, bounds };
  }, [size]);
  return (
    <figure
      style={styleLCHGradient}
      className="flex aspect-square items-center justify-center rounded-full"
    >
      <svg ref={ref} className="size-[95%] rounded-full bg-white">
        <circle
          fill="transparent"
          strokeWidth={1}
          stroke="#EEE"
          cx={bag.originX}
          cy={bag.originY}
          r={bag.unitR}
        />
        <circle
          fill="transparent"
          strokeWidth={1}
          stroke="#EEE"
          cx={bag.originX}
          cy={bag.originY}
          r={bag.unitR * 1.5}
        />
        {scales.map((scale, index) => (
          <ColorScale
            key={index}
            {...scale}
            index={index}
            {...bag}
            updateScale={({ hue, multiplier }) => {
              updateScale(index, {
                hue,
                chroma: { ...scale.chroma, multiplier },
              });
            }}
          />
        ))}
      </svg>
    </figure>
  );
};

const ColorScale = (
  props: ScaleData & {
    index: number;
    updateScale: (args: { hue: number; multiplier: number }) => void;
    unitR: number;
    originX: number;
    originY: number;
    bounds: DragConfig["bounds"];
  },
) => {
  const {
    hue,
    chroma: { multiplier: chromaMultiplier },
    unitR,
    originX,
    originY,
    bounds,
    updateScale,
  } = props;
  const rotation = hue - 90;
  const r = unitR * chromaMultiplier;
  const cx = originX + r * Math.cos(rotation * 0.0174533);
  const cy = originY + r * Math.sin(rotation * 0.0174533);
  const strokeWidth = 1;
  const bind = useDrag(
    (state) => {
      const {
        offset: [x, y],
      } = state;
      const multiplier = clamp(
        round(
          Math.sqrt(Math.pow(x - originX, 2) + Math.pow(y - originY, 2)) /
            unitR,
          2,
        ),
        0,
        1.5,
      );
      const theta = Math.atan2(y - originY, x - originX);
      const rotation = theta * 57.2958;
      let newHue = round(rotation + 90);
      if (newHue < 0) newHue += 360;
      if (newHue > 360) newHue -= 360;
      updateScale({ hue: newHue, multiplier });
    },
    {
      from: [cx, cy],
      bounds,
    },
  );
  return (
    <g className="group stroke-zinc-200 hover:stroke-zinc-700">
      <line
        strokeWidth={strokeWidth}
        x1={originX}
        y1={originY}
        x2={cx}
        y2={cy}
      />
      <circle
        className="cursor-pointer"
        {...bind()}
        cx={cx}
        cy={cy}
        r={CONST_HANDLE_R}
        fill={fnHueToCSSLCHString(hue, chromaMultiplier)}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};

const MiniColorScales = () => {
  const [scales] = useAtom(allColors);
  return (
    <dl className="grid grid-cols-12 items-center text-sm text-zinc-600">
      {scales.map(({ name, colors }, index) => (
        <div className="contents" key={index}>
          <dt>{name}</dt>
          <dd className="col-span-11 flex">
            {colors.map((color, index) => (
              <div
                key={index}
                style={{ backgroundColor: formatCss(color) }}
                className="h-8 w-full"
              />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
};
