import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://www.30secondsofcode.org/js/s/format-duration/
export const formatDuration = (ms: number, short = false) => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    // millisecond: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(
      ([key, val]) =>
        `${val}${!short ? " " : ""}${short ? key.substring(0, 1) : key}${
          val !== 1 && !short ? "s" : ""
        }`
    )
    .join(short ? " " : ", ");
};
