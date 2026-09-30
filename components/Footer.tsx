import Link from "next/link";
import { getContent } from "@/lib/content-store";

const GREEN_COLOR = "#14532d";

function lines(value: string) {
  return value.split("\n").map((line) => (
    <span key={line}>
      {line}
      <br />
    </span>
  ));
}

export async function Footer() {
  const { footer, chrome } = await getContent();
  return (
    <div className="w-full">
      <footer
        className="w-full border-b border-slate-200 bg-white px-6 py-14 md:px-8"
        style={{ paddingBottom: "max(3.5rem, calc(1.25rem + env(safe-area-inset-bottom, 0px)))" }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
          <div className="flex flex-col items-center md:items-start md:border-r md:border-black md:pr-8">
            <img src="/images/logo.png" alt="" className="h-20 w-20 object-contain" />
            <span className="mt-4 font-serif text-2xl font-bold text-slate-900">{chrome.brand}</span>
            <span className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-600">
              {chrome.schoolLine}
            </span>
          </div>

          <div className="flex flex-col md:border-r md:border-black md:px-8">
            <h2 className="font-bold uppercase tracking-wider text-slate-900">{footer.newsletterTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{footer.newsletterBody}</p>
          </div>

          <div className="flex flex-col md:pl-8">
            <h2 className="font-bold uppercase tracking-wider text-slate-900">{footer.contactTitle}</h2>
            <p className="mt-4 font-medium text-slate-800">{footer.schoolName}</p>
            <p className="mt-2 text-sm text-slate-600">{lines(footer.addressCourbevoie)}</p>
            <p className="mt-2 text-sm text-slate-600">{lines(footer.addressBoisColombes)}</p>
            <a href={footer.phoneHref} className="mt-4 text-sm text-slate-600 hover:text-slate-900">
              {footer.phone}
            </a>
            <a href={`mailto:${footer.email}`} className="mt-1 text-sm text-slate-600 hover:text-slate-900">
              {footer.email}
            </a>
          </div>
        </div>

        <nav
          aria-label={footer.legalMentions}
          className="mx-auto mt-12 flex max-w-6xl flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-6 text-sm text-slate-600"
        >
          <Link href="/mentions-legales" className="hover:text-slate-900">
            {footer.legalMentions}
          </Link>
          <Link href="/confidentialite" className="hover:text-slate-900">
            {footer.legalPrivacy}
          </Link>
        </nav>
      </footer>
      <div className="h-3 w-full" style={{ backgroundColor: GREEN_COLOR }} />
    </div>
  );
}
