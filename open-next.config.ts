import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// shortcut: cache en lecture seule (pages prérendues au build, pas de revalidatePath).
// Suffit tant que le CMS n'est pas branché sur Cloudflare ; passer à r2IncrementalCache + d1NextTagCache ensuite.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
