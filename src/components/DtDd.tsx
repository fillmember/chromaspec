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
        className={clsx("group relative", !!copyString && "cursor-pointer")}
        onClick={() => {
          if (copyString) {
            navigator.clipboard.writeText(copyString);
          }
        }}
      >
        {desc}
        {!!copyString && (
          <LuCopy className="absolute right-0 top-0 bottom-0 bg-white opacity-0 group-hover:opacity-100" />
        )}
      </dd>
    </>
  );
};
