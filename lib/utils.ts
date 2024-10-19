import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCamelCase(str: string) {
  return str
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("")
    .trim();
}

// convert date from mm-dd-yyyy
export function formatToCanonicalDateString(date: string) {
  return date
    .split("/")
    .map((x) => x.padStart(2, "0"))
    .filter((x) => x.trim().length > 0)
    .join("-")
    .trim();
}
