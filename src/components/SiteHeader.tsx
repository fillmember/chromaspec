import Link from "next/link";

const clsLink =
  "px-2 -mx-0.5 text-black hover:bg-black hover:text-white rounded";

export const SiteHeader = () => {
  return (
    <header className="pb-1 mb-2 border-b border-zinc-700 flex justify-between items-center">
      <h1 className="font-mono text-sm font-bold text-zinc-700 uppercase">
        Chromaspec
      </h1>
      <nav className="col-span-full flex font-mono">
        <Link className={clsLink} href="/levels" shallow>
          Levels
        </Link>
        <Link className={clsLink} href="/palette" shallow>
          Palette
        </Link>
        <Link className={clsLink} href="/" shallow>
          Scales
        </Link>
        <Link className={clsLink} href="/combinations" shallow>
          Combinations
        </Link>
        <Link className={clsLink} href="/import-export" shallow>
          Import/Export
        </Link>
        <Link className={clsLink} href="/info" shallow>
          Info
        </Link>
      </nav>
    </header>
  );
};
