"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Globe, 
  LayoutDashboard, 
  FolderHeart, 
  Sprout, 
  MailOpen, 
  Settings as SettingsIcon, 
  ExternalLink, 
  LogOut,
  Menu
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  // If loading authentication state, show loading spinner
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Securing administrator session...</p>
        </div>
      </div>
    );
  }

  // If on login page, just render the child login card
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not loading, show redirecting state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Redirecting to login portal...</p>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Category Management", href: "/admin/categories", icon: FolderHeart },
    { name: "Product Registry", href: "/admin/products", icon: Sprout },
    { name: "Inquiry Inbox", href: "/admin/inquiries", icon: MailOpen },
    { name: "Business Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-bg text-charcoal">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
        
        {/* Header Branding */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-maroon text-gold">
              <Globe className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide font-heading text-maroon leading-none">RP Foods</span>
              <span className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">Admin Dashboard</span>
            </div>
          </div>
          <Link href="/" target="_blank" className="p-1 hover:bg-gray-100 text-gray-400 hover:text-charcoal rounded md:hidden" title="View Website">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* User Info Capsule */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 hidden md:block">
          <span className="block text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Logged In As</span>
          <span className="text-xs font-bold text-gray-700 truncate block" title={user.email || ""}>
            {user.email}
          </span>
        </div>

        {/* Sidebar Menu Links */}
        <nav className="flex-grow p-4 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                  isActive 
                    ? "bg-maroon text-white border-maroon" 
                    : "bg-transparent text-gray-600 border-transparent hover:bg-gray-50 hover:text-charcoal"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-charcoal transition-colors">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>Visit Site</span>
          </Link>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out of the administration panel?")) {
                logout();
              }
            }}
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-grow flex flex-col overflow-x-hidden min-h-screen">
        
        {/* Mobile Header Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-maroon font-heading">RP Foods Admin</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">{user.email}</span>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-grow p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AdminAuthProvider>
  );
}
