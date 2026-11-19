import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.temoignages;

export const metadata = contentPageMetadata(page);

export default function TemoignagesPage() {
  return <ContentPage page={page} />;
}
