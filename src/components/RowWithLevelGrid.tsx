import { useGridSettings } from "@/hooks/useGridSettings";
import clsx from "clsx";
import type { FC, ReactNode } from "react";

export const RowWithLevelGrid: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => {
  const gridSettings = useGridSettings();
  const style = {
    ...gridSettings.containerStyle,
    gridTemplateColumns: `16rem ${gridSettings.containerStyle.gridTemplateColumns}`,
  };
  return (
    <section className={clsx("grid", className)} style={style}>
      {children}
    </section>
  );
};
