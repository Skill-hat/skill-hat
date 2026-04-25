"use client";

import { useState, useEffect } from "react";
import Loader from "@/src/components/loading";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem("seenLoader");

    if (!hasSeenLoader) {
      setLoading(true);

      setTimeout(() => {
        sessionStorage.setItem("seenLoader", "true");
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, []);

  // 🚫 Don't show anything until decision is made
  if (loading === null) return null;

  // ⏳ Show ONLY loader
  if (loading) return <Loader />;

  // ✅ After loader → show app
  return <>{children}</>;
}