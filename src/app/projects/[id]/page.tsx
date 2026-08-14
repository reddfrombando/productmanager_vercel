"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { PORTFOLIO_PROJECTS } from "@/data/curriculum";
import {
  ArrowLeft,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  Bookmark,
  CheckCircle,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toggleBookmark, isBookmarked } = usePlatform();

  const projectId = (Array.isArray(params?.id) ? params.id[0] : params?.id) || "";
  const project = PORTFOLIO_PROJECTS.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = useState<"overview" | "context" | "requirements" | "evaluation">("overview");
  const [projectStatus, setProjectStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");
  const [sampleOutputExpanded, setSampleOutputExpanded] = useState(false);

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h1 className="text-lg font-bold">Project Not Found</h1>
            <Link href="/projects" className="text-sm text-accent-purple hover:underline">
              Return to Portfolios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(project.id);

  const tabs = [
    { id: "overview", name: "Project Brief" },
    { id: "context", name: "Business Context" },
    { id: "requirements", name: "Requirements Guide" },
    { id: "evaluation", name: "Rubric & Sample" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-5xl">
          
          {/* Back Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center space-x-1 text-xs font-bold text-primary/55 hover:text-accent-purple transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Portfolio Projects Directory</span>
            </Link>

            <div className="flex items-center space-x-3">
              {/* Bookmark Toggle */}
              <button
                onClick={() => toggleBookmark(project.id, "project", project.title)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  bookmarked
                    ? "bg-accent-purple/10 border-accent-purple text-accent-purple"
                    : "bg-white border-border-light text-primary/50 hover:text-primary"
                }`}
                title="Bookmark project"
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-accent-purple" : ""}`} />
              </button>

              {/* Status Update */}
              <button
                onClick={() => {
                  if (projectStatus === "not_started") setProjectStatus("in_progress");
                  else if (projectStatus === "in_progress") setProjectStatus("completed");
                  else setProjectStatus("not_started");
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  projectStatus === "completed"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : projectStatus === "in_progress"
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-border-light text-primary/80 hover:border-primary"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>
                  {projectStatus === "completed"
                    ? "Submitted"
                    : projectStatus === "in_progress"
                    ? "In Progress"
                    : "Start Project"}
                </span>
              </button>
            </div>
          </div>

          {/* Project Summary Banner */}
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium grid md:grid-cols-4 gap-6 items-start">
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="text-accent-cyan">{project.domain}</span>
                <span className="text-primary/30">•</span>
                <span className="text-accent-purple">{project.difficulty} Level</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-primary">
                {project.title}
              </h1>
              <p className="text-xs text-primary/65 leading-relaxed font-sans font-medium">
                {project.problemStatement}
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="bg-bg-light border border-border-light/60 rounded-xl p-4 space-y-2 text-[11px] font-semibold text-primary/80">
              <div className="flex items-center justify-between">
                <span className="text-primary/50">Duration:</span>
                <span>{project.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary/50">Stack:</span>
                <span className="truncate max-w-[100px] text-right" title={project.technologies.join(", ")}>
                  {project.technologies[0]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary/50">Deliverables:</span>
                <span>{project.deliverables.length} files</span>
              </div>
            </div>
          </div>

          {/* Tab Menu */}
          <div className="border-b border-border-light flex space-x-6 text-sm font-semibold text-primary/65">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-accent-purple text-accent-purple font-bold"
                    : "border-transparent hover:text-primary"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab content wrapper */}
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium min-h-[350px]">
            {activeTab === "overview" && (
              <div className="space-y-6 font-sans">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-primary">Project Goal & Summary</h3>
                  <p className="text-xs text-primary/75 leading-relaxed font-medium">
                    {project.businessContext}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-light/60">
                  <h3 className="text-sm font-bold text-primary">Key Deliverables Required</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.deliverables.map((deliv, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-xl border border-border-light bg-[#F8FAFC]/30 text-xs font-semibold text-primary/80"
                      >
                        <FileText className="h-4.5 w-4.5 text-accent-purple shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-light/60">
                  <h3 className="text-sm font-bold text-primary">Technologies Involved</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-accent-purple/5 border border-accent-purple/10 text-accent-purple rounded-md px-2.5 py-1 text-[10px] font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "context" && (
              <div className="space-y-6 font-sans">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-primary">Business Domain Context</h3>
                  <p className="text-xs text-primary/75 leading-relaxed font-medium">
                    {project.businessContext}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-light/60">
                  <h3 className="text-sm font-bold text-primary">Competitor Gaps & Opportunities</h3>
                  <p className="text-xs text-primary/70 leading-relaxed font-medium">
                    In this project, your goal is to analyze user feedback loop trends. Look at how competitors structure this layout (e.g. user surveys vs implicit clicks) and design a solution that requires less than 3 seconds of active user configuration.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="space-y-6 font-sans">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-primary">Core Technical & UX Requirements</h3>
                  <ul className="space-y-3 text-xs text-primary/80 font-medium leading-relaxed">
                    {project.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3 bg-bg-light/60 border border-border-light/50 p-3 rounded-xl">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple/10 text-[10px] font-bold text-accent-purple shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "evaluation" && (
              <div className="space-y-6 font-sans">
                {/* Rubric */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-primary">Evaluation Rubric</h3>
                  <div className="space-y-2">
                    {project.evaluationCriteria.map((crit, index) => (
                      <div key={index} className="flex items-start space-x-2.5 text-xs text-primary/80 font-medium">
                        <CheckCircle className="h-4.5 w-4.5 text-accent-purple shrink-0 mt-0.5" />
                        <span className="leading-normal">{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible Sample Output */}
                <div className="space-y-3 pt-4 border-t border-border-light/60">
                  <button
                    onClick={() => setSampleOutputExpanded(!sampleOutputExpanded)}
                    className="w-full flex items-center justify-between text-left font-display text-sm font-bold text-primary focus:outline-none cursor-pointer"
                  >
                    <span>Inspect Sample Output Outline</span>
                    {sampleOutputExpanded ? (
                      <ChevronUp className="h-4 w-4 text-primary/50" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-primary/50" />
                    )}
                  </button>

                  {sampleOutputExpanded && (
                    <div className="bg-bg-light border border-border-light rounded-xl p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-primary/75 bg-[#F8FAFC]">
                      <pre className="whitespace-pre-wrap font-sans">{project.sampleOutput}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
