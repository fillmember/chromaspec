"use client";

import { Button, Field, Input, Label } from "@headlessui/react";
import * as icons from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SharableLink = () => {
  const searchParams = useSearchParams();
  const [shareLink, setShareLink] = useState<string>("");
  useEffect(() => {
    setShareLink(`${window.location.origin}?${searchParams.toString()}`);
  }, [searchParams]);
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
        <icons.Copy /> Copy
      </Button>
    </Field>
  );
};
