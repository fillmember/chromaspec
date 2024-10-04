import { useGesture } from "@use-gesture/react";
import { MutableRefObject, useState, useMemo } from "react";

type DragMeasurementDataPoint = {
  level: number;
  relativeLuminance: number;
  mouseData: [number, number];
};

type DragMeasurementData = {
  dragging: boolean;
  contrastRatio: number | null;
  start: DragMeasurementDataPoint | null;
  end: DragMeasurementDataPoint | null;
};

export const useDragMeasurement = (
  parentRef?: MutableRefObject<HTMLDivElement | null>
): {
  bind: ReturnType<typeof useGesture>;
} & DragMeasurementData => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [start, setStart] = useState<DragMeasurementDataPoint | null>(null);
  const [end, setEnd] = useState<DragMeasurementDataPoint | null>(null);
  const bind = useGesture(
    {
      onPointerDown: ({ args: [level, relativeLuminance], event }) => {
        const rect = parentRef?.current?.getBoundingClientRect() || {
          left: 0,
          top: 0,
        };
        setDragging(true);
        setStart({
          level,
          relativeLuminance,
          mouseData: [event.clientX - rect.left, event.clientY - rect.top],
        });
      },
      onPointerMove: ({ args: [level, relativeLuminance], event }) => {
        if (dragging) {
          const rect = parentRef?.current?.getBoundingClientRect() || {
            left: 0,
            top: 0,
          };
          setEnd({
            level,
            relativeLuminance,
            mouseData: [event.clientX - rect.left, event.clientY - rect.top],
          });
        }
      },
      onPointerUp: () => {
        setDragging(false);
        setStart(null);
        setEnd(null);
      },
    },
    { drag: { axis: "x" } }
  );
  const contrastRatio = useMemo(() => {
    if (start && end) {
      let result =
        (start.relativeLuminance + 0.05) / (end.relativeLuminance + 0.05);
      if (result < 1) {
        result = 1 / result;
      }
      return result;
    }
    return null;
  }, [start, end]);
  return { bind, dragging, contrastRatio, start, end };
};

export const DragMeasurementDisplay = ({
  contrastRatio,
  start,
  end,
}: DragMeasurementData) => {
  return (
    <div className="absolute inset-0 pointer-events-none grid grid-cols-12 gap-1">
      {start?.mouseData && (
        <div
          className="absolute size-4 bg-white/5 border-2 border-black rounded-full ring ring-white"
          style={{
            left: start?.mouseData[0] - 8,
            top: start?.mouseData[1] - 8,
          }}
        />
      )}
      {end?.mouseData && (
        <div
          className="absolute size-4 bg-white/5 border-2 border-black rounded-full ring ring-white"
          style={{
            left: end?.mouseData[0] - 8,
            top: end?.mouseData[1] - 8,
          }}
        />
      )}
      {start && end && contrastRatio && contrastRatio > 0 && (
        <div
          className="text-sm p-2 bg-white border rounded absolute"
          style={{
            left: (end.mouseData[0] + start.mouseData[0]) / 2,
            top: (end.mouseData[1] + start.mouseData[1]) / 2 - 16,
          }}
        >
          {contrastRatio.toFixed(2)}
        </div>
      )}
    </div>
  );
};
