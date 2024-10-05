"use client";

import {
  atomUserData,
  defaultChromasMaxPerLevel,
  ScaleData,
} from "@/atoms/userdata";
import { useAtom } from "jotai/react";
import { deleteItemAtIndex, setItemAtIndex } from "./arrayManipulation";
import { useCallback } from "react";

export const useUserData = () => {
  const [scales, setScales] = useAtom(atomUserData);
  const addNewScale = useCallback(
    () =>
      setScales([
        ...scales,
        {
          name: "new scale",
          hue: 0,
          chromaMultiplier: 1,
          chromaMaxPerLevel: defaultChromasMaxPerLevel,
        },
      ]),
    [scales, setScales],
  );
  const updateScale = useCallback(
    (index: number, partialData: Partial<ScaleData>) =>
      setScales(setItemAtIndex(scales, index, partialData)),
    [scales, setScales],
  );
  const deleteScale = useCallback(
    (index: number) => setScales(deleteItemAtIndex(scales, index)),
    [scales, setScales],
  );
  return { scales, updateScale, addNewScale, deleteScale };
};
