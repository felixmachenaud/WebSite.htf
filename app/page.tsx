import { CheminLanding } from "@/components/CheminLanding";
import { getContent } from "@/lib/content-store";

export default async function HomePage() {
  const content = await getContent();
  return <CheminLanding news={content.actualites.slice(0, 3)} footer={content.footer} chrome={content.chrome} />;
}
