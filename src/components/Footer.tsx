"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  const hideRoutes = ["/admin", "/register", "/login", "/courses","/profile/setting"];

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

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* LEFT SECTION */}
          <div className="col-span-1 md:col-span-2">

            {/* LOGO + NAME */}
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo1.png"
                alt="Skillhat Logo"
                width={160}
                height={160}
                className="w-auto h-10 object-contain"
                priority
              />
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 max-w-md leading-relaxed text-sm">
              Empowering the next generation of professionals through expert-led
              internships and industry-recognized certifications.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/internships" className="hover:text-blue-600 transition-colors">
                  All Internship
                </Link>
              </li>
              <li>
                <Link href="/mentors" className="hover:text-blue-600 transition-colors">
                  Our Mentors
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/company/about" className="hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/company/contactus" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              {/* 🔥 Privacy Policy ko Terms & Conditions page se link kiya */}
              <li>
                <Link href="/auth/terms-and-conditions" className="hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

          <p>© 2026 Skillhat. All rights reserved.</p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-5 mt-4 md:mt-0 text-lg">
            <a 
              href="https://twitter.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-transform hover:scale-110"
            >
              <FaTwitter />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-transform hover:scale-110"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-transform hover:scale-110"
            >
              <FaInstagram />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}