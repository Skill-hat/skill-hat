import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { cn } from "@/lib/utils";
import SplashCursor from "@/src/components/SplashCursor";
import ClientWrapper from "@/src/components/ClientWrapper";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skill-hatt | Professional Learning Platform",
  description:
    "Empowering the next generation of professionals through expert-led courses.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${inter.className} min-h-screen bg-[#F9FAFB] text-[#111827]`}
      >
        {/* Client-only effects */}
        <SplashCursor
          DENSITY_DISSIPATION={3.5}
          VELOCITY_DISSIPATION={2}
          PRESSURE={0.1}
          CURL={3}
          SPLAT_RADIUS={0.2}
          SPLAT_FORCE={6000}
          COLOR_UPDATE_SPEED={10}
          SHADING
          RAINBOW_MODE={false}
          COLOR="#9ab0d0"
        />

        <AuthProvider>
          <ClientWrapper>
            <Navbar />

            <main>{children}</main>

            <Footer />
          </ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
