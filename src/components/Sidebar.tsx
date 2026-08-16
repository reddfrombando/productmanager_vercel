"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";

import {
  LayoutDashboard,
  BookOpen,
  FolderHeart,
  FileText,
  PlusCircle,
  Settings,
  Shield,
  Library,
  ChevronRight,
  CalendarDays
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const { user, streak } = usePlatform();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Curriculum",
      href: "/curriculum",
      icon: BookOpen
    },
    {
      name: "Study Calendar",
      href: "/calendar",
      icon: CalendarDays
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderHeart
    },
    {
      name: "Case Studies",
      href: "/cases",
      icon: FileText
    },
    {
      name: "Resources",
      href: "/resources",
      icon: Library
    },
    {
      name: "Contributor Portal",
      href: "/contribute",
      icon: PlusCircle
    }
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname?.startsWith(href) ?? false;
  };

  return (
    <aside className="w-64 border-r border-border-light bg-white flex flex-col h-[calc(100vh-73px)] sticky top-[73px] z-10 shrink-0 hidden md:flex">
      {user && (
        <div className="p-4 border-b border-border-light bg-[#F8FAFC]/50">
          <div className="flex items-center space-x-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-3 border border-orange-500/10">
            <span className="text-xl animate-bounce">
              🔥
            </span>

            <div>
              <div className="text-xs font-semibold text-primary/60">
                Study Streak
              </div>

              <div className="text-sm font-bold text-orange-600">
                {streak} {streak === 1 ? "Day" : "Days"}
              </div>
            </div>

            <ChevronRight className="h-4 w-4 ml-auto text-orange-400" />
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-primary/40 uppercase tracking-wider px-3 mb-2">
          Platform Workspace
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                active
                  ? "bg-accent-purple/10 text-accent-purple font-semibold shadow-sm"
                  : "text-primary/75 hover:bg-primary-light/5 hover:text-primary"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${
                  active
                    ? "text-accent-purple"
                    : "text-primary/50 group-hover:text-primary"
                }`}
              />

              <span>{item.name}</span>
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <div className="pt-4 border-t border-border-light/80 mt-4 space-y-1.5">
            <div className="text-[10px] font-bold text-primary/40 uppercase tracking-wider px-3 mb-2">
              Administration
            </div>

            <Link
              href="/admin"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive("/admin")
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary/75 hover:bg-primary-light/5 hover:text-primary"
              }`}
            >
              <Shield
                className={`h-4.5 w-4.5 ${
                  isActive("/admin")
                    ? "text-white"
                    : "text-primary/50"
                }`}
              />

              <span>Admin Dashboard</span>
            </Link>

            <Link
              href="/admin/cache-sync"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive("/admin/cache-sync")
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary/75 hover:bg-primary-light/5 hover:text-primary"
              }`}
            >
              <Settings
                className={`h-4.5 w-4.5 ${
                  isActive("/admin/cache-sync")
                    ? "text-white"
                    : "text-primary/50"
                }`}
              />

              <span>Sync Admin Cache</span>
            </Link>
          </div>
        )}
      </nav>

      {user && (
        <div className="p-4 border-t border-border-light bg-white flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="overflow-hidden">
            <div className="text-xs font-bold text-primary truncate leading-none">
              {user.name}
            </div>

            <div className="text-[10px] text-primary/50 truncate leading-none mt-1">
              {user.email}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
