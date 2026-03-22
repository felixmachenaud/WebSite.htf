import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Contact | Collège Lycée HauteFeuille",
  description: "Contactez le Collège Lycée HauteFeuille.",
};

// À configurer : remplacez par votre lien Calendly
const CALENDLY_URL = "https://calendly.com/hautefeuille";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-page pt-[69px]">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            Contact
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-slate-600">
            Pour toute question ou demande de rendez-vous, n&apos;hésitez pas à nous contacter.
          </p>

          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">
                Téléphone
              </h2>
              <a
                href="tel:+33143332402"
                className="mt-2 block rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 font-sans text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors hover:bg-slate-100/80 hover:text-slate-900"
              >
                01 43 33 24 02
              </a>
            </div>

            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">
                Courriel
              </h2>
              <a
                href="mailto:hautefeuille92@gmail.com"
                className="mt-2 block rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 font-sans text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors hover:bg-slate-100/80 hover:text-slate-900"
              >
                hautefeuille92@gmail.com
              </a>
            </div>

            <div className="pt-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded border-2 border-slate-800 bg-slate-800 px-8 py-3 font-medium text-white transition-colors hover:bg-slate-900 hover:border-slate-900"
              >
                Prendre rendez-vous (Calendly)
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
