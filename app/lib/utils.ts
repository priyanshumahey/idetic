import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function search(searchTerm: string) {
  const res = await fetch("/api/localserver/search", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      search_string: searchTerm,
    }),
  });

  const json = await res.json();

  return json;
}
