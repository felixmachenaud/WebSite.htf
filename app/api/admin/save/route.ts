import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminFetch, readSessionToken } from "@/lib/admin-auth";
import { sessionExists } from "@/lib/admin-sessions";
import { saveContent } from "@/lib/content-store";

export async function POST(request: Request) {
  if (!isAdminFetch(request)) {
    return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  }
  if (!(await sessionExists(await readSessionToken()))) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Contenu invalide." }, { status: 400 });
  }
  const result = await saveContent(body);
  if (result === "unavailable") {
    return NextResponse.json({ error: "Stockage indisponible." }, { status: 503 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
