"use client";

import { allColors } from "@/atoms/userdata";
import { useAtom } from "jotai/react";

export const MiniColorScales = () => {
  const [scales] = useAtom(allColors);
  return (
    <dl className="grid grid-cols-12 items-center text-sm text-zinc-600">
      {scales.map(({ id, name, swatches }) => (
        <div className="contents" key={id}>
          <dt>{name}</dt>
          <dd className="col-span-11 flex">
            {swatches.map((swatch, index) => (
              <div
                key={index}
                style={{ backgroundColor: swatch.css }}
                className="h-8 w-full"
              />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
};
