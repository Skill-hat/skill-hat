"use client";
import { MdPeople, MdOutlineArrowForward, MdOutlineFace, MdWork } from "react-icons/md";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function Dashboard() {
  const [internships, setInternships] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);

  // ✅ 1. Fetch Internships (Backend API)
  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API}/upload/internships/list/`);

      if (!res.ok) {
        throw new Error("Failed to fetch internships");
      }

      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ 2. Fetch Mentors (Backend API)
  const fetchMentors = async () => {
    try {
      const res = await fetch(`${API}/api/mentors/list/`);

      if (!res.ok) {
        throw new Error("Failed to fetch mentors");
      }

      const data = await res.json();
      setMentors(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ LOAD ALL DATA
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchInternships(), fetchMentors()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`${API}/upload/enrollments/`);
      const json = await res.json();
      const allEnrollments = json.enrollments || json.data || json || [];

      setEnrollments(allEnrollments);

      // Sort and take recent 6
      const sorted = [...allEnrollments].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setRecentEnrollments(sorted.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Call it when component mounts
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isRecent = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 24 * 60 * 60 * 1000; // Last 24 hours
  };

  return (
    <div className="p-3 md:p-8 bg-gray-50/50 min-h-screen space-y-6">
      {/* --- HEADER --- */}
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">
          Dashboard
        </h1>
        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          Nirmatri Stats
        </p>
      </div>

      {/* --- QUICK STATS (Mobile: 2 Columns | Desktop: 4 Columns) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          // { label: "Revenue", value: `₹${totalRevenue}`, icon: <MdAttachMoney />, color: "text-emerald-600 bg-emerald-50" },
          {
            label: "Students",
            value: enrollments.length,
            icon: <MdPeople />,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Internships",
            value: internships.length,
            icon: <MdWork />,
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            label: "Mentors",
            value: mentors.length,
            icon: <MdPeople />,
            color: "text-orange-500 bg-orange-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="bg-white p-3 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left transition-all"
          >
            <div
              className={`p-2 md:p-3 rounded-xl text-xl md:text-2xl shrink-0 ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 truncate tracking-tight">
                {stat.label}
              </p>
              <h3 className="text-sm md:text-xl font-black text-gray-800 tracking-tighter truncate">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* INTERNSHIPS COMPACT LIST */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm md:text-lg font-black text-gray-800 uppercase tracking-tight">
              Internships
            </h2>
            <Link
              href="/admin/internships"
              className="text-indigo-600 text-[10px] md:text-xs font-bold flex items-center gap-1 hover:underline"
            >
              VIEW ALL <MdOutlineArrowForward />
            </Link>
          </div>

          <div className="space-y-3">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 animate-pulse rounded-2xl"
                  />
                ))
              : internships.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl border border-gray-50 hover:bg-indigo-50/30 transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.jpg"}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-gray-800 truncate leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[9px] md:text-[10px] text-gray-400 truncate mt-0.5">
                        {item.company} • {item.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs md:text-sm font-black text-emerald-600">
                        ₹{item.stipend || "0"}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* MENTORS COMPACT LIST */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm md:text-lg font-black text-gray-800 uppercase tracking-tight">
              Top Mentors
            </h2>
            <Link
              href="/admin/mentors"
              className="text-purple-600 text-[10px] md:text-xs font-bold flex items-center gap-1 hover:underline"
            >
              VIEW ALL <MdOutlineArrowForward />
            </Link>
          </div>

          <div className="space-y-3">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 animate-pulse rounded-2xl"
                  />
                ))
              : mentors.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl border border-gray-50 hover:bg-purple-50/30 transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 shrink-0 overflow-hidden border-2 border-white shadow-sm">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.name?.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs md:text-sm font-bold text-gray-800 truncate leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[9px] md:text-[10px] text-gray-400 truncate mt-0.5">
                        {item.expertise?.split(",")[0]}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* --- ENROLLMENTS TABLE (Simplified for Mobile) --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">
            Recent Enrollments
          </h2>
          <a
            href="/admin/enrollments"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Internship
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentEnrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-sm text-gray-400"
                  >
                    No recent enrollments yet
                  </td>
                </tr>
              ) : (
                recentEnrollments.map((enr, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {enr.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {enr.user.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">
                        {enr.internship?.title}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {enr.internship?.company}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(enr.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      {isRecent(enr.created_at) ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Recent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                          Older
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
