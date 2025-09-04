"use client";

import { useEffect } from "react";

export const CrispChat = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).$crisp = [];
      // BELANGRIJK: Vervang dit met je eigen Crisp Website ID
      (window as any).CRISP_WEBSITE_ID = "VERVANG_DIT_DOOR_JE_WEBSITE_ID"; 
      (() => {
        const d = document;
        const s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = true;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    }
  }, []);

  return null;
};