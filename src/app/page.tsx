"use client";

import {
  atomDataPointVisibility,
  uiDataEnumViewDataPoint,
} from "@/atoms/applicationState";
import { allColors } from "@/atoms/userdata";
import { RowScale } from "@/components/RowScale";
import { useUserData } from "@/utils/useUserData";
import { Field, Fieldset, Input, Label, Legend } from "@headlessui/react";
import { useAtom } from "jotai/react";
import { LuEye, LuPlusCircle } from "react-icons/lu";

export default function Page() {
  const [dataPointVisibility, setDataPointVisibility] = useAtom(
    atomDataPointVisibility,
  );
  const { addNewScale, updateScale, deleteScale } = useUserData();
  const [data] = useAtom(allColors);
  return (
    <>
      <section className="mb-2 flex max-w-full flex-wrap items-center justify-between gap-4 overflow-auto">
        <div className="flex items-center gap-2">
          <button className="btn" onClick={addNewScale}>
            <LuPlusCircle />
            add scale
          </button>
        </div>
        <Fieldset className="flex flex-grow items-center justify-between gap-3 text-sm md:justify-end md:text-base">
          <Legend>
            <LuEye />
          </Legend>
          {uiDataEnumViewDataPoint.map(({ type, label }) => {
            const checked = dataPointVisibility.includes(type);
            return (
              <Field className="flex items-center gap-1 leading-4" key={type}>
                <Input
                  type="checkbox"
                  checked={checked}
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      setDataPointVisibility([...dataPointVisibility, type]);
                    } else {
                      setDataPointVisibility(
                        dataPointVisibility.filter((item) => item !== type),
                      );
                    }
                  }}
                />
                <Label>{label}</Label>
              </Field>
            );
          })}
        </Fieldset>
      </section>
      <section className="space-y-4">
        {data.map((scale, index) => {
          return (
            <RowScale
              key={index}
              scale={scale}
              updateScale={(partialData) => updateScale(index, partialData)}
              deleteScale={() => deleteScale(index)}
            />
          );
        })}
      </section>
    </>
  );
}
