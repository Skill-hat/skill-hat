"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MdAdminPanelSettings } from "react-icons/md";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function AdminLogin() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDevelopmentBypass, setIsDevelopmentBypass] = useState(false);
  
  const router = useRouter();

  // Check for existing admin session
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      router.replace("/admin");
    }
  }, [router]);

  // ==================== SEND OTP ====================
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send OTP");
      }

      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==================== VERIFY OTP ====================
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Invalid OTP");
      }

      // Success
      sessionStorage.setItem("isAdmin", "true");
      if (data.token) localStorage.setItem("token", data.token);

      toast.success("Login successful");
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message || "Verification failed");
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==================== DEVELOPMENT BYPASS (Only for local/dev) ====================
  const handleDevBypass = () => {
    if (process.env.NODE_ENV === "development") {
      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("token", "dev-bypass-token");
      toast.success("Development bypass activated");
      router.replace("/admin");
    } else {
      toast.error("Bypass only available in development mode");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
            <MdAdminPanelSettings size={100}/>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Secure access to admin panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Email Step */}
        {step === "email" && (
          <form onSubmit={sendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 rounded-2xl transition-all duration-200 text-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP sent to <span className="font-medium">{email}</span>
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl tracking-widest text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-4 rounded-2xl transition-all duration-200 text-lg"
            >
              {loading ? "Verifying OTP..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
              }}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-sm"
            >
              ← Change Email
            </button>
          </form>
        )}

        {/* Development Bypass - Visible only in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleDevBypass}
              className="w-full py-3 text-sm text-amber-600 hover:text-amber-700 border border-dashed border-amber-300 rounded-2xl hover:bg-amber-50 transition-colors"
            >
              ⚡ Development Bypass (Skip Login)
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              Only works in development environment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}