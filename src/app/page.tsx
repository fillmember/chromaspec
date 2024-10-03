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
    atomDataPointVisibility
  );
  const { addNewScale, updateScale, deleteScale } = useUserData();
  const [data] = useAtom(allColors);
  return (
    <>
      <section className="mb-2 flex gap-4 justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            className="border p-2 border-zinc-200 bg-zinc-100 text-zinc-800 text-sm flex gap-1 items-center rounded-lg hover:bg-zinc-200 active:bg-zinc-100"
            onClick={addNewScale}
          >
            <LuPlusCircle />
            add scale
          </button>
        </div>
        <Fieldset className="flex gap-2 items-center">
          <Legend>
            <LuEye />
          </Legend>
          {uiDataEnumViewDataPoint.map(({ type, label }) => {
            const checked = dataPointVisibility.includes(type);
            return (
              <Field className="flex gap-1 items-center" key={type}>
                <Input
                  type="checkbox"
                  checked={checked}
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      setDataPointVisibility([...dataPointVisibility, type]);
                    } else {
                      setDataPointVisibility(
                        dataPointVisibility.filter((item) => item !== type)
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
