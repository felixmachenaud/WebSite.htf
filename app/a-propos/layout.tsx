import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
