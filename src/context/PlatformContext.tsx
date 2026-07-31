"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TOPICS, MODULES, PHASES, PORTFOLIO_PROJECTS, CASE_STUDIES, ResourceItem } from "@/data/curriculum";

export interface User {
  name: string;
  email: string;
  role: "learner" | "admin";
}

interface PlatformContextType {
  user: User | null;
  progress: string[]; // List of completed topic IDs
  notes: { [topicId: string]: string };
  bookmarks: { id: string; type: "topic" | "project" | "case"; title: string }[];
  submissions: {
    id: string;
    topicId: string;
    resourceTitle: string;
    link: string;
    type: string;
    contributorName: string;
    contributorEmail: string;
    status: "Pending" | "Approved" | "Rejected";
    submittedAt: string;
    suggestedTopicTitle?: string;
    suggestedTopicDuration?: string;
    moduleId?: number;
  }[];
  streak: number;
  lastStudyDate: string | null;
  login: (name: string, email: string, role: "learner" | "admin") => void;
  logout: () => void;
  toggleTopicCompletion: (topicId: string) => void;
  saveNote: (topicId: string, text: string) => void;
  toggleBookmark: (id: string, type: "topic" | "project" | "case", title: string) => void;
  isBookmarked: (id: string) => boolean;
  addSubmission: (submission: {
    topicId: string;
    resourceTitle: string;
    link: string;
    type: string;
    contributorName: string;
    contributorEmail: string;
    suggestedTopicTitle?: string;
    suggestedTopicDuration?: string;
    moduleId?: number;
  }) => void;
  updateSubmissionStatus: (id: string, status: "Approved" | "Rejected") => void;
  allTopics: typeof TOPICS;
  topicVideos: { [topicId: string]: string[] };
  addTopic: (moduleId: number, title: string, duration: string, videoUrl: string) => void;
  addTopicVideo: (topicId: string, url: string) => void;
  removeTopicVideo: (topicId: string, index: number) => void;
  getModuleProgress: (moduleId: number) => number; // percentage (0-100)
  getPhaseProgress: (phaseId: number) => number; // percentage (0-100)
  getOverallProgress: () => number; // percentage (0-100)
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ [topicId: string]: string }>({});
  const [bookmarks, setBookmarks] = useState<{ id: string; type: "topic" | "project" | "case"; title: string }[]>([]);
  const [submissions, setSubmissions] = useState<PlatformContextType["submissions"]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null);
  const [customTopics, setCustomTopics] = useState<typeof TOPICS>([]);
  const [topicVideos, setTopicVideos] = useState<{ [topicId: string]: string[] }>({});
  const [initialized, setInitialized] = useState(false);

  const allTopics = [...TOPICS, ...customTopics];

  // Load from local storage on mount (global objects and user session)
  useEffect(() => {
    const storedUser = localStorage.getItem("pm_user");
    const storedSubmissions = localStorage.getItem("pm_submissions");
    const storedCustomTopics = localStorage.getItem("pm_custom_topics");
    const storedTopicVideos = localStorage.getItem("pm_topic_videos");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedCustomTopics) {
      setCustomTopics(JSON.parse(storedCustomTopics));
    }
    if (storedTopicVideos) {
      setTopicVideos(JSON.parse(storedTopicVideos));
    } else {
      const initialVideos: { [topicId: string]: string[] } = {};
      TOPICS.forEach((t) => {
        initialVideos[t.id] = [t.youtubeId];
      });
      setTopicVideos(initialVideos);
      localStorage.setItem("pm_topic_videos", JSON.stringify(initialVideos));
    }

    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    } else {
      const sampleSubmissions: PlatformContextType["submissions"] = [
        {
          id: "sub-1",
          topicId: "t-1-1",
          resourceTitle: "Shreyas Doshi on PM Competencies",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          type: "Video",
          contributorName: "Shreyas Doshi",
          contributorEmail: "shreyas@productlead.co",
          status: "Pending",
          submittedAt: "2026-07-29T10:30:00.000Z"
        },
        {
          id: "sub-2",
          topicId: "t-14-2",
          resourceTitle: "Andrej Karpathy - Let's build GPT: from scratch",
          link: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
          type: "Video",
          contributorName: "Andrej Karpathy",
          contributorEmail: "andrej@karpathy.ai",
          status: "Pending",
          submittedAt: "2026-07-30T08:15:00.000Z"
        }
      ];
      setSubmissions(sampleSubmissions);
      localStorage.setItem("pm_submissions", JSON.stringify(sampleSubmissions));
    }
    setInitialized(true);
  }, []);

  // Load user-specific tracking spaces when user session loads/changes
  useEffect(() => {
    if (!initialized) return;

    if (user) {
      const email = user.email;
      const storedProgress = localStorage.getItem(`pm_${email}_progress`);
      const storedNotes = localStorage.getItem(`pm_${email}_notes`);
      const storedBookmarks = localStorage.getItem(`pm_${email}_bookmarks`);
      const storedStreak = localStorage.getItem(`pm_${email}_streak`);
      const storedLastStudy = localStorage.getItem(`pm_${email}_last_study_date`);

      setProgress(storedProgress ? JSON.parse(storedProgress) : []);
      setNotes(storedNotes ? JSON.parse(storedNotes) : {});
      setBookmarks(storedBookmarks ? JSON.parse(storedBookmarks) : []);
      setStreak(storedStreak ? Number(storedStreak) || 0 : 0);
      setLastStudyDate(storedLastStudy || null);
    } else {
      // Clean states on logout
      setProgress([]);
      setNotes({});
      setBookmarks([]);
      setStreak(0);
      setLastStudyDate(null);
    }
  }, [user, initialized]);

  // Persist user session changes
  useEffect(() => {
    if (!initialized) return;
    if (user) {
      localStorage.setItem("pm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pm_user");
    }
  }, [user, initialized]);

  // Persist namespaced learner telemetry
  useEffect(() => {
    if (!initialized || !user) return;
    localStorage.setItem(`pm_${user.email}_progress`, JSON.stringify(progress));
  }, [progress, user, initialized]);

  useEffect(() => {
    if (!initialized || !user) return;
    localStorage.setItem(`pm_${user.email}_notes`, JSON.stringify(notes));
  }, [notes, user, initialized]);

  useEffect(() => {
    if (!initialized || !user) return;
    localStorage.setItem(`pm_${user.email}_bookmarks`, JSON.stringify(bookmarks));
  }, [bookmarks, user, initialized]);

  useEffect(() => {
    if (!initialized || !user) return;
    localStorage.setItem(`pm_${user.email}_streak`, String(streak));
  }, [streak, user, initialized]);

  useEffect(() => {
    if (!initialized || !user) return;
    localStorage.setItem(`pm_${user.email}_last_study_date`, lastStudyDate || "");
  }, [lastStudyDate, user, initialized]);

  // Persist global administrative & catalog changes
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("pm_submissions", JSON.stringify(submissions));
  }, [submissions, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("pm_custom_topics", JSON.stringify(customTopics));
  }, [customTopics, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("pm_topic_videos", JSON.stringify(topicVideos));
  }, [topicVideos, initialized]);

  const login = (name: string, email: string, role: "learner" | "admin") => {
    setUser({ name, email, role });
    // If logging in, initialize default progress if empty
    if (progress.length === 0) {
      setProgress([]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const toggleTopicCompletion = (topicId: string) => {
    setProgress((prev) => {
      const isCompleted = prev.includes(topicId);
      let updated;
      if (isCompleted) {
        updated = prev.filter((id) => id !== topicId);
      } else {
        updated = [...prev, topicId];
        // Calculate streak update when completing a new topic
        updateStreak();
      }
      return updated;
    });
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    if (lastStudyDate === today) return; // already studied today

    if (lastStudyDate) {
      const lastDate = new Date(lastStudyDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setStreak((prev) => prev + 1);
      } else if (diffDays > 1) {
        setStreak(1);
      }
    } else {
      setStreak(1);
    }
    setLastStudyDate(today);
  };

  const saveNote = (topicId: string, text: string) => {
    setNotes((prev) => ({ ...prev, [topicId]: text }));
  };

  const toggleBookmark = (id: string, type: "topic" | "project" | "case", title: string) => {
    setBookmarks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index !== -1) {
        return prev.filter((b) => b.id !== id);
      } else {
        return [...prev, { id, type, title }];
      }
    });
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  const addSubmission = (sub: {
    topicId: string;
    resourceTitle: string;
    link: string;
    type: string;
    contributorName: string;
    contributorEmail: string;
    suggestedTopicTitle?: string;
    suggestedTopicDuration?: string;
    moduleId?: number;
  }) => {
    const newSub: PlatformContextType["submissions"][0] = {
      ...sub,
      id: `sub-${Date.now()}`,
      status: "Pending",
      submittedAt: new Date().toISOString()
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const updateSubmissionStatus = (id: string, status: "Approved" | "Rejected") => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          if (status === "Approved") {
            if (sub.suggestedTopicTitle) {
              addTopic(
                sub.moduleId || 1,
                sub.suggestedTopicTitle,
                sub.suggestedTopicDuration || "15 mins",
                sub.link
              );
            } else if (sub.type === "Video") {
              setTopicVideos((prevMap) => {
                const prevList = prevMap[sub.topicId] || [];
                if (prevList.includes(sub.link)) return prevMap;
                return {
                  ...prevMap,
                  [sub.topicId]: [...prevList, sub.link]
                };
              });
            }
          }
          return { ...sub, status };
        }
        return sub;
      })
    );
  };

  const addTopic = (moduleId: number, title: string, duration: string, videoUrl: string) => {
    const newTopicId = `t-custom-${Date.now()}`;
    const newTopic = {
      id: newTopicId,
      moduleId,
      title,
      duration,
      youtubeId: videoUrl,
      notesTemplate: `## Lecture Notes: ${title}\n\n- Key Concept 1:\n- Key Concept 2:\n- Strategic Takeaway:\n`,
      exercise: "Reflect on how this concept impacts product engineering and list three primary execution metrics."
    };
    setCustomTopics((prev) => [...prev, newTopic]);
    setTopicVideos((prevMap) => ({
      ...prevMap,
      [newTopicId]: videoUrl ? [videoUrl] : []
    }));
  };

  const addTopicVideo = (topicId: string, url: string) => {
    setTopicVideos((prevMap) => {
      const prevList = prevMap[topicId] || [];
      if (prevList.includes(url)) return prevMap;
      return {
        ...prevMap,
        [topicId]: [...prevList, url]
      };
    });
  };

  const removeTopicVideo = (topicId: string, index: number) => {
    setTopicVideos((prevMap) => {
      const prevList = prevMap[topicId] || [];
      const updated = prevList.filter((_, idx) => idx !== index);
      return {
        ...prevMap,
        [topicId]: updated
      };
    });
  };
  const getModuleProgress = (moduleId: number) => {
    const module = MODULES.find((m) => m.id === moduleId);
    if (!module) return 0;

    // Filter topics belonging to this module
    const moduleTopics = TOPICS.filter((t) => t.moduleId === moduleId);
    if (moduleTopics.length === 0) return 0;

    const completedInModule = moduleTopics.filter((t) => progress.includes(t.id)).length;
    return Math.round((completedInModule / moduleTopics.length) * 100);
  };

  const getPhaseProgress = (phaseId: number) => {
    const phaseModules = MODULES.filter((m) => m.phaseId === phaseId);
    if (phaseModules.length === 0) return 0;

    const totalTopicsInPhase = TOPICS.filter((t) => {
      const module = MODULES.find((m) => m.id === t.moduleId);
      return module?.phaseId === phaseId;
    });

    if (totalTopicsInPhase.length === 0) return 0;

    const completedInPhase = totalTopicsInPhase.filter((t) => progress.includes(t.id)).length;
    return Math.round((completedInPhase / totalTopicsInPhase.length) * 100);
  };

  const getOverallProgress = () => {
    if (TOPICS.length === 0) return 0;
    const completed = TOPICS.filter((t) => progress.includes(t.id)).length;
    return Math.round((completed / TOPICS.length) * 100);
  };

  return (
    <PlatformContext.Provider
      value={{
        user,
        progress,
        notes,
        bookmarks,
        submissions,
        streak,
        lastStudyDate,
        login,
        logout,
        toggleTopicCompletion,
        saveNote,
        toggleBookmark,
        isBookmarked,
        addSubmission,
        updateSubmissionStatus,
        allTopics,
        topicVideos,
        addTopic,
        addTopicVideo,
        removeTopicVideo,
        getModuleProgress,
        getPhaseProgress,
        getOverallProgress
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
};
