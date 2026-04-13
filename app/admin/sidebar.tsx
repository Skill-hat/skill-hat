"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdWork, MdPerson, MdControlCamera, MdAdminPanelSettings } from "react-icons/md";
import { useRouter } from "next/navigation";

export function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname() || "";
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = useRouter();

const handleLogout = () => {
  // ✅ clear BOTH
  sessionStorage.removeItem("isAdmin");
  sessionStorage.removeItem("token");

  localStorage.removeItem("token");   // 🔥 ADD THIS
  localStorage.removeItem("user");    // optional

  router.replace("/admin/login");
};

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: MdDashboard },
    { path: "/admin/internships", label: "Internships", icon: MdWork },
    { path: "/admin/mentors", label: "Mentors", icon: MdAdminPanelSettings },
    { path: "/admin/accessControl", label: "Controls", icon: MdControlCamera },
    { path: "/admin/enrollments", label: "Enrollments", icon: MdPerson }    
  ];

  const isActive = (path: string) => {
    if (!path) return false;
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    // Sirf mobile (chhote screen) par click karne se sidebar band hoga
    // Laptop/PC par sidebar khula hi rahega
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-72 bg-white border-r z-[60]
        flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 shrink-0">
        <h1 className="text-2xl font-bold text-white ml-10 tracking-tight">
          Admin Panel
        </h1>
        <p className="text-sm text-blue-100 mt-1 ml-10 truncate opacity-90">
          Internships & Courses
        </p>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={handleLinkClick} // <--- Yahan change kiya hai
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-400 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      {/* User Bottom */}
    </aside>
  );
}
