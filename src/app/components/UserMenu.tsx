"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface UserData {
  id: string;
  username: string;
  money: number;
}

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const router = useRouter();

  const fetchUserExtraData = () => {
    if (status === "authenticated") {
      setLoadingData(true);
      fetch("/api/user/me")
        .then((res) => res.json())
        .then((data) => {
          setUserData(data.user);
          setLoadingData(false);
        })
        .catch(() => setLoadingData(false));
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUserExtraData();
    window.addEventListener("user-updated", fetchUserExtraData);
    return () => window.removeEventListener("user-updated", fetchUserExtraData);
  }, [status]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  if (status === "loading" || loadingData) {
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

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-white text-[10px] font-black uppercase tracking-widest">
          {userData?.username || session?.user?.name}
        </span>
        <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">
          ${userData?.money.toLocaleString() || "0"}
        </span>
      </div>
      <button
        onClick={handleLogout}
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
