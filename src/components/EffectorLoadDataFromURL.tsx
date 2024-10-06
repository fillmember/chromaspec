"use client";

import { atomLevels, atomUserData } from "@/atoms/userdata";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const EffectorLoadDataFromURL = () => {
  const [, setUserData] = useAtom(atomUserData);
  const [, setLevels] = useAtom(atomLevels);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const str = urlParams.get("d");
    if (!str) return;
    try {
      const decoded = atob(str);
      const { scales, levels } = JSON.parse(decoded);
      setUserData(scales);
      setLevels(levels);
    } catch (error) {
      // do nothing...
    }
    window.location.search = "";
  }, []);
  return null;
};
