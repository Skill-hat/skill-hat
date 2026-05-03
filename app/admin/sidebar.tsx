"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdWork,
  MdPerson,
  MdControlCamera,
  MdAdminPanelSettings,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { DockIcon, LogInIcon } from "lucide-react";
import { HiDocument } from "react-icons/hi";

export function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname() || "";
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, open]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/admin/login");
  }, [router]);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: MdDashboard },
    { path: "/admin/internships", label: "Internships", icon: MdWork },
    { path: "/admin/mentors", label: "Mentors", icon: MdAdminPanelSettings },
    { path: "/admin/accessControl", label: "Controls", icon: MdControlCamera },
    { path: "/admin/enrollments", label: "Enrollments", icon: MdPerson },
    { path: "/admin/certificates", label: "Certificates", icon: HiDocument },
  ];

  const isActive = (path: string) => {
    if (!path) return false;
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile – tapping outside closes the sidebar */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white border-r z-[60]
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "shadow-2xl" : ""}
        `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white ml-2 sm:ml-10 tracking-tight">
            Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 ml-2 sm:ml-10 truncate opacity-90">
            Internships & Courses
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    // No onClick → sidebar stays open on mobile
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors active:scale-[0.98] ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
          >
            <LogInIcon />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}