"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { PHASES } from "@/data/curriculum";
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
  ChevronRight,
  PlusCircle,
  HelpCircle,
  Shield
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

export default function LandingPage() {
  const router = useRouter();
  const { login } = usePlatform();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(PHASES[0].id);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  const activePhaseData = PHASES.find((p) => p.id === selectedPhase) || PHASES[0];

  const statistics = [
    { value: "12", label: "Learning Phases" },
    { value: "22", label: "Modules" },
    { value: "180+", label: "Topics" },
    { value: "12", label: "Portfolio Projects" },
    { value: "40+", label: "Case Studies" }
  ];

  const features = [
    { title: "Structured Curriculum", desc: "A comprehensive, phase-by-phase roadmap compiled from leading business schools and PM bootcamps.", icon: Compass },
    { title: "Progress Tracking", desc: "Keep track of completed topics and study streaks with dynamic dashboards and heatmaps.", icon: BarChart3 },
    { title: "AI PM Flagship Track", desc: "Deep dive into RAG, AI Agents, Prompt Engineering, and AI UX patterns to build modern AI software.", icon: Sparkles },
    { title: "Portfolio Projects", desc: "Build 12 production-grade artifacts like PRDs and Figma wireframes to show recruiters in interviews.", icon: FolderHeart },
    { title: "Classic Case Studies", desc: "Analyze the business strategy, metrics, and frameworks behind top firms like Netflix, Stripe, and Uber.", icon: Layers },
    { title: "Career Preparation", desc: "Master product sense, sizing estimation, and behavioral questions using industry frameworks.", icon: GraduationCap }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        {/* Soft grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

        <div className="mx-auto max-w-5xl text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rounded-full border border-accent-purple/20 bg-accent-purple/5 px-4 py-1.5 text-xs font-semibold text-accent-purple"
          >
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>The Premium PM Academy — 100% Free</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-6xl mt-6 max-w-4xl mx-auto leading-[1.1]"
          >
            Become a Premium <span className="gradient-text">Product Manager</span> in the AI Era — Structured & Portfolio-Driven
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-primary/70 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Skip the $5,000 bootcamps. Access a comprehensive, self-paced Product Manager curriculum matching top executive programs. Pair curated video tutorials with applied exercises and portfolio projects to launch your career.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login?tab=signup"
              className="gradient-bg w-full sm:w-auto rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Start Learning Now</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="#curriculum-roadmap"
              className="w-full sm:w-auto rounded-xl border border-border-light bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-bg-light/80 hover:text-accent-purple transition-all duration-300 flex items-center justify-center"
            >
              Explore Curriculum
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-4xl rounded-2xl border border-border-light bg-white p-6 shadow-premium mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            {statistics.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl font-extrabold text-primary md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Clickable Interactive Roadmap Section */}
      <section id="curriculum-roadmap" className="border-t border-border-light/85 bg-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
              Interactive Product Manager Curriculum Roadmap
            </h2>
            <p className="mt-4 text-base text-primary/60 font-sans">
              Click on any learning phase in the path below to preview the core modules, target skills, and target project outcomes.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Roadmap Steps */}
            <div className="lg:col-span-5 space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {PHASES.map((phase) => {
                const Icon = iconMap[phase.iconName] || Compass;
                const isSelected = phase.id === selectedPhase;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-300 border cursor-pointer ${
                      isSelected
                        ? "bg-accent-purple/5 border-accent-purple text-primary shadow-sm"
                        : "bg-[#F8FAFC]/50 border-border-light text-primary/80 hover:bg-[#F8FAFC] hover:border-primary/20"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        isSelected
                          ? "bg-accent-purple text-white border-accent-purple"
                          : "bg-white border-border-light text-primary/65"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-primary/45 uppercase tracking-wider">
                        Phase {phase.id}
                      </div>
                      <div className="font-semibold text-sm truncate">{phase.title}</div>
                    </div>
                    {isSelected && (
                      <motion.div layoutId="active-indicator" className="h-2 w-2 rounded-full bg-accent-purple" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed Phase Preview Pane */}
            <div className="lg:col-span-7 bg-[#F8FAFC] border border-border-light rounded-2xl p-6 md:p-8 min-h-[480px] flex flex-col justify-between shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPhase || "none"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="inline-flex items-center space-x-2 text-xs font-bold text-accent-purple uppercase tracking-widest bg-accent-purple/10 px-3 py-1 rounded-full">
                      Phase {activePhaseData.id} Description
                    </div>
                    <h3 className="font-display text-2xl font-bold text-primary mt-3">
                      {activePhaseData.title}
                    </h3>
                    <p className="text-sm text-primary/70 mt-2 font-sans leading-relaxed">
                      {activePhaseData.description}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-border-light/70 p-4">
                      <h4 className="text-xs font-bold text-primary/50 uppercase tracking-wide">Key Metrics</h4>
                      <div className="mt-2 space-y-1.5 text-xs text-primary/80">
                        <div className="flex justify-between">
                          <span className="font-semibold">Duration:</span>
                          <span>{activePhaseData.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Difficulty:</span>
                          <span className="font-bold text-accent-purple">{activePhaseData.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Syllabus Modules:</span>
                          <span>{activePhaseData.modulesCount} modules</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border-light/70 p-4">
                      <h4 className="text-xs font-bold text-primary/50 uppercase tracking-wide">Skills Target</h4>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activePhaseData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-bg-light border border-border-light rounded-md px-2 py-0.5 text-[10px] font-semibold text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {activePhaseData.id === 12 ? (
                    <div className="bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-primary/70 uppercase tracking-wide flex items-center space-x-1">
                        <FolderHeart className="h-4 w-4 text-accent-purple" />
                        <span>Featured Project Outcomes</span>
                      </h4>
                      <p className="text-xs text-primary/75 mt-1.5 leading-relaxed font-sans">
                        Build portfolio deliverables for Spotify, Netflix, Swiggy, Uber, OpenAI, and a final startup Capstone project with full PRD + Figma prototypes.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-border-light/70 p-4">
                      <h4 className="text-xs font-bold text-primary/50 uppercase tracking-wide">Suggested Project Aligned</h4>
                      <p className="text-xs text-primary/75 mt-1.5 leading-relaxed font-sans">
                        Completing this phase unlocks components of your portfolio projects, allowing you to build real documentation and wireframes incrementally.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="pt-6 border-t border-border-light/60 mt-6 flex items-center justify-between">
                <span className="text-xs text-primary/45">Complete Phase to unlock next badge</span>
                <Link
                  href="/curriculum"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/95 transition-colors flex items-center space-x-1"
                >
                  <span>Explore Phase Syllabus</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grids Section */}
      <section className="bg-bg-light py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
              SaaS Features Built For The Modern Product Manager
            </h2>
            <p className="mt-4 text-base text-primary/60 font-sans">
              Experience learning designed with the aesthetic polish and micro-interactions of Linear and Vercel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, boxShadow: "var(--shadow-premium-hover)" }}
                  className="bg-white border border-border-light rounded-2xl p-6 shadow-premium transition-all duration-300"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light/5 text-accent-purple border border-accent-purple/10">
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-primary mt-4">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-primary/65 mt-2 leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contributor Callout Banner */}
      <section className="bg-primary text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_bottom_right,var(--color-accent-cyan),transparent_50%),radial-gradient(circle_at_top_left,var(--color-accent-purple),transparent_50%)]" />
        <div className="mx-auto max-w-4xl text-center relative z-10 space-y-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Are you a practicing Product Manager?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm font-sans leading-relaxed">
            Help us enrich our database! Contribute video tutorials, book recommendations, case studies, or templates. Submissions are reviewed by admins before publishing.
          </p>
          <div className="pt-2">
            <Link
              href="/contribute"
              className="rounded-xl bg-white text-primary px-6 py-3 text-sm font-bold shadow-md hover:bg-bg-light transition-colors inline-flex items-center space-x-2"
            >
              <PlusCircle className="h-4.5 w-4.5 text-accent-purple" />
              <span>Contribute Resource</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border-light/80 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="font-display font-bold text-primary">
              PM Foundations
            </div>
            <div className="text-xs text-primary/50 font-sans">
              © 2026 PM Foundations. Structured, open curriculum for digital creators.
            </div>
          </div>
          <div className="flex flex-wrap gap-4 md:space-x-6 text-xs font-semibold text-primary/65 items-center justify-center">
            <Link href="/curriculum" className="hover:text-accent-purple">Syllabus</Link>
            <Link href="/projects" className="hover:text-accent-purple">Projects</Link>
            <Link href="/cases" className="hover:text-accent-purple">Cases</Link>
            <Link href="/resources" className="hover:text-accent-purple">Resources</Link>
            <Link href="/contribute" className="hover:text-accent-purple">Contributor portal</Link>
            <button
              onClick={() => setShowAdminModal(true)}
              className="hover:text-accent-purple cursor-pointer text-primary/80 font-bold bg-primary-light/5 border border-border-light rounded px-2.5 py-1 transition-all"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal Overlay */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4 font-sans text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white border border-border-light rounded-2xl p-6 shadow-premium space-y-4"
          >
            {/* Title */}
            <div className="flex items-center justify-between border-b border-border-light/60 pb-3">
              <h3 className="text-sm font-bold text-primary flex items-center space-x-1.5">
                <Shield className="h-4.5 w-4.5 text-accent-cyan animate-pulse" />
                <span>Admin Portal Login</span>
              </h3>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminError("");
                }}
                className="text-primary/40 hover:text-primary cursor-pointer text-base font-bold"
              >
                &times;
              </button>
            </div>

            {/* Fields Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAdminError("");
                if (adminUser === "ADMIN_REDD" && adminPass === "ADMIN_PASSWORD") {
                  login("Redd Admin", "admin@pmfoundations.com", "admin");
                  setShowAdminModal(false);
                  router.push("/admin");
                } else {
                  setAdminError("Invalid administrator username or password.");
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="font-bold text-primary/60">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/30 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary/60">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/30 text-xs"
                />
              </div>

              {adminError && (
                <div className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg">
                  {adminError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full gradient-bg hover:opacity-95 text-white py-2.5 rounded-xl font-bold shadow-md transition-all cursor-pointer"
                >
                  Authenticate
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
