"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔐 Already logged in → redirect
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin) {
      router.push("/admin");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔍 Validation
    if (!email || !password) {
      return setError("All fields are required");
    }

    setLoading(true);

    // 🔥 Fake delay (real feel)
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === "admin@gmail.com" &&
        password === "1234"
      ) {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin");
      } else {
        setError("Invalid Admin Credentials ❌");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px]">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Admin Login 🔐
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter admin credentials to continue
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}