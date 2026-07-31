"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { RESOURCE_LIBRARY } from "@/data/curriculum";
import { Library, Search, ExternalLink, Tag } from "lucide-react";

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Books",
    "Podcasts",
    "Frameworks",
    "Templates"
  ];

  const filteredResources = RESOURCE_LIBRARY.filter((res) => {
    const matchesCategory = selectedCategory === "All" ? true : res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      res.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-4xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-primary flex items-center space-x-2">
                <Library className="h-6 w-6 text-accent-purple" />
                <span>PM Resource Library</span>
              </h1>
              <p className="text-xs text-primary/50 mt-1 font-sans">
                Curated checklists, templates, books, and podcast episodes recommended by practicing Product Managers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-primary/30" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Categories select pills */}
          <div className="flex bg-white border border-border-light rounded-xl p-1 text-xs font-semibold text-primary/60 shadow-sm self-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-accent-purple text-white font-bold"
                    : "hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resources listing grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex flex-col justify-between hover:border-accent-purple/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-accent-purple uppercase bg-accent-purple/5 px-2 py-0.5 rounded border border-accent-purple/10">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-primary/50 font-semibold">by {res.author}</span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-primary leading-snug group-hover:text-accent-purple transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-primary/65 leading-relaxed font-sans font-medium">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border-light/60 flex items-center justify-between">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {res.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-bg-light border border-border-light rounded px-1.5 py-0.5 text-[9px] font-bold text-primary/50 flex items-center space-x-1"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* External Link */}
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/30 group-hover:text-accent-purple p-1 flex items-center space-x-1 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    <span>View Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12 bg-white border border-dashed border-border-light rounded-2xl max-w-xl">
              <Library className="h-10 w-10 text-primary/20 mx-auto" />
              <h3 className="font-display text-base font-bold text-primary mt-3">No resources found</h3>
              <p className="text-xs text-primary/50 max-w-xs mx-auto mt-1 font-sans">
                Try typing another keyword or selecting a different filter.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
