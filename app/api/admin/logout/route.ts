import { NextResponse } from "next/server";
import { clearSessionCookie, isAdminFetch, readSessionToken } from "@/lib/admin-auth";
import { destroySession } from "@/lib/admin-sessions";

export async function POST(request: Request) {
  if (!isAdminFetch(request)) {
    return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  }
  await destroySession(await readSessionToken());
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
