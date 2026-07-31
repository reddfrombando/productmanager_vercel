"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { TOPICS, MODULES } from "@/data/curriculum";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  Save,
  MessageSquare,
  HelpCircle,
  Play
} from "lucide-react";
import confetti from "canvas-confetti";

function getYoutubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.length === 11) return urlOrId;
  try {
    const url = new URL(urlOrId);
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx !== -1 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    }
  } catch (e) {
    const match = urlOrId.match(/(?:v=|\/embed\/|\/shorts\/|\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  return urlOrId;
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const {
    progress,
    notes,
    saveNote,
    toggleTopicCompletion,
    toggleBookmark,
    isBookmarked,
    allTopics,
    topicVideos
  } = usePlatform();

  const topicId = params.id as string;
  const topic = allTopics.find((t) => t.id === topicId);

  const videosList = topic ? topicVideos[topic.id] || [] : [];
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const activeVideoUrl = videosList[activeVideoIndex] || "";
  const activeYoutubeId = getYoutubeId(activeVideoUrl);
  const isOverridden = activeVideoUrl && activeVideoUrl !== topic?.youtubeId;

  const [noteText, setNoteText] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [discussionComment, setDiscussionComment] = useState("");
  const [comments, setComments] = useState([
    { author: "Sarah Jenkins", role: "Product Lead @ Stripe", text: "Marty Cagan's chapters on value creation are essential. Pay extra attention to the user-testing frameworks here.", time: "1 hour ago" },
    { author: "Michael Chen", role: "Ex-Google PM", text: "Remember that the PM isn't the decision maker, you are the coordinator who synthesizes data to influence teams.", time: "3 hours ago" }
  ]);

  useEffect(() => {
    if (topic && notes[topic.id]) {
      setNoteText(notes[topic.id]);
    } else if (topic) {
      setNoteText(topic.notesTemplate);
    }
  }, [topic, notes]);

  if (!topic) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-3">
            <h1 className="text-lg font-bold">Topic Not Found</h1>
            <Link href="/curriculum" className="text-sm text-accent-purple hover:underline">
              Return to Curriculum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const module = MODULES.find((m) => m.id === topic.moduleId) || MODULES[0];
  const isCompleted = progress.includes(topic.id);
  const bookmarked = isBookmarked(topic.id);

  // Pagination navigation helpers
  const currentTopicIndex = allTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentTopicIndex > 0 ? allTopics[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex < allTopics.length - 1 ? allTopics[currentTopicIndex + 1] : null;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);
    setSaveStatus("Saving...");
    // Auto-saves to Context state
    saveNote(topic.id, text);
    
    // Simulate auto-save status bounce
    const timeout = setTimeout(() => {
      setSaveStatus("Saved");
    }, 800);
    return () => clearTimeout(timeout);
  };

  const handleToggleCompletion = () => {
    toggleTopicCompletion(topic.id);
    if (!isCompleted) {
      // Trigger a confetti burst on completion!
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionComment.trim()) return;
    setComments((prev) => [
      {
        author: "You (Learner)",
        role: "Aspiring PM",
        text: discussionComment,
        time: "Just now"
      },
      ...prev
    ]);
    setDiscussionComment("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-hidden h-[calc(100vh-73px)] flex flex-col md:flex-row">
          
          {/* Left Pane: YouTube video, Description, related topics, discussions */}
          <div className="flex-1 p-6 overflow-y-auto max-h-full space-y-6">
            
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/curriculum/module/${module.id}`}
                className="inline-flex items-center space-x-1 text-xs font-bold text-primary/55 hover:text-accent-purple transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Module {module.id} Dashboard</span>
              </Link>
              
              <div className="flex items-center space-x-2">
                {/* Bookmark Toggle */}
                <button
                  onClick={() => toggleBookmark(topic.id, "topic", topic.title)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                    bookmarked
                      ? "bg-accent-purple/10 border-accent-purple text-accent-purple"
                      : "bg-white border-border-light text-primary/50 hover:text-primary"
                  }`}
                  title="Bookmark topic"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-accent-purple" : ""}`} />
                </button>

                {/* Completion Toggle */}
                <button
                  onClick={handleToggleCompletion}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                      : "bg-white border-border-light text-primary/80 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
                </button>
              </div>
            </div>

            {/* Video Player Box */}
            <div className="space-y-3">
              {videosList.length === 0 ? (
                <div className="relative aspect-video w-full rounded-2xl bg-[#0A192F] overflow-hidden shadow-premium border border-border-light flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
                  <Play className="h-10 w-10 text-accent-purple animate-pulse" />
                  <h4 className="font-display font-bold text-sm text-white">No Active Video Tutorial</h4>
                  <p className="text-white/60 text-[11px] max-w-xs leading-relaxed font-sans font-medium">
                    This video has been marked as outdated or removed by curators. You can submit a fresh learning resource in our Contributor Portal!
                  </p>
                  <Link
                    href="/contribute"
                    className="rounded-xl bg-accent-purple px-4 py-2 text-xs font-bold text-white transition-all shadow-sm hover:opacity-90"
                  >
                    Recommend A Video
                  </Link>
                </div>
              ) : (
                <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-premium border border-border-light">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=0&rel=0`}
                    title={topic?.title || "Video lecture"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-primary/50 font-semibold px-1">
                <h1 className="font-display font-bold text-primary text-base leading-snug flex flex-wrap items-center gap-2">
                  <span>{topic?.title}</span>
                  {isOverridden && (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full px-2 py-0.5 text-[9px] font-bold inline-flex items-center">
                      <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
                      User Contributed Video (Approved by Admin)
                    </span>
                  )}
                </h1>
                <span className="flex items-center shrink-0">
                  <Clock className="h-3.5 w-3.5 mr-1" /> {topic?.duration} lecture
                </span>
              </div>

              {/* Playlist selectors */}
              {videosList.length > 1 && (
                <div className="bg-white border border-border-light rounded-2xl p-4 shadow-premium space-y-2.5">
                  <div className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">
                    Available Video Streams ({videosList.length} Lectures)
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    {videosList.map((video, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVideoIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          activeVideoIndex === idx
                            ? "bg-accent-purple border-accent-purple text-white shadow-sm font-extrabold"
                            : "bg-[#F8FAFC]/50 border-border-light text-primary/75 hover:bg-[#F8FAFC]"
                        }`}
                      >
                        Lecture Stream {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Practice Exercise */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-3">
              <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-accent-purple" />
                <span>Practice Exercise & Prompt</span>
              </h3>
              <p className="text-xs text-primary/75 leading-relaxed font-sans font-medium">
                {topic.exercise}
              </p>
              <div className="text-[10px] text-primary/40 font-semibold italic bg-bg-light p-2.5 rounded-lg border border-border-light/50">
                Tip: Write down your solution draft in the notepad panel on the right. Your notes persist locally!
              </div>
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center pt-4 border-t border-border-light">
              {prevTopic ? (
                <Link
                  href={`/curriculum/topic/${prevTopic.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-accent-purple transition-all"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                  <span>{prevTopic.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {nextTopic ? (
                <Link
                  href={`/curriculum/topic/${nextTopic.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-accent-purple transition-all"
                >
                  <span>{nextTopic.title}</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              ) : (
                <Link
                  href={`/curriculum/module/${module.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-accent-purple hover:underline"
                >
                  <span>Module Directory</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              )}
            </div>

            {/* Discussion comments */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
              <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="h-4 w-4 text-accent-purple" />
                <span>Concept Discussion ({comments.length})</span>
              </h3>

              <form onSubmit={handlePostComment} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask a question or share a thought on this concept..."
                  value={discussionComment}
                  onChange={(e) => setDiscussionComment(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-border-light rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-[#F8FAFC]/40"
                />
                <button
                  type="submit"
                  className="gradient-bg hover:opacity-95 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm cursor-pointer shrink-0"
                >
                  Post
                </button>
              </form>

              <div className="space-y-4 pt-2">
                {comments.map((comment, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs leading-normal font-sans">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent-purple/20 to-accent-cyan/20 flex items-center justify-center text-primary font-bold shadow-sm border border-border-light shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-bold text-primary">{comment.author}</span>
                          <span className="text-[9px] text-primary/40 font-medium">({comment.role})</span>
                        </div>
                        <span className="text-[9px] text-primary/40 font-semibold">{comment.time}</span>
                      </div>
                      <p className="text-primary/75 font-medium">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Pane: Workspace Notepad */}
          <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-border-light bg-white flex flex-col h-1/2 md:h-full max-h-full shrink-0">
            {/* Header info */}
            <div className="p-4 border-b border-border-light flex items-center justify-between bg-bg-light/40 shrink-0">
              <h3 className="text-xs font-bold text-primary flex items-center space-x-1.5">
                <FileText className="h-4.5 w-4.5 text-accent-purple" />
                <span>Workspace Notebook</span>
              </h3>
              
              {/* Save state badge */}
              <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                saveStatus === "Saved" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600 animate-pulse"
              }`}>
                <Save className="h-3 w-3" />
                <span>{saveStatus}</span>
              </span>
            </div>

            {/* Markdown Textarea Editor */}
            <textarea
              value={noteText}
              onChange={handleNoteChange}
              placeholder="# Personal Notes\n\nStart typing key concepts, framework templates, or project drafts..."
              className="flex-1 p-5 text-xs font-medium font-sans bg-white leading-relaxed focus:outline-none resize-none overflow-y-auto"
            />
          </div>

        </main>
      </div>
    </div>
  );
}
