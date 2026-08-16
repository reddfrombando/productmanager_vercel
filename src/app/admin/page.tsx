"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { TOPICS, MODULES } from "@/data/curriculum";
import {
  Shield,
  Check,
  X,
  FileText,
  Users,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  Save,
  Edit,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Database
} from "lucide-react";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
const VersionHistoryPage = dynamic(() => import("@/components/admin/VersionHistoryPage"), { ssr: false });

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    user,
    submissions,
    updateSubmissionStatus,
    allTopics,
    topicVideos,
    addTopic,
    addTopicVideo,
    removeTopicVideo
  } = usePlatform();
const handleCheckAndSync = async (
  topicId: string,
  video: string
) => {
  try {
    const buttonKey = `${topicId}-${video}`;

    setSyncingVideos((prev) => ({
      ...prev,
      [buttonKey]: true
    }));

    const response = await fetch(
      "/api/topic-videos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topicId,
          url: video,
          adminUser: {
            email: user?.email || "admin"
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Video sync failed:",
        data
      );

      alert(
        `Could not sync video: ${
          data?.error || "Unknown error"
        }`
      );

      return;
    }

    if (data.alreadyExists) {
      alert(
        "✓ Video is already present in the database."
      );
    } else {
      alert(
        "✓ Video was added to the database."
      );
    }

  } catch (error) {
    console.error(
      "Video sync error:",
      error
    );

    alert(
      "Could not check/sync this video."
    );

  } finally {
    const buttonKey = `${topicId}-${video}`;

    setSyncingVideos((prev) => ({
      ...prev,
      [buttonKey]: false
    }));
  }
};
  const [activeTab, setActiveTab] = useState<"queue" | "syllabus">("queue");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDuration, setNewTopicDuration] = useState("");
  const [newTopicVideoUrl, setNewTopicVideoUrl] = useState("");
  const [showAddTopicFormModId, setShowAddTopicFormModId] = useState<number | null>(null);

  const [newVideoUrls, setNewVideoUrls] = useState<Record<string, string>>({});
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  const [syncing, setSyncing] = useState(false);

const [syncStatus, setSyncStatus] = useState<
  "idle" | "success" | "failed"
>("idle");

const [syncMessage, setSyncMessage] =
  useState("");

