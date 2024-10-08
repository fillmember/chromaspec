import { formatCss, formatHex, type Oklch } from "culori";

const c1: Oklch = {
  mode: "oklch",
  l: 0.8,
  c: 0.18,
  h: 85,
};
const c2: Oklch = {
  mode: "oklch",
  l: 0.8,
  c: 0.12,
  h: 240,
};
export default function PageInfo() {
  return (
    <article className="prose my-4">
      <h1>Chromaspec</h1>
      <p className="leading">
        Chromaspec is an opinionated design system palette generator that
        creates color scales with consistent perceived brightness using OKLCH.
      </p>
      <h2>Why OKLCH</h2>
      <p>
        OKLCH is an improved version of LCH. LCH is a color space where colors
        with the same <b>L</b>ightness value should have comparable perceived
        brightness.
      </p>
      <figure className="grid grid-cols-2">
        <div
          className="h-20"
          style={{
            backgroundColor: formatCss(c1),
          }}
        />
        <div
          className="h-20"
          style={{
            backgroundColor: formatCss(c2),
          }}
        />
        <figcaption className="contents">
          <div className="flex justify-between p-1">
            <span>
              L:{c1.l} C:{c1.c} H:{c1.h}
            </span>
            <span>{formatHex(c1).toUpperCase()}</span>
          </div>
          <div className="flex justify-between p-1">
            <span>
              L:{c2.l} C:{c2.c} H:{c2.h}
            </span>
            <span>{formatHex(c2).toUpperCase()}</span>
          </div>
        </figcaption>
      </figure>
      <p>
        This property of LCH/OKLCH makes it an ideal solution for creating a
        system of colors with predictable brightness, suitable for UI design. An
        UI element moving from colors like blue-10 blue-50 and blue-70 to
        yellow-10 yellow-50 yellow-70 should keep the perceived brightness, thus
        stay as prominent as before in the design.
      </p>
      <h2>Guide</h2>
      <h3>Levels</h3>
      <p>
        Levels defines the steps in the color scales. In Chromaspec, level
        ranges from 0 to 100, and calculates lightness with the following
        formula:
        <pre>
          <code>lightness = 100 - level</code>
        </pre>
        level 0 will have 100% lightness and results in white (
        <code>#FFFFFF</code>), while level 100 will result in pitch black (
        <code>#000000</code>)
      </p>
      <h3>Palette</h3>
      <p>
        Palette is the view that visualizes the relationship between the chosen
        tones of the color scales. It is most useful when used to examine the
        general tone of the selected palette.
      </p>
      <h3>Scales</h3>
      <p>
        Scales is the view where the color steps are laid out with details. Tip:
        To make each scale to have roughly the same accessible color pairs, try
        to fine tune the chroma curves and aim for similar WCAG Relative
        Luminance values for the same step across the scales.
      </p>
      <h3>Combinations</h3>
      <p>
        Select two scales and check how many accessible combinations the scales
        can produce. A flexible color system that is easier to use in UI design
        should have more accessible combinations.
      </p>
      <h3>Import/Export</h3>
      <p>
        Export the result in different formats. Generate a sharable link here
        for future reference.
      </p>
      <h2>Reference and Links</h2>
      <ul>
        <li>
          Code by:{" "}
          <a href="https://fillmember.net" target="_blank">
            fillmember.net
          </a>
        </li>
        <li>
          Github Repo:
          <a href="https://github.com/fillmember/chromaspec" target="_blank">
            github.com/fillmember/chromaspec
          </a>
        </li>
      </ul>
    </article>
  );
}
