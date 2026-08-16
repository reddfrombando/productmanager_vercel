"use client";

import React, {
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Search,
  X,
  Trash2,
  StickyNote,
  Plus,
  Minus,
} from "lucide-react";

import {
  PHASES,
  MODULES,
  TOPICS,
} from "@/data/curriculum";


/* ============================================================
   TYPES
============================================================ */

type ItemType =
  | "phase"
  | "module"
  | "topic";

type CalendarEvent = {
  id: string;
  sourceId: string;
  type: ItemType;
  title: string;
  start: string;
  end: string;
  color: string;
  note?: string;
};


/* ============================================================
   COLORS
============================================================ */

const COLORS = [
  "#7C3AED",
  "#06B6D4",
  "#F59E0B",
  "#F43F5E",
  "#10B981",
  "#3B82F6",
  "#EC4899",
  "#64748B",
];


/* ============================================================
   HELPERS
============================================================ */

function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const d = String(
    date.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
}


function parseDate(value: string) {
  const [y, m, d] =
    value.split("-").map(Number);

  return new Date(
    y,
    m - 1,
    d
  );
}


function addDays(
  date: Date,
  amount: number
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
}


function startOfWeek(
  date: Date
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() -
      result.getDay()
  );

  return result;
}


function endOfWeek(
  date: Date
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() +
      (6 - result.getDay())
  );

  return result;
}


function daysBetween(
  start: Date,
  end: Date
) {
  return Math.round(
    (
      end.getTime() -
      start.getTime()
    ) /
      86400000
  );
}


function formatDate(
  date: Date
) {
  return date.toLocaleDateString(
    "en-GB"
  );
}


function formatMonth(
  date: Date
) {
  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );
}


/* ============================================================
   COMPONENT
============================================================ */

