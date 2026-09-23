"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Language = "nb" | "en";

const storageKey = "grandcabin-language";
const listeners = new Set<() => void>();
let fallbackLanguage: Language = "nb";

function readLanguage(): Language {
  if (typeof window === "undefined") return "nb";

  try {
    const savedLanguage = window.localStorage.getItem(storageKey);
    if (savedLanguage === "nb" || savedLanguage === "en") {
      fallbackLanguage = savedLanguage;
    }
  } catch {
    // Keep the in-memory choice when storage is unavailable.
  }

  return fallbackLanguage;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function updateLanguage(language: Language) {
  fallbackLanguage = language;

  try {
    window.localStorage.setItem(storageKey, language);
  } catch {
    // The current session still remembers the choice in memory.
  }

  document.documentElement.lang = language;
  listeners.forEach((listener) => listener());
}

function getServerLanguage(): Language {
  return "nb";
}

export function useSiteLanguage(): [Language, (language: Language) => void] {
  const language = useSyncExternalStore(subscribe, readLanguage, getServerLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return [language, updateLanguage];
}
