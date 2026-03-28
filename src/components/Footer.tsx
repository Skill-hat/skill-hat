"use client";
import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Routes where footer should NOT show
  const hideRoutes = ["/admin","/register", "/login", "/courses"];

  const shouldHide =
    hideRoutes.includes(pathname) ||
    pathname.startsWith("/course/") ||
    pathname.startsWith("/mentors/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/mentors";

  if (shouldHide) return null;
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <GraduationCap size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                NexusAcademy
              </span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Empowering the next generation of professionals through expert-led
              courses and industry-recognized certifications.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="hover:text-blue-600 transition-colors"
                >
                  Our Mentors
                </Link>
              </li>
              <li>
                <Link
                  href="/certificates"
                  className="hover:text-blue-600 transition-colors"
                >
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2026 NexusAcademy Professional. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
