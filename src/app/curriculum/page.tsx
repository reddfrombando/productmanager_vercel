"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { PHASES, MODULES, TOPICS } from "@/data/curriculum";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  TrendingUp,
  Layers,
  Cpu,
  GitBranch,
  BarChart3,
  Sparkles,
  Zap,
  Briefcase,
  Users,
  GraduationCap,
  FolderHeart,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Clock,
  Gauge,
  CheckCircle,
  Play
} from "lucide-react";

// Helper map to match lucide icons dynamically
const iconMap: { [key: string]: any } = {
  Compass,
  TrendingUp,
  Layers,
  Cpu,
  GitBranch,
  BarChart3,
  Sparkles,
  Zap,
  Briefcase,
  Users,
  GraduationCap,
  FolderHeart
};

export default function CurriculumPage() {
  const { progress, getPhaseProgress, getModuleProgress } = usePlatform();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const togglePhase = (phaseId: number) => {
    setExpandedPhase((prev) => (prev === phaseId ? null : phaseId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary">
              Product Management Syllabus
            </h1>
            <p className="text-xs text-primary/50 mt-1 font-sans">
              12 phases, 22 structured learning modules, and applied portfolio projects. Expand a phase to browse topics.
            </p>
          </div>

          {/* Syllabus Accordion Grid */}
          <div className="space-y-4 max-w-4xl">
            {PHASES.map((phase) => {
              const Icon = iconMap[phase.iconName] || Compass;
              const isExpanded = phase.id === expandedPhase;
              const phaseProgress = getPhaseProgress(phase.id);
              const phaseModules = MODULES.filter((m) => m.phaseId === phase.id);

              return (
                <div
                  key={phase.id}
                  className="bg-white border border-border-light rounded-2xl shadow-premium overflow-hidden transition-all duration-300"
                >
                  {/* Phase Summary Header */}
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-bg-light/40 transition-colors cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Badge Icon */}
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border shrink-0 ${
                          phaseProgress === 100
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : isExpanded
                            ? "bg-accent-purple text-white border-accent-purple"
                            : "bg-bg-light border-border-light text-primary/65"
                        }`}
                      >
                        {phaseProgress === 100 ? <CheckCircle className="h-5.5 w-5.5" /> : <Icon className="h-5.5 w-5.5" />}
                      </span>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">
                            Phase {phase.id}
                          </span>
                          <span className="text-[10px] font-semibold text-primary/40">•</span>
                          <span className="text-[10px] font-bold text-primary/50">{phase.duration}</span>
                          <span className="text-[10px] font-semibold text-primary/40">•</span>
                          <span className="text-[10px] font-bold text-accent-purple uppercase">{phase.difficulty}</span>
                        </div>
                        <h2 className="font-display text-base font-bold text-primary truncate mt-0.5">
                          {phase.title}
                        </h2>
                      </div>
                    </div>

                    {/* Progress Bar & Toggle */}
                    <div className="flex items-center space-x-6 shrink-0 pl-4 border-l border-border-light/65">
                      <div className="hidden sm:flex flex-col items-end space-y-1">
                        <span className="text-[10px] font-bold text-primary/75">{phaseProgress}% Complete</span>
                        <div className="h-1.5 w-24 rounded-full bg-border-light/60 overflow-hidden">
                          <div
                            className="h-full bg-accent-purple rounded-full transition-all duration-500"
                            style={{ width: `${phaseProgress}%` }}
                          />
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-primary/45" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary/45" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Syllabus Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-5 border-t border-border-light bg-[#F8FAFC]/40 space-y-6">
                          {/* Description & skills list */}
                          <div className="space-y-3">
                            <p className="text-xs text-primary/70 leading-relaxed font-medium">
                              {phase.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {phase.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-white border border-border-light/80 rounded-md px-2 py-0.5 text-[9px] font-bold text-primary/60"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Modules List Grid */}
                          <div className="space-y-3">
                            <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-1">
                              Modules Included ({phaseModules.length})
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {phaseModules.map((module) => {
                                const moduleProgress = getModuleProgress(module.id);
                                const moduleTopics = TOPICS.filter((t) => t.moduleId === module.id);
                                return (
                                  <div
                                    key={module.id}
                                    className="bg-white border border-border-light/60 rounded-xl p-4 shadow-sm flex flex-col justify-between group hover:border-accent-purple/55 hover:shadow-premium transition-all duration-200"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-primary/45 uppercase tracking-wide">
                                          Module {module.id}
                                        </span>
                                        <span className="text-[9px] font-bold text-accent-purple uppercase bg-accent-purple/5 px-2 py-0.5 rounded-md">
                                          {module.difficulty}
                                        </span>
                                      </div>
                                      
                                      <h3 className="font-display text-sm font-bold text-primary">
                                        {module.title}
                                      </h3>
                                      <p className="text-[11px] text-primary/60 line-clamp-2 leading-relaxed font-sans font-medium">
                                        {module.description}
                                      </p>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="pt-4 mt-4 border-t border-border-light/60 flex items-center justify-between">
                                      {/* Mini Progress */}
                                      <div className="flex flex-col space-y-1">
                                        <span className="text-[9px] font-bold text-primary/60">
                                          {moduleProgress}% Done ({moduleTopics.filter((t) => progress.includes(t.id)).length}/{moduleTopics.length} topics)
                                        </span>
                                        <div className="h-1 w-20 rounded-full bg-border-light/50 overflow-hidden">
                                          <div
                                            className="h-full bg-accent-cyan rounded-full transition-all duration-300"
                                            style={{ width: `${moduleProgress}%` }}
                                          />
                                        </div>
                                      </div>

                                      {/* Link out */}
                                      <Link
                                        href={`/curriculum/module/${module.id}`}
                                        className="rounded-lg bg-primary-light/5 hover:bg-accent-purple hover:text-white px-3 py-1.5 text-[10px] font-bold text-primary transition-all flex items-center space-x-1"
                                      >
                                        <span>Open module</span>
                                        <ChevronRight className="h-3 w-3" />
                                      </Link>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
