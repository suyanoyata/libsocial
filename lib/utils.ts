import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectTypes(obj: any) {
  return Object.keys(obj).map((key) => ({
    [key]: typeof obj[key],
  }));
}
