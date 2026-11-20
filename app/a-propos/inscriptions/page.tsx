import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.inscriptions;

export const metadata = contentPageMetadata(page);

export default function InscriptionsPage() {
  return <ContentPage page={page} sections={[["soutenez-nous", CONTENT_PAGES.soutien]]} />;
}
