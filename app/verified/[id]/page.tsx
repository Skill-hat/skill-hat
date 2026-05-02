"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaAward,
  FaDownload,
  FaLinkedin,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function CertificatePage() {
  const { id } = useParams(); // certificate_id
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FETCH CERTIFICATE
  useEffect(() => {
    if (!id) return;

    const fetchCertificate = async () => {
      try {
        const res = await fetch(
          `${API}/upload/verify-certificate?certificate_id=${id}`,
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Invalid certificate");

        setCertificateData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  // 🎉 Confetti
  const triggerConfetti = () => {
    confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } });
  };

  // 📄 PDF DOWNLOAD
  const handleDownloadPDF = async () => {
    if (!certificateRef.current || !certificateData) return;

    setDownloading(true);

    try {
      const container = document.createElement("div");

      container.style.position = "fixed";
      container.style.top = "-9999px";
      container.style.left = "0";
      container.style.width = "1123px";
      container.style.height = "794px";
      container.style.background = "#ffffff";
      container.style.fontFamily = "Arial, sans-serif";

      const clone = certificateRef.current.cloneNode(true) as HTMLElement;

      const all = clone.querySelectorAll("*");
      all.forEach((el: any) => {
        el.removeAttribute("class");
        el.style.all = "unset";
      });

      clone.innerHTML = `
        <div style="width:1123px;height:794px;padding:60px;text-align:center;">
          <h1 style="font-size:42px;font-weight:bold;margin-bottom:20px;">SkillHat</h1>
          <p style="margin-bottom:20px;">Certificate of Completion</p>

          <h2 style="font-size:30px;margin-bottom:30px;">
            ${certificateData.internship_title}
          </h2>

          <p style="margin-bottom:10px;">This is to certify that</p>

          <h3 style="font-size:28px;font-weight:bold;margin-bottom:10px;">
            ${certificateData.user_name}
          </h3>

          <p style="margin-bottom:20px;">
            ${certificateData.user_email}
          </p>

          <p style="margin-bottom:40px;">
            has successfully completed the program.
          </p>

          <div style="display:flex;justify-content:space-around;">
            <div>
              <p style="font-size:12px;">Course</p>
              <p style="font-weight:bold;">${certificateData.internship_title}</p>
            </div>

            <div>
              <p style="font-size:12px;">Issued</p>
              <p style="font-weight:bold;">
                ${new Date(certificateData.issued_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p style="font-size:12px;">ID</p>
              <p style="font-weight:bold;">
                ${certificateData.certificate_id}
              </p>
            </div>
          </div>
        </div>
      `;

      container.appendChild(clone);
      document.body.appendChild(container);

      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(container, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1123, 794],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
      pdf.save(`SkillHat-Certificate-${certificateData.certificate_id}.pdf`);
    } catch (error) {
      console.error("PDF ERROR:", error);
      alert("PDF generation failed");
    } finally {
      setDownloading(false);
    }
  };

  // 🔄 LOADING UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Verifying certificate...
      </div>
    );
  }

  // ❌ ERROR UI
  if (error || !certificateData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <h1 className="text-2xl font-bold">Invalid Certificate ❌</h1>
        <p>{error}</p>
      </div>
    );
  }

  // ✅ MAIN UI (UNCHANGED)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> Back to Profile
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#1e40af] px-10 py-6 text-white flex justify-between">
            <div className="flex items-center gap-3">
              <FaAward size={36} />
              <div>
                <h1 className="text-3xl font-bold">SkillHat</h1>
                <p className="text-sm">Academy of Excellence</p>
              </div>
            </div>
          </div>

          {certificateData && (
            <div className="bg-white/20 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <FaCheckCircle /> VERIFIED
            </div>
          )}

          {/* Certificate UI */}
          <div ref={certificateRef} className="p-14 text-center bg-white">
            <h2 className="text-4xl font-bold mb-6">
              {certificateData.internship_title}
            </h2>

            <p className="mb-4">This is to certify that</p>

            <h3 className="text-3xl font-semibold mb-2">
              {certificateData.user_name}
            </h3>

            <p className="mb-10">has successfully completed the program.</p>

            <div className="flex justify-around">
              <div>
                <p className="text-sm">Course</p>
                <p className="font-semibold">
                  {certificateData.internship_title}
                </p>
              </div>
              <div>
                <p className="text-sm">Issued</p>
                <p className="font-semibold">
                  {new Date(certificateData.issued_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm">ID</p>
                <p className="font-semibold">
                  {certificateData.certificate_id}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-10 py-6 bg-gray-50 flex justify-between">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-blue-600 text-white px-4 py-2 rounded-2xl"
            >
              {downloading ? "Generating..." : "Download PDF"}
            </button>

            <button
              onClick={() => {
                triggerConfetti();
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?text=${encodeURIComponent(
                    `I earned ${certificateData.internship_title}`,
                  )}`,
                );
              }}
              className="border px-6 py-3 rounded-xl"
            >
              <FaLinkedin size={30} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        This certificate has been verified by SkillHat.
      </div>
    </div>
  );
}
