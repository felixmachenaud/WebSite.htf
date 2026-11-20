import { headers } from "next/headers";
import { authConfig, isAdmin } from "@/lib/admin-auth";
import { getContent } from "@/lib/content-store";
import { DEFAULT_CONTENT } from "@/lib/site-content";
import { Editor } from "./Editor";

export const dynamic = "force-dynamic";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="font-serif text-3xl">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{children}</p>
    </main>
  );
}

export default async function AdminPage() {
  if (authConfig() !== "ok") {
    return (
      <Notice title="Administration non configurée">
        Renseignez ACCESS_TEAM_DOMAIN et ACCESS_AUD (Cloudflare Access) pour cet environnement. Aucune modification
        n&apos;est possible tant qu&apos;ils manquent.
      </Notice>
    );
  }
  if (!(await isAdmin(await headers()))) {
    return (
      <Notice title="Accès réservé">
        Cette page est réservée à l&apos;établissement. Ouvrez-la depuis l&apos;adresse du site pour recevoir un code de
        connexion sur votre courriel autorisé.
      </Notice>
    );
  }
  return <Editor initial={await getContent()} defaults={DEFAULT_CONTENT} />;
}
