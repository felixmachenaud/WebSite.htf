import { getCloudflareContext } from "@opennextjs/cloudflare";

// Types minimaux des liaisons utilisées (évite d'ajouter @cloudflare/workers-types).
export interface CmsBucket {
  get(key: string): Promise<{ text(): Promise<string> } | null>;
  put(key: string, value: string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
}
type Bindings = { CMS_BUCKET?: CmsBucket };

/**
 * Liaisons Cloudflare du Worker (R2 du CMS), ou {} hors Worker.
 * Jamais pendant `next build` (le local de Wrangler pourrait injecter des données de test dans le build)
 * ni en `next dev` (fichier .data/ à la place, sans lancer de workerd local).
 */
export async function bindings(): Promise<Bindings> {
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "development") return {};
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as unknown as Bindings;
  } catch {
    return {};
  }
}
