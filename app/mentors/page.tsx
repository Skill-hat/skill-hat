"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Star,
  Users,
  Award,
  GraduationCap,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function Mentors() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${API}/api/mentors/list/`);
        if (!res.ok) throw new Error("Failed to fetch mentors");
        const data = await res.json();
        setMentors(data);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Search Filter
  const filteredMentors = mentors.filter((mentor) =>
    mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
<div className="bg-gray-50 pt-15">      
      
      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 ">
        
        {/* Section Header */}
               <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-700 rounded-3xl text-sm font-semibold mb-6"
          >
            <Award className="w-4 h-4" />
             Expert Mentors
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
          >
            Learn from the <span className="text-blue-600">Best Mentors</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-xl mx-auto text-base md:text-lg"
          >
            Connect with experienced professionals and accelerate your learning journey
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mt-10 px-4"
          >
            <div className="relative">
            
            </div>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-80 sm:h-96 bg-white rounded-3xl animate-pulse border border-gray-100" 
              />
            ))}
          </div>
        ) : (
          /* Mentors Grid - Fully Responsive */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMentors.map((mentor, i) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl 
                         transition-all duration-300 group border border-gray-100 
                         flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-52 sm:h-56 md:h-60 overflow-hidden">
                  <img
                    src={mentor.imageUrl || "/placeholder.jpg"}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    alt={mentor.name}
                  />

                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 right-4 text-xs px-4 py-1.5 rounded-3xl font-semibold 
                               flex items-center gap-1.5 shadow-md ${
                                 mentor.status === "Active"
                                   ? "bg-emerald-500 text-white"
                                   : "bg-amber-500 text-white"
                               }`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {mentor.status || "Available"}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {mentor.name}
                  </h3>

                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <GraduationCap size={17} className="text-blue-500 flex-shrink-0" />
                    {mentor.email}
                  </p>

                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mt-4 flex-1">
                    {mentor.bio || "Experienced mentor helping students grow in their careers."}
                  </p>

                  {/* Expertise */}
                  <div className="flex items-start gap-2 mt-5">
                    <Award size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise?.split(",").map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-2xl font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMentors.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-500 text-sm md:text-base">Try changing your search keywords</p>
          </div>
        )}
      </section>
    </div>
  );
}