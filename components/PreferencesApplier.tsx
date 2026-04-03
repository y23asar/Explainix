"use client";

import { useEffect } from "react";
import { applyPreferencesToDom, getExplainixPreferences } from "@/lib/preferences";

function readThemeFromStorage(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const raw = window.localStorage.getItem("explainixTheme");
  return raw === "dark" ? "dark" : "light";
}

export function PreferencesApplier() {
  useEffect(() => {
    const applyAll = () => {
      applyPreferencesToDom(getExplainixPreferences());
      document.documentElement.classList.toggle("dark", readThemeFromStorage() === "dark");
    };

    applyAll();
    const onChange = () => applyAll();
    window.addEventListener("explainix-preferences-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("explainix-preferences-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return null;
}
