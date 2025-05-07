import { clsx, type ClassValue } from "clsx"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function objectTypes(obj: any) {
  return Object.keys(obj).map((key) => ({
    [key]: typeof obj[key],
  }))
}

export const biggest = (arr: number[]) => {
  return Math.max(...arr)
}

type Success<T> = {
  data: T
  error?: never
}

type Failure<E> = {
  data?: never
  error: E
}

export async function throwable<T, E = unknown>(
  func: (() => T) | Promise<T>,
): Promise<Success<T> | Failure<E>> {
  try {
    const data = await (func instanceof Promise
      ? func
      : Promise.resolve().then(func))
    return { data }
  } catch (error) {
    return { error: error as E }
  }
}

export function withImpact(callback: () => void) {
  impactAsync(ImpactFeedbackStyle.Soft).then(() => callback())
}
