"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { usePlatform } from "@/context/PlatformContext";
import { TOPICS, MODULES } from "@/data/curriculum";
import { PlusCircle, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function ContributePage() {
  const { addSubmission, allTopics } = usePlatform();

  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [topicId, setTopicId] = useState("");
  const [suggestedTopicTitle, setSuggestedTopicTitle] = useState("");
  const [suggestedTopicDuration, setSuggestedTopicDuration] = useState("15 mins");

  const [resourceTitle, setResourceTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("Video");
  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");

  const [success, setSuccess] = useState(false);

  const moduleTopics = allTopics.filter((t) => t.moduleId === Number(selectedModuleId));

  useEffect(() => {
    if (moduleTopics.length > 0) {
      setTopicId(moduleTopics[0].id);
    } else {
      setTopicId("suggest-new");
    }
  }, [selectedModuleId, allTopics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle || !link || !contributorName || !contributorEmail) {
      alert("Please fill out all fields.");
      return;
    }

    if (topicId === "suggest-new" && !suggestedTopicTitle.trim()) {
      alert("Please enter a title for the suggested topic.");
      return;
    }

    addSubmission({
      topicId,
      resourceTitle,
      link,
      type,
      contributorName,
      contributorEmail,
      ...(topicId === "suggest-new"
        ? {
            suggestedTopicTitle: suggestedTopicTitle.trim(),
            suggestedTopicDuration: suggestedTopicDuration.trim() || "15 mins",
            moduleId: Number(selectedModuleId)
          }
        : {})
    });

    setSuccess(true);
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 }
    });

    // Clear form
    setResourceTitle("");
    setLink("");
    setContributorName("");
    setContributorEmail("");
    setSuggestedTopicTitle("");
    setSuggestedTopicDuration("15 mins");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-2xl">
          
          {/* Header */}
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary flex items-center space-x-2">
              <PlusCircle className="h-6 w-6 text-accent-purple animate-pulse" />
              <span>Contributor Portal</span>
            </h1>
            <p className="text-xs text-primary/50 mt-1 font-sans">
              Help us enrich the PM Foundations syllabus. Recommend a video, template, book, or article for a specific topic.
            </p>
          </div>

          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                
                {/* Contributor credentials */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-primary/60">Contributor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Marty Cagan"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-primary/60">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={contributorEmail}
                      onChange={(e) => setContributorEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/30"
                    />
                  </div>
                </div>

                {/* Select Target Module & Topic */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-primary/60">Select Target Module</label>
                    <select
                      value={selectedModuleId}
                      onChange={(e) => setSelectedModuleId(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border-light rounded-xl font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-accent-purple"
                    >
                      {MODULES.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          Module {mod.id} - {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-primary/60">Select Topic Concept</label>
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-xl font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-accent-purple"
                    >
                      {moduleTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                      <option value="suggest-new">+ Suggest a new topic under this module...</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Suggest New Topic Fields */}
                {topicId === "suggest-new" && (
                  <div className="bg-[#F8FAFC]/55 border border-border-light/75 rounded-2xl p-4 grid sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="font-bold text-primary/60">Suggested Topic Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Continuous Product Discovery"
                        value={suggestedTopicTitle}
                        onChange={(e) => setSuggestedTopicTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-primary/60">Suggested Duration (e.g. 15 mins)</label>
                      <input
                        type="text"
                        placeholder="e.g. 15 mins"
                        value={suggestedTopicDuration}
                        onChange={(e) => setSuggestedTopicDuration(e.target.value)}
                        className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Resource Info */}
                <div className="space-y-1.5">
                  <label className="font-bold text-primary/60">Recommended Resource Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Teresa Torres on Continuous Discovery Habits"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/30"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-primary/60">Resource Link / URL</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-primary/60">Format Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-xl font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-accent-purple"
                    >
                      <option value="Video">Video Tutorial</option>
                      <option value="Book">Book Recommend</option>
                      <option value="Article">Article Link</option>
                      <option value="Template">PRD / Figma Template</option>
                      <option value="Framework">Framework Outline</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="gradient-bg w-full rounded-xl py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity flex items-center justify-center space-x-1.5 cursor-pointer mt-6"
                >
                  <span>Submit Recommendation</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              /* Success Panel */
              <div className="text-center py-6 space-y-4 font-sans text-xs">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-primary">Submission Queued!</h3>
                <p className="text-primary/60 max-w-sm mx-auto font-medium">
                  Thank you! Your recommendation has been added to our validation pipeline. An admin will review it shortly.
                </p>
                <div className="pt-2 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="rounded-xl border border-border-light hover:bg-bg-light/60 px-4 py-2 font-bold text-primary transition-colors cursor-pointer"
                  >
                    Submit Another
                  </button>
                  <Link
                    href="/curriculum"
                    className="gradient-bg text-white rounded-xl px-4 py-2 font-bold shadow-sm"
                  >
                    Curriculum Home
                  </Link>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
