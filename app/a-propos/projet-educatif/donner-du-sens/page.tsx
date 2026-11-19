import { ContentPage, contentPageMetadata } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const page = CONTENT_PAGES.sens;

export const metadata = contentPageMetadata(page);

export default function SensPage() {
  return <ContentPage page={page} />;
}
