"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuMenu } from "react-icons/lu";

const clsLink =
  "px-2 -mx-0.5 text-black hover:bg-black hover:text-white rounded";

const menuItems = [
  { label: "Levels", href: "/levels" },
  { label: "Palette", href: "/palette" },
  { label: "Scales", href: "/" },
  { label: "Combinations", href: "/combinations" },
  { label: "Import/Export", href: "/import-export" },
  { label: "Info", href: "/info" },
];

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
      <nav className="col-span-full hidden font-mono md:flex">
        {menuItems.map(({ label, href }) => (
          <Link className={clsLink} href={fHRef(href)} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <Menu>
        <MenuButton className="btn font-medium md:hidden">
          <LuMenu /> Menu
          <MenuItems
            anchor="bottom end"
            className="xs:-translate-x-8 grid transform gap-2 rounded-lg border bg-white p-4 [--anchor-gap:4px]"
          >
            {menuItems.map(({ label, href }) => (
              <MenuItem key={href}>
                <Link className={clsx(clsLink, "py-2")} href={fHRef(href)}>
                  {label}
                </Link>
              </MenuItem>
            ))}
          </MenuItems>
        </MenuButton>
      </Menu>
    </header>
  );
};
