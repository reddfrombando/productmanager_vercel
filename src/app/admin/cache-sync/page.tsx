"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

type SyncResult = {
  success: boolean;
  message?: string;
  error?: string;
  totals?: {
    attempted: number;
    saved: number;
    verified: number;
  };
};

export default function AdminCacheSyncPage() {
  const [syncing, setSyncing] =
    useState(false);

  const [result, setResult] =
    useState<SyncResult | null>(null);

  const handleSync = async () => {
    if (syncing) return;

    setSyncing(true);
    setResult(null);

    try {
      /*
       * ======================================================
       * READ ONLY ADMIN/CATALOG CACHE
       * ======================================================
       */

      let customTopics: any[] = [];

      let submissions: any[] = [];

      let topicVideos: Record<
        string,
        string[]
      > = {};

      let calendarEvents: any[] = [];


      try {
        customTopics = JSON.parse(
          localStorage.getItem(
            "pm_custom_topics"
          ) || "[]"
        );
      } catch {
        customTopics = [];
      }


      try {
        submissions = JSON.parse(
          localStorage.getItem(
            "pm_submissions"
          ) || "[]"
        );
      } catch {
        submissions = [];
      }


      try {
        topicVideos = JSON.parse(
          localStorage.getItem(
            "pm_topic_videos"
          ) || "{}"
        );
      } catch {
        topicVideos = {};
      }


      try {
        calendarEvents = JSON.parse(
          localStorage.getItem(
            "pm_calendar_events"
          ) || "[]"
        );
      } catch {
        calendarEvents = [];
      }


      /*
       * ======================================================
       * CHECK WHETHER THERE IS ACTUALLY ANY ADMIN DATA
       * ======================================================
       */

      const videoCount =
        Object.values(
          topicVideos
        ).reduce(
          (
            total,
            videos
          ) =>
            total +
            (Array.isArray(videos)
              ? videos.length
              : 0),
          0
        );


      const totalCached =
        customTopics.length +
        submissions.length +
        videoCount +
        calendarEvents.length;


      if (totalCached === 0) {
        setResult({
          success: false,
          error:
            "No admin cache data was found in this browser. Nothing was sent to Supabase.",
          totals: {
            attempted: 0,
            saved: 0,
            verified: 0,
          },
        });

        return;
      }


      /*
       * ======================================================
       * ADMIN LOGIN
       * ======================================================
       */

      const username =
        window.prompt(
          "Enter Admin Username"
        );

      if (!username) {
        setResult({
          success: false,
          error:
            "Sync cancelled. Admin username was not entered.",
        });

        return;
      }


      const password =
        window.prompt(
          "Enter Admin Password"
        );

      if (!password) {
        setResult({
          success: false,
          error:
            "Sync cancelled. Admin password was not entered.",
        });

        return;
      }


      /*
       * ======================================================
       * BASIC AUTH
       * ======================================================
       */

      const authorization =
        "Basic " +
        window.btoa(
          `${username}:${password}`
        );


      /*
       * ======================================================
       * SEND CACHE TO SERVER
       * ======================================================
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
                authorization,
            },

            body: JSON.stringify({
              customTopics,
              submissions,
              topicVideos,
              calendarEvents,
            }),
          }
        );


      let data: SyncResult;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "The sync server returned an invalid response."
        );
      }


      /*
       * ======================================================
       * CHECK SERVER RESULT
       * ======================================================
       */

      if (
        !response.ok ||
        !data.success
      ) {
        setResult({
          success: false,

          error:
            data.error ||
            "Supabase sync failed.",

          totals:
            data.totals,
        });

        return;
      }


      /*
       * ======================================================
       * EXTRA SAFETY CHECK
       *
       * DO NOT SHOW SUCCESS UNLESS:
       *
       * attempted > 0
       * saved === attempted
       * verified === attempted
       * ======================================================
       */

      const totals =
        data.totals;


      if (
        !totals ||
        totals.attempted === 0 ||
        totals.saved !==
          totals.attempted ||
        totals.verified !==
          totals.attempted
      ) {
        setResult({
          success: false,

          error:
            "Supabase sync could not be fully verified. The data was not confirmed in the database.",

          totals,
        });

        return;
      }


      /*
       * ======================================================
       * SUCCESS
       * ======================================================
       */

      setResult({
        success: true,

        message:
          "All admin cache data was successfully added to Supabase and verified.",

        totals,
      });


    } catch (error: any) {
      console.error(
        "Admin cache sync error:",
        error
      );

      setResult({
        success: false,

        error:
          error?.message ||
          "Admin cache sync failed.",
      });

    } finally {
      setSyncing(false);
    }
  };


  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">

      <div className="w-full max-w-xl">

        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary/50 hover:text-primary mb-5"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Admin Dashboard
        </Link>


        <div className="bg-white border border-border-light rounded-3xl shadow-premium p-8">

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto h-16 w-16 rounded-2xl bg-accent-purple/10 text-accent-purple flex items-center justify-center mb-5">

              <Database className="h-8 w-8" />

            </div>


            <h1 className="font-display text-2xl font-black text-primary">
              Admin Cache Sync
            </h1>


            <p className="text-xs text-primary/50 mt-2 max-w-md mx-auto">
              Transfer admin-created data stored in this
              browser to the Supabase database.
            </p>

          </div>


          {/* ==================================================
              IDLE STATE
          ================================================== */}

          {!syncing &&
            !result && (
              <div className="mt-8">

                <button
                  type="button"
                  onClick={
                    handleSync
                  }
                  className="w-full gradient-bg text-white rounded-xl py-4 font-bold text-sm shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
                >

                  <RefreshCw className="h-4 w-4" />

                  Sync Admin Cache to Supabase

                </button>


                <p className="text-[10px] text-primary/40 text-center mt-4">
                  Only admin/catalog cache is transferred.
                  Learner progress is not touched.
                </p>

              </div>
            )}


          {/* ==================================================
              SYNCING
          ================================================== */}

          {syncing && (
            <div className="mt-8 text-center">

              <div className="mx-auto h-14 w-14 rounded-full bg-accent-purple/10 text-accent-purple flex items-center justify-center">

                <RefreshCw className="h-6 w-6 animate-spin" />

              </div>


              <h2 className="font-bold text-primary mt-5">
                Syncing...
              </h2>


              <p className="text-xs text-primary/50 mt-2">
                Sending admin cache to Supabase
                and verifying the database records.
              </p>

            </div>
          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {!syncing &&
            result?.success && (
              <div className="mt-8">

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">

                  <div className="mx-auto h-14 w-14 rounded-full bg-white text-emerald-600 flex items-center justify-center">

                    <CheckCircle2 className="h-8 w-8" />

                  </div>


                  <h2 className="text-xl font-black text-emerald-700 mt-4">
                    SYNC SUCCESSFUL
                  </h2>


                  <p className="text-xs font-semibold text-emerald-700/70 mt-2">
                    Data successfully added to
                    Supabase and verified.
                  </p>


                  {result.totals && (
                    <div className="grid grid-cols-3 gap-3 mt-6">

                      <div className="bg-white rounded-xl p-3">

                        <div className="text-lg font-black text-primary">
                          {
                            result.totals
                              .attempted
                          }
                        </div>

                        <div className="text-[8px] uppercase font-bold text-primary/40">
                          Cached
                        </div>

                      </div>


                      <div className="bg-white rounded-xl p-3">

                        <div className="text-lg font-black text-primary">
                          {
                            result.totals
                              .saved
                          }
                        </div>

                        <div className="text-[8px] uppercase font-bold text-primary/40">
                          Saved
                        </div>

                      </div>


                      <div className="bg-white rounded-xl p-3">

                        <div className="text-lg font-black text-emerald-600">
                          {
                            result.totals
                              .verified
                          }
                        </div>

                        <div className="text-[8px] uppercase font-bold text-primary/40">
                          Verified
                        </div>

                      </div>

                    </div>
                  )}

                </div>


                <button
                  type="button"
                  onClick={
                    handleSync
                  }
                  className="w-full mt-4 rounded-xl border border-border-light py-3 text-xs font-bold text-primary hover:bg-bg-light"
                >
                  Sync Again
                </button>

              </div>
            )}


          {/* ==================================================
              FAILURE
          ================================================== */}

          {!syncing &&
            result &&
            !result.success && (
              <div className="mt-8">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                  <div className="mx-auto h-14 w-14 rounded-full bg-white text-red-600 flex items-center justify-center">

                    <XCircle className="h-8 w-8" />

                  </div>


                  <h2 className="text-xl font-black text-red-700 mt-4">
                    SYNC FAILED
                  </h2>


                  <p className="text-xs font-semibold text-red-700/70 mt-2">
                    {result.error ||
                      "The admin data could not be confirmed in Supabase."}
                  </p>


                  {result.totals && (
                    <div className="grid grid-cols-3 gap-3 mt-6">

                      <div className="bg-white rounded-xl p-3">

                        <div className="text-lg font-black text-primary">
                          {
                            result.totals
                              .attempted
                          }
                        </div>

                        <div className="text-[8px] uppercase font-bold text-primary/40">
                          Cached
                        </div>

                      </div>


                      <div className="bg-white rounded-xl p-3">

                        <div className="text-lg font-black text-primary">
                          {
                            result.totals
                              .saved
                          }
                        </div>

                        <div className="text-[8px] uppercase font-bold text-primary/40">
                          Saved
                        </div>

                      </div>


                      <div className="bg-white rounded-xl p-3">

                        <div className="text-lg font-black text-red-600">
                          {
                            result.totals
                              .verified
                          }
                        </div>

                        <div className="text-[8px] uppercase font-bold text-primary/40">
                          Verified
                        </div>

                      </div>

                    </div>
                  )}

                </div>


                <button
                  type="button"
                  onClick={
                    handleSync
                  }
                  className="w-full mt-4 gradient-bg text-white rounded-xl py-3 text-xs font-bold"
                >
                  Try Sync Again
                </button>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}
