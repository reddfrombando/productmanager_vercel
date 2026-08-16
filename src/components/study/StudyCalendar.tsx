"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MODULES, PHASES } from "@/data/curriculum";
import { usePlatform } from "@/context/PlatformContext";
import {
  CalendarDays,
  GripVertical,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type DragItem = {
  itemType: "phase" | "module" | "topic";
  itemId: string;
  title: string;
};

type CalendarEvent = {
  id: string;
  user_email: string;
  item_type: "phase" | "module" | "topic";
  item_id: string;
  title: string;
  scheduled_date: string;
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarDays(date: Date) {
  const first = startOfMonth(date);
  const startDay = first.getDay();

  const days: Date[] = [];

  for (let i = 0; i < startDay; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() - (startDay - i));
    days.push(d);
  }

  for (let i = 1; i <= 42 - days.length; i++) {
    const d = new Date(first);
    d.setDate(i);
    days.push(d);
  }

  return days;
}

export default function StudyCalendar() {
  const { user, allTopics } = usePlatform();

  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dragged, setDragged] = useState<DragItem | null>(null);
  const [loading, setLoading] = useState(false);

  const days = useMemo(
    () => getCalendarDays(month),
    [month]
  );

  const moduleItems = MODULES.map((module) => ({
    itemType: "module" as const,
    itemId: String(module.id),
    title: module.title
  }));

  const phaseItems = PHASES.map((phase) => ({
    itemType: "phase" as const,
    itemId: String(phase.id),
    title: phase.title
  }));

  const topicItems = allTopics.map((topic) => ({
    itemType: "topic" as const,
    itemId: topic.id,
    title: topic.title
  }));

  const loadEvents = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/calendar?userEmail=${encodeURIComponent(user.email)}`
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user?.email]);

  const createEvent = async (
    item: DragItem,
    scheduledDate: string
  ) => {
    if (!user?.email) {
      alert("Please sign in before using the study calendar.");
      return;
    }

    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: user.email,
        itemType: item.itemType,
        itemId: item.itemId,
        title: item.title,
        scheduledDate
      })
    });

    if (!response.ok) {
      alert("Could not save the calendar event.");
      return;
    }

    const created = await response.json();

    setEvents((prev) => [...prev, created]);
  };

  const moveEvent = async (
    event: CalendarEvent,
    scheduledDate: string
  ) => {
    const response = await fetch("/api/calendar", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: event.id,
        userEmail: user?.email,
        scheduledDate
      })
    });

    if (!response.ok) {
      alert("Could not move the event.");
      return;
    }

    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? {
              ...item,
              scheduled_date: scheduledDate
            }
          : item
      )
    );
  };

  const deleteEvent = async (event: CalendarEvent) => {
    const response = await fetch(
      `/api/calendar?id=${encodeURIComponent(
        event.id
      )}&userEmail=${encodeURIComponent(user?.email || "")}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      setEvents((prev) =>
        prev.filter((item) => item.id !== event.id)
      );
    }
  };

  const renderSidebarItem = (item: DragItem) => (
    <div
      key={`${item.itemType}-${item.itemId}`}
      draggable
      onDragStart={() => setDragged(item)}
      onDragEnd={() => setDragged(null)}
      className="flex items-center gap-2 p-2.5 rounded-xl border border-border-light bg-white hover:border-accent-purple hover:bg-accent-purple/5 cursor-grab active:cursor-grabbing transition-all"
    >
      <GripVertical className="h-3.5 w-3.5 text-primary/25 shrink-0" />

      <div className="min-w-0">
        <div className="text-[10px] font-bold text-primary truncate">
          {item.title}
        </div>

        <div className="text-[8px] uppercase font-bold text-primary/35">
          {item.itemType}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* -------------------------------------------------- */}
      {/* LEFT SIDE PANEL */}
      {/* -------------------------------------------------- */}

      <aside className="w-full lg:w-72 shrink-0 bg-white border border-border-light rounded-2xl shadow-premium p-4">
        <div className="mb-5">
          <h2 className="font-display text-sm font-bold text-primary flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent-purple" />
            Study Planner
          </h2>

          <p className="text-[10px] text-primary/45 mt-1">
            Drag a phase, module or topic onto a calendar date.
          </p>
        </div>

        <div className="space-y-5 max-h-[650px] overflow-y-auto pr-1">
          {/* PHASES */}

          <section>
            <h3 className="text-[9px] font-black uppercase tracking-wider text-primary/40 mb-2">
              Phases
            </h3>

            <div className="space-y-1.5">
              {phaseItems.map(renderSidebarItem)}
            </div>
          </section>

          {/* MODULES */}

          <section>
            <h3 className="text-[9px] font-black uppercase tracking-wider text-primary/40 mb-2">
              Modules
            </h3>

            <div className="space-y-1.5">
              {moduleItems.map(renderSidebarItem)}
            </div>
          </section>

          {/* TOPICS */}

          <section>
            <h3 className="text-[9px] font-black uppercase tracking-wider text-primary/40 mb-2">
              Topics
            </h3>

            <div className="space-y-1.5">
              {topicItems.map(renderSidebarItem)}
            </div>
          </section>
        </div>
      </aside>

      {/* -------------------------------------------------- */}
      {/* CALENDAR */}
      {/* -------------------------------------------------- */}

      <section className="flex-1 min-w-0 bg-white border border-border-light rounded-2xl shadow-premium overflow-hidden">
        <div className="p-4 border-b border-border-light flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-primary">
              {month.toLocaleString("default", {
                month: "long"
              })}{" "}
              {month.getFullYear()}
            </h2>

            <p className="text-[9px] text-primary/40 mt-0.5">
              {loading
                ? "Loading schedule..."
                : `${events.length} scheduled items`}
            </p>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() =>
                setMonth(
                  new Date(
                    month.getFullYear(),
                    month.getMonth() - 1,
                    1
                  )
                )
              }
              className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setMonth(new Date())}
              className="px-3 h-8 rounded-lg border border-border-light text-[9px] font-bold hover:bg-bg-light"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                setMonth(
                  new Date(
                    month.getFullYear(),
                    month.getMonth() + 1,
                    1
                  )
                )
              }
              className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* WEEK HEADER */}

        <div className="grid grid-cols-7 border-b border-border-light bg-bg-light/50">
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
          ].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-[9px] font-black uppercase tracking-wider text-primary/35"
            >
              {day}
            </div>
          ))}
        </div>

        {/* DAYS */}

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = dateKey(day);
            const dayEvents = events.filter(
              (event) => event.scheduled_date === key
            );

            const isCurrentMonth =
              day.getMonth() === month.getMonth();

            const isToday =
              key === dateKey(new Date());

            return (
              <div
                key={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();

                  if (dragged) {
                    createEvent(dragged, key);
                    setDragged(null);
                  }
                }}
                className={`min-h-[120px] border-r border-b border-border-light p-1.5 transition-colors ${
                  isCurrentMonth
                    ? "bg-white"
                    : "bg-[#F8FAFC]/50"
                } ${
                  dragged
                    ? "hover:bg-accent-purple/5"
                    : ""
                }`}
              >
                <div
                  className={`h-6 w-6 flex items-center justify-center rounded-full text-[10px] font-bold mb-1 ${
                    isToday
                      ? "bg-accent-purple text-white"
                      : isCurrentMonth
                      ? "text-primary"
                      : "text-primary/25"
                  }`}
                >
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={() => {
                        setDragged({
                          itemType: event.item_type,
                          itemId: event.item_id,
                          title: event.title
                        });
                      }}
                      onDragEnd={() => setDragged(null)}
                      className="group bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-1.5 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start gap-1">
                        <GripVertical className="h-3 w-3 text-accent-purple/40 shrink-0 mt-0.5" />

                        <div className="min-w-0 flex-1">
                          <div className="text-[8px] font-bold text-accent-purple uppercase">
                            {event.item_type}
                          </div>

                          <div className="text-[9px] font-bold text-primary leading-tight">
                            {event.title}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteEvent(event)
                          }
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
