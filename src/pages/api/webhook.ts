import type { APIContext } from "astro";
import type { Octokit } from "octokit";

export function GET({ params, request }: APIContext) {
  return new Response(
    JSON.stringify({
      name: "Astro",
      url: "https://astro.build/",
    })
  );
}
