"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/src/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const API = process.env.NEXT_PUBLIC_APP_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch user from backend using token
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token); // 🔍 debug

    if (!token || token === "undefined" || token === "null") {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/users/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid token");
      }

      const data = await res.json();
      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Auth error:", err);

      // 🔥 clear invalid session
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token); // 🔍 debug

    try {
      if (token && token !== "undefined" && token !== "null") {
        await fetch(`${API}/api/users/logout/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.warn("No valid token, skipping backend logout");
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
