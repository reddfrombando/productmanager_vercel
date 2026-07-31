"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CASE_STUDIES } from "@/data/curriculum";
import { FileText, ChevronRight, Search, Sparkles, BookOpen } from "lucide-react";

export default function CaseStudiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Classic", "AI", "FAANG Prompt"];

  const filteredCases = CASE_STUDIES.filter((c) => {
    const matchesCategory = activeCategory === "All" ? true : c.type === activeCategory;
    const matchesSearch =
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-primary flex items-center space-x-2">
                <FileText className="h-6 w-6 text-accent-cyan animate-pulse" />
                <span>Product Case Studies Library</span>
              </h1>
              <p className="text-xs text-primary/50 mt-1 font-sans">
                Review the structural decisions, metrics, and frameworks implemented by Stripe, Netflix, OpenAI, and Cursor.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-primary/30" />
              <input
                type="text"
                placeholder="Search by company or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex bg-white border border-border-light rounded-xl p-1 text-xs font-semibold text-primary/60 shadow-sm self-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-accent-cyan text-white font-bold"
                    : "hover:text-primary"
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>

          {/* Case studies list grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-border-light rounded-2xl p-6 shadow-premium flex flex-col justify-between hover:border-accent-cyan/55 hover:shadow-premium-hover transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Top line badges */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-black text-primary tracking-wide">
                      {c.company}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                      c.type === "AI"
                        ? "bg-accent-purple/5 border border-accent-purple/10 text-accent-purple"
                        : c.type === "Classic"
                        ? "bg-accent-cyan/5 border border-accent-cyan/10 text-accent-cyan"
                        : "bg-orange-50 border border-orange-100 text-orange-600"
                    }`}>
                      {c.type}
                    </span>
                  </div>

                  {/* Title & Core Problem */}
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-bold text-primary group-hover:text-accent-cyan transition-colors leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-primary/60 line-clamp-2 leading-relaxed font-sans font-medium">
                      {c.problem}
                    </p>
                  </div>

                  {/* Framework tag */}
                  <div className="bg-bg-light/60 border border-border-light/50 rounded-xl p-3 text-[11px] font-semibold text-primary/75">
                    <div className="text-[9px] font-bold text-primary/45 uppercase tracking-wide">Core Framework</div>
                    <div className="mt-1 flex items-center space-x-1">
                      <BookOpen className="h-3.5 w-3.5 text-accent-purple shrink-0" />
                      <span>{c.frameworkUsed}</span>
                    </div>
                  </div>
                </div>

                {/* Footer tags & CTA */}
                <div className="pt-4 mt-4 border-t border-border-light/65 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-bg-light border border-border-light rounded px-1.5 py-0.5 text-[9px] font-bold text-primary/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/cases/${c.id}`}
                    className="rounded-lg bg-bg-light border border-border-light hover:bg-accent-cyan hover:text-white hover:border-accent-cyan px-3 py-1.5 text-[10px] font-bold text-primary transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Read Analysis</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCases.length === 0 && (
            <div className="text-center py-16 bg-white border border-dashed border-border-light rounded-2xl max-w-xl">
              <FileText className="h-10 w-10 text-primary/20 mx-auto" />
              <h3 className="font-display text-base font-bold text-primary mt-3">No cases found</h3>
              <p className="text-xs text-primary/50 max-w-xs mx-auto mt-1 font-sans">
                Try searching for other companies, or modify your category tabs.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
