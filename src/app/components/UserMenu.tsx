"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status, update } = useSession();

  const syncUserMoney = async () => {
    if (status === "authenticated") {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      if (data.user) {
        await update({ money: data.user.money });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("user-updated", syncUserMoney);
    return () => window.removeEventListener("user-updated", syncUserMoney);
  }, [status]);

  if (status === "loading") {
    return (
      <div className="h-10 px-4 bg-white/5 animate-pulse rounded-full"></div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-white text-black px-4 py-2 rounded-full uppercase font-black tracking-widest text-[10px] hover:bg-zinc-200 transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-white text-[10px] font-black uppercase tracking-widest">
          {user?.username || user?.name}
        </span>
        <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">
          ${user?.money?.toLocaleString() || "0"}
        </span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-zinc-500 hover:text-red-500 transition-colors"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}
