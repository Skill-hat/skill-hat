"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2, // ← React icon spinner (Lucide)
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const router = useRouter();

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email address is required");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 🔥 Save token
      localStorage.setItem("token", data.token);

      // 🔥 IMPORTANT: fetch user from backend
      const profileRes = await fetch(`${API}/api/users/profile/`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const userData = await profileRes.json();

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user");
      }

      // 🔥 Save user
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      setSuccess("Login successful");

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f630_1px,transparent_1px)] bg-[length:40px_40px] opacity-30 pointer-events-none dark:opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-slate-200/70 dark:shadow-black/40 border border-slate-100 dark:border-zinc-700 p-8 md:p-12 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Sign in to your Skillhat account
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-400"
          >
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 p-4 text-sm text-emerald-700 dark:text-emerald-400"
          >
            <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-white text-[10px] leading-none">✓</span>
            </div>
            <span className="font-medium">{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={20}
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-12 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all outline-none"
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={20}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-12 py-4 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
              />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Remember me
              </span>
            </label>
          </div>

          {/* Login Button with React Icon Spinner */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-white" />{" "}
                {/* ← Clean React icon spinner */}
                <span>Signing in...</span>
              </>
            ) : (
              <>
                Sign in
                <ChevronRight
                  size={22}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Create a free account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
