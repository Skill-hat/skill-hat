"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const params = useParams();
  const urlId = params?.id;

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Please enter certificate ID");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API}/upload/verify/${certificateId.trim()}/`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Certificate not found");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (urlId) {
    const formattedId = String(urlId).toUpperCase();

    // ✅ Fill input automatically
    setCertificateId(formattedId);

    // ✅ Automatically trigger search
    const autoVerify = async () => {
      setLoading(true);
      setError("");
      setResult(null);

      try {
        const res = await fetch(
          `${API}/upload/verify/${formattedId}/`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Certificate not found");
        }

        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    autoVerify();
  }
}, [urlId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col items-center justify-center px-4 py-8 md:py-12">
      {/* Header Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">SkillHat</h1>
        <p className="text-gray-500 text-sm mt-1">
          Certificate Verification Portal
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Verify Certificate
          </h2>
          <p className="text-gray-500 text-sm mt-2 px-4">
            Enter a certificate ID to validate authenticity
          </p>
        </div>

        {/* Input Section - Stacks on mobile */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. CERT-7E13B5"
            value={certificateId}
            onChange={(e) => {
              setCertificateId(e.target.value.toUpperCase().trim());
              setError("");
            }}
            className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 
                       outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       text-base md:text-lg placeholder:text-gray-400"
            disabled={loading}
          />

          <button
            onClick={handleVerify}
            disabled={loading || !certificateId.trim()}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                       disabled:bg-gray-400 transition-all
                       text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 
                       font-medium text-base sm:min-w-[140px] active:scale-[0.97]"
          >
            <FaSearch /> 
            <span>{loading ? "Verifying..." : "Verify"}</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 text-center text-gray-500 flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            Verifying certificate...
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-center"
          >
            <FaTimesCircle className="mx-auto text-red-500 mb-3" size={28} />
            <p className="text-red-600 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Success Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border border-green-200 rounded-2xl p-6 bg-green-50"
          >
            <div className="flex items-center justify-center gap-2 text-green-600 mb-5">
              <FaCheckCircle size={24} />
              <span className="font-semibold text-lg">Verified Certificate</span>
            </div>

            <div className="space-y-4 text-[15px] text-gray-700">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-right">{result.user_name}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-right break-all">{result.user_email}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Internship</span>
                <span className="font-medium text-right">{result.internship_title}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Mentor</span>
                <span className="font-medium text-right">{result.mentor_name}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Certificate ID</span>
                <span className="font-mono font-medium">{result.certificate_id}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Issued</span>
                <span>{new Date(result.issued_at).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-6 pt-5 border-t border-green-200 flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaShieldAlt />
              Verified by SkillHat Secure Certificate System
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-8 text-center max-w-xs">
        This verification confirms the authenticity of certificates issued by SkillHat.
      </p>
    </div>
  );
}