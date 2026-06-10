"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-[#0a0a0a] text-white">
      <div className="p-8 bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-xl">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-center mb-8 font-serif italic">
          Welcome <span className="text-zinc-500">Back</span>
        </h1>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleSocialLogin("github")}
            className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-white p-3 rounded-xl font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-zinc-900 px-4 text-zinc-500 italic">or use credentials</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-zinc-500">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-black/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-white/20 transition-colors"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-zinc-500">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-white/20 transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-100 text-black p-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {isLoading ? "Authenticating..." : "Login to Vault"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
          New to the ring?{" "}
          <Link href="/register" className="text-white hover:underline decoration-zinc-500 underline-offset-4">
            Register your fighter
          </Link>
        </p>
      </div>
    </div>
  );
}
