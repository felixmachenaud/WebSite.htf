import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.documentation;

export const metadata = contentPageMetadata(page);

export default function DocumentationPage() {
  return <ContentPage page={page} />;
}
