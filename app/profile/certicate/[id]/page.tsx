"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaLinkedin,
  FaArrowLeft,
  FaCalendarAlt,
} from "react-icons/fa";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function CertificatePage() {
  const { id } = useParams();
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [certificateData, setCertificateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`${API}/upload/verify/${id}/`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError("Invalid Certificate");
          return;
        }

        setCertificateData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCertificate();
  }, [id]);

  const triggerConfetti = () => {
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
  };

  // High Quality PDF Download
  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    setDownloading(true);

    try {
      const element = certificateRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,

        // ✅ FIX: sanitize unsupported colors
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");

          allElements.forEach((el: any) => {
            const style = window.getComputedStyle(el);

            // Replace unsupported lab/oklch colors
            if (style.color.includes("lab") || style.color.includes("oklch")) {
              el.style.color = "#000000";
            }

            if (
              style.backgroundColor.includes("lab") ||
              style.backgroundColor.includes("oklch")
            ) {
              el.style.backgroundColor = "#ffffff";
            }

            if (style.borderColor.includes("lab")) {
              el.style.borderColor = "#1e3a8a";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [297, 210],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);

      pdf.save(`Certificate-${certificateData.certificate_id}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Certificate...
      </div>
    );
  if (error || !certificateData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-2xl">{error}</p>
        <button
          onClick={() => router.push("/verify")}
          className="mt-6 underline"
        >
          Go to Verification
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-black"
        >
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="shadow-2xl"
        >
          {/* Certificate Container */}
          <div
            ref={certificateRef}
            className="bg-white border-[12px] border-[#1e3a8a] rounded-none aspect-[297/210] w-full max-w-[1000px] mx-auto relative overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)" }}
          >
            {/* Header */}
            <div className="flex justify-between items-start px-16 pt-12">
              <div className="flex items-center gap-4">
                {/* Dynamic Logo / Organization */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {certificateData.organization_name || "SkillHat"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {certificateData.organization_tagline ||
                      "Empowering Innovation, Building Future"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-5xl font-bold tracking-wider text-[#1e3a8a]">
                  CERTIFICATE
                </h2>
                <p className="text-xl text-gray-700 -mt-2">OF INTERNSHIP</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-16 pt-8 text-center">
              <p className="text-lg mb-4">This is to certify that</p>

              <h3 className="text-4xl font-bold text-[#1e40af] mb-2 tracking-wide">
                {certificateData.user_name}
              </h3>

              <p className="text-gray-600 mb-8">
                has successfully completed an internship as
              </p>

              {/* Role Box */}
              <div className="inline-block border-2 border-[#1e40af] rounded-full px-10 py-3 mb-10">
                <p className="text-2xl font-semibold text-[#1e40af]">
                  {certificateData.internship_title ||
                    "Software Development Intern"}
                </p>
              </div>

              <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mb-12 text-[15px]">
                During this period, {certificateData.user_name?.split(" ")[0]}{" "}
                worked on various tasks including
                {certificateData.description ||
                  "project development, problem solving, and demonstrating dedication and a keen learning attitude."}
              </p>

              {/* Duration */}
              <div className="flex items-center justify-center gap-4 mb-16">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaCalendarAlt className="text-[#1e40af] text-xl" />
                </div>

                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Issued On
                  </p>

                  <p className="font-semibold text-lg text-gray-800">
                    {certificateData.start_date
                      ? `${new Date(
                          certificateData.start_date,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })} - ${
                          certificateData.end_date
                            ? new Date(
                                certificateData.end_date,
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Present"
                        }`
                      : new Date(certificateData.issued_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Signature */}
            <div className="absolute bottom-12 left-16 right-16 pt-6 flex justify-between items-end">
              <div>
                <p className="font-semibold text-lg">Authorized Signatory</p>
                <p className="text-gray-600">
                  {certificateData.organization_name || "SkillHat"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-black-500">Verify at</p>
                <a
                  href={`https://www.skillhat.in/verify`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {`www.skillhat.in/verify`}
                </a>
                <p className="text-sm text-black-500">Certificate ID</p>
                <p className="font-mono blue-600">
                  {certificateData.certificate_id}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition disabled:opacity-70"
          >
            <FaDownload />
            {downloading ? "Generating PDF..." : "Download Certificate"}
          </button>

          <button
            onClick={() => {
              triggerConfetti();
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?text=${encodeURIComponent(
                  `I completed my internship at ${certificateData.organization_name || "SkillHat"}! 🎉`,
                )}`,
              );
            }}
            className="flex items-center gap-3 border-2 border-gray-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-medium"
          >
            <FaLinkedin size={24} /> Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}
