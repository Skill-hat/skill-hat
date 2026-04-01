"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_APP_URL;

interface Enrollment {
  _id?: string;
  name?: string;
  email?: string;
  created_at?: string;
}

export default function EnrollmentsPage() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 Fetch enrollments
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(`${API}/api/enrollments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch enrollments: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      console.log("Fetched data:", json); // Debug log

      // ✅ Handle both array & {data: []} and ensure it's an array
      let enrollments = [];
      if (Array.isArray(json)) {
        enrollments = json;
      } else if (json.data && Array.isArray(json.data)) {
        enrollments = json.data;
      } else {
        console.warn("Unexpected data format:", json);
        enrollments = [];
      }

      setData(enrollments);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err instanceof Error ? err.message : "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Filter safely
  const filtered = data.filter((item) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;
    
    const nameMatch = (item.name?.toLowerCase() || "").includes(searchTerm);
    const emailMatch = (item.email?.toLowerCase() || "").includes(searchTerm);
    
    return nameMatch || emailMatch;
  });

  // ⏱ Format date safely
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Invalid Date";
      
      return parsedDate.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // 🟢 Status (recent = last 24h)
  const isRecent = (date?: string) => {
    if (!date) return false;
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      
      return Date.now() - parsedDate.getTime() < 24 * 60 * 60 * 1000;
    } catch (error) {
      console.error("Date comparison error:", error);
      return false;
    }
  };

  // Refresh data handler
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Enrollments</h1>
          <p className="text-gray-500 text-sm">
            Track recent internship applications ({filtered.length} total)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border px-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg text-center">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-pulse">Loading enrollments...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Enrolled At</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-400">
                      {search ? "No matching enrollments found" : "No enrollments found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr
                      key={item._id || `${item.email}-${index}`}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      {/* 👤 NAME */}
                      <td className="p-4 font-semibold">
                        {item.name || "Anonymous"}
                      </td>

                      {/* 📧 EMAIL */}
                      <td className="p-4 text-gray-600">
                        {item.email || "No email provided"}
                      </td>

                      {/* 🕒 DATE */}
                      <td className="p-4 text-gray-600">
                        {formatDate(item.created_at)}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        {isRecent(item.created_at) ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                            🟢 Recent (24h)
                          </span>
                        ) : item.created_at ? (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                            ⏰ Older
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                            ❓ Unknown
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}