const [syncTotals, setSyncTotals] =
  useState<{
    attempted: number;
    synced: number;
    verified: number;
  } | null>(null);

  // Protect route
  useEffect(() => {
    const storedUser = localStorage.getItem("pm_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      // not admin
    }
  }, [router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-4 max-w-md bg-white border border-border-light p-8 rounded-2xl shadow-premium">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
            <h1 className="font-display text-xl font-bold text-primary">Access Denied</h1>
            <p className="text-xs text-primary/60 font-sans leading-relaxed">
              This area is restricted to platform curators and administrators. Please sign in with an Admin Demo account.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="gradient-bg rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all inline-block"
              >
                Go to Authentication page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "Pending");

  const handleApprove = (id: string) => {
    updateSubmissionStatus(id, "Approved");
    confetti({
      particleCount: 30,
      spread: 30,
      origin: { y: 0.6 }
    });
  };

  const handleReject = (id: string) => {
    updateSubmissionStatus(id, "Rejected");
  };

  const handleAdminCacheSync =
  async () => {
    if (syncing) return;

    setSyncing(true);

    setSyncStatus("idle");

    setSyncMessage("");

    setSyncTotals(null);

    try {
      /*
       * ------------------------------------------------------
       * READ ONLY ADMIN/CATALOG CACHE
       * ------------------------------------------------------
       *
       * We deliberately DO NOT read:
       *
       * pm_<email>_progress
       * pm_<email>_notes
       * pm_<email>_bookmarks
       * pm_<email>_streak
       * pm_<email>_last_study_date
       *
       * Those belong to individual learners.
       */

      let customTopics: any[] = [];

      let submissions: any[] = [];

      let topicVideos: Record<
        string,
        string[]
      > = {};

      let calendarEvents: any[] = [];


      try {
        customTopics =
          JSON.parse(
            localStorage.getItem(
              "pm_custom_topics"
            ) || "[]"
          );
      } catch {
        customTopics = [];
      }


      try {
        submissions =
          JSON.parse(
            localStorage.getItem(
              "pm_submissions"
            ) || "[]"
          );
      } catch {
        submissions = [];
      }


      try {
        topicVideos =
          JSON.parse(
            localStorage.getItem(
              "pm_topic_videos"
            ) || "{}"
          );
      } catch {
        topicVideos = {};
      }


      /*
       * Calendar support is included now so the
       * same sync system works once calendar
       * drag/drop is enabled.
       */

      try {
        calendarEvents =
          JSON.parse(
            localStorage.getItem(
              "pm_calendar_events"
            ) || "[]"
          );
      } catch {
        calendarEvents = [];
      }


      /*
       * ------------------------------------------------------
       * ASK FOR SERVER-SIDE ADMIN CREDENTIALS
       * ------------------------------------------------------
       *
       * Your current application uses client-side
       * demo authentication, so the browser cannot
       * safely read ADMIN_PASSWORD from Vercel.
       *
       * The credentials are sent only through HTTPS
       * to the protected API route.
       */

      const adminUsername =
        window.prompt(
          "Admin username"
        );

      if (!adminUsername) {
        throw new Error(
          "Admin sync cancelled."
        );
      }


      const adminPassword =
        window.prompt(
          "Admin password"
        );

      if (!adminPassword) {
        throw new Error(
          "Admin sync cancelled."
        );
      }


      const authorization =
        "Basic " +
        window.btoa(
          `${adminUsername}:${adminPassword}`
        );


      /*
       * ------------------------------------------------------
       * SEND CACHE TO SERVER
       * ------------------------------------------------------
       */

      const response =
        await fetch(
          "/api/admin-sync",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                authorization
            },

            body: JSON.stringify({
              customTopics,
              submissions,
              topicVideos,
              calendarEvents
            })
          }
        );


      const data =
        await response.json();


      /*
       * ------------------------------------------------------
       * API MUST CONFIRM SUPABASE VERIFICATION
       * ------------------------------------------------------
       */

      if (
        !response.ok ||
        !data.success
      ) {
        setSyncStatus("failed");

        setSyncMessage(
          data?.error ||
            "Supabase verification failed. The cache was not confirmed."
        );

        if (data?.totals) {
          setSyncTotals(
            data.totals
          );
        }

        return;
      }


      /*
       * ------------------------------------------------------
       * SUCCESS
       * ------------------------------------------------------
       */

      setSyncStatus("success");

      setSyncMessage(
        "Admin cache successfully synced and verified in Supabase."
      );

      setSyncTotals(
        data.totals
      );


    } catch (error: any) {
      console.error(
        "Admin cache sync failed:",
        error
      );

      setSyncStatus("failed");

      setSyncMessage(
        error?.message ||
          "Admin cache sync failed."
      );

    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-primary flex items-center space-x-2">
                <Shield className="h-6 w-6 text-accent-purple animate-pulse" />
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-xs text-primary/50 mt-1 font-sans">
                Manage contributed resources, manually edit topic videos, and review sitemap analytics.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-white border border-border-light rounded-xl p-1 text-xs font-semibold text-primary/60 shadow-sm self-start shrink-0">
              <button
                onClick={() => {
                  setActiveTab("queue");
                  setSelectedModuleId(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "queue"
                    ? "bg-accent-purple text-white font-bold"
                    : "hover:text-primary"
                }`}
              >
                Review Queue ({pendingSubmissions.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("syllabus");
                  setSelectedModuleId(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "syllabus"
                    ? "bg-accent-purple text-white font-bold"
                    : "hover:text-primary"
                }`}
              >
                Syllabus Manager
              </button>
            </div>
          </div>

          {/* Metrics summary */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center space-x-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">Learners Active</div>
                <div className="text-lg font-black text-primary">1,248</div>
              </div>
            </div>

            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center space-x-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-cyan/10 text-accent-cyan">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">Curriculum Gaps / Coverage</div>
                <div className="text-lg font-black text-primary">94.2%</div>
              </div>
            </div>

            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium flex items-center space-x-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/60 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">Review Queue</div>
                <div className="text-lg font-black text-primary">{pendingSubmissions.length} pending</div>
              </div>
            </div>
          </div>
{/* ADMIN CACHE SYNC */}
<div
  className={`bg-white border rounded-2xl p-5 shadow-premium ${
    syncStatus === "success"
      ? "border-emerald-200"
      : syncStatus === "failed"
      ? "border-red-200"
      : "border-border-light"
  }`}
>
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center space-x-3">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          syncStatus === "success"
            ? "bg-emerald-50 text-emerald-600"
            : syncStatus === "failed"
            ? "bg-red-50 text-red-600"
            : "bg-accent-purple/10 text-accent-purple"
        }`}
      >
        {syncStatus === "success" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : syncStatus === "failed" ? (
          <XCircle className="h-5 w-5" />
        ) : (
          <Database className="h-5 w-5" />
        )}
      </span>

      <div>
        <div className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">
          Admin Data Sync
        </div>

        <div
          className={`text-sm font-black ${
            syncStatus === "success"
              ? "text-emerald-600"
              : syncStatus === "failed"
              ? "text-red-600"
              : "text-primary"
          }`}
        >
          {syncing
            ? "Syncing..."
            : syncStatus === "success"
            ? "SYNC SUCCESSFUL"
            : syncStatus === "failed"
            ? "SYNC FAILED"
            : "Not synced"}
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={handleAdminCacheSync}
      disabled={syncing}
      className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light disabled:opacity-50 disabled:cursor-not-allowed"
      title="Sync admin browser cache to Supabase"
    >
      <RefreshCw
        className={`h-4 w-4 ${
          syncing
            ? "animate-spin"
            : ""
        }`}
      />
    </button>
  </div>

  {/* Status message */}
  {syncMessage && (
    <div
      className={`mt-3 text-[9px] leading-relaxed font-semibold ${
        syncStatus === "success"
          ? "text-emerald-600"
          : "text-red-600"
      }`}
    >
      {syncMessage}
    </div>
  )}

  {/* Verification numbers */}
  {syncTotals && (
    <div className="mt-3 pt-3 border-t border-border-light/70 grid grid-cols-3 gap-2 text-center">
      <div>
        <div className="text-sm font-black text-primary">
          {syncTotals.attempted}
        </div>

        <div className="text-[8px] uppercase font-bold text-primary/35">
          Read
        </div>
      </div>

      <div>
        <div className="text-sm font-black text-primary">
          {syncTotals.synced}
        </div>

        <div className="text-[8px] uppercase font-bold text-primary/35">
          Saved
        </div>
      </div>

      <div>
        <div
          className={`text-sm font-black ${
            syncTotals.verified ===
            syncTotals.attempted
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >
          {syncTotals.verified}
        </div>

        <div className="text-[8px] uppercase font-bold text-primary/35">
          Verified
        </div>
      </div>
    </div>
  )}
</div>
          {/* Tab contents */}
          {activeTab === "queue" && (
            <div className="bg-white border border-border-light rounded-2xl shadow-premium overflow-hidden">
              <div className="p-5 border-b border-border-light/80 flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-primary flex items-center space-x-1.5">
                  <FileText className="h-4.5 w-4.5 text-accent-purple" />
                  <span>Resource Publishing Queue</span>
                </h3>
                <span className="bg-bg-light border border-border-light rounded-md px-2 py-0.5 text-[9px] font-bold text-primary/50">
                  {submissions.length} Total items
                </span>
              </div>

              {submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#F8FAFC] border-b border-border-light text-primary/60 font-bold uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="p-4">Topic / Target</th>
                        <th className="p-4">Resource Details</th>
                        <th className="p-4">Contributor</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light text-primary/80 font-medium">
                      {submissions.map((sub) => {
                        const topic = allTopics.find((t) => t.id === sub.topicId);
                        const mod = MODULES.find((m) => m.id === topic?.moduleId);

                        return (
                          <tr key={sub.id} className="hover:bg-bg-light/30">
                            <td className="p-4">
                              {sub.suggestedTopicTitle ? (
                                <div>
                                  <span className="bg-purple-50 border border-purple-100 text-purple-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                                    Topic Suggestion
                                  </span>
                                  <div className="text-xs font-bold text-primary">{sub.suggestedTopicTitle}</div>
                                  <div className="text-[9px] text-primary/45 mt-0.5">
                                    Module {sub.moduleId} • {sub.suggestedTopicDuration}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-xs font-bold text-primary">{topic?.title || "Unknown"}</div>
                                  <div className="text-[9px] text-primary/45 mt-0.5">Module {mod?.id || 1}</div>
                                </div>
                              )}
                            </td>
                            <td className="p-4 space-y-0.5 max-w-[200px]">
                              <div className="font-bold text-primary truncate" title={sub.resourceTitle}>
                                {sub.resourceTitle}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] font-bold text-accent-cyan uppercase">{sub.type}</span>
                                <a
                                  href={sub.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary/40 hover:text-accent-purple inline-flex items-center space-x-0.5 text-[9px]"
                                >
                                  <span>Link</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-primary">{sub.contributorName}</div>
                              <div className="text-[9px] text-primary/45">{sub.contributorEmail}</div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                sub.status === "Approved"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : sub.status === "Rejected"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : "bg-orange-50 text-orange-600 border border-orange-100"
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {sub.status === "Pending" ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleReject(sub.id)}
                                    className="h-7 w-7 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleApprove(sub.id)}
                                    className="h-7 w-7 rounded-lg border border-emerald-200 text-emerald-500 hover:bg-emerald-50 flex items-center justify-center cursor-pointer transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-primary/30 italic">Reviewed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Shield className="h-10 w-10 text-primary/20 mx-auto" />
                  <h3 className="font-display text-sm font-bold text-primary mt-3">Review Queue Empty</h3>
                  <p className="text-xs text-primary/50 max-w-xs mx-auto mt-1">
                    All contributed resources have been reviewed and published.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "syllabus" && (
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
              {/* Syllabus Manager (Left side) */}
              <div className="flex-1 bg-white border border-border-light rounded-2xl shadow-premium p-5 space-y-6 w-full">
                <div>
                  <h3 className="font-display text-sm font-bold text-primary flex items-center space-x-1.5">
                    <Shield className="h-4.5 w-4.5 text-accent-purple animate-pulse" />
                    <span>Syllabus Video Curation Manager</span>
                  </h3>
                  <p className="text-[11px] text-primary/50 mt-1 font-sans">
                    Manage modules and topics. Add more topics, specify multiple video streams, or clean up outdated video links.
                  </p>
                </div>

                {/* Modules List Accordion */}
                <div className="space-y-4 font-sans text-xs">
                  {MODULES.map((mod) => {
                    const isExpanded = selectedModuleId === mod.id;
                    const moduleTopics = allTopics.filter((t) => t.moduleId === mod.id);
                    const isAddingTopic = showAddTopicFormModId === mod.id;

                    return (
                      <div key={mod.id} className="border border-border-light/60 rounded-xl overflow-hidden bg-white shadow-sm">
                        {/* Module header */}
                        <div className="w-full flex items-center justify-between p-4 bg-[#F8FAFC]/40 border-b border-border-light/60">
                          <button
                            onClick={() => {
                              setSelectedModuleId(isExpanded ? null : mod.id);
                              setShowAddTopicFormModId(null);
                            }}
                            className="flex-1 text-left font-display text-xs font-extrabold text-primary hover:text-accent-purple transition-colors cursor-pointer"
                          >
                            Module {mod.id} - {mod.title}
                          </button>
                          <div className="flex items-center space-x-4 shrink-0">
                            <span className="text-[10px] text-primary/45 font-bold">
                              {moduleTopics.length} topics
                            </span>
                            <button
                              onClick={() => {
                                setSelectedModuleId(mod.id);
                                setShowAddTopicFormModId(isAddingTopic ? null : mod.id);
                              }}
                              className="bg-accent-purple/5 hover:bg-accent-purple text-accent-purple hover:text-white border border-accent-purple/20 px-2.5 py-1 rounded-lg text-[9px] font-bold"
                            >
                              + Add Topic
                            </button>
                            <button
                              onClick={() => {
                                setSelectedModuleId(isExpanded ? null : mod.id);
                                setShowAddTopicFormModId(null);
                              }}
                              className="text-primary/30 hover:text-primary cursor-pointer hover:scale-105 transition-transform"
                            >
                              {isExpanded ? <ChevronUp className="h-4.5 w-4.5 animate-pulse" /> : <ChevronDown className="h-4.5 w-4.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Topics inside module */}
                        {isExpanded && (
                          <div className="p-4 space-y-4">
                            
                            {/* Add Topic Form */}
                            {isAddingTopic && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newTopicTitle.trim() || !newTopicDuration.trim()) {
                                    alert("Please fill out Topic Title and Duration.");
                                    return;
                                  }
                                  addTopic(mod.id, newTopicTitle.trim(), newTopicDuration.trim(), newTopicVideoUrl.trim());
                                  setNewTopicTitle("");
                                  setNewTopicDuration("");
                                  setNewTopicVideoUrl("");
                                  setShowAddTopicFormModId(null);
                                  confetti({ particleCount: 30, spread: 30 });
                                }}
                                className="bg-bg-light/60 border border-border-light/75 rounded-xl p-4 space-y-3"
                              >
                                <div className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">
                                  Create New Topic inside Module {mod.id}
                                </div>
                                <div className="grid sm:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="font-bold text-primary/60">Topic Title</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Value Creation Metrics"
                                      value={newTopicTitle}
                                      onChange={(e) => setNewTopicTitle(e.target.value)}
                                      className="w-full px-3 py-1.5 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-primary/60">Duration (e.g. 15 mins)</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. 12 mins"
                                      value={newTopicDuration}
                                      onChange={(e) => setNewTopicDuration(e.target.value)}
                                      className="w-full px-3 py-1.5 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-primary/60">Initial Video URL (Optional)</label>
                                    <input
                                      type="text"
                                      placeholder="https://youtube.com/watch?v=..."
                                      value={newTopicVideoUrl}
                                      onChange={(e) => setNewTopicVideoUrl(e.target.value)}
                                      className="w-full px-3 py-1.5 border border-border-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-accent-purple bg-white"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setShowAddTopicFormModId(null)}
                                    className="px-3 py-1.5 rounded-lg border border-border-light hover:bg-[#F8FAFC] font-bold text-primary/70 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 rounded-lg bg-accent-purple text-white font-bold shadow-sm cursor-pointer hover:opacity-95"
                                  >
                                    Add Topic
                                  </button>
                                </div>
                              </form>
                            )}

                            <div className="divide-y divide-border-light/65">
                              {moduleTopics.map((topic, index) => {
                                const tVideos = topicVideos[topic.id] || [];

                                return (
                                  <div key={topic.id} className={`py-4 ${index === 0 ? "pt-0 border-t-0" : ""}`}>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                      {/* Topic details */}
                                      <div className="space-y-1 max-w-sm">
                                        <div className="font-bold text-primary flex items-center space-x-2">
                                          <span className="text-xs">{topic.title}</span>
                                          <span className="bg-bg-light border border-border-light rounded px-1.5 py-0.5 text-[9px] font-bold text-primary/45 font-mono">
                                            {topic.id}
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-primary/50 font-semibold">
                                          Duration: {topic.duration}
                                        </div>
                                      </div>

                                      {/* Video playlist manager */}
                                      <div className="flex-1 space-y-3 max-w-xl bg-[#F8FAFC]/50 border border-border-light/50 rounded-xl p-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-bold text-primary/45 uppercase tracking-wide">
                                            Active Video Links ({tVideos.length})
                                          </span>
                                        </div>

                                        {/* Links list */}
                                        {tVideos.length > 0 ? (
                                          <div className="space-y-1.5">
                                            {tVideos.map((video, vIdx) => (
                                              <div
                                                key={vIdx}
                                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-border-light/60 shadow-sm gap-2"
                                              >
                                                <div className="flex items-center space-x-2 truncate">
                                                  <button
                                                    onClick={() => setPreviewVideoUrl(video)}
                                                    className={`h-6 w-6 rounded flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                                                      previewVideoUrl === video
                                                        ? "bg-accent-purple text-white shadow-sm"
                                                        : "hover:bg-accent-purple/10 text-accent-purple bg-accent-purple/5"
                                                    }`}
                                                    type="button"
                                                    title="Skim & Verify Video"
                                                  >
                                                    <Play className="h-3 w-3" />
                                                  </button>
                                                  <a
                                                    href={video.startsWith("http") ? video : `https://youtube.com/watch?v=${video}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] text-accent-purple hover:underline font-bold truncate max-w-[200px]"
                                                  >
                                                    {video}
                                                  </a>
                                                </div>
                                                <button
                                                  onClick={() => removeTopicVideo(topic.id, vIdx)}
                                                  className="h-6 w-6 rounded hover:bg-red-50 text-red-500 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                                                  title="Remove video link"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-[10px] text-primary/40 italic py-1">
                                            No active videos. Topic will render a fallback recommended request.
                                          </div>
                                        )}

                                        {/* Add Video inline form */}
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="text"
                                            placeholder="Add YouTube URL or ID"
                                            value={newVideoUrls[topic.id] || ""}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setNewVideoUrls((prev) => ({
                                                ...prev,
                                                [topic.id]: val
                                              }));
                                            }}
                                            className="px-2.5 py-1 border border-border-light rounded-lg font-medium focus:outline-none bg-white text-[10px] flex-1"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const url = newVideoUrls[topic.id];
                                              if (url && url.trim()) {
                                                addTopicVideo(topic.id, url.trim());
                                                setNewVideoUrls((prev) => ({
                                                  ...prev,
                                                  [topic.id]: ""
                                                }));
                                                confetti({ particleCount: 20, spread: 20 });
                                              }
                                            }}
                                            className="bg-accent-purple text-white px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer hover:opacity-95 text-center shrink-0"
                                          >
                                            + Add Video
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Skim & Verification Sidebar (Right side) */}
              <div className="w-full lg:w-80 shrink-0 space-y-4">
                <div className="bg-white border border-border-light rounded-2xl shadow-premium p-4 sticky top-6">
                  <h3 className="font-display text-xs font-bold text-primary flex items-center space-x-1.5 border-b border-border-light pb-2">
                    <Play className="h-4 w-4 text-accent-purple" />
                    <span>Video Verification Skimmer</span>
                  </h3>
                  
                  {previewVideoUrl ? (
                    <div className="space-y-3 pt-3">
                      <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden shadow-inner border border-border-light">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${getYoutubeId(previewVideoUrl)}?autoplay=1&mute=1`}
                          title="Verification Skim Player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-primary truncate" title={previewVideoUrl}>
                          {previewVideoUrl}
                        </div>
                        <div className="text-[9px] text-primary/45 font-semibold font-mono">
                          Video ID: {getYoutubeId(previewVideoUrl)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewVideoUrl("")}
                          className="w-full border border-border-light hover:bg-[#F8FAFC] py-1.5 rounded-lg text-[9px] font-bold text-primary/70 transition-all cursor-pointer text-center"
                        >
                          Close Player
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-primary/40 font-semibold space-y-2">
                      <Play className="h-8 w-8 mx-auto text-primary/20 stroke-1" />
                      <div className="text-[10px] leading-relaxed max-w-[200px] mx-auto">
                        Click the play icon next to any video link to inspect, skim, and verify its playback.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Version History admin panel */}
          <VersionHistoryPage />

        </main>
      </div>
    </div>
  );
}
