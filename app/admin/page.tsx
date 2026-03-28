"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  BookOpen, 
  X,
  Save
} from "lucide-react";
import { Course, Mentor } from "@/src/types";
import { MOCK_COURSES, MOCK_MENTORS } from "@/src/mockData";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdWork, MdSchool, MdPerson } from "react-icons/md";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🔐 ADMIN PROTECTION
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, []);

  const [activeTab, setActiveTab] = useState<"courses" | "mentors">("courses");
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: MdDashboard },
    { path: "/admin/internships", label: "Internships", icon: MdWork },
    { path: "/admin/courses", label: "Courses", icon: MdSchool },
    { path: "/admin/mentors", label: "Mentors", icon: MdPerson },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());

    if (editingItem) {
      if (activeTab === 'courses') {
        setCourses(courses.map(c => c._id === editingItem._id ? { ...c, ...data } : c));
      } else {
        setMentors(mentors.map(m => m._id === editingItem._id ? { ...m, ...data } : m));
      }
    } else {
      const newItem = { ...data, _id: Math.random().toString(36).substr(2, 9) };
      if (activeTab === 'courses') {
        setCourses([...courses, newItem]);
      } else {
        setMentors([...mentors, newItem]);
      }
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (activeTab === 'courses') {
      setCourses(courses.filter(c => c._id !== id));
    } else {
      setMentors(mentors.filter(m => m._id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div className="flex">

      {/* 🔥 SIDEBAR (SMALL WIDTH) */}
      <aside className="w-56 h-screen bg-white border-r fixed left-0 top-0 flex flex-col shadow-sm">

        <div className="p-5 bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-lg font-bold text-white">Admin</h1>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                      isActive(item.path)
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* 🔥 MAIN CONTENT */}
      <div className="ml-56 w-full px-6 py-10">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg mb-6 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New {activeTab}
        </button>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab("courses")}>Courses</button>
          <button onClick={() => setActiveTab("mentors")}>Mentors</button>
        </div>

        {/* LIST */}
        {activeTab === "courses"
          ? courses.map(c => (
              <div key={c._id} className="flex justify-between border p-3 mb-2 rounded">
                {c.title}
                <div className="flex gap-2">
                  <Edit2 size={16} />
                  <Trash2 size={16} onClick={() => handleDelete(c._id)} />
                </div>
              </div>
            ))
          : mentors.map(m => (
              <div key={m._id} className="flex justify-between border p-3 mb-2 rounded">
                {m.name}
                <div className="flex gap-2">
                  <Edit2 size={16} />
                  <Trash2 size={16} onClick={() => handleDelete(m._id)} />
                </div>
              </div>
            ))}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <motion.div className="bg-white p-6 rounded-xl w-[400px]">
              <form onSubmit={handleSave}>
                <input name="title" className="border p-2 w-full mb-3" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}