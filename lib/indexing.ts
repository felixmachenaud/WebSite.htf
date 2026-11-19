// Indexation opt-in (skill deploiement-cloudflare) : seul INDEXING="on" (production Cloudflare) l'ouvre.
// Valeur absente ou mal orthographiée = site hors des moteurs de recherche.
export function indexingEnabled(value: string | undefined): boolean {
  return value === "on";
}

const CLOSED_ROBOTS = "User-agent: *\nDisallow: /\n";

/** Entoure le rendu Next : robots.txt fermé et X-Robots-Tag noindex tant que l'indexation est fermée. */
export async function serveWithIndexing(
  request: Request,
  indexing: string | undefined,
  next: () => Response | Promise<Response>,
): Promise<Response> {
  if (indexingEnabled(indexing)) return next();
  const response =
    new URL(request.url).pathname === "/robots.txt"
      ? new Response(CLOSED_ROBOTS, { headers: { "Content-Type": "text/plain" } })
      : await next();
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
