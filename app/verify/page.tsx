"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
} from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!certificateId) {
      setError("Please enter certificate ID");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `${API}/upload/verify/${certificateId}/`
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col items-center justify-center px-4">

      {/* Header Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">SkillHat</h1>
        <p className="text-gray-500 text-sm mt-1">
          Certificate Verification Portal
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Verify Certificate</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter a certificate ID to validate authenticity
          </p>
        </div>

        {/* Input Section */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. CERT-7E13B5"
            value={certificateId}
            onChange={(e) => {
              setCertificateId(e.target.value.toUpperCase());
              setError("");
            }}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <button
            onClick={handleVerify}
            className="bg-blue-600 text-white px-6 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FaSearch /> Verify
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            Verifying certificate...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <FaTimesCircle className="mx-auto text-red-500 mb-2" size={26} />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Success */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 border border-green-200 rounded-xl p-5 bg-green-50"
          >
            {/* Verified Badge */}
            <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
              <FaCheckCircle size={20} />
              <span className="font-semibold text-sm">
                Verified Certificate
              </span>
            </div>

            {/* Certificate Info */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{result.user_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{result.user_email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Internship</span>
                <span className="font-medium">{result.internship_title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Mentor</span>
                <span className="font-medium">{result.mentor_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Certificate ID</span>
                <span className="font-mono">{result.certificate_id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Issued</span>
                <span>
                  {new Date(result.issued_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-5 border-t pt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaShieldAlt />
              Verified by SkillHat Secure Certificate System
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        This verification confirms the authenticity of certificates issued by SkillHat.
      </p>
    </div>
  );
}