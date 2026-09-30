"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "x-hautefeuille-admin": "1" },
    });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
    >
      Se déconnecter
    </button>
  );
}
