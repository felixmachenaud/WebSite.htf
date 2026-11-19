import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.soutien;

export const metadata = contentPageMetadata(page);

export default function SoutenezNousPage() {
  return <ContentPage page={page} />;
}
