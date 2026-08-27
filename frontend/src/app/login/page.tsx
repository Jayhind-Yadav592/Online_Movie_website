"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, fetchUser } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login/", { email, password });
      if (res.data.access) {
        login(res.data.access, res.data.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
        await fetchUser();
        router.push('/profiles');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
          <Play fill="currentColor" className="w-6 h-6" />
          CineVerse
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg shadow-xl shadow-black/20 w-full max-w-md">
          <h1 className="text-3xl font-bold text-card-foreground mb-6">Sign In</h1>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded text-sm mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-input border border-border text-foreground px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-input border border-border text-foreground px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-muted-foreground text-sm">
            New to CineVerse? <Link href="/register" className="text-foreground hover:underline">Sign up now.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
