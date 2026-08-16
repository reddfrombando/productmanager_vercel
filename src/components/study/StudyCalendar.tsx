"use client";

import React, {
  DragEvent,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  GripVertical,
  Layers3,
  Minus,
  Plus,
  StickyNote,
  X,
} from "lucide-react";

import {
  PHASES,
  MODULES,
  TOPICS,
  type Phase,
  type Module,
  type Topic,
} from "@/data/curriculum";


/* ============================================================
   TYPES
============================================================ */

type CalendarItemType =
  | "phase"
  | "module"
  | "topic";

type CalendarItem = {
  id: string;
  type: CalendarItemType;
  title: string;

  phaseId?: number;
  moduleId?: number;

  duration?: string;

  color: string;

  startDay: number;
  endDay: number;

  note?: string;
};


type DragPayload = {
  id: string;
  type: CalendarItemType;
};


/* ============================================================
   COLORS
============================================================ */

const COLORS = [
  {
    name: "Purple",
    value: "#8B5CF6",
    soft: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    name: "Blue",
    value: "#3B82F6",
    soft: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    name: "Cyan",
    value: "#06B6D4",
    soft: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    name: "Green",
    value: "#10B981",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    name: "Orange",
    value: "#F59E0B",
    soft: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    name: "Pink",
    value: "#EC4899",
    soft: "bg-pink-50",
    border: "border-pink-200",
  },
];


/* ============================================================
   DEFAULT CALENDAR
============================================================ */

const DEFAULT_DAYS = 14;


/* ============================================================
   HELPERS
============================================================ */

function getTopic(
  topicId: string
): Topic | undefined {
  return TOPICS.find(
    (topic) =>
      topic.id === topicId
  );
}


function getModule(
  moduleId: number
): Module | undefined {
  return MODULES.find(
    (module) =>
      module.id === moduleId
  );
}


function getPhase(
  phaseId: number
): Phase | undefined {
  return PHASES.find(
    (phase) =>
      phase.id === phaseId
  );
}


function getModuleTopics(
  module: Module
) {
  return module.topics
    .map(getTopic)
    .filter(Boolean) as Topic[];
}


/* ============================================================
   COMPONENT
============================================================ */

