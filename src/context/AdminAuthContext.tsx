"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { isAuthorizedAdmin, logActivity } from "@/lib/firebase/db";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          if (firebaseUser.email) {
            const isAuthorized = await isAuthorizedAdmin(firebaseUser.email);
            if (isAuthorized) {
              setUser(firebaseUser);
              // Log admin login activity in background
              logActivity(firebaseUser.email, "Logged into administrator panel").catch(console.error);
            } else {
              // Sign out and show error if unauthorized
              await signOut(auth);
              setUser(null);
              setError("Access Denied: Your email is not registered in the administrator registry.");
              router.push("/admin/login");
            }
          } else {
            await signOut(auth);
            setUser(null);
            setError("Access Denied: Account email not found.");
            router.push("/admin/login");
          }
        } catch (err) {
          console.error("Auth check error:", err);
          setUser(null);
          setError("Access Denied: Server authentication check failed.");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    if (user?.email) {
      await logActivity(user.email, "Logged out of administrator panel").catch(console.error);
    }
    await signOut(auth);
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
