import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content-store";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getContent();
  return { title: contact.metaTitle, description: contact.metaDescription };
}

export default async function ContactPage() {
  const content = await getContent();
  const { contact, footer, chrome } = content;
  return (
    <>
      <Navbar chrome={chrome} />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{contact.title}</h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-slate-600">{contact.intro}</p>

          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">{contact.phoneTitle}</h2>
              <a
                href={footer.phoneHref}
                className="mt-2 block rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 font-sans text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors hover:bg-slate-100/80 hover:text-slate-900"
              >
                {footer.phone}
              </a>
            </div>

            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">{contact.emailTitle}</h2>
              <a
                href={`mailto:${footer.email}`}
                className="mt-2 block rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 font-sans text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors hover:bg-slate-100/80 hover:text-slate-900"
              >
                {footer.email}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
