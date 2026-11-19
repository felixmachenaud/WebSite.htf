// Point d'entrée Cloudflare : le Worker généré par OpenNext, entouré du verrou d'indexation.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- fichier produit par `opennextjs-cloudflare build` (absent avant le build)
// @ts-ignore
import handler from "./.open-next/worker.js";
import { serveWithIndexing } from "./lib/indexing";

const worker = {
  fetch(request: Request, env: { INDEXING?: string }, ctx: unknown) {
    return serveWithIndexing(request, env.INDEXING, () => handler.fetch(request, env, ctx));
  },
};

export default worker;
