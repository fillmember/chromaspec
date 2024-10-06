"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const clsLink =
  "px-2 -mx-0.5 text-black hover:bg-black hover:text-white rounded";

export const SiteHeader = () => {
  const searchParams = useSearchParams();
  const fHRef = (pathname: string) => ({
    pathname,
    query: searchParams.toString(),
  });
  return (
    <header className="mb-2 flex items-center justify-between border-b border-zinc-700 pb-1">
      <h1 className="font-mono text-sm font-bold uppercase text-zinc-700">
        Chromaspec
      </h1>
      <nav className="col-span-full flex font-mono">
        <Link className={clsLink} href={fHRef("/levels")}>
          Levels
        </Link>
        <Link className={clsLink} href={fHRef("/palette")}>
          Palette
        </Link>
        <Link className={clsLink} href={fHRef("/")}>
          Scales
        </Link>
        <Link className={clsLink} href={fHRef("/combinations")}>
          Combinations
        </Link>
        <Link className={clsLink} href={fHRef("/import-export")}>
          Import/Export
        </Link>
        <Link className={clsLink} href={fHRef("/info")}>
          Info
        </Link>
      </nav>
    </header>
  );
};
