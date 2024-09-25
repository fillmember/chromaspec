import { listAscending } from "@/utils/autoName";
import chroma from "chroma-js";

const svgSize = 500;
const center = svgSize / 2;
const radiusInner = 150;
const radiusOuter = 200;
const textRadius = 220;

const segments = listAscending.map((color, index, arr) => {
  const rangeMin = arr[index - 1]?.rangeMax ?? 0;
  const hue = (rangeMin + color.rangeMax) / 2;
  const fill = chroma.lch(50, 100, hue);
  const angleStart = (rangeMin / 360) * 2 * Math.PI;
  const angleEnd = (color.rangeMax / 360) * 2 * Math.PI;

  // Calculate positions for inner and outer arcs
  const x1Outer = center + radiusOuter * Math.cos(angleStart);
  const y1Outer = center + radiusOuter * Math.sin(angleStart);
  const x2Outer = center + radiusOuter * Math.cos(angleEnd);
  const y2Outer = center + radiusOuter * Math.sin(angleEnd);
  const x1Inner = center + radiusInner * Math.cos(angleStart);
  const y1Inner = center + radiusInner * Math.sin(angleStart);
  const x2Inner = center + radiusInner * Math.cos(angleEnd);
  const y2Inner = center + radiusInner * Math.sin(angleEnd);

  // Large arc flag
  const largeArcFlag = color.rangeMax - rangeMin > 180 ? 1 : 0;

  // Path for the segment
  const pathData = `
          M ${x1Outer},${y1Outer}
          A ${radiusOuter},${radiusOuter} 0 ${largeArcFlag},1 ${x2Outer},${y2Outer}
          L ${x2Inner},${y2Inner}
          A ${radiusInner},${radiusInner} 0 ${largeArcFlag},0 ${x1Inner},${y1Inner}
          Z
        `;

  // Calculate text position
  const angleText = (rangeMin + color.rangeMax) / 2;
  const angleTextRad = (angleText / 360) * 2 * Math.PI;
  const textX = center + textRadius * Math.cos(angleTextRad);
  const textY = center + textRadius * Math.sin(angleTextRad);

  return (
    <g key={index}>
      <path d={pathData} fill={fill.hex()} />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="10px"
        fill="black"
      >
        {color.name}
      </text>
    </g>
  );
});

export default function PalettePage() {
  return (
    <div>
      <svg width={svgSize} height={svgSize}>
        {segments}
      </svg>
    </div>
  );
}
