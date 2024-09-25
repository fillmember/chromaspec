import { atomLevels } from "@/atoms/userdata";
import { useAtom } from "jotai";
import type { CSSProperties } from "react";

export const useGridSettings = (): {
  gap: number;
  columns: number;
  containerStyle: CSSProperties;
} => {
  const [levels] = useAtom(atomLevels);
  const gap = 2; // dp
  const columns = levels.length;
  return {
    gap,
    columns,
    containerStyle: {
      gap: gap,
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    },
  };
};
