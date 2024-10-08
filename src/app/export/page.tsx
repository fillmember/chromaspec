"use client";

import {
  atomTailwindConfig,
  atomSVGAllScales,
  atomJSONDesignTokens,
  atomCSSVariables,
} from "@/atoms/userdata";
import { MiniColorScales } from "@/components/MiniColorScales";
import { SharableLink } from "@/components/SharableLink";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useAtom } from "jotai";
import { ReactNode, Suspense } from "react";
import { LuCopy } from "react-icons/lu";

const clsTabButton =
  "px-2 py-1 hover:bg-zinc-200 data-[selected]:bg-zinc-900 data-[selected]:text-zinc-50";

export default function PageInfo() {
  const [svg] = useAtom(atomSVGAllScales);
  const [tailwindConfig] = useAtom(atomTailwindConfig);
  const [jsonDesignToken] = useAtom(atomJSONDesignTokens);
  const [cssVariables] = useAtom(atomCSSVariables);
  return (
    <div className="mt-8">
      <header className="my-4 flex flex-wrap justify-between gap-2">
        <h2 className="text-2xl font-bold">Import / Export</h2>
        <Suspense>
          <SharableLink />
        </Suspense>
      </header>
      <figure className="my-4 border p-4">
        <MiniColorScales />
      </figure>
      <TabGroup className="space-y-1">
        <TabList className="flex items-center gap-1 px-4">
          <h4 className="font-medium">Available Formats: </h4>
          <Tab className={clsTabButton}>SVG (Figma)</Tab>
          <Tab className={clsTabButton}>CSS Variables</Tab>
          <Tab className={clsTabButton}>TailwindCSS Config</Tab>
          <Tab className={clsTabButton}>JSON</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CodeArea title="SVG (Figma)" code={svg} />
          </TabPanel>
          <TabPanel>
            <CodeArea title="CSS Variables" code={cssVariables} />
          </TabPanel>
          <TabPanel>
            <CodeArea title="TailwindCSS Concifg" code={tailwindConfig} />
          </TabPanel>
          <TabPanel>
            <CodeArea title="JSON" code={jsonDesignToken} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

const CodeArea = ({ title, code }: { title?: ReactNode; code: string }) => {
  return (
    <section className="relative bg-slate-700 text-slate-200">
      <div className="flex items-center bg-slate-800 text-slate-200">
        {title && <h3 className="px-4">{title}</h3>}
        <div className="flex-grow"></div>
        <button
          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700"
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
        >
          <LuCopy /> copy to clipboard
        </button>
      </div>
      <pre className="max-h-[36rem] overflow-auto p-4 text-sm">
        <code>{code}</code>
      </pre>
    </section>
  );
};
