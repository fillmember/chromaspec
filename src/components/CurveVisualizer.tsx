import { atomLevels, ScaleData } from "@/atoms/userdata";
import { bellShapeCurve } from "@/utils/bellShapeCurve";
import { useAtom } from "jotai";
import { round } from "lodash";
import { useMemo } from "react";

export const CurveVisualizer = ({
  peak: mean,
  steepness: variance,
  multiplier,
  className,
}: ScaleData["chroma"] & { className?: string }) => {
  const [levels] = useAtom(atomLevels);
  const count = levels.length;
  const values = useMemo(
    () =>
      Array.from(levels, (_, index) => index / count).map(
        (v) =>
          multiplier *
          bellShapeCurve(mean, 0.001 * Math.pow(1000, variance), v),
      ),
    [count, mean, multiplier, variance, levels],
  );
  return (
    <ol className={className}>
      {values.map((c, index) => (
        <li
          key={index}
          style={{
            width: round(100 / count, 2) + "%",
            height: round(c * 100, 2) + "%",
          }}
          className="min-w-[1px] overflow-hidden bg-black text-center text-xs text-white"
        >
          {levels[index]}
        </li>
      ))}
    </ol>
  );
};
