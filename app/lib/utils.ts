import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function search(searchTerm: string) {
  const res = await fetch("https://660e-129-97-124-74.ngrok-free.app/search", {
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
