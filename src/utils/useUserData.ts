"use client";

import { atomUserData, ScaleData } from "@/atoms/userdata";
import { useAtom } from "jotai/react";
import { deleteItemById, setItemById } from "./arrayManipulation";
import { useCallback } from "react";
import { defaultScales } from "@/atoms/defaultScales";

export const useUserData = () => {
  const [scales, setScales] = useAtom(atomUserData);
  const addNewScale = useCallback(
    () =>
      setScales([...scales, { ...defaultScales[0], id: crypto.randomUUID() }]),
    [scales, setScales],
  );
  const updateScale = useCallback(
    (id: string, partialData: Partial<ScaleData>) =>
      setScales(setItemById(scales, id, partialData)),
    [scales, setScales],
  );
  const deleteScale = useCallback(
    (id: string) => setScales(deleteItemById(scales, id)),
    [scales, setScales],
  );
  return { scales, updateScale, addNewScale, deleteScale };
};
