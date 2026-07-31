"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ProgressRing } from "@/components/ProgressRing";
import { TOPICS, MODULES } from "@/data/curriculum";
import {
  Play,
  Calendar,
  BookOpen,
  FolderHeart,
  FileText,
  Bookmark,
  ChevronRight,
  Flame,
  Clock,
  CheckCircle,
  FileEdit,
  ArrowRight
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    progress,
    notes,
    bookmarks,
    streak,
    getOverallProgress
  } = usePlatform();

  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: "Watch 1 video tutorial", completed: false },
    { id: 2, text: "Write 1 practice exercise", completed: false },
    { id: 3, text: "Review portfolio project details", completed: false }
  ]);

  // Protect route
  useEffect(() => {
    const storedUser = localStorage.getItem("pm_user");
    if (!storedUser) {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  const overallProgress = getOverallProgress();

  // Find the next incomplete topic to "Continue Learning"
  const nextTopic = TOPICS.find((t) => !progress.includes(t.id)) || TOPICS[0];
  const nextModule = MODULES.find((m) => m.id === nextTopic?.moduleId) || MODULES[0];

  const toggleGoal = (id: number) => {
    setDailyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  // Convert notes dictionary to array for listing
  const savedNotesList = Object.keys(notes)
    .map((topicId) => {
      const topic = TOPICS.find((t) => t.id === topicId);
      return {
        topicId,
        title: topic?.title || "Unknown Topic",
        content: notes[topicId]
      };
    })
    .slice(0, 3); // show top 3

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
                <span>Welcome back, {user.name}</span>
                <span className="animate-pulse">✨</span>
              </h1>
              <p className="text-xs text-primary/50 mt-1 font-sans">
                Track your study milestones and advance your Product Management skill sets.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-primary/60 bg-white border border-border-light rounded-xl px-3 py-2 shadow-sm shrink-0">
              <Calendar className="h-4 w-4 text-accent-purple" />
              <span>Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Overall Progress Ring Card */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-primary/40 uppercase tracking-wider">Overall Progress</h3>
                <div className="text-xl font-extrabold text-primary">{progress.length} / {TOPICS.length}</div>
                <div className="text-[10px] text-primary/50 font-medium">Completed Topics</div>
              </div>
              <ProgressRing radius={40} stroke={4} progress={overallProgress} />
            </div>

            {/* Streak Card */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-primary/40 uppercase tracking-wider">Study Streak</h3>
                <div className="text-xl font-extrabold text-orange-600 flex items-center space-x-1">
                  <Flame className="h-5 w-5 fill-orange-500 stroke-orange-600" />
                  <span>{streak} {streak === 1 ? "Day" : "Days"}</span>
                </div>
                <div className="text-[10px] text-primary/50 font-medium">Keep completing topics</div>
              </div>
            </div>

            {/* Time Studied Card */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-primary/40 uppercase tracking-wider">Hours Studied</h3>
                <div className="text-xl font-extrabold text-primary flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-accent-purple" />
                  <span>{Math.round(progress.length * 0.4 * 10) / 10} h</span>
                </div>
                <div className="text-[10px] text-primary/50 font-medium">Est. active learning time</div>
              </div>
            </div>

            {/* Projects Completed Card */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-primary/40 uppercase tracking-wider">Completed Portfolios</h3>
                <div className="text-xl font-extrabold text-primary flex items-center space-x-1">
                  <CheckCircle className="h-5 w-5 text-accent-cyan" />
                  <span>{progress.includes("t-23-1") ? "1" : "0"} / 12</span>
                </div>
                <div className="text-[10px] text-primary/50 font-medium">Applied PM Projects</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Continue Learning Widget */}
            <div className="lg:col-span-2 space-y-4">
              {nextTopic ? (
                <div className="bg-gradient-to-r from-primary to-primary-light border border-primary-light rounded-2xl p-6 md:p-8 text-white shadow-premium flex flex-col justify-between min-h-[220px]">
                  <div>
                    <span className="bg-accent-purple/20 text-accent-purple border border-accent-purple/25 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Continue Learning
                    </span>
                    <h2 className="font-display text-xl md:text-2xl font-bold mt-4">
                      {nextTopic.title}
                    </h2>
                    <p className="text-xs text-white/60 mt-1 font-sans">
                      Module {nextModule.id}: {nextModule.title}
                    </p>
                  </div>
                  <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 border-t border-white/10">
                    <span className="text-xs text-white/50">Estimated Duration: {nextTopic.duration}</span>
                    <Link
                      href={`/curriculum/topic/${nextTopic.id}`}
                      className="gradient-bg rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 self-start cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-white stroke-none" />
                      <span>Resume Lecture</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-border-light rounded-2xl p-6 text-center shadow-premium space-y-4">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                  <h3 className="font-display text-lg font-bold text-primary">Curriculum Complete!</h3>
                  <p className="text-xs text-primary/60 max-w-sm mx-auto">
                    Excellent job! You have checked off all topics. Check your Portfolios or start reviewing notes.
                  </p>
                </div>
              )}

              {/* GitHub Mock Heatmap Calendar */}
              <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium space-y-3">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Activity Log</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-1.5 justify-between">
                    <span className="text-[10px] font-bold text-primary/45">Jan - Jul Learning History</span>
                    <span className="text-[10px] font-semibold text-accent-purple">🔥 Streak Target Active</span>
                  </div>
                  {/* Grid */}
                  <div className="grid grid-cols-24 gap-1 overflow-x-auto py-1">
                    {Array.from({ length: 96 }).map((_, i) => {
                      // Mock heat values
                      let color = "bg-border-light/40";
                      if (i === 12 || i === 30 || i === 42 || i === 50 || i === 70 || i === 90) color = "bg-accent-purple/20";
                      if (i === 15 || i === 31 || i === 51 || i === 85) color = "bg-accent-purple/55";
                      if (i === 88 || i === 89 || i === 91 || i === 92 || i === 95) color = "bg-accent-purple";
                      return (
                        <div
                          key={i}
                          className={`h-3 w-3 rounded-sm ${color} transition-colors hover:ring-1 hover:ring-accent-purple/50`}
                          title={`Day ${i + 1}: Activity logged`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center space-x-4 justify-end text-[10px] text-primary/45 font-semibold pt-1">
                    <span>Less</span>
                    <div className="flex space-x-1">
                      <div className="h-2.5 w-2.5 rounded-sm bg-border-light/40" />
                      <div className="h-2.5 w-2.5 rounded-sm bg-accent-purple/20" />
                      <div className="h-2.5 w-2.5 rounded-sm bg-accent-purple/55" />
                      <div className="h-2.5 w-2.5 rounded-sm bg-accent-purple" />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-6">
              {/* Daily Goals Checklists */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Today's Goals</h3>
                <div className="space-y-2.5">
                  {dailyGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className="w-full flex items-start space-x-3 text-left group cursor-pointer focus:outline-none"
                    >
                      <span className={`h-4.5 w-4.5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                        goal.completed
                          ? "bg-accent-purple border-accent-purple text-white"
                          : "border-border-light group-hover:border-primary/40 bg-bg-light"
                      }`}>
                        {goal.completed && <span className="text-[10px]">✓</span>}
                      </span>
                      <span className={`text-xs font-medium transition-all ${
                        goal.completed ? "text-primary/40 line-through" : "text-primary/75"
                      }`}>
                        {goal.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmarks */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Bookmarks ({bookmarks.length})</h3>
                {bookmarks.length > 0 ? (
                  <div className="space-y-2">
                    {bookmarks.slice(0, 4).map((bookmark, i) => (
                      <Link
                        key={i}
                        href={
                          bookmark.type === "topic"
                            ? `/curriculum/topic/${bookmark.id}`
                            : bookmark.type === "project"
                            ? `/projects/${bookmark.id}`
                            : `/cases/${bookmark.id}`
                        }
                        className="flex items-center space-x-2.5 p-2 rounded-xl border border-border-light/60 hover:border-accent-purple bg-bg-light/20 transition-all group"
                      >
                        {bookmark.type === "topic" && <BookOpen className="h-3.5 w-3.5 text-accent-purple group-hover:scale-110 transition-transform shrink-0" />}
                        {bookmark.type === "project" && <FolderHeart className="h-3.5 w-3.5 text-accent-purple group-hover:scale-110 transition-transform shrink-0" />}
                        {bookmark.type === "case" && <FileText className="h-3.5 w-3.5 text-accent-cyan group-hover:scale-110 transition-transform shrink-0" />}
                        <span className="text-xs font-medium text-primary/85 truncate flex-1 leading-none">{bookmark.title}</span>
                        <ChevronRight className="h-3 w-3 text-primary/30 group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-1.5 border border-dashed border-border-light rounded-xl">
                    <Bookmark className="h-5 w-5 text-primary/20 mx-auto" />
                    <div className="text-[10px] font-bold text-primary/40">No bookmarks saved yet</div>
                  </div>
                )}
              </div>

              {/* Recent Notes */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Recent Notes ({savedNotesList.length})</h3>
                {savedNotesList.length > 0 ? (
                  <div className="space-y-2.5">
                    {savedNotesList.map((note) => (
                      <div key={note.topicId} className="space-y-1">
                        <Link
                          href={`/curriculum/topic/${note.topicId}`}
                          className="flex items-center text-xs font-bold text-primary hover:text-accent-purple transition-colors group"
                        >
                          <FileEdit className="h-3.5 w-3.5 text-accent-purple mr-1.5 group-hover:scale-110 transition-transform" />
                          <span className="truncate flex-1">{note.title}</span>
                          <ArrowRight className="h-3 w-3 text-primary/30 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-1" />
                        </Link>
                        <p className="text-[10px] text-primary/50 line-clamp-2 pl-5 italic font-medium">
                          {note.content.replace(/#.*\n/g, "").slice(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-1.5 border border-dashed border-border-light rounded-xl">
                    <FileEdit className="h-5 w-5 text-primary/20 mx-auto" />
                    <div className="text-[10px] font-bold text-primary/40">Notepad is empty</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
