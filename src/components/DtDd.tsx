import clsx from "clsx";
import { ReactNode } from "react";
import { LuCopy } from "react-icons/lu";

export const DtDd = ({
  term,
  desc,
  copyString,
}: {
  term: ReactNode;
  desc: ReactNode;
  copyString?: string;
}) => {
  return (
    <>
      <dt>{term}</dt>
      <dd
        className={clsx(
          "group relative",
          !!copyString &&
            "cursor-pointer underline decoration-zinc-400 hover:text-blue-500",
        )}
        onClick={() => {
          if (copyString) {
            navigator.clipboard.writeText(copyString);
          }
        }}
      >
        {desc}
        {!!copyString && (
          <LuCopy className="absolute bottom-0 right-0 top-0 bg-white opacity-0 group-hover:opacity-100" />
        )}
      </dd>
    </>
  );
};
