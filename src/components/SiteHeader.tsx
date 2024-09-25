import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="pb-1 mb-2 border-b border-zinc-700 flex justify-between items-center">
      <h1 className="font-mono text-sm font-bold text-zinc-700 uppercase">
        Chromaspec
      </h1>
      <nav className="col-span-full flex gap-2">
        <Link href="/" shallow>
          Scales
        </Link>
        <Link href="/combinations" shallow>
          Combinations
        </Link>
      </nav>
    </header>
  );
};
