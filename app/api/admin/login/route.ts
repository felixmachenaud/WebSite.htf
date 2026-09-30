import { NextResponse } from "next/server";
import {
  authConfig,
  clientAddress,
  isAdminFetch,
  newSessionToken,
  verifyPassword,
  writeSessionCookie,
} from "@/lib/admin-auth";
import {
  clearLoginFailures,
  createSession,
  loginIsLimited,
  registerLoginFailure,
  sessionStoreReady,
} from "@/lib/admin-sessions";

export async function POST(request: Request) {
  if (!isAdminFetch(request)) {
    return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  }
  if (authConfig() !== "ok" || !sessionStoreReady()) {
    return NextResponse.json({ error: "Administration non configurée." }, { status: 503 });
  }
  const ip = clientAddress(request);
  if (await loginIsLimited(ip)) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? "")) {
    const { limited } = await registerLoginFailure(ip);
    return NextResponse.json(
      { error: limited ? "Trop de tentatives." : "Mot de passe incorrect." },
      { status: limited ? 429 : 401 },
    );
  }
  await clearLoginFailures(ip);
  const token = newSessionToken();
  await createSession(token);
  await writeSessionCookie(token);
  return NextResponse.json({ ok: true });
}
