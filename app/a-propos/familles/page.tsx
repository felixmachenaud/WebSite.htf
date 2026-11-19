import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.familles;

export const metadata = contentPageMetadata(page);

export default function FamillesPage() {
  return <ContentPage page={page} />;
}
