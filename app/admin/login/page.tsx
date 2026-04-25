"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MdAdminPanelSettings, MdOutlineSecurity } from "react-icons/md";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function AdminLogin() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      toast.success("OTP sent successfully to your email");
      setStep("otp");
    } catch (err: any) {
      const message = err.message || "Failed to send OTP";
      setError(message);
      toast.error(message);
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
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          otp: otp.trim() 
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Invalid OTP");
      }

      // Success
      sessionStorage.setItem("isAdmin", "true");
      if (data.token) localStorage.setItem("token", data.token);

      toast.success("Welcome back, Admin");
      router.replace("/admin");
    } catch (err: any) {
      const message = err.message || "Verification failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-90 via-blue-950 to-indigo-950 p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e510_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,#6366f110_0%,transparent_50%)]"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-8 text-center border-b border-gray-100">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
              <MdAdminPanelSettings className="text-white" size={52} />
            </div>
            
            <h1 className="mt-6 text-3xl font-semibold text-gray-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Secure access for authorized personnel only
            </p>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <MdOutlineSecurity className="text-emerald-500" />
              <span>Enterprise Grade Security</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-10 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-3">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          {/* Email Step */}
          {step === "email" && (
            <form onSubmit={sendOtp} className="px-10 pt-8 pb-12 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@yourcompany.com"
                    className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl transition-all duration-300 text-lg shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Sending OTP...</>
                ) : (
                  <>
                    Send Secure OTP <FiLock className="text-lg" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="px-10 pt-8 pb-12 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter verification code sent to
                </label>
                <p className="text-blue-700 font-medium text-lg mb-4">{email}</p>

                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-3xl tracking-[8px] text-center font-mono"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl transition-all duration-300 text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center"
              >
                {loading ? "Verifying..." : "Verify & Access Dashboard"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-700 font-medium py-3 transition-colors"
              >
                <FiArrowLeft className="text-lg" />
                Change Email Address
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-8">
          Protected by advanced multi-factor authentication
        </p>
      </div>
    </div>
  );
}