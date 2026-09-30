import { authConfig, readSessionToken } from "@/lib/admin-auth";
import { sessionExists, sessionStoreReady } from "@/lib/admin-sessions";
import { getContent } from "@/lib/content-store";
import { Editor } from "./Editor";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (authConfig() !== "ok" || !sessionStoreReady()) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="font-serif text-3xl">Administration non configurée</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Renseignez le hash du mot de passe, le secret de session et, en production, Redis.
          Aucune connexion n&apos;est possible tant que ces éléments manquent. Un mot de passe en
          clair est refusé en production.
        </p>
      </main>
    );
  }

  if (!(await sessionExists(await readSessionToken()))) {
    return <LoginForm />;
  }

  return <Editor initial={await getContent()} />;
}
