"use client";

import { atomLevels, atomUserData } from "@/atoms/userdata";
import { Field, Label, Input, Button } from "@headlessui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { LuCopy } from "react-icons/lu";

export const SharableLink = () => {
  const [shareLink, setShareLink] = useState<string>("");
  const scales = useAtom(atomUserData);
  const levels = useAtom(atomLevels);
  useEffect(() => {
    setShareLink(
      `${window.location.origin}?d=${btoa(JSON.stringify({ scales, levels }))}`,
    );
  }, [scales, levels]);
  return (
    <Field className="flex items-center gap-2 text-sm">
      <Label className="font-medium">Sharable Link</Label>
      <Input
        type="text"
        value={shareLink}
        readOnly
        onClick={(evt) => evt.currentTarget.select()}
        className="border-b border-zinc-700 p-1"
      />
      <Button
        className="btn btn-sm"
        onClick={() => {
          window.navigator.clipboard.writeText(shareLink);
        }}
      >
        <LuCopy /> Copy
      </Button>
    </Field>
  );
};
