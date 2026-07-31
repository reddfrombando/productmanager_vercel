"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CASE_STUDIES } from "@/data/curriculum";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle,
  FileText,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen
} from "lucide-react";

export default function CaseDetailPage() {
  const params = useParams();
  const { toggleBookmark, isBookmarked } = usePlatform();

  const caseId = params.id as string;
  const item = CASE_STUDIES.find((c) => c.id === caseId);

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h1 className="text-lg font-bold">Case Study Not Found</h1>
            <Link href="/cases" className="text-sm text-accent-cyan hover:underline">
              Return to Cases
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(item.id);

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-4xl">
          
          {/* Back Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/cases"
              className="inline-flex items-center space-x-1 text-xs font-bold text-primary/55 hover:text-accent-cyan transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Case Library Directory</span>
            </Link>

            <button
              onClick={() => toggleBookmark(item.id, "case", `${item.company} - ${item.title}`)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                bookmarked
                  ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan"
                  : "bg-white border-border-light text-primary/50 hover:text-primary"
              }`}
              title="Bookmark case"
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-accent-cyan" : ""}`} />
            </button>
          </div>

          {/* Case Study Header Summary */}
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium space-y-3">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="text-accent-cyan font-black tracking-widest">{item.company}</span>
              <span className="text-primary/30">•</span>
              <span className="text-primary/45">{item.type} Case Study</span>
            </div>
            
            <h1 className="font-display text-2xl font-extrabold text-primary leading-tight">
              {item.title}
            </h1>
            
            <div className="flex flex-wrap gap-1 pt-1">
              {item.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-bg-light border border-border-light rounded px-2 py-0.5 text-[9px] font-bold text-primary/55"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Left Column: Analysis, problems */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Problem Brief */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-3 font-sans">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">The Business Problem</h3>
                <p className="text-xs text-primary/80 leading-relaxed font-medium">
                  {item.problem}
                </p>
              </div>

              {/* PM Analysis details */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-3 font-sans">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">PM Decisions & Analysis</h3>
                <p className="text-xs text-primary/75 leading-relaxed font-medium whitespace-pre-line">
                  {item.analysis}
                </p>
              </div>

              {/* Interview questions */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4 font-sans">
                <div className="flex items-center space-x-2 border-b border-border-light/60 pb-3">
                  <HelpCircle className="h-4.5 w-4.5 text-accent-cyan shrink-0" />
                  <h3 className="text-xs font-bold text-primary/85 uppercase tracking-wider">
                    FAANG Interview Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {item.interviewQuestions.map((q, idx) => {
                    const isExpanded = expandedQuestion === idx;
                    return (
                      <div key={idx} className="border border-border-light/60 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(idx)}
                          className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-primary bg-[#F8FAFC]/40 hover:bg-[#F8FAFC] transition-colors focus:outline-none cursor-pointer"
                        >
                          <span className="flex-1 pr-4">{q}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-primary/50 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-primary/50 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 border-t border-border-light/60 bg-white text-[11px] leading-relaxed text-primary/75 font-sans font-medium space-y-2">
                            <span className="font-bold text-accent-cyan block">Suggested Answering Strategy:</span>
                            <p>
                              1. **Clarify assumptions**: Restate the goal and define the target segment.
                              2. **Framework layout**: Map out the core user pain points.
                              3. **Ideate options**: Focus on three distinct features.
                              4. **Success criteria**: Detail metrics that prove user value.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Frameworks & Success Metrics */}
            <div className="space-y-6">
              
              {/* Framework card */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-3 font-sans">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="h-4 w-4 text-accent-purple" />
                  <span>Strategic Framework</span>
                </h3>
                <div className="text-xs font-bold text-primary">
                  {item.frameworkUsed}
                </div>
                <p className="text-[10px] text-primary/60 leading-relaxed font-medium">
                  This case represents a high-quality implementation of the specified framework. Review this logic when answering similar product sense prompts.
                </p>
              </div>

              {/* Metrics card */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-3 font-sans">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp className="h-4 w-4 text-accent-cyan animate-pulse" />
                  <span>Key Target Metrics</span>
                </h3>
                <ul className="space-y-2 text-xs text-primary/80 font-medium">
                  {item.metrics.map((metric, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan mt-1.5 shrink-0" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
