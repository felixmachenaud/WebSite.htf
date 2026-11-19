import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.excellence;

export const metadata = contentPageMetadata(page);

export default function ExcellencePage() {
  return <ContentPage page={page} />;
}
