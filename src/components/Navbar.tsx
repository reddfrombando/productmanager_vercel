"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Menu, X, Sparkles, BookOpen, User, LogOut, LayoutDashboard, ChevronRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, getOverallProgress } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Curriculum", href: "/curriculum" },
    { name: "Projects", href: "/projects" },
    { name: "Case Studies", href: "/cases" },
    { name: "Resources", href: "/resources" },
  ];

  const overallProgress = getOverallProgress();

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-border-light/80 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 font-display text-xl font-bold tracking-tight">
          <span className="gradient-bg flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md">
            P
          </span>
          <span className="text-primary tracking-wide">PM</span>
          <span className="text-accent-purple font-medium">Foundations</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 font-sans text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-200 hover:text-accent-purple ${
                isActive(link.href) ? "text-accent-purple font-semibold" : "text-primary/75"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth / Profile Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Progress Ring Summary */}
              <div className="flex items-center space-x-2 rounded-full bg-primary-light/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <BookOpen className="h-3.5 w-3.5 text-accent-purple animate-pulse" />
                <span>{overallProgress}% Done</span>
              </div>

              {/* Admin Area Tag */}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-full bg-accent-purple/10 px-3 py-1 text-xs font-bold text-accent-purple hover:bg-accent-purple/20 transition-colors"
                >
                  Admin Area
                </Link>
              )}

              {/* User Dropdown Preview */}
              <div className="flex items-center space-x-3 border-l border-border-light pl-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-accent-purple transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary/70" />
                  <span>Dashboard</span>
                </Link>
                
                <span className="text-xs text-primary/40">|</span>
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-primary hover:text-accent-purple transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=signup"
                className="gradient-bg rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity flex items-center space-x-1"
              >
                <span>Start Learning</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary hover:text-accent-purple focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-border-light/50 font-sans text-base font-semibold space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-1 hover:text-accent-purple ${
                isActive(link.href) ? "text-accent-purple" : "text-primary/75"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border-light">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-primary/75">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-accent-purple" />
                    <span>{user.name}</span>
                  </div>
                  <span className="font-bold">{overallProgress}% Complete</span>
                </div>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center rounded-xl bg-accent-purple/10 py-2 text-xs font-bold text-accent-purple"
                  >
                    Admin Area
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-xl border border-border-light py-2 text-sm font-semibold text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center rounded-xl bg-red-50 py-2 text-sm font-semibold text-red-500 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center border border-border-light py-2 rounded-xl text-sm font-semibold text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?tab=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gradient-bg block text-center py-2 rounded-xl text-sm font-semibold text-white shadow-md"
                >
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
