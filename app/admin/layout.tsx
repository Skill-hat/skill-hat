"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Sidebar } from "./sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ ensure client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 Auth guard
  useEffect(() => {
    if (!mounted) return;

    const isAdmin = sessionStorage.getItem("isAdmin");

    // ❌ Not logged → redirect
    if (pathname !== "/admin/login" && isAdmin !== "true") {
      router.replace("/admin/login");
    }
  }, [mounted, pathname, router]);

  // ⛔ block render until mounted
  if (!mounted) return null;

  const isAdmin = sessionStorage.getItem("isAdmin");

  // ❌ block unauthorized UI
  if (pathname !== "/admin/login" && isAdmin !== "true") {
    return null;
  }

  // ✅ LOGIN PAGE → only login UI
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // ✅ ADMIN PANEL UI
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main */}
      <div className={`flex-1 transition-all ${open ? "lg:ml-72" : ""}`}>
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-[100] p-2 bg-white rounded-xl shadow border"
        >
          {open ? (
            <HiOutlineX className="w-5 h-5" />
          ) : (
            <HiOutlineMenu className="w-5 h-5" />
          )}
        </button>

        <main className="p-6 pt-0 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
