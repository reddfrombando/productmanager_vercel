"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import StudyCalendar from "@/components/study/StudyCalendar";

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          <div className="max-w-[1500px] mx-auto space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-primary">
                Study Calendar
              </h1>

              <p className="text-xs text-primary/50 mt-1">
                Build your own Product Management learning schedule by
                dragging phases, modules and topics onto the calendar.
              </p>
            </div>

            <StudyCalendar />
          </div>
        </main>
      </div>
    </div>
  );
}
