"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
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

import { useAuth } from "@/src/context/AuthContext";

export default function CertificatePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const certificateData = {
    id: id as string,
    title:
      id === "uiux-design"
        ? "Professional UI/UX Design Mastery"
        : id === "react-mastery"
        ? "Advanced React & Next.js Mastery"
        : "SkillHat Professional Certificate",
    course:
      id === "uiux-design"
        ? "UI/UX Design Systems & Figma"
        : id === "react-mastery"
        ? "Advanced React & Next.js"
        : "Professional Course",
    issuedDate: "April 08, 2026",
    certificateId: `SKH-${(id as string).toUpperCase()}-2026-001`,
    description:
      "has successfully completed the comprehensive program with distinction and demonstrated exceptional skills in modern design & development practices.",
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } });
  };

  useEffect(() => {
    const img = new Image();
    img.src = "/logo1.png";
  }, []);

  // 🔥 FINAL STABLE PDF FUNCTION
  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

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

      // 🔥 REMOVE TAILWIND (fix lab error)
      const all = clone.querySelectorAll("*");
      all.forEach((el: any) => {
        el.removeAttribute("class");
        el.style.all = "unset";
      });

      // 🔥 REBUILD SAFE DESIGN
      clone.innerHTML = `
        <div style="width:1123px;height:794px;padding:60px;text-align:center;">
          <h1 style="font-size:42px;font-weight:bold;margin-bottom:20px;">SkillHat</h1>
          <p style="margin-bottom:20px;">Certificate of Completion</p>

          <h2 style="font-size:30px;margin-bottom:30px;">
            ${certificateData.title}
          </h2>

          <p style="margin-bottom:10px;">This is to certify that</p>

          <h3 style="font-size:28px;font-weight:bold;margin-bottom:10px;">
            ${user?.full_name}
          </h3>

          <p style="margin-bottom:20px;">${user?.email}</p>

          <p style="margin-bottom:40px;">
            ${certificateData.description}
          </p>

          <div style="display:flex;justify-content:space-around;">
            <div>
              <p style="font-size:12px;">Course</p>
              <p style="font-weight:bold;">${certificateData.course}</p>
            </div>

            <div>
              <p style="font-size:12px;">Issued</p>
              <p style="font-weight:bold;">${certificateData.issuedDate}</p>
            </div>

            <div>
              <p style="font-size:12px;">ID</p>
              <p style="font-weight:bold;">${certificateData.certificateId}</p>
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
      pdf.save(`SkillHat-Certificate-${certificateData.certificateId}.pdf`);

    } catch (error) {
      console.error("PDF ERROR:", error);
      alert("PDF generation failed");
    } finally {
      setDownloading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login to view certificate.
      </div>
    );
  }

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
            <div className="bg-white/20 px-4 py-2 rounded-xl text-sm">
              <FaCheckCircle /> VERIFIED
            </div>
          </div>

          {/* Certificate UI */}
          <div ref={certificateRef} className="p-14 text-center bg-white">
            <h2 className="text-4xl font-bold mb-6">
              {certificateData.title}
            </h2>

            <p className="mb-4">This is to certify that</p>

            <h3 className="text-3xl font-semibold mb-2">
              {user.full_name}
            </h3>


            <p className="mb-10">{certificateData.description}</p>

            <div className="flex justify-around">
              <div>
                <p className="text-sm">Course</p>
                <p className="font-semibold">{certificateData.course}</p>
              </div>
              <div>
                <p className="text-sm">Issued</p>
                <p className="font-semibold">{certificateData.issuedDate}</p>
              </div>
              <div>
                <p className="text-sm">ID</p>
                <p className="font-semibold">
                  {certificateData.certificateId}
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
                    `I earned ${certificateData.title}`
                  )}`
                );
              }}
              className="border px-6 py-3 rounded-xl"
            >
              <FaLinkedin size={30}/> Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}