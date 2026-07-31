"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { PORTFOLIO_PROJECTS } from "@/data/curriculum";
import { Compass, FolderHeart, ShieldCheck, ChevronRight, LayoutGrid, CheckCircle } from "lucide-react";

export default function ProjectsPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Capstone"];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((proj) =>
    filterDifficulty === "All" ? true : proj.difficulty === filterDifficulty
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-primary flex items-center space-x-2">
                <FolderHeart className="h-6 w-6 text-accent-purple" />
                <span>Applied PM Portfolio Projects</span>
              </h1>
              <p className="text-xs text-primary/50 mt-1 font-sans">
                Build 12 progressive, industry-grade projects mimicking real PM responsibilities at Google, Netflix, and OpenAI.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex bg-white border border-border-light rounded-xl p-1 text-xs font-semibold text-primary/60 shadow-sm self-start">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterDifficulty === diff
                      ? "bg-accent-purple text-white font-bold"
                      : "hover:text-primary"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex flex-col justify-between hover:border-accent-purple/55 hover:shadow-premium-hover transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-accent-cyan uppercase bg-accent-cyan/5 px-2.5 py-0.5 rounded-md border border-accent-cyan/10">
                      {proj.domain}
                    </span>
                    <span className="text-[9px] font-bold text-accent-purple uppercase bg-accent-purple/5 px-2.5 py-0.5 rounded-md border border-accent-purple/10">
                      {proj.difficulty}
                    </span>
                  </div>

                  {/* Title & Context */}
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-primary group-hover:text-accent-purple transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] text-primary/50 font-medium">Estimated Duration: {proj.duration}</p>
                  </div>

                  {/* Skills Tag Cloud */}
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] font-bold text-primary/45 uppercase tracking-wide">Key Focus Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {proj.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-bg-light border border-border-light rounded px-2 py-0.5 text-[9px] font-bold text-primary/65"
                        >
                          {skill}
                        </span>
                      ))}
                      {proj.skills.length > 3 && (
                        <span className="bg-bg-light border border-dashed border-border-light rounded px-1.5 py-0.5 text-[9px] font-bold text-primary/45">
                          +{proj.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-1.5 pt-3 border-t border-border-light/70">
                    <h4 className="text-[9px] font-bold text-primary/45 uppercase tracking-wide">Deliverables Required</h4>
                    <div className="space-y-1 text-[10px] text-primary/75 font-sans font-medium">
                      {proj.deliverables.slice(0, 2).map((deliv, index) => (
                        <div key={index} className="flex items-center space-x-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-accent-purple shrink-0" />
                          <span className="truncate">{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Action button */}
                <div className="pt-5 mt-5 border-t border-border-light/65">
                  <Link
                    href={`/projects/${proj.id}`}
                    className="w-full rounded-xl bg-primary-light/5 hover:bg-accent-purple hover:text-white px-4 py-2.5 text-xs font-bold text-primary transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm group-hover:bg-accent-purple/5"
                  >
                    <span>Inspect Requirements</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 bg-white border border-dashed border-border-light rounded-2xl max-w-xl">
              <Compass className="h-10 w-10 text-primary/20 mx-auto" />
              <h3 className="font-display text-base font-bold text-primary mt-3">No projects matching criteria</h3>
              <p className="text-xs text-primary/50 max-w-xs mx-auto mt-1 font-sans">
                Adjust your filters to see Beginner, Intermediate, or Advanced projects.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
