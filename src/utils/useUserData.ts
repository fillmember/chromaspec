"use client";

import {
  atomUserData,
  defaultChromasMaxPerLevel,
  ScaleData,
} from "@/atoms/userdata";
import { produce } from "immer";
import { useAtom } from "jotai/react";

export const useUserData = () => {
  const [scales, setScales] = useAtom(atomUserData);
  const addNewScale = () =>
    setScales([
      ...scales,
      {
        name: "new scale",
        hue: 0,
        chromaMultiplier: 1,
        chromaMaxPerLevel: defaultChromasMaxPerLevel,
      },
    ]);
  const updateScale = (index: number, partialData: Partial<ScaleData>) =>
    setScales(
      produce<ScaleData[]>(scales, (draftState) => {
        draftState[index] = {
          ...draftState[index],
          ...partialData,
        };
      })
    );
  const deleteScale = (index: number) =>
    setScales(
      produce<ScaleData[]>(scales, (draftState) => {
        draftState.splice(index, 1);
      })
    );
  return { scales, updateScale, addNewScale, deleteScale };
};