export default function StudyCalendar() {

  const [
    currentMonth,
    setCurrentMonth,
  ] = useState(
    new Date(
      2026,
      7,
      1
    )
  );


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    expandedPhases,
    setExpandedPhases,
  ] = useState<
    Record<number, boolean>
  >({});


  const [
    expandedModules,
    setExpandedModules,
  ] = useState<
    Record<number, boolean>
  >({});


  const [
    events,
    setEvents,
  ] = useState<
    CalendarEvent[]
  >([]);


  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState<
    CalendarEvent | null
  >(null);


  const [
    dragItem,
    setDragItem,
  ] = useState<{
    sourceId: string;
    type: ItemType;
  } | null>(null);


  const [
    resizing,
    setResizing,
  ] = useState<{
    id: string;
    side: "left" | "right";
  } | null>(null);


  const [
    resizePreview,
    setResizePreview,
  ] = useState<{
    id: string;
    start: string;
    end: string;
  } | null>(null);


  const [
    noteText,
    setNoteText,
  ] = useState("");


  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    COLORS[0]
  );


  const calendarRef =
    useRef<HTMLDivElement>(
      null
    );


  /* ==========================================================
     CALENDAR DAYS
  ========================================================== */

  const calendarDays =
    useMemo(() => {

      const first =
        startOfWeek(
          new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          )
        );

      const last =
        endOfWeek(
          new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
          )
        );


      const days: Date[] = [];

      let cursor =
        new Date(first);


      while (
        cursor <= last
      ) {
        days.push(
          new Date(cursor)
        );

        cursor =
          addDays(
            cursor,
            1
          );
      }


      return days;

    }, [
      currentMonth,
    ]);


  /* ==========================================================
     WEEKS
  ========================================================== */

  const weeks =
    useMemo(() => {

      const result:
        Date[][] = [];

      for (
        let i = 0;
        i <
        calendarDays.length;
        i += 7
      ) {
        result.push(
          calendarDays.slice(
            i,
            i + 7
          )
        );
      }

      return result;

    }, [
      calendarDays,
    ]);


  /* ==========================================================
     MODULE / TOPIC HELPERS
  ========================================================== */

  const phaseModules =
    (phaseId: number) =>
      MODULES.filter(
        (module: any) =>
          Number(
            module.phaseId
          ) === phaseId
      );


  const moduleTopics =
    (moduleId: number) =>
      TOPICS.filter(
        (topic: any) =>
          Number(
            topic.moduleId
          ) === moduleId
      );


  /* ==========================================================
     SEARCH
  ========================================================== */

  const searchMatches = (
    value: string
  ) => {

    if (!search.trim())
      return true;

    return value
      .toLowerCase()
      .includes(
        search
          .toLowerCase()
          .trim()
      );

  };


  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const previousMonth =
    () => {

      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
      );

    };


  const nextMonth =
    () => {

      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
      );

    };


  /* ==========================================================
     DRAG FROM SIDEBAR
  ========================================================== */

  const handleSidebarDragStart =
    (
      event: DragEvent,
      sourceId: string,
      type: ItemType
    ) => {

      setDragItem({
        sourceId,
        type,
      });


      event.dataTransfer.effectAllowed =
        "copy";


      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          sourceId,
          type,
        })
      );

    };


  /* ==========================================================
     GET DRAGGED ITEM TITLE
  ========================================================== */

  const getSourceTitle = (
    sourceId: string,
    type: ItemType
  ) => {

    if (
      type === "phase"
    ) {

      const item =
        PHASES.find(
          (p: any) =>
            String(p.id) ===
            String(sourceId)
        );

      return item?.title ||
        "Phase";

    }


    if (
      type === "module"
    ) {

      const item =
        MODULES.find(
          (m: any) =>
            String(m.id) ===
            String(sourceId)
        );

      return item?.title ||
        "Module";

    }


    const item =
      TOPICS.find(
        (t: any) =>
          String(t.id) ===
          String(sourceId)
      );

    return item?.title ||
      "Topic";
  };


  /* ==========================================================
     DROP ON CALENDAR
  ========================================================== */

  const handleCalendarDrop =
    (
      event: DragEvent,
      day: Date
    ) => {

      event.preventDefault();


      let payload =
        dragItem;


      if (!payload) {

        try {

          payload =
            JSON.parse(
              event.dataTransfer.getData(
                "text/plain"
              )
            );

        } catch {
          return;
        }

      }


      if (!payload)
        return;


      const start =
        dateKey(day);


      const end =
        dateKey(
          addDays(
            day,
            payload.type ===
              "phase"
              ? 13
              : payload.type ===
                "module"
              ? 2
              : 0
          )
        );


      const color =
        payload.type ===
        "phase"
          ? COLORS[0]
          : payload.type ===
            "module"
          ? COLORS[1]
          : COLORS[2];


      const newEvent:
        CalendarEvent = {

        id:
          `${payload.type}-${payload.sourceId}-${Date.now()}`,

        sourceId:
          String(
            payload.sourceId
          ),

        type:
          payload.type,

        title:
          getSourceTitle(
            payload.sourceId,
            payload.type
          ),

        start,

        end,

        color,

      };


      setEvents(
        current => [
          ...current,
          newEvent,
        ]
      );


      setDragItem(
        null
      );

    };


  /* ==========================================================
     DRAG EXISTING BAR
  ========================================================== */

  const handleEventDragStart =
    (
      event: DragEvent,
      item: CalendarEvent
    ) => {

      event.stopPropagation();


      event.dataTransfer.effectAllowed =
        "move";


      event.dataTransfer.setData(
        "text/calendar-event",
        item.id
      );

    };


  /* ==========================================================
     MOVE EXISTING BAR
  ========================================================== */

  const handleEventDrop =
    (
      event: DragEvent,
      destination: Date
    ) => {

      const eventId =
        event.dataTransfer.getData(
          "text/calendar-event"
        );


      if (!eventId)
        return;


      const item =
        events.find(
          e =>
            e.id ===
            eventId
        );


      if (!item)
        return;


      const oldStart =
        parseDate(
          item.start
        );


      const oldEnd =
        parseDate(
          item.end
        );


      const duration =
        daysBetween(
          oldStart,
          oldEnd
        );


      const newStart =
        new Date(
          destination
        );


      const newEnd =
        addDays(
          newStart,
          duration
        );


      setEvents(
        current =>
          current.map(
            e =>
              e.id ===
              eventId
                ? {
                    ...e,
                    start:
                      dateKey(
                        newStart
                      ),
                    end:
                      dateKey(
                        newEnd
                      ),
                  }
                : e
          )
      );

    };


  /* ==========================================================
     RESIZE START
  ========================================================== */

  const beginResize =
    (
      event: MouseEvent,
      item: CalendarEvent,
      side:
        | "left"
        | "right"
    ) => {

      event.preventDefault();
      event.stopPropagation();


      setResizing({
        id:
          item.id,
        side,
      });


      setResizePreview({
        id:
          item.id,
        start:
          item.start,
        end:
          item.end,
      });

    };


  /* ==========================================================
     RESIZE CALCULATION
  ========================================================== */

  const handleResizeMove =
    (
      day: Date
    ) => {

      if (!resizing)
        return;


      const item =
        events.find(
          e =>
            e.id ===
            resizing.id
        );


      if (!item)
        return;


      const newDate =
        dateKey(day);


      let start =
        item.start;

      let end =
        item.end;


      if (
        resizing.side ===
        "left"
      ) {

        if (
          newDate <= end
        ) {
          start =
            newDate;
        }

      } else {

        if (
          newDate >= start
        ) {
          end =
            newDate;
        }

      }


      setResizePreview({
        id:
          item.id,
        start,
        end,
      });

    };


  /* ==========================================================
     FINISH RESIZE
  ========================================================== */

  const finishResize =
    () => {

      if (
        !resizing ||
        !resizePreview
      ) {
        return;
      }


      setEvents(
        current =>
          current.map(
            item =>
              item.id ===
              resizing.id
                ? {
                    ...item,
                    start:
                      resizePreview.start,
                    end:
                      resizePreview.end,
                  }
                : item
          )
      );


      setResizing(
        null
      );


      setResizePreview(
        null
      );

    };


  /* ==========================================================
     GLOBAL MOUSE EVENTS
  ========================================================== */

  React.useEffect(
    () => {

      if (!resizing)
        return;


      const handleMouseMove =
        (
          event: globalThis.MouseEvent
        ) => {

          const target =
            document.elementFromPoint(
              event.clientX,
              event.clientY
            );


          const cell =
            target?.closest(
              "[data-calendar-day]"
            ) as
              | HTMLElement
              | null;


          if (!cell)
            return;


          const value =
            cell.dataset.calendarDay;


          if (!value)
            return;


          handleResizeMove(
            parseDate(value)
          );

        };


      const handleMouseUp =
        () => {
          finishResize();
        };


      window.addEventListener(
        "mousemove",
        handleMouseMove
      );

      window.addEventListener(
        "mouseup",
        handleMouseUp
      );


      return () => {

        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        window.removeEventListener(
          "mouseup",
          handleMouseUp
        );

      };

    },
    [
      resizing,
      resizePreview,
      events,
    ]
  );


  /* ==========================================================
     EVENT POSITION IN WEEK
  ========================================================== */

  const getEventsForWeek =
    (
      week: Date[]
    ) => {

      const weekStart =
        week[0];

      const weekEnd =
        week[6];


      return events
        .map(
          item => {

            let start =
              parseDate(
                item.start
              );

            let end =
              parseDate(
                item.end
              );


            if (
              resizePreview?.id ===
              item.id
            ) {

              start =
                parseDate(
                  resizePreview.start
                );

              end =
                parseDate(
                  resizePreview.end
                );

            }


            if (
              end <
                weekStart ||
              start >
                weekEnd
            ) {
              return null;
            }


            const visibleStart =
              start <
              weekStart
                ? weekStart
                : start;


            const visibleEnd =
              end >
              weekEnd
                ? weekEnd
                : end;


            const startIndex =
              daysBetween(
                weekStart,
                visibleStart
              );


            const endIndex =
              daysBetween(
                weekStart,
                visibleEnd
              );


            return {
              item,
              startIndex,
              endIndex,
              start,
              end,
            };

          }
        )
        .filter(Boolean) as {
          item: CalendarEvent;
          startIndex: number;
          endIndex: number;
          start: Date;
          end: Date;
        }[];

    };


  /* ==========================================================
     OPEN EDITOR
  ========================================================== */

  const openEditor =
    (
      item: CalendarEvent
    ) => {

      setSelectedEvent(
        item
      );

      setNoteText(
        item.note || ""
      );

      setSelectedColor(
        item.color
      );

    };


  /* ==========================================================
     SAVE EDITOR
  ========================================================== */

  const saveEditor =
    () => {

      if (!selectedEvent)
        return;


      setEvents(
        current =>
          current.map(
            item =>
              item.id ===
              selectedEvent.id
                ? {
                    ...item,

                    start:
                      selectedEvent.start,

                    end:
                      selectedEvent.end,

                    color:
                      selectedColor,

                    note:
                      noteText,
                  }
                : item
          )
      );


      setSelectedEvent(
        null
      );

    };


  /* ==========================================================
     REMOVE
  ========================================================== */

  const removeEvent =
    () => {

      if (!selectedEvent)
        return;


      setEvents(
        current =>
          current.filter(
            item =>
              item.id !==
              selectedEvent.id
          )
      );


      setSelectedEvent(
        null
      );

    };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-5">

        <div className="flex items-center gap-2">

          <CalendarDays
            className="h-6 w-6 text-accent-purple"
          />

          <h1 className="text-2xl font-black text-primary">
            Study Calendar
          </h1>

        </div>


        <p className="text-xs text-primary/45 mt-1 max-w-2xl">
          Drag Phases, Modules, and Topics from
          the panel onto a day to schedule them.
          Drag a bar to move it, drag its edges
          to extend or shorten it. Click a day
          bar to edit its color or note.
        </p>

      </div>


      {/* ======================================================
          MAIN CALENDAR CARD
      ====================================================== */}

      <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-premium">

        <div className="flex">


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="w-[290px] shrink-0 border-r border-border-light bg-white">

            {/* SEARCH */}

            <div className="p-4">

              <div className="relative">

                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/30"
                />

                <input
                  value={search}
                  onChange={e =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search phases, modules, topics..."
                  className="w-full h-8 rounded-lg border border-border-light pl-9 pr-3 text-[10px] outline-none focus:ring-2 focus:ring-accent-purple/20"
                />

              </div>

            </div>


            <div className="px-4 pb-2">

              <div className="text-[8px] font-black uppercase tracking-widest text-primary/35">
                Drag an item onto the calendar
              </div>

            </div>


            {/* CURRICULUM */}

            <div className="px-3 pb-4 max-h-[700px] overflow-y-auto">

              {PHASES.map(
                (phase: any) => {

                  if (
                    !searchMatches(
                      phase.title
                    ) &&
                    !phaseModules(
                      phase.id
                    ).some(
                      (m: any) =>
                        searchMatches(
                          m.title
                        ) ||
                        moduleTopics(
                          m.id
                        ).some(
                          (t: any) =>
                            searchMatches(
                              t.title
                            )
                        )
                    )
                  ) {
                    return null;
                  }


                  const open =
                    expandedPhases[
                      phase.id
                    ];


                  return (
                    <div
                      key={
                        phase.id
                      }
                      className="mb-1"
                    >

                      {/* PHASE */}

                      <div
                        draggable
                        onDragStart={e =>
                          handleSidebarDragStart(
                            e,
                            String(
                              phase.id
                            ),
                            "phase"
                          )
                        }
                        className="group flex items-center gap-1 rounded-lg px-2 py-2 bg-purple-50 border border-purple-100 cursor-grab active:cursor-grabbing"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPhases(
                              current => ({
                                ...current,
                                [phase.id]:
                                  !current[
                                    phase.id
                                  ],
                              })
                            )
                          }
                          className="h-5 w-5 flex items-center justify-center"
                        >

                          {open ? (
                            <ChevronDown className="h-3 w-3 text-primary/50" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-primary/50" />
                          )}

                        </button>


                        <GripVertical className="h-3 w-3 text-primary/20" />


                        <div className="h-4 w-4 rounded-full bg-purple-600 flex items-center justify-center text-white text-[7px] font-black">
                          {phase.id}
                        </div>


                        <span className="text-[10px] font-black text-primary truncate flex-1">
                          {phase.title}
                        </span>

                      </div>


                      {/* MODULES */}

                      {open && (

                        <div className="ml-5 mt-1">

                          {phaseModules(
                            phase.id
                          ).map(
                            (module: any) => {

                              if (
                                search &&
                                !searchMatches(
                                  module.title
                                ) &&
                                !moduleTopics(
                                  module.id
                                ).some(
                                  (t: any) =>
                                    searchMatches(
                                      t.title
                                    )
                                )
                              ) {
                                return null;
                              }


                              const moduleOpen =
                                expandedModules[
                                  module.id
                                ];


                              return (
                                <div
                                  key={
                                    module.id
                                  }
                                >

                                  <div
                                    draggable
                                    onDragStart={e =>
                                      handleSidebarDragStart(
                                        e,
                                        String(
                                          module.id
                                        ),
                                        "module"
                                      )
                                    }
                                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-cyan-50 cursor-grab active:cursor-grabbing"
                                  >

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedModules(
                                          current => ({
                                            ...current,
                                            [module.id]:
                                              !current[
                                                module.id
                                              ],
                                          })
                                        )
                                      }
                                      className="h-5 w-5 flex items-center justify-center"
                                    >

                                      {moduleOpen ? (
                                        <ChevronDown className="h-3 w-3 text-primary/35" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 text-primary/35" />
                                      )}

                                    </button>


                                    <GripVertical className="h-3 w-3 text-primary/15" />


                                    <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />


                                    <span className="text-[9px] font-bold text-primary truncate">
                                      {module.title}
                                    </span>

                                  </div>


                                  {/* TOPICS */}

                                  {moduleOpen && (

                                    <div className="ml-8 border-l border-border-light pl-2">

                                      {moduleTopics(
                                        module.id
                                      ).map(
                                        (topic: any) => {

                                          if (
                                            search &&
                                            !searchMatches(
                                              topic.title
                                            )
                                          ) {
                                            return null;
                                          }


                                          return (
                                            <div
                                              key={
                                                topic.id
                                              }
                                              draggable
                                              onDragStart={e =>
                                                handleSidebarDragStart(
                                                  e,
                                                  String(
                                                    topic.id
                                                  ),
                                                  "topic"
                                                )
                                              }
                                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-amber-50 cursor-grab active:cursor-grabbing"
                                            >

                                              <GripVertical className="h-2.5 w-2.5 text-primary/15" />


                                              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />


                                              <span className="text-[8px] text-primary/70 truncate">
                                                {topic.title}
                                              </span>

                                            </div>
                                          );

                                        }
                                      )}

                                    </div>

                                  )}

                                </div>
                              );

                            }
                          )}

                        </div>

                      )}

                    </div>
                  );

                }
              )}

            </div>


            {/* LEGEND */}

            <div className="border-t border-border-light p-3 text-[8px] text-primary/45">

              <div className="flex gap-4">

                <span className="flex items-center gap-1">
                  <i className="w-2 h-2 rounded-full bg-purple-600" />
                  Phase
                </span>

                <span className="flex items-center gap-1">
                  <i className="w-2 h-2 rounded-full bg-cyan-500" />
                  Module
                </span>

                <span className="flex items-center gap-1">
                  <i className="w-2 h-2 rounded-full bg-amber-500" />
                  Topic
                </span>

              </div>

            </div>

          </aside>


          {/* ==================================================
              CALENDAR
          ================================================== */}

          <main
            ref={calendarRef}
            className="flex-1 min-w-0"
          >

            {/* MONTH HEADER */}

            <div className="h-16 border-b border-border-light flex items-center justify-between px-5">

              <button
                type="button"
                onClick={
                  previousMonth
                }
                className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light"
              >

                <ChevronLeft className="h-4 w-4" />

              </button>


              <div className="text-sm font-black text-primary">
                {formatMonth(
                  currentMonth
                )}
              </div>


              <button
                type="button"
                onClick={
                  nextMonth
                }
                className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light"
              >

                <ChevronRight className="h-4 w-4" />

              </button>

            </div>


            {/* WEEKDAY HEADER */}

            <div className="grid grid-cols-7 border-b border-border-light">

              {[
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT",
              ].map(
                day => (

                  <div
                    key={
                      day
                    }
                    className="h-9 flex items-center justify-center text-[8px] font-black tracking-widest text-primary/35"
                  >
                    {day}
                  </div>

                )
              )}

            </div>


            {/* ==================================================
                WEEKS
            ================================================== */}

            {weeks.map(
              (
                week,
                weekIndex
              ) => {

                const weekEvents =
                  getEventsForWeek(
                    week
                  );


                return (
                  <div
                    key={
                      weekIndex
                    }
                    className="relative"
                  >

                    {/* DATE CELLS */}

                    <div className="grid grid-cols-7">

                      {week.map(
                        day => {

                          const key =
                            dateKey(
                              day
                            );


                          const inMonth =
                            day.getMonth() ===
                            currentMonth.getMonth();


                          const today =
                            key ===
                            dateKey(
                              new Date()
                            );


                          return (
                            <div
                              key={
                                key
                              }
                              data-calendar-day={
                                key
                              }
                              onDragOver={e =>
                                e.preventDefault()
                              }
                              onDrop={e => {

                                if (
                                  e.dataTransfer.types.includes(
                                    "text/calendar-event"
                                  )
                                ) {

                                  handleEventDrop(
                                    e,
                                    day
                                  );

                                } else {

                                  handleCalendarDrop(
                                    e,
                                    day
                                  );

                                }

                              }}
                              className={`h-[108px] border-r border-b border-border-light p-2 transition-colors ${
                                !inMonth
                                  ? "bg-slate-50/60"
                                  : "bg-white"
                              } ${
                                dragItem
                                  ? "hover:bg-purple-50/50"
                                  : ""
                              }`}
                            >

                              <div
                                className={`text-[10px] font-bold ${
                                  today
                                    ? "bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    : inMonth
                                    ? "text-primary/60"
                                    : "text-primary/25"
                                }`}
                              >
                                {day.getDate()}
                              </div>

                            </div>
                          );

                        }
                      )}

                    </div>


                    {/* EVENT BARS */}

                    <div className="absolute left-0 right-0 top-0 pointer-events-none">

                      {weekEvents.map(
                        (
                          data,
                          eventIndex
                        ) => {

                          const {
                            item,
                            startIndex,
                            endIndex,
                            start,
                            end,
                          } =
                            data;


                          const visibleStart =
                            Math.max(
                              0,
                              startIndex
                            );


                          const visibleEnd =
                            Math.min(
                              6,
                              endIndex
                            );


                          const columns =
                            visibleEnd -
                            visibleStart +
                            1;


                          const left =
                            `calc(${visibleStart} * (100% / 7) + 4px)`;


                          const width =
                            `calc(${columns} * (100% / 7) - 8px)`;


                          const top =
                            31 +
                            eventIndex *
                              28;


                          return (
                            <div
                              key={
                                `${item.id}-${weekIndex}`
                              }
                              className="absolute pointer-events-auto"
                              style={{
                                left,
                                width,
                                top,
                              }}
                            >

                              <div
                                draggable
                                onDragStart={e =>
                                  handleEventDragStart(
                                    e,
                                    item
                                  )
                                }
                                onClick={() =>
                                  openEditor(
                                    item
                                  )
                                }
                                className="group relative h-5 rounded-md text-white px-2 flex items-center cursor-grab active:cursor-grabbing shadow-sm"
                                style={{
                                  backgroundColor:
                                    item.color,
                                }}
                              >

                                {/* LEFT RESIZE */}

                                <div
                                  onMouseDown={e =>
                                    beginResize(
                                      e,
                                      item,
                                      "left"
                                    )
                                  }
                                  className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-20 opacity-0 group-hover:opacity-100"
                                >
                                  <div className="h-full w-0.5 bg-white/80" />
                                </div>


                                {/* TITLE */}

                                <span className="text-[8px] font-bold truncate flex-1">
                                  {item.title}
                                </span>


                                {/* NOTE */}

                                {item.note && (
                                  <StickyNote className="h-2.5 w-2.5 ml-1 shrink-0" />
                                )}


                                {/* RIGHT RESIZE */}

                                <div
                                  onMouseDown={e =>
                                    beginResize(
                                      e,
                                      item,
                                      "right"
                                    )
                                  }
                                  className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize z-20 opacity-0 group-hover:opacity-100"
                                >
                                  <div className="h-full w-0.5 bg-white/80 ml-auto" />
                                </div>

                              </div>

                            </div>
                          );

                        }
                      )}

                    </div>

                  </div>
                );

              }
            )}

          </main>

        </div>

      </div>


      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {selectedEvent && (

        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-[390px] rounded-2xl shadow-2xl">

            {/* HEADER */}

            <div className="p-5 flex items-start justify-between">

              <div>

                <div
                  className="inline-flex px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      `${selectedEvent.color}15`,
                    color:
                      selectedEvent.color,
                  }}
                >
                  {selectedEvent.type}
                </div>


                <h3 className="text-base font-black text-primary mt-2">
                  Edit Calendar Item
                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedEvent(
                    null
                  )
                }
                className="h-7 w-7 rounded-lg hover:bg-bg-light flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>

            </div>


            <div className="px-5 pb-5 space-y-4">

              {/* TITLE */}

              <div>

                <label className="text-[8px] uppercase font-black tracking-widest text-primary/45">
                  Title
                </label>

                <input
                  value={
                    selectedEvent.title
                  }
                  onChange={e =>
                    setSelectedEvent(
                      current =>
                        current
                          ? {
                              ...current,
                              title:
                                e.target.value,
                            }
                          : null
                    )
                  }
                  className="w-full h-9 mt-1 rounded-lg border border-border-light px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-accent-purple/20"
                />

              </div>


              {/* DATES */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="text-[8px] uppercase font-black tracking-widest text-primary/45">
                    Start
                  </label>

                  <input
                    type="date"
                    value={
                      selectedEvent.start
                    }
                    onChange={e =>
                      setSelectedEvent(
                        current =>
                          current
                            ? {
                                ...current,
                                start:
                                  e.target.value,
                              }
                            : null
                      )
                    }
                    className="w-full h-9 mt-1 rounded-lg border border-border-light px-2 text-[10px] outline-none"
                  />

                </div>


                <div>

                  <label className="text-[8px] uppercase font-black tracking-widest text-primary/45">
                    End
                  </label>

                  <input
                    type="date"
                    value={
                      selectedEvent.end
                    }
                    onChange={e =>
                      setSelectedEvent(
                        current =>
                          current
                            ? {
                                ...current,
                                end:
                                  e.target.value,
                              }
                            : null
                      )
                    }
                    className="w-full h-9 mt-1 rounded-lg border border-border-light px-2 text-[10px] outline-none"
                  />

                </div>

              </div>


              {/* COLOR */}

              <div>

                <label className="text-[8px] uppercase font-black tracking-widest text-primary/45">
                  Bar Color
                </label>


                <div className="flex gap-2 mt-2">

                  {COLORS.map(
                    color => (

                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        className={`h-7 w-7 rounded-full border-2 ${
                          selectedColor ===
                          color
                            ? "border-primary"
                            : "border-white"
                        } shadow ring-1 ring-border-light`}
                        style={{
                          backgroundColor:
                            color,
                        }}
                      />

                    )
                  )}

                </div>

              </div>


              {/* NOTES */}

              <div>

                <label className="flex items-center gap-1 text-[8px] uppercase font-black tracking-widest text-primary/45">

                  <StickyNote className="h-3 w-3" />

                  Notes

                </label>


                <textarea
                  value={
                    noteText
                  }
                  onChange={e =>
                    setNoteText(
                      e.target.value
                    )
                  }
                  placeholder="Add notes for this phase, module or topic..."
                  rows={4}
                  className="w-full mt-1 rounded-lg border border-border-light p-3 text-xs resize-none outline-none focus:ring-2 focus:ring-accent-purple/20"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex items-center justify-between pt-2">

                <button
                  type="button"
                  onClick={
                    removeEvent
                  }
                  className="h-9 px-3 rounded-lg border border-red-200 text-red-500 text-[10px] font-bold flex items-center gap-1.5 hover:bg-red-50"
                >

                  <Trash2 className="h-3 w-3" />

                  Remove

                </button>


                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedEvent(
                        null
                      )
                    }
                    className="h-9 px-4 rounded-lg border border-border-light text-[10px] font-bold text-primary/60"
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    onClick={
                      saveEditor
                    }
                    className="h-9 px-4 rounded-lg bg-purple-600 text-white text-[10px] font-bold"
                  >
                    Save
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
