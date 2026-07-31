"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import {
  GraduationCap,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Briefcase,
  HelpCircle,
  FileText
} from "lucide-react";

export default function CareerHubPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("interview");

  const categories = [
    { id: "interview", name: "Mock Interviews", icon: HelpCircle },
    { id: "resume", name: "Resume & LinkedIn", icon: FileText },
    { id: "salary", name: "Salary Guide", icon: TrendingUp },
    { id: "hiring", name: "Hiring Directory", icon: Briefcase }
  ];

  const salaries = [
    { role: "Associate PM (APM)", experience: "0-2 years", usSalary: "$90,000 - $130,000", inSalary: "₹12L - ₹20L" },
    { role: "Product Manager (PM)", experience: "2-5 years", usSalary: "$130,000 - $175,000", inSalary: "₹18L - ₹35L" },
    { role: "Senior PM (SPM)", experience: "5-8 years", usSalary: "$175,000 - $225,000", inSalary: "₹35L - ₹60L" },
    { role: "Director / Principal PM", experience: "8+ years", usSalary: "$225,000 - $350,000+", inSalary: "₹60L - ₹1.2Cr+" }
  ];

  const interviewPrompts = [
    {
      category: "Product Sense",
      question: "Design a smart workspace whiteboard for hybrid workforces.",
      framework: "CIRCLES Method: Identify hybrid user segments (creative teams, teachers), focus on screen synchronization and drawing latency, select 3 key features (AI hand sketch beautifier, audio transcription pins, cloud board sync), define success metrics."
    },
    {
      category: "Estimation Sizing",
      question: "Estimate the annual market size of tennis balls in the United States.",
      framework: "Top-down Sizing: Start with US population (340M). Estimate % of active tennis players (approx 5% = 17M). Segment by frequency (recreational, league players). Estimate annual tennis ball can purchases per player (e.g. 5 cans vs 40 cans). Multiply by price per can (~$4)."
    },
    {
      category: "Behavioral",
      question: "Tell me about a time you disagreed with an engineering lead on a roadmap item.",
      framework: "STAR Method: Situation (timeline vs tech debt clash), Task (aligning sprint scope), Action (pulled customer data and API load reports to justify priorities objectively without feelings), Result (reduced check-out latency by 12% in 2 sprints)."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-4xl">
          
          {/* Header */}
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-accent-purple" />
              <span>PM Career Hub</span>
            </h1>
            <p className="text-xs text-primary/50 mt-1 font-sans">
              Accelerate your job search. Practice mock interview frameworks, build Google-style resumes, and evaluate compensation trends.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 items-start">
            {/* Left sidebar nav selectors */}
            <div className="space-y-1 bg-white border border-border-light rounded-2xl p-3 shadow-premium">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTopic(cat.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-xs font-bold text-left cursor-pointer ${
                      selectedTopic === cat.id
                        ? "bg-accent-purple/10 text-accent-purple font-extrabold"
                        : "text-primary/75 hover:bg-bg-light/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right main panel */}
            <div className="md:col-span-3 bg-white border border-border-light rounded-2xl p-6 shadow-premium min-h-[400px]">
              
              {selectedTopic === "interview" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-base font-bold text-primary flex items-center space-x-1.5">
                      <HelpCircle className="h-4.5 w-4.5 text-accent-purple animate-pulse" />
                      <span>Mock Interview Prompts</span>
                    </h2>
                    <p className="text-[11px] text-primary/50 mt-1">
                      Practice these frequently asked interview prompts compiled from Google, Stripe, and Meta evaluations.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {interviewPrompts.map((prompt, i) => (
                      <div key={i} className="border border-border-light/60 rounded-xl p-4 space-y-2 bg-[#F8FAFC]/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-accent-purple uppercase bg-accent-purple/5 px-2 py-0.5 rounded">
                            {prompt.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-primary">{prompt.question}</h4>
                        <div className="text-[10px] leading-relaxed text-primary/70 font-sans font-medium pt-2 border-t border-border-light/60">
                          <span className="font-bold text-primary block mb-0.5">Answering Framework Outline:</span>
                          {prompt.framework}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTopic === "resume" && (
                <div className="space-y-6 font-sans">
                  <div>
                    <h2 className="font-display text-base font-bold text-primary flex items-center space-x-1.5">
                      <FileText className="h-4.5 w-4.5 text-accent-purple" />
                      <span>Google X-Y-Z Resume Builder</span>
                    </h2>
                    <p className="text-[11px] text-primary/50 mt-1">
                      Recruiters spend an average of 6 seconds reviewing resumes. Use quantitative bullet points that outline your direct impact.
                    </p>
                  </div>

                  {/* Formula banner */}
                  <div className="bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20 rounded-xl p-5 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-purple block mb-1">
                      The Quantitative Formula
                    </span>
                    <div className="font-display text-lg font-black text-primary">
                      Accomplished <span className="text-accent-purple">[X]</span>, as measured by <span className="text-accent-cyan">[Y]</span>, by doing <span className="text-accent-purple">[Z]</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-primary">Example Redesigns:</h4>
                      <div className="grid gap-3">
                        <div className="border border-border-light rounded-xl p-3 bg-red-50/20 text-red-800">
                          <span className="font-bold text-xs">Poor Bullet point:</span>
                          <p className="mt-1 font-medium">"Responsible for updating the checkout payments page."</p>
                        </div>
                        <div className="border border-border-light rounded-xl p-3 bg-emerald-50/20 text-emerald-800">
                          <span className="font-bold text-xs">Polished Google-style:</span>
                          <p className="mt-1 font-medium">"Redesigned check-out credit fields [Z], decreasing shopping cart abandonment by 14% [Y], leading to $120k incremental annual revenues [X]."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === "salary" && (
                <div className="space-y-6 font-sans">
                  <div>
                    <h2 className="font-display text-base font-bold text-primary flex items-center space-x-1.5">
                      <TrendingUp className="h-4.5 w-4.5 text-accent-purple" />
                      <span>PM Compensation Bands</span>
                    </h2>
                    <p className="text-[11px] text-primary/50 mt-1">
                      Estimated base salary ranges across regions based on tech hubs like San Francisco and Bangalore.
                    </p>
                  </div>

                  {/* Salary Table */}
                  <div className="border border-border-light rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] border-b border-border-light text-primary/60 font-bold">
                        <tr>
                          <th className="p-3">Role Tier</th>
                          <th className="p-3">Experience</th>
                          <th className="p-3">US Base</th>
                          <th className="p-3">India Base</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light font-medium text-primary/80">
                        {salaries.map((row, i) => (
                          <tr key={i} className="hover:bg-bg-light/40">
                            <td className="p-3 font-bold text-primary">{row.role}</td>
                            <td className="p-3">{row.experience}</td>
                            <td className="p-3 font-semibold text-accent-purple">{row.usSalary}</td>
                            <td className="p-3 font-semibold text-accent-cyan">{row.inSalary}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedTopic === "hiring" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-base font-bold text-primary flex items-center space-x-1.5">
                      <Briefcase className="h-4.5 w-4.5 text-accent-purple" />
                      <span>Hiring Companies</span>
                    </h2>
                    <p className="text-[11px] text-primary/50 mt-1">
                      Target firms that actively recruit and value structured, portfolio-driven PM backgrounds.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {["Stripe", "Google", "Microsoft", "OpenAI", "Airbnb", "Uber"].map((company) => (
                      <div
                        key={company}
                        className="border border-border-light rounded-xl p-4 flex items-center justify-between hover:border-accent-purple transition-all group"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-primary">{company}</h4>
                          <span className="text-[9px] text-primary/45 font-semibold">Active PM hires</span>
                        </div>
                        <a
                          href="https://careers.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary/30 group-hover:text-accent-purple p-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
