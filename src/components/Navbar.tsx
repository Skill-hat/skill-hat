"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { User, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const hideNavbarRouters = ["/admin", "/mentors", "/login", "/register"];

  const shouldHide = hideNavbarRouters.includes(pathname) || pathname.startsWith("/course/") || pathname.startsWith("/mentors/")  || pathname.startsWith("/admin/");

  if (shouldHide) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-30 h-10 bg-white rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <Image
                src={"/logo.png"}
                alt="logo"
                height={100}
                width={100}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/mentors"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Mentors
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/register"
                  className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4"
          >
            <Link href="/courses" className="block text-gray-600 font-medium">
              Courses
            </Link>
            <Link href="/mentors" className="block text-gray-600 font-medium">
              Mentors
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block text-gray-600 font-medium"
                >
                  Profile
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block text-gray-600 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-600 font-medium">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
