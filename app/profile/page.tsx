"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Award, BookOpen, User as UserIcon, Calendar, Linkedin, Download, ExternalLink } from "lucide-react";
import { Course } from "@/src/types";
import confetti from "canvas-confetti";
import { MOCK_COURSES } from "@/src/mockData";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";

export default function Profile() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Simulate API call
    const timer = setTimeout(() => {
      setEnrolledCourses([MOCK_COURSES[0]]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleShareLinkedIn = (courseTitle: string) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    const text = encodeURIComponent(`I'm thrilled to share that I've successfully completed the ${courseTitle} at SkillHatv! #SkillHat #Certification #Learning`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?text=${text}`, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Please login to view your profile</h2>
          <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Profile Header */}
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
          <UserIcon size={64} />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 font-medium">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 border border-gray-100">
              <BookOpen size={18} className="text-blue-600" />
              <span>{enrolledCourses.length} Enrolled</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 border border-gray-100">
              <Award size={18} className="text-purple-600" />
              <span>1 Certificate</span>
            </div>
          </div>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all">
          Edit Profile
        </button>
      </section>

      {/* Enrolled Courses */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Learning Journey</h2>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">In Progress</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
            <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enrolledCourses.map(course => (
              <motion.div 
                key={course._id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 group"
              >
                <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{course.category}</span>
                      <span className="text-xs text-gray-400 flex items-center"><Calendar size={12} className="mr-1" /> Enrolled Mar 2026</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[65%]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">65% Complete</span>
                      <Link href={`/course/${course._id}`} className="text-blue-600 font-bold text-sm flex items-center">
                        Continue <ExternalLink size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Certificates */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Award size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional UI/UX Design</h3>
                <p className="text-blue-100 text-sm">Issued on Jan 15, 2026</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => handleShareLinkedIn("Professional UI/UX Design")}
                  className="flex-1 bg-white text-blue-600 py-3 rounded-2xl font-bold text-sm flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <Linkedin size={16} className="mr-2" /> Share
                </button>
                <button className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors">
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
