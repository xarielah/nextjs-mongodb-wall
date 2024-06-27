import { twMerge } from "tailwind-merge";

export default function cn(...args: string[]) {
  return twMerge(...args);
}
