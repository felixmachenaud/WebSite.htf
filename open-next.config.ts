import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// Pages prérendues stockées dans R2 (NEXT_INC_CACHE_R2_BUCKET), invalidations dans D1 (NEXT_TAG_CACHE_D1) :
// revalidatePath après un enregistrement admin régénère les pages avec le nouveau contenu.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  enableCacheInterception: true,
});
