"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  TOPICS,
  MODULES,
  PHASES
} from "@/data/curriculum";

export interface User {
  name: string;
  email: string;
  role: "learner" | "admin";
}

type Submission = {
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
};

interface PlatformContextType {
  user: User | null;

  progress: string[];

  notes: {
    [topicId: string]: string;
  };

  bookmarks: {
    id: string;
    type: "topic" | "project" | "case";
    title: string;
  }[];

  submissions: Submission[];

  streak: number;

  lastStudyDate: string | null;

  login: (
    name: string,
    email: string,
    role: "learner" | "admin"
  ) => void;

  logout: () => void;

  toggleTopicCompletion: (
    topicId: string
  ) => void;

  saveNote: (
    topicId: string,
    text: string
  ) => void;

  toggleBookmark: (
    id: string,
    type: "topic" | "project" | "case",
    title: string
  ) => void;

  isBookmarked: (
    id: string
  ) => boolean;

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
  }) => Promise<void>;

  updateSubmissionStatus: (
    id: string,
    status: "Approved" | "Rejected"
  ) => Promise<void>;

  allTopics: typeof TOPICS;

  topicVideos: {
    [topicId: string]: string[];
  };

  addTopic: (
    moduleId: number,
    title: string,
    duration: string,
    videoUrl: string
  ) => Promise<void>;

  addTopicVideo: (
    topicId: string,
    url: string
  ) => Promise<void>;

  removeTopicVideo: (
    topicId: string,
    index: number
  ) => void;

  getModuleProgress: (
    moduleId: number
  ) => number;

  getPhaseProgress: (
    phaseId: number
  ) => number;

  getOverallProgress: () => number;
}

const PlatformContext =
  createContext<PlatformContextType | undefined>(
    undefined
  );

