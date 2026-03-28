"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { MdAdd } from "react-icons/md";

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM DJANGO
  const fetchInternships = async () => {
    try {
      const res = await fetch("http://localhost:8000/upload/internships/list/");
      const data = await res.json();
      setInternships(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">

      {/* HEADER */}
      <div className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Internships 
          </h1>
          <p className="text-gray-500 mt-2">
            Explore available internship opportunities
          </p>
        </div>

        <Link href="/admin/internships/add">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition">
            <MdAdd /> Add Internship
          </button>
        </Link>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-20">

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {internships.map((item: any, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition group border"
              >

                {/* IMAGE */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl || "/placeholder.jpg"}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-3">

                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {item.company} • {item.location}
                  </p>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>

                  {/* STATS */}
                  <div className="flex justify-between text-sm text-gray-600 pt-2">
                    <span>⏳ {item.duration}</span>
                    <span className="text-blue-600 font-semibold">
                      {item.stipend}
                    </span>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>

                    <Link
                      href={`/admin/internships/edit/${item._id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                    >
                      Edit →
                    </Link>
                  </div>

                </div>
              </motion.div>
            ))}

          </div>
        )}

        {/* EMPTY */}
        {!loading && internships.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No internships found
          </div>
        )}

      </div>
    </div>
  );
}