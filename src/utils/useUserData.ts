"use client";

import { atomUserData, ScaleData } from "@/atoms/userdata";
import { useAtom } from "jotai/react";
import { deleteItemAtIndex, setItemAtIndex } from "./arrayManipulation";
import { useCallback } from "react";
import { defaultScales } from "@/atoms/defaultScales";

export const useUserData = () => {
  const [scales, setScales] = useAtom(atomUserData);
  const addNewScale = useCallback(
    () => setScales([...scales, defaultScales[0]]),
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