export default function StudyCalendar() {

  const [
    numberOfDays,
    setNumberOfDays,
  ] = useState(
    DEFAULT_DAYS
  );


  const [
    activePhase,
    setActivePhase,
  ] = useState<number | null>(
    null
  );


  const [
    expandedModules,
    setExpandedModules,
  ] = useState<
    Record<number, boolean>
  >({});


  const [
    calendarItems,
    setCalendarItems,
  ] = useState<
    Record<number, CalendarItem[]>
  >({});


  const [
    draggedItem,
    setDraggedItem,
  ] = useState<
    DragPayload | null
  >(null);


  const [
    selectedItem,
    setSelectedItem,
  ] = useState<
    CalendarItem | null
  >(null);


  const [
    noteText,
    setNoteText,
  ] = useState("");


  const [
    colorPickerOpen,
    setColorPickerOpen,
  ] = useState(false);


  /* ==========================================================
     ALL MODULES GROUPED BY PHASE
  ========================================================== */

  const modulesByPhase =
    useMemo(() => {

      const map =
        new Map<
          number,
          Module[]
        >();

      MODULES.forEach(
        (module) => {

          const current =
            map.get(
              module.phaseId
            ) || [];

          current.push(
            module
          );

          map.set(
            module.phaseId,
            current
          );
        }
      );

      return map;

    }, []);


  /* ==========================================================
     TOGGLE PHASE
  ========================================================== */

  const togglePhase = (
    phaseId: number
  ) => {

    setActivePhase(
      (current) =>
        current === phaseId
          ? null
          : phaseId
    );

  };


  /* ==========================================================
     TOGGLE MODULE
  ========================================================== */

  const toggleModule = (
    moduleId: number
  ) => {

    setExpandedModules(
      (current) => ({
        ...current,

        [moduleId]:
          !current[
            moduleId
          ],
      })
    );

  };


  /* ==========================================================
     DRAG START
  ========================================================== */

  const handleDragStart = (
    event: DragEvent,
    payload: DragPayload
  ) => {

    setDraggedItem(
      payload
    );

    event.dataTransfer.effectAllowed =
      "copy";

    event.dataTransfer.setData(
      "application/json",
      JSON.stringify(
        payload
      )
    );

  };


  /* ==========================================================
     DRAG END
  ========================================================== */

  const handleDragEnd = () => {

    setDraggedItem(
      null
    );

  };


  /* ==========================================================
     DROP ON DAY
  ========================================================== */

  const handleDrop = (
    event: DragEvent,
    day: number
  ) => {

    event.preventDefault();

    let payload =
      draggedItem;

    if (!payload) {

      try {

        payload =
          JSON.parse(
            event.dataTransfer.getData(
              "application/json"
            )
          );

      } catch {
        return;
      }

    }


    if (!payload)
      return;


    let title = "";

    let duration =
      undefined;

    let phaseId:
      | number
      | undefined;

    let moduleId:
      | number
      | undefined;

    if (
      payload.type ===
      "phase"
    ) {

      const phase =
        getPhase(
          Number(
            payload.id
          )
        );

      if (!phase)
        return;

      title =
        phase.title;

      duration =
        phase.duration;

      phaseId =
        phase.id;

    }


    if (
      payload.type ===
      "module"
    ) {

      const module =
        getModule(
          Number(
            payload.id
          )
        );

      if (!module)
        return;

      title =
        module.title;

      duration =
        module.duration;

      phaseId =
        module.phaseId;

      moduleId =
        module.id;

    }


    if (
      payload.type ===
      "topic"
    ) {

      const topic =
        getTopic(
          payload.id
        );

      if (!topic)
        return;

      title =
        topic.title;

      duration =
        topic.duration;

      moduleId =
        topic.moduleId;

      const module =
        getModule(
          topic.moduleId
        );

      phaseId =
        module?.phaseId;

    }


    const newItem: CalendarItem = {

      id:
        `${payload.type}-${payload.id}-${Date.now()}`,

      type:
        payload.type,

      title,

      phaseId,

      moduleId,

      duration,

      color:
        COLORS[
          calendarItems[day]
            ?.length %
            COLORS.length
        ]?.value ||
        COLORS[0].value,

      startDay:
        day,

      endDay:
        day,

    };


    setCalendarItems(
      (current) => {

        const copy = {
          ...current,
        };

        copy[day] = [
          ...(copy[day] || []),
          newItem,
        ];

        return copy;

      }
    );


    setDraggedItem(
      null
    );

  };


  /* ==========================================================
     MOVE EXISTING CALENDAR ITEM
  ========================================================== */

  const handleCalendarItemDragStart =
    (
      event: DragEvent,
      item: CalendarItem
    ) => {

      event.stopPropagation();

      setDraggedItem({
        id:
          item.id,
        type:
          item.type,
      });

      event.dataTransfer.effectAllowed =
        "move";

      event.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          id:
            item.id,
          type:
            item.type,
        })
      );

    };


  /* ==========================================================
     REMOVE ITEM
  ========================================================== */

  const removeCalendarItem = (
    day: number,
    itemId: string
  ) => {

    setCalendarItems(
      (current) => {

        const copy = {
          ...current,
        };

        copy[day] =
          (
            copy[day] || []
          ).filter(
            (item) =>
              item.id !==
              itemId
          );

        return copy;

      }
    );


    if (
      selectedItem?.id ===
      itemId
    ) {

      setSelectedItem(
        null
      );

    }

  };


  /* ==========================================================
     OPEN NOTES
  ========================================================== */

  const openNotes = (
    item: CalendarItem
  ) => {

    setSelectedItem(
      item
    );

    setNoteText(
      item.note || ""
    );

  };


  /* ==========================================================
     SAVE NOTES
  ========================================================== */

  const saveNote = () => {

    if (!selectedItem)
      return;


    setCalendarItems(
      (current) => {

        const copy = {
          ...current,
        };


        Object.keys(
          copy
        ).forEach(
          (dayKey) => {

            const day =
              Number(
                dayKey
              );

            copy[day] =
              (
                copy[day] ||
                []
              ).map(
                (item) =>
                  item.id ===
                  selectedItem.id
                    ? {
                        ...item,
                        note:
                          noteText,
                      }
                    : item
              );

          }
        );


        return copy;

      }
    );


    setSelectedItem(
      null
    );

  };


  /* ==========================================================
     CHANGE COLOR
  ========================================================== */

  const changeItemColor = (
    color: string
  ) => {

    if (!selectedItem)
      return;


    setCalendarItems(
      (current) => {

        const copy = {
          ...current,
        };


        Object.keys(
          copy
        ).forEach(
          (dayKey) => {

            const day =
              Number(
                dayKey
              );

            copy[day] =
              (
                copy[day] ||
                []
              ).map(
                (item) =>
                  item.id ===
                  selectedItem.id
                    ? {
                        ...item,
                        color,
                      }
                    : item
              );

          }
        );


        return copy;

      }
    );


    setSelectedItem(
      (current) =>
        current
          ? {
              ...current,
              color,
            }
          : null
    );


    setColorPickerOpen(
      false
    );

  };


  /* ==========================================================
     EXTEND ITEM
  ========================================================== */

  const extendItem = (
    item: CalendarItem,
    additionalDays: number
  ) => {

    setCalendarItems(
      (current) => {

        const copy = {
          ...current,
        };


        Object.keys(
          copy
        ).forEach(
          (dayKey) => {

            const day =
              Number(
                dayKey
              );


            copy[day] =
              (
                copy[day] ||
                []
              ).map(
                (existing) => {

                  if (
                    existing.id !==
                    item.id
                  ) {
                    return existing;
                  }


                  return {
                    ...existing,

                    endDay:
                      Math.min(
                        numberOfDays,
                        Math.max(
                          existing.endDay,
                          existing.endDay +
                            additionalDays
                        )
                      ),
                  };

                }
              );

          }
        );


        return copy;

      }
    );

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="bg-white border border-border-light rounded-2xl shadow-premium overflow-hidden">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="p-5 border-b border-border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <CalendarDays className="h-5 w-5 text-accent-purple" />

            <h2 className="font-display text-lg font-black text-primary">
              Study Planner
            </h2>

          </div>


          <p className="text-[10px] text-primary/45 mt-1">
            Drag phases, modules and topics onto
            any day to build your learning plan.
          </p>

        </div>


        {/* NUMBER OF DAYS */}

        <div className="flex items-center gap-2">

          <span className="text-[9px] uppercase font-bold tracking-wider text-primary/40">
            Calendar
          </span>


          <button
            type="button"
            onClick={() =>
              setNumberOfDays(
                (days) =>
                  Math.max(
                    7,
                    days - 7
                  )
              )
            }
            className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>


          <div className="min-w-[75px] text-center">

            <div className="font-black text-sm text-primary">
              {numberOfDays}
            </div>

            <div className="text-[8px] uppercase font-bold text-primary/35">
              Days
            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setNumberOfDays(
                (days) =>
                  Math.min(
                    90,
                    days + 7
                  )
              )
            }
            className="h-8 w-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-bg-light"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

        </div>

      </div>


      {/* ======================================================
          MAIN AREA
      ====================================================== */}

      <div className="flex min-h-[650px]">


        {/* ====================================================
            LEFT SIDEBAR
        ==================================================== */}

        <aside className="w-[300px] shrink-0 border-r border-border-light bg-[#FBFCFE] overflow-y-auto">

          <div className="p-4 border-b border-border-light">

            <div className="text-[9px] uppercase font-black tracking-wider text-primary/35">
              Curriculum Library
            </div>

            <p className="text-[10px] text-primary/45 mt-1">
              Drag anything into the calendar.
            </p>

          </div>


          <div className="p-3 space-y-2">

            {PHASES.map(
              (phase) => {

                const phaseModules =
                  modulesByPhase.get(
                    phase.id
                  ) || [];


                const phaseOpen =
                  activePhase ===
                  phase.id;


                return (
                  <div
                    key={
                      phase.id
                    }
                    className="rounded-xl border border-border-light bg-white overflow-hidden"
                  >

                    {/* PHASE */}

                    <div
                      className="flex items-center gap-2 p-2.5"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          togglePhase(
                            phase.id
                          )
                        }
                        className="h-6 w-6 rounded-md hover:bg-bg-light flex items-center justify-center shrink-0"
                      >

                        {phaseOpen ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}

                      </button>


                      <div
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(
                            event,
                            {
                              id:
                                String(
                                  phase.id
                                ),
                              type:
                                "phase",
                            }
                          )
                        }
                        onDragEnd={
                          handleDragEnd
                        }
                        className="flex-1 flex items-center gap-2 cursor-grab active:cursor-grabbing"
                      >

                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{
                            backgroundColor:
                              COLORS[
                                (
                                  phase.id -
                                  1
                                ) %
                                  COLORS.length
                              ].value,
                          }}
                        >

                          <Layers3 className="h-3.5 w-3.5" />

                        </div>


                        <div className="min-w-0">

                          <div className="text-[10px] font-black text-primary truncate">
                            Phase {phase.id}
                          </div>

                          <div className="text-[9px] font-semibold text-primary/50 truncate">
                            {phase.title}
                          </div>

                        </div>

                      </div>

                    </div>


                    {/* MODULES */}

                    {phaseOpen && (

                      <div className="px-2 pb-2 space-y-1">

                        {phaseModules.map(
                          (module) => {

                            const moduleOpen =
                              !!expandedModules[
                                module.id
                              ];


                            return (
                              <div
                                key={
                                  module.id
                                }
                                className="ml-4"
                              >

                                {/* MODULE */}

                                <div
                                  className="flex items-center gap-1 rounded-lg hover:bg-bg-light"
                                >

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleModule(
                                        module.id
                                      )
                                    }
                                    className="h-6 w-6 flex items-center justify-center"
                                  >

                                    {moduleOpen ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}

                                  </button>


                                  <div
                                    draggable
                                    onDragStart={(event) =>
                                      handleDragStart(
                                        event,
                                        {
                                          id:
                                            String(
                                              module.id
                                            ),
                                          type:
                                            "module",
                                        }
                                      )
                                    }
                                    onDragEnd={
                                      handleDragEnd
                                    }
                                    className="flex-1 flex items-center gap-2 py-1.5 cursor-grab active:cursor-grabbing"
                                  >

                                    <GripVertical className="h-3 w-3 text-primary/20 shrink-0" />


                                    <div className="min-w-0">

                                      <div className="text-[9px] font-bold text-primary truncate">
                                        Module {module.id}
                                      </div>

                                      <div className="text-[8px] text-primary/45 truncate">
                                        {module.title}
                                      </div>

                                    </div>

                                  </div>

                                </div>


                                {/* TOPICS */}

                                {moduleOpen && (

                                  <div className="ml-6 mt-1 border-l border-border-light pl-2 space-y-0.5">

                                    {getModuleTopics(
                                      module
                                    ).map(
                                      (topic) => (

                                        <div
                                          key={
                                            topic.id
                                          }
                                          draggable
                                          onDragStart={(event) =>
                                            handleDragStart(
                                              event,
                                              {
                                                id:
                                                  topic.id,
                                                type:
                                                  "topic",
                                              }
                                            )
                                          }
                                          onDragEnd={
                                            handleDragEnd
                                          }
                                          className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm cursor-grab active:cursor-grabbing"
                                        >

                                          <GripVertical className="h-3 w-3 text-primary/15 group-hover:text-primary/35" />


                                          <div className="min-w-0 flex-1">

                                            <div className="text-[8px] font-semibold text-primary truncate">
                                              {topic.title}
                                            </div>

                                            <div className="flex items-center gap-1 text-[7px] text-primary/35">

                                              <Clock3 className="h-2.5 w-2.5" />

                                              {topic.duration}

                                            </div>

                                          </div>

                                        </div>

                                      )
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

        </aside>


        {/* ====================================================
            CALENDAR
        ==================================================== */}

        <main className="flex-1 overflow-x-auto">

          <div
            className="grid min-w-[1100px]"
            style={{
              gridTemplateColumns:
                `repeat(${numberOfDays}, minmax(150px, 1fr))`,
            }}
          >

            {Array.from(
              {
                length:
                  numberOfDays,
              },
              (_, index) => {

                const day =
                  index + 1;

                const items =
                  calendarItems[
                    day
                  ] || [];


                return (
                  <div
                    key={day}
                    onDragOver={(event) =>
                      event.preventDefault()
                    }
                    onDrop={(event) =>
                      handleDrop(
                        event,
                        day
                      )
                    }
                    className={`min-h-[620px] border-r border-border-light ${
                      draggedItem
                        ? "bg-accent-purple/[0.025]"
                        : ""
                    }`}
                  >

                    {/* DAY HEADER */}

                    <div className="sticky top-0 z-10 bg-white border-b border-border-light p-3">

                      <div className="text-[8px] uppercase font-black text-primary/35">
                        Day {day}
                      </div>

                      <div className="text-sm font-black text-primary mt-0.5">
                        {day}
                      </div>

                    </div>


                    {/* DROP AREA */}

                    <div className="p-2 space-y-2 min-h-[540px]">

                      {items.length ===
                        0 && (

                        <div className="h-24 border border-dashed border-border-light rounded-xl flex flex-col items-center justify-center text-center">

                          <CalendarDays className="h-4 w-4 text-primary/15" />

                          <span className="text-[8px] font-semibold text-primary/25 mt-2">
                            Drop topic here
                          </span>

                        </div>

                      )}


                      {items.map(
                        (item) => {

                          const isSelected =
                            selectedItem?.id ===
                            item.id;


                          return (
                            <div
                              key={
                                item.id
                              }
                              draggable
                              onDragStart={(event) =>
                                handleCalendarItemDragStart(
                                  event,
                                  item
                                )
                              }
                              onDragEnd={
                                handleDragEnd
                              }
                              onClick={() =>
                                setSelectedItem(
                                  item
                                )
                              }
                              className={`group relative rounded-xl border bg-white p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${
                                isSelected
                                  ? "ring-2 ring-accent-purple/20"
                                  : ""
                              }`}
                              style={{
                                borderLeft:
                                  `4px solid ${item.color}`,
                              }}
                            >

                              <div className="flex items-start gap-2">

                                <GripVertical className="h-3 w-3 text-primary/20 mt-0.5 shrink-0" />


                                <div className="min-w-0 flex-1">

                                  <div className="flex items-center gap-1 mb-1">

                                    <span
                                      className="text-[7px] uppercase font-black px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor:
                                          `${item.color}18`,
                                        color:
                                          item.color,
                                      }}
                                    >
                                      {item.type}
                                    </span>

                                  </div>


                                  <div className="text-[9px] font-black text-primary leading-snug">
                                    {item.title}
                                  </div>


                                  {item.duration && (

                                    <div className="flex items-center gap-1 mt-1 text-[7px] text-primary/40">

                                      <Clock3 className="h-2.5 w-2.5" />

                                      {item.duration}

                                    </div>

                                  )}


                                  {item.note && (

                                    <div className="flex items-center gap-1 mt-2 text-[7px] text-accent-purple font-semibold">

                                      <StickyNote className="h-2.5 w-2.5" />

                                      Note added

                                    </div>

                                  )}

                                </div>


                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    removeCalendarItem(
                                      day,
                                      item.id
                                    );
                                  }}
                                  className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded-md hover:bg-red-50 hover:text-red-500 flex items-center justify-center"
                                >

                                  <X className="h-3 w-3" />

                                </button>

                              </div>


                              {/* EXTENSION */}

                              {item.endDay >
                                item.startDay && (

                                <div className="mt-2 text-[7px] font-bold text-primary/35">

                                  Extended to Day{" "}
                                  {
                                    item.endDay
                                  }

                                </div>

                              )}

                            </div>
                          );

                        }
                      )}

                    </div>

                  </div>
                );

              }
            )}

          </div>

        </main>

      </div>


      {/* ======================================================
          ITEM DETAIL / NOTES PANEL
      ====================================================== */}

      {selectedItem && (

        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/20 backdrop-blur-sm p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border-light overflow-hidden">

            <div className="p-5 border-b border-border-light flex items-center justify-between">

              <div>

                <div className="text-[8px] uppercase font-black text-primary/35">
                  {selectedItem.type}
                </div>

                <h3 className="font-display text-base font-black text-primary mt-1">
                  {selectedItem.title}
                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedItem(
                    null
                  )
                }
                className="h-8 w-8 rounded-lg hover:bg-bg-light flex items-center justify-center"
              >

                <X className="h-4 w-4" />

              </button>

            </div>


            <div className="p-5 space-y-5">

              {/* DURATION */}

              <div>

                <label className="text-[9px] uppercase font-black tracking-wider text-primary/40">
                  Duration
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-xl bg-bg-light p-3">

                  <Clock3 className="h-4 w-4 text-accent-purple" />

                  <span className="text-xs font-bold text-primary">
                    {selectedItem.duration ||
                      "Flexible"}
                  </span>

                </div>

              </div>


              {/* EXTEND */}

              <div>

                <label className="text-[9px] uppercase font-black tracking-wider text-primary/40">
                  Extend Schedule
                </label>

                <div className="grid grid-cols-3 gap-2 mt-2">

                  {[1, 2, 3].map(
                    (days) => (

                      <button
                        key={
                          days
                        }
                        type="button"
                        onClick={() =>
                          extendItem(
                            selectedItem,
                            days
                          )
                        }
                        className="rounded-xl border border-border-light py-2 text-[9px] font-bold hover:bg-bg-light"
                      >
                        +{days} day
                        {days >
                        1
                          ? "s"
                          : ""}
                      </button>

                    )
                  )}

                </div>

              </div>


              {/* COLOR */}

              <div>

                <div className="flex items-center justify-between">

                  <label className="text-[9px] uppercase font-black tracking-wider text-primary/40">
                    Color
                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      setColorPickerOpen(
                        (open) =>
                          !open
                      )
                    }
                    className="text-[9px] font-bold text-accent-purple"
                  >
                    Change
                  </button>

                </div>


                {colorPickerOpen && (

                  <div className="flex flex-wrap gap-2 mt-3">

                    {COLORS.map(
                      (color) => (

                        <button
                          key={
                            color.name
                          }
                          type="button"
                          onClick={() =>
                            changeItemColor(
                              color.value
                            )
                          }
                          title={
                            color.name
                          }
                          className="h-8 w-8 rounded-full border-2 border-white shadow ring-1 ring-border-light"
                          style={{
                            backgroundColor:
                              color.value,
                          }}
                        />

                      )
                    )}

                  </div>

                )}

              </div>


              {/* NOTES */}

              <div>

                <label className="flex items-center gap-1 text-[9px] uppercase font-black tracking-wider text-primary/40">

                  <FileText className="h-3 w-3" />

                  Notes

                </label>


                <textarea
                  value={
                    noteText
                  }
                  onChange={(event) =>
                    setNoteText(
                      event.target.value
                    )
                  }
                  placeholder="Add your own notes for this study item..."
                  rows={5}
                  className="w-full mt-2 rounded-xl border border-border-light p-3 text-xs outline-none focus:ring-2 focus:ring-accent-purple/20 resize-none"
                />

              </div>


              <button
                type="button"
                onClick={
                  saveNote
                }
                className="w-full gradient-bg text-white rounded-xl py-3 text-xs font-bold"
              >
                Save Notes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
