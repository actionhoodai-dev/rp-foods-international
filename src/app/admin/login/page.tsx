"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock, LogIn, Globe, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const { user, loading, error: authError } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, send them to dashboard
    if (user && !loading) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // AdminAuthContext will automatically check authorization and redirect
    } catch (err: any) {
      console.error("Login error:", err);
      setSubmitError(err.message || "Failed to log in. Please check your credentials.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  const activeError = submitError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg py-16 px-4">
      <div className="max-w-md w-full flex flex-col gap-6">
        
        {/* Brand header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="p-2 rounded bg-maroon text-gold">
            <Globe className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-maroon">RP Foods International</h1>
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">Trade Administrator Desk</p>
        </div>

        <Card className="rounded-none border-gray-200 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold font-heading text-charcoal">Secure Portal Access</CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              Only authorized trade administrators can access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {activeError && (
              <Alert variant="destructive" className="rounded-none mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs leading-relaxed">{activeError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@rp-foods.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 rounded-none border-gray-300 focus-visible:ring-maroon"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 rounded-none border-gray-300 focus-visible:ring-maroon"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-maroon hover:bg-maroon-dark text-white rounded-none py-6 font-semibold uppercase tracking-wider text-xs shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                {submitting ? "Authenticating..." : "Sign In"} <LogIn className="h-4 w-4" />
              </Button>
            </form>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
