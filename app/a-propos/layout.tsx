import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content-store";

export default async function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chrome } = await getContent();
  return (
    <>
      <Navbar chrome={chrome} />
      {children}
      <Footer />
    </>
  );
}