export const PlatformProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [progress, setProgress] =
    useState<string[]>([]);

  const [notes, setNotes] =
    useState<{ [topicId: string]: string }>({});

  const [bookmarks, setBookmarks] =
    useState<
      {
        id: string;
        type: "topic" | "project" | "case";
        title: string;
      }[]
    >([]);

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [streak, setStreak] =
    useState(0);

  const [lastStudyDate, setLastStudyDate] =
    useState<string | null>(null);

  const [customTopics, setCustomTopics] =
    useState<typeof TOPICS>([]);

  const [topicVideos, setTopicVideos] =
    useState<{
      [topicId: string]: string[];
    }>({});

  const [initialized, setInitialized] =
    useState(false);

  const LOCAL_TOPIC_VIDEOS_KEY =
    "pm_topic_videos";

  const allTopics = [
    ...TOPICS,
    ...customTopics
  ];

  // ==========================================================
  // INITIAL LOCAL CACHE
  // ==========================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("pm_user");

    const storedCustomTopics =
      localStorage.getItem(
        "pm_custom_topics"
      );

    const storedSubmissions =
      localStorage.getItem(
        "pm_submissions"
      );

    const storedVideos =
      localStorage.getItem(
        LOCAL_TOPIC_VIDEOS_KEY
      );

    if (storedUser) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch {}
    }

    if (storedCustomTopics) {
      try {
        setCustomTopics(
          JSON.parse(
            storedCustomTopics
          )
        );
      } catch {}
    }

    if (storedSubmissions) {
      try {
        setSubmissions(
          JSON.parse(
            storedSubmissions
          )
        );
      } catch {}
    }

    if (storedVideos) {
      try {
        setTopicVideos(
          JSON.parse(
            storedVideos
          )
        );
      } catch {}
    }

    setInitialized(true);
  }, []);

  // ==========================================================
  // LOAD CUSTOM TOPICS FROM SUPABASE
  // ==========================================================

  useEffect(() => {
    if (!initialized) return;

    const loadTopics = async () => {
      try {
        const response =
          await fetch(
            "/api/admin/topics"
          );

        if (!response.ok) return;

        const data =
          await response.json();

        const mapped =
          data.map(
            (row: any) => ({
              id: row.id,

              moduleId:
                Number(
                  row.module_id
                ),

              title:
                row.title,

              duration:
                row.duration ||
                "15 mins",

              youtubeId:
                row.youtube_id ||
                "",

              notesTemplate:
                row.notes_template ||
                "",

              exercise:
                row.exercise ||
                ""
            })
          );

        setCustomTopics(
          mapped
        );

        localStorage.setItem(
          "pm_custom_topics",
          JSON.stringify(
            mapped
          )
        );

      } catch {
        // Local cache remains fallback.
      }
    };

    loadTopics();

  }, [initialized]);

  // ==========================================================
  // LOAD TOPIC VIDEOS FROM SUPABASE
  // ==========================================================

  useEffect(() => {
    if (!initialized) return;

    const loadVideos = async () => {
      try {
        const response =
          await fetch(
            "/api/topic-videos"
          );

        if (!response.ok) {
          console.error(
            "Could not load topic videos from Supabase."
          );

          return;
        }

        const data =
          await response.json();

        /*
         * API returns:
         *
         * [
         *   {
         *     topic_id: "...",
         *     url: "..."
         *   }
         * ]
         */

        const map: {
          [topicId: string]: string[];
        } = {};

        if (Array.isArray(data)) {
          data.forEach(
            (row: any) => {
              if (
                !row?.topic_id ||
                !row?.url
              ) {
                return;
              }

              if (
                !map[row.topic_id]
              ) {
                map[row.topic_id] =
                  [];
              }

              if (
                !map[
                  row.topic_id
                ].includes(
                  row.url
                )
              ) {
                map[
                  row.topic_id
                ].push(
                  row.url
                );
              }
            }
          );
        }

        setTopicVideos(
          map
        );

        /*
         * Keep a local copy as a
         * fallback/cache.
         */

        localStorage.setItem(
          LOCAL_TOPIC_VIDEOS_KEY,
          JSON.stringify(
            map
          )
        );

      } catch (error) {
        console.error(
          "Could not load topic videos:",
          error
        );

        // Local cache remains fallback.
      }
    };

    loadVideos();

  }, [initialized]);

  // ==========================================================
  // LOAD ADMIN CONTRIBUTIONS FROM DATABASE
  // ==========================================================

  useEffect(() => {
    if (
      !initialized ||
      user?.role !== "admin"
    ) {
      return;
    }

    const loadContributions =
      async () => {
        /*
         * Existing demo authentication is
         * client-side, so the API requires
         * admin credentials when needed.
         *
         * If credentials are not supplied,
         * the existing local cache remains.
         */
      };

    loadContributions();

  }, [
    initialized,
    user?.role
  ]);

  // ==========================================================
  // LOAD USER DATA
  // ==========================================================

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      setProgress([]);
      setNotes({});
      setBookmarks([]);
      setStreak(0);
      setLastStudyDate(null);

      return;
    }

    const email =
      user.email;

    const storedProgress =
      localStorage.getItem(
        `pm_${email}_progress`
      );

    const storedNotes =
      localStorage.getItem(
        `pm_${email}_notes`
      );

    const storedBookmarks =
      localStorage.getItem(
        `pm_${email}_bookmarks`
      );

    const storedStreak =
      localStorage.getItem(
        `pm_${email}_streak`
      );

    const storedLastStudy =
      localStorage.getItem(
        `pm_${email}_last_study_date`
      );

    setProgress(
      storedProgress
        ? JSON.parse(
            storedProgress
          )
        : []
    );

    setNotes(
      storedNotes
        ? JSON.parse(
            storedNotes
          )
        : {}
    );

    setBookmarks(
      storedBookmarks
        ? JSON.parse(
            storedBookmarks
          )
        : []
    );

    setStreak(
      storedStreak
        ? Number(
            storedStreak
          )
        : 0
    );

    setLastStudyDate(
      storedLastStudy ||
        null
    );

  }, [
    user,
    initialized
  ]);

  // ==========================================================
  // USER SESSION
  // ==========================================================

  useEffect(() => {
    if (!initialized) return;

    if (user) {
      localStorage.setItem(
        "pm_user",
        JSON.stringify(
          user
        )
      );
    } else {
      localStorage.removeItem(
        "pm_user"
      );
    }

  }, [
    user,
    initialized
  ]);

  // ==========================================================
  // LEARNER CACHE
  // ==========================================================

  useEffect(() => {
    if (
      !initialized ||
      !user
    ) {
      return;
    }

    localStorage.setItem(
      `pm_${user.email}_progress`,
      JSON.stringify(
        progress
      )
    );

  }, [
    progress,
    user,
    initialized
  ]);

  useEffect(() => {
    if (
      !initialized ||
      !user
    ) {
      return;
    }

    localStorage.setItem(
      `pm_${user.email}_notes`,
      JSON.stringify(
        notes
      )
    );

  }, [
    notes,
    user,
    initialized
  ]);

  useEffect(() => {
    if (
      !initialized ||
      !user
    ) {
      return;
    }

    localStorage.setItem(
      `pm_${user.email}_bookmarks`,
      JSON.stringify(
        bookmarks
      )
    );

  }, [
    bookmarks,
    user,
    initialized
  ]);

  useEffect(() => {
    if (
      !initialized ||
      !user
    ) {
      return;
    }

    localStorage.setItem(
      `pm_${user.email}_streak`,
      String(
        streak
      )
    );

  }, [
    streak,
    user,
    initialized
  ]);

  useEffect(() => {
    if (
      !initialized ||
      !user
    ) {
      return;
    }

    localStorage.setItem(
      `pm_${user.email}_last_study_date`,
      lastStudyDate ||
        ""
    );

  }, [
    lastStudyDate,
    user,
    initialized
  ]);

  // ==========================================================
  // CACHE ADMIN DATA
  //
  // These are ONLY caches.
  // Supabase is the source of truth.
  // ==========================================================

  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem(
      "pm_custom_topics",
      JSON.stringify(
        customTopics
      )
    );

  }, [
    customTopics,
    initialized
  ]);

  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem(
      "pm_submissions",
      JSON.stringify(
        submissions
      )
    );

  }, [
    submissions,
    initialized
  ]);

  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem(
      LOCAL_TOPIC_VIDEOS_KEY,
      JSON.stringify(
        topicVideos
      )
    );

  }, [
    topicVideos,
    initialized
  ]);

  // ==========================================================
  // LOGIN / LOGOUT
  // ==========================================================

  const login = (
    name: string,
    email: string,
    role:
      | "learner"
      | "admin"
  ) => {
    setUser({
      name,
      email,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const updateStreak = () => {
    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    if (
      lastStudyDate ===
      today
    ) {
      return;
    }

    if (!lastStudyDate) {
      setStreak(1);

    } else {

      const previous =
        new Date(
          lastStudyDate
        );

      const current =
        new Date(
          today
        );

      const difference =
        Math.round(
          (
            current.getTime() -
            previous.getTime()
          ) /
            (
              1000 *
              60 *
              60 *
              24
            )
        );

      if (
        difference === 1
      ) {

        setStreak(
          (value) =>
            value + 1
        );

      } else {

        setStreak(1);

      }
    }

    setLastStudyDate(
      today
    );
  };

  const toggleTopicCompletion = (
    topicId: string
  ) => {

    setProgress(
      (previous) => {

        if (
          previous.includes(
            topicId
          )
        ) {

          return previous.filter(
            (id) =>
              id !== topicId
          );

        }

        updateStreak();

        return [
          ...previous,
          topicId
        ];
      }
    );
  };

  // ==========================================================
  // NOTES
  // ==========================================================

  const saveNote = (
    topicId: string,
    text: string
  ) => {

    setNotes(
      (previous) => ({
        ...previous,
        [topicId]:
          text
      })
    );
  };

  // ==========================================================
  // BOOKMARKS
  // ==========================================================

  const toggleBookmark = (
    id: string,
    type:
      | "topic"
      | "project"
      | "case",
    title: string
  ) => {

    setBookmarks(
      (previous) => {

        const exists =
          previous.some(
            (bookmark) =>
              bookmark.id ===
              id
          );

        if (exists) {

          return previous.filter(
            (bookmark) =>
              bookmark.id !==
              id
          );

        }

        return [
          ...previous,
          {
            id,
            type,
            title
          }
        ];
      }
    );
  };

  const isBookmarked = (
    id: string
  ) => {

    return bookmarks.some(
      (bookmark) =>
        bookmark.id === id
    );
  };

  // ==========================================================
  // USER CONTRIBUTION
  // ==========================================================

  const addSubmission =
    async (
      sub: {
        topicId: string;
        resourceTitle: string;
        link: string;
        type: string;
        contributorName: string;
        contributorEmail: string;
        suggestedTopicTitle?: string;
        suggestedTopicDuration?: string;
        moduleId?: number;
      }
    ) => {

      const newSubmission:
        Submission = {
        ...sub,

        id:
          `sub-${Date.now()}`,

        status:
          "Pending",

        submittedAt:
          new Date().toISOString()
      };

      /*
       * DATABASE FIRST
       */

      const response =
        await fetch(
          "/api/contributions",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                newSubmission
              )
          }
        );

      if (!response.ok) {

        throw new Error(
          "Could not save contribution to database."
        );

      }

      const saved =
        await response.json();

      /*
       * Update browser cache
       */

      setSubmissions(
        (previous) => [
          saved,
          ...previous
        ]
      );
    };

  // ==========================================================
  // ADMIN APPROVE / REJECT
  // ==========================================================

  const updateSubmissionStatus =
    async (
      id: string,
      status:
        | "Approved"
        | "Rejected"
    ) => {

      const submission =
        submissions.find(
          (item) =>
            item.id === id
        );

      if (!submission)
        return;

      /*
       * IMPORTANT:
       *
       * Current application has
       * client-side admin authentication.
       */

      const username =
        window.prompt(
          "Admin username"
        );

      const password =
        window.prompt(
          "Admin password"
        );

      if (
        !username ||
        !password
      ) {
        return;
      }

      const auth =
        "Basic " +
        btoa(
          `${username}:${password}`
        );

      const response =
        await fetch(
          "/api/contributions",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                auth
            },

            body:
              JSON.stringify({
                id,
                status,
                reviewedBy:
                  user?.email ||
                  username
              })
          }
        );

      if (!response.ok) {

        let errorMessage =
          "Could not update contribution in Supabase.";

        try {
          const errorData =
            await response.json();

          if (
            errorData?.error
          ) {
            errorMessage =
              errorData.error;
          }

        } catch {}

        alert(
          errorMessage
        );

        return;
      }

      /*
       * Update local cache
       */

      setSubmissions(
        (previous) =>
          previous.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    status
                  }
                : item
          )
      );

      /*
       * If approved video,
       * save permanently.
       */

      if (
        status === "Approved" &&
        submission.type ===
          "Video"
      ) {

        const videoResponse =
          await fetch(
            "/api/topic-videos",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  auth
              },

              body:
                JSON.stringify({
                  topicId:
                    submission.topicId,

                  url:
                    submission.link,

                  adminUser: {
                    email:
                      user?.email ||
                      username
                  }
                })
            }
          );

        if (
          !videoResponse.ok
        ) {

          let errorMessage =
            "Could not save approved video to Supabase.";

          try {

            const errorData =
              await videoResponse.json();

            if (
              errorData?.error
            ) {
              errorMessage =
                errorData.error;
            }

          } catch {}

          alert(
            errorMessage
          );

          return;
        }

        setTopicVideos(
          (previous) => {

            const existing =
              previous[
                submission.topicId
              ] || [];

            if (
              existing.includes(
                submission.link
              )
            ) {
              return previous;
            }

            return {
              ...previous,

              [submission.topicId]:
                [
                  ...existing,
                  submission.link
                ]
            };
          }
        );
      }

      /*
       * If contributor suggested
       * a new topic, create it.
       */

      if (
        status === "Approved" &&
        submission.suggestedTopicTitle
      ) {

        await addTopic(
          submission.moduleId ||
            1,

          submission.suggestedTopicTitle,

          submission.suggestedTopicDuration ||
            "15 mins",

          submission.link
        );
      }
    };

  // ==========================================================
  // ADMIN CREATE TOPIC
  // ==========================================================

  const addTopic =
    async (
      moduleId: number,
      title: string,
      duration: string,
      videoUrl: string
    ) => {

      const newTopicId =
        `t-custom-${Date.now()}`;

      const newTopic = {
        id:
          newTopicId,

        moduleId,

        title,

        duration:
          duration ||
          "15 mins",

        youtubeId:
          videoUrl || "",

        notesTemplate:
          `## Lecture Notes: ${title}\n\n- Key Concept 1:\n- Key Concept 2:\n- Strategic Takeaway:\n`,

        exercise:
          "Reflect on how this concept impacts product management and list three useful execution metrics."
      };

      /*
       * Ask admin for credentials.
       */

      const username =
        window.prompt(
          "Admin username"
        );

      const password =
        window.prompt(
          "Admin password"
        );

      if (
        !username ||
        !password
      ) {
        return;
      }

      const auth =
        "Basic " +
        btoa(
          `${username}:${password}`
        );

      const response =
        await fetch(
          "/api/admin/topics",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                auth
            },

            body:
              JSON.stringify({
                ...newTopic,

                adminUser: {
                  email:
                    user?.email ||
                    username
                }
              })
          }
        );

      if (!response.ok) {

        let errorMessage =
          "Could not save topic to Supabase.";

        try {

          const errorData =
            await response.json();

          if (
            errorData?.error
          ) {
            errorMessage =
              errorData.error;
          }

        } catch {}

        alert(
          errorMessage
        );

        return;
      }

      setCustomTopics(
        (previous) => [
          ...previous,
          newTopic as any
        ]
      );

      if (videoUrl) {

        await addTopicVideo(
          newTopicId,
          videoUrl
        );
      }
    };

  // ==========================================================
  // ADD VIDEO
  // ==========================================================

  const addTopicVideo =
    async (
      topicId: string,
      url: string
    ) => {

      /*
       * Ask for admin credentials.
       *
       * The browser does NOT directly
       * write to Supabase.
       *
       * It calls:
       *
       * /api/topic-videos
       *
       * The server API uses the
       * Supabase service-role key.
       */

      const username =
        window.prompt(
          "Admin username"
        );

      const password =
        window.prompt(
          "Admin password"
        );

      if (
        !username ||
        !password
      ) {
        return;
      }

      const auth =
        "Basic " +
        btoa(
          `${username}:${password}`
        );

      const response =
        await fetch(
          "/api/topic-videos",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                auth
            },

            body:
              JSON.stringify({
                topicId,

                url,

                adminUser: {
                  email:
                    user?.email ||
                    username
                }
              })
          }
        );

      /* ======================================================
         IMPORTANT ERROR HANDLING
      ====================================================== */

      if (!response.ok) {

        let errorMessage =
          "Could not save video to Supabase.";

        try {

          const errorData =
            await response.json();

          if (
            errorData?.error
          ) {
            errorMessage =
              errorData.error;
          }

        } catch {
          // Ignore JSON parsing failure.
        }

        console.error(
          "ADD TOPIC VIDEO ERROR:",
          errorMessage
        );

        alert(
          `Could not save video to Supabase.\n\n${errorMessage}`
        );

        return;
      }

      /* ======================================================
         SUCCESS
      ====================================================== */

      const result =
        await response.json();

      console.log(
        "VIDEO SAVED TO SUPABASE:",
        result
      );

      /*
       * Update local UI immediately.
       */

      setTopicVideos(
        (previous) => {

          const existing =
            previous[
              topicId
            ] || [];

          if (
            existing.includes(
              url
            )
          ) {
            return previous;
          }

          return {
            ...previous,

            [topicId]: [
              ...existing,
              url
            ]
          };
        }
      );

      /*
       * Show success confirmation.
       */

      alert(
        "Video saved successfully to Supabase."
      );
    };

  // ==========================================================
  // REMOVE VIDEO
  // ==========================================================

  const removeTopicVideo =
    (
      topicId: string,
      index: number
    ) => {

      setTopicVideos(
        (previous) => {

          const videos =
            previous[
              topicId
            ] || [];

          return {
            ...previous,

            [topicId]:
              videos.filter(
                (_, i) =>
                  i !== index
              )
          };
        }
      );
    };

  // ==========================================================
  // PROGRESS CALCULATIONS
  // ==========================================================

  const getModuleProgress =
    (
      moduleId: number
    ) => {

      const module =
        MODULES.find(
          (item) =>
            item.id ===
            moduleId
        );

      if (!module)
        return 0;

      const moduleTopics =
        allTopics.filter(
          (topic) =>
            topic.moduleId ===
            moduleId
        );

      if (
        !moduleTopics.length
      ) {
        return 0;
      }

      const completed =
        moduleTopics.filter(
          (topic) =>
            progress.includes(
              topic.id
            )
        ).length;

      return Math.round(
        (
          completed /
          moduleTopics.length
        ) * 100
      );
    };

  const getPhaseProgress =
    (
      phaseId: number
    ) => {

      const phaseTopics =
        allTopics.filter(
          (topic) => {

            const module =
              MODULES.find(
                (item) =>
                  item.id ===
                  topic.moduleId
              );

            return (
              module?.phaseId ===
              phaseId
            );
          }
        );

      if (
        !phaseTopics.length
      ) {
        return 0;
      }

      const completed =
        phaseTopics.filter(
          (topic) =>
            progress.includes(
              topic.id
            )
        ).length;

      return Math.round(
        (
          completed /
          phaseTopics.length
        ) * 100
      );
    };

  const getOverallProgress =
    () => {

      if (
        !allTopics.length
      ) {
        return 0;
      }

      const completed =
        allTopics.filter(
          (topic) =>
            progress.includes(
              topic.id
            )
        ).length;

      return Math.round(
        (
          completed /
          allTopics.length
        ) * 100
      );
    };

  // ==========================================================
  // PROVIDER
  // ==========================================================

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

export const usePlatform =
  () => {

    const context =
      useContext(
        PlatformContext
      );

    if (!context) {

      throw new Error(
        "usePlatform must be used within PlatformProvider"
      );

    }

    return context;
  };
