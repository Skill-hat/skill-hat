"use client";

import { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  User as UserIcon,
  Linkedin,
  Phone,
  MapPin,
  Calendar,
  Edit,
  School,
  Book,
  GraduationCap,
  UserCheck,
  Briefcase,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import AuthGuard from "@/src/components/AuthGuard";
import CertificatesPage from "./certificates/page";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API}/api/users/my-enrollments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setEnrollments(data.enrollments);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      }
    };

    fetchEnrollments();
  }, []);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Please login to view your profile
          </h2>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Header (same as before) */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start gap-8">
          {/* ... (Personal Information + Education section same rakha hai) ... */}
          <div className="w-22 h-22 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <UserIcon size={64} />
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.full_name}
                </h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Edit size={20} />
                  Edit Profile
                </Link>

                <button
                  onClick={() => {
                    if (user.linkedin) {
                      let url = user.linkedin.trim();

                      // Add https:// if missing
                      if (
                        !url.startsWith("http://") &&
                        !url.startsWith("https://")
                      ) {
                        url = "https://" + url;
                      }

                      window.open(url, "_blank", "noopener,noreferrer");
                    } else {
                      router.push("/profile/edit");
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-6 py-3 rounded-2xl font-semibold transition-all active:scale-95"
                >
                  <Linkedin size={20} />
                  {user.linkedin
                    ? "View LinkedIn Profile"
                    : "Add LinkedIn Profile"}
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck size={22} className="text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.phone && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <Phone className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="font-semibold">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.gender && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <UserCheck className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Gender
                      </p>
                      <p className="font-semibold">{user.gender}</p>
                    </div>
                  </div>
                )}
                {(user.city || user.state) && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Location
                      </p>
                      <p className="font-semibold">
                        {user.city && user.state
                          ? `${user.city}, ${user.state}`
                          : user.city || user.state}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <School size={22} className="text-blue-600" />
                Education
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.college && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <School className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        College / University
                      </p>
                      <p className="font-semibold">{user.college}</p>
                    </div>
                  </div>
                )}
                {user.course && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <Book className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Course
                      </p>
                      <p className="font-semibold">{user.course}</p>
                    </div>
                  </div>
                )}
                {user.branch && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <Book className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Branch / Specialization
                      </p>
                      <p className="font-semibold">{user.branch}</p>
                    </div>
                  </div>
                )}
                {user.graduation_year && (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                    <GraduationCap className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Expected Graduation Year
                      </p>
                      <p className="font-semibold">{user.graduation_year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====================== PROFESSIONAL ENROLLED INTERNSHIPS ====================== */}
        {/* ====================== IMPROVED & PREMIUM ENROLLED INTERNSHIPS ====================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase size={26} className="text-blue-600" />
              Enrolled Internships
            </h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl py-16 text-center">
              <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No internships enrolled yet
              </p>
              <p className="text-gray-500 mt-1">
                Start your learning journey by enrolling in an internship
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
                >
                  {/* Premium Top Accent Bar */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

                  <div className="p-7">
                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>

                    {/* Company */}
                    <p className="mt-3 text-gray-700 flex items-center gap-2 text-lg">
                      <span className="text-blue-600">•</span>
                      {item.company}
                    </p>

                    {/* Duration */}
                    <div className="mt-8 flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Calendar size={22} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          DURATION
                        </p>
                        <p className="font-semibold text-gray-900 text-lg">
                          {item.duration}
                        </p>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => router.push(`/internship/${item._id}`)}
                      className="mt-10 w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all group-hover:scale-[1.03] active:scale-95 shadow-lg shadow-blue-500/30"
                    >
                      View Details
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Certificates */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
          <CertificatesPage />
        </section>
      </div>
    </AuthGuard>
  );
}
