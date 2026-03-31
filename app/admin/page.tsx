"use client";

import { useData } from "@/src/context/DataContext";
import {
  MdWork,
  MdPeople,
  MdStar,
  MdAttachMoney,
  MdOutlineArrowForward,
  MdLocationOn,
} from "react-icons/md";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // ✅ Context Data
  const { enrollments = [], getTotalRevenue } = useData();

  // ✅ Backend States
  const [internships, setInternships] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalRevenue = getTotalRevenue ? getTotalRevenue() : 0;

  // ✅ 1. Fetch Internships (Backend API)
  const fetchInternships = async () => {
    try {
      const res = await fetch("https://skillhat-backend.onrender.com/upload/internships/list/");
      if (!res.ok) throw new Error("Internships fetch failed");
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ 2. Fetch Mentors (Backend API)
  const fetchMentors = async () => {
    try {
      const res = await fetch("https://skillhat-backend.onrender.com/api/mentors/list/");
      if (!res.ok) throw new Error("Mentors fetch failed");
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

  return (
    <div className="p-3 md:p-8 bg-gray-50/50 min-h-screen space-y-6">

      {/* --- HEADER --- */}
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">Dashboard</h1>
        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Nirmatri Stats</p>
      </div>

      {/* --- QUICK STATS (Mobile: 2 Columns | Desktop: 4 Columns) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Revenue", value: `₹${totalRevenue}`, icon: <MdAttachMoney />, color: "text-emerald-600 bg-emerald-50" },
          { label: "Students", value: enrollments.length, icon: <MdPeople />, color: "text-blue-600 bg-blue-50" },
          { label: "Internships", value: internships.length, icon: <MdWork />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Mentors", value: mentors.length, icon: <MdStar />, color: "text-orange-500 bg-orange-50" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="bg-white p-3 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left transition-all"
          >
            <div className={`p-2 md:p-3 rounded-xl text-xl md:text-2xl shrink-0 ${stat.color}`}>{stat.icon}</div>
            <div className="overflow-hidden w-full">
              <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 truncate tracking-tight">{stat.label}</p>
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
            <h2 className="text-sm md:text-lg font-black text-gray-800 uppercase tracking-tight">Internships</h2>
            <Link href="/admin/internships" className="text-indigo-600 text-[10px] md:text-xs font-bold flex items-center gap-1 hover:underline">
              VIEW ALL <MdOutlineArrowForward />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />) :
              internships.slice(0, 3).map((item) => (
                <div key={item._id} className="p-3 rounded-2xl border border-gray-50 hover:bg-indigo-50/30 transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img src={item.imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 truncate leading-tight">{item.title}</h4>
                    <p className="text-[9px] md:text-[10px] text-gray-400 truncate mt-0.5">{item.company} • {item.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs md:text-sm font-black text-emerald-600">₹{item.stipend || "0"}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* MENTORS COMPACT LIST */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm md:text-lg font-black text-gray-800 uppercase tracking-tight">Top Mentors</h2>
            <Link href="/admin/mentors" className="text-purple-600 text-[10px] md:text-xs font-bold flex items-center gap-1 hover:underline">
              VIEW ALL <MdOutlineArrowForward />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />) :
              mentors.slice(0, 3).map((item) => (
                <div key={item._id} className="p-3 rounded-2xl border border-gray-50 hover:bg-purple-50/30 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 shrink-0 overflow-hidden border-2 border-white shadow-sm">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : item.name?.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 truncate leading-tight">{item.name}</h4>
                    <p className="text-[9px] md:text-[10px] text-gray-400 truncate mt-0.5">{item.expertise?.split(',')[0]}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] font-black text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                    <MdStar /> {item.rating || "0"}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* --- ENROLLMENTS TABLE (Simplified for Mobile) --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Recent Enrollments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-50">
              {enrollments.slice(0, 5).map((e, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-xs md:text-sm font-bold text-gray-800 leading-tight">{e.studentName}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 truncate max-w-[150px] md:max-w-none">{e.studentEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-[10px] text-gray-500 font-bold hidden md:table-cell">
                    {new Date(e.enrolledDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={`px-2 py-1 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-tight shadow-sm border ${e.status === "Active" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"
                      }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enrollments.length === 0 && (
            <div className="p-10 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">No Recent Data</div>
          )}
        </div>
      </div>
    </div>
  );
}