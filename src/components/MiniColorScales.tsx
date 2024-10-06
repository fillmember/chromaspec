"use client";

import { allColors } from "@/atoms/userdata";
import { formatCss } from "culori";
import { useAtom } from "jotai/react";

export const MiniColorScales = () => {
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
