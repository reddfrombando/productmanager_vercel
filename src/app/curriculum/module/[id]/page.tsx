"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MODULES, TOPICS, PHASES } from "@/data/curriculum";
import {
  ArrowLeft,
  Clock,
  Gauge,
  BookOpen,
  Award,
  ChevronRight,
  ListChecks,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const { progress, getModuleProgress, toggleTopicCompletion, allTopics } = usePlatform();

  const moduleId = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);
  const module = MODULES.find((m) => m.id === moduleId);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!module) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h1 className="text-lg font-bold">Module Not Found</h1>
            <Link href="/curriculum" className="text-sm text-accent-purple hover:underline">
              Return to Curriculum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const phase = PHASES.find((p) => p.id === module.phaseId);
  const moduleTopics = allTopics.filter((t) => t.moduleId === module.id);
  const moduleProgress = getModuleProgress(module.id);

  // Quiz functions
  const handleAnswerSelect = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null || quizSubmitted) return;
    setQuizSubmitted(true);

    const isCorrect = selectedAnswer === module.quiz[currentQuestionIndex].answerIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);

    if (currentQuestionIndex + 1 < module.quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      if (quizScore + 1 === module.quiz.length) {
        // Trigger confetti for perfect score!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-6 max-w-5xl">
          {/* Back Navigation */}
          <Link
            href="/curriculum"
            className="inline-flex items-center space-x-1 text-xs font-bold text-primary/55 hover:text-accent-purple transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Syllabus Directory</span>
          </Link>

          {/* Module Hero banner */}
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="text-primary/45">Phase {module.phaseId}</span>
                <span className="text-primary/30">•</span>
                <span className="text-accent-purple">Module {module.id}</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-primary">
                {module.title}
              </h1>
              <p className="text-xs text-primary/65 leading-relaxed font-sans font-medium">
                {module.description}
              </p>
            </div>

            {/* Quick specifications panel */}
            <div className="bg-bg-light/80 border border-border-light/60 rounded-xl p-4 space-y-2 text-xs font-semibold text-primary/80">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-primary/50">
                  <Clock className="h-3.5 w-3.5 mr-1.5" /> Est. Time
                </span>
                <span>{module.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-primary/50">
                  <Gauge className="h-3.5 w-3.5 mr-1.5" /> Difficulty
                </span>
                <span className="text-accent-purple">{module.difficulty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-primary/50">
                  <Award className="h-3.5 w-3.5 mr-1.5" /> Completion
                </span>
                <span className="font-bold text-primary">{moduleProgress}%</span>
              </div>
              <div className="pt-2 border-t border-border-light/80">
                <div className="h-1.5 w-full rounded-full bg-border-light overflow-hidden">
                  <div
                    className="h-full bg-accent-purple rounded-full transition-all duration-500"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Topics list & Syllabus */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lecture list */}
              <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium space-y-4">
                <div className="flex items-center justify-between border-b border-border-light/60 pb-3">
                  <h3 className="font-display text-sm font-bold text-primary flex items-center space-x-1.5">
                    <BookOpen className="h-4.5 w-4.5 text-accent-purple" />
                    <span>Lectures & Concepts ({moduleTopics.length})</span>
                  </h3>
                  <span className="text-[10px] font-bold text-primary/45 uppercase">Topic Progress</span>
                </div>

                <div className="space-y-2">
                  {moduleTopics.map((topic, i) => {
                    const isCompleted = progress.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border-light/50 bg-[#F8FAFC]/40 hover:bg-[#F8FAFC] transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-4">
                          <button
                            onClick={() => toggleTopicCompletion(topic.id)}
                            className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-border-light hover:border-primary bg-white"
                            }`}
                          >
                            {isCompleted && <span className="text-[10px]">✓</span>}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-primary truncate leading-none">
                              {i + 1}. {topic.title}
                            </h4>
                            <span className="text-[9px] text-primary/40 font-medium">Est. {topic.duration} lecture</span>
                          </div>
                        </div>

                        <Link
                          href={`/curriculum/topic/${topic.id}`}
                          className="rounded-lg bg-white border border-border-light/80 hover:bg-accent-purple hover:text-white hover:border-accent-purple p-1.5 text-xs text-primary transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                          title="Play lecture video"
                        >
                          <Play className="h-3.5 w-3.5 fill-current stroke-none" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quiz card */}
              {module.quiz && module.quiz.length > 0 && (
                <div className="bg-white border border-border-light rounded-2xl p-6 shadow-premium space-y-4">
                  <div className="flex items-center justify-between border-b border-border-light/60 pb-3">
                    <h3 className="font-display text-sm font-bold text-primary flex items-center space-x-1.5">
                      <HelpCircle className="h-4.5 w-4.5 text-accent-purple" />
                      <span>Module Assessment Quiz</span>
                    </h3>
                    <span className="text-[10px] font-bold text-primary/45 uppercase">Assessment</span>
                  </div>

                  {!quizFinished ? (
                    <div className="space-y-4 font-sans">
                      {/* Progress header */}
                      <div className="flex items-center justify-between text-xs text-primary/60">
                        <span className="font-bold">Question {currentQuestionIndex + 1} of {module.quiz.length}</span>
                        <span>Score: {quizScore}</span>
                      </div>

                      {/* Question */}
                      <p className="text-xs font-bold text-primary">
                        {module.quiz[currentQuestionIndex].question}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {module.quiz[currentQuestionIndex].options.map((option, index) => {
                          let optionColor = "border-border-light hover:border-primary/30";
                          
                          if (selectedAnswer === index) {
                            optionColor = "border-accent-purple bg-accent-purple/5";
                          }

                          if (quizSubmitted) {
                            if (index === module.quiz[currentQuestionIndex].answerIndex) {
                              optionColor = "border-emerald-500 bg-emerald-500/5 text-emerald-700";
                            } else if (selectedAnswer === index) {
                              optionColor = "border-red-500 bg-red-50/60 text-red-700";
                            } else {
                              optionColor = "border-border-light opacity-50";
                            }
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              disabled={quizSubmitted}
                              className={`w-full flex items-start space-x-3 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                                !quizSubmitted && "cursor-pointer"
                              } ${optionColor}`}
                            >
                              <span className="font-bold shrink-0">{String.fromCharCode(65 + index)}.</span>
                              <span className="flex-1 leading-normal">{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {quizSubmitted && (
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-[11px] leading-relaxed text-primary/75 font-sans font-medium">
                          <span className="font-bold block text-primary mb-1">Answer explanation:</span>
                          {module.quiz[currentQuestionIndex].explanation}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end pt-2">
                        {!quizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={selectedAnswer === null}
                            className={`rounded-xl py-2 px-5 text-xs font-bold text-white shadow-sm transition-all ${
                              selectedAnswer === null
                                ? "bg-primary/40 cursor-not-allowed"
                                : "gradient-bg hover:opacity-95 cursor-pointer"
                            }`}
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="gradient-bg rounded-xl py-2 px-5 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer flex items-center space-x-1"
                          >
                            <span>
                              {currentQuestionIndex + 1 === module.quiz.length ? "Finish Quiz" : "Next Question"}
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Quiz Results */
                    <div className="text-center py-6 space-y-4 font-sans">
                      <Award className="h-12 w-12 text-accent-purple mx-auto animate-bounce" />
                      <h4 className="font-display text-base font-bold text-primary">Assessment Finished!</h4>
                      <p className="text-xs text-primary/60 max-w-xs mx-auto font-medium">
                        You scored <span className="font-bold text-primary">{quizScore} out of {module.quiz.length}</span> correct answers.
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 pt-2">
                        <button
                          onClick={handleRestartQuiz}
                          className="rounded-xl border border-border-light hover:bg-bg-light/60 px-4 py-2 text-xs font-bold text-primary transition-colors cursor-pointer"
                        >
                          Retry Assessment
                        </button>
                        <Link
                          href="/curriculum"
                          className="gradient-bg rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                        >
                          Syllabus Home
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Objectives, Prerequisites, Resources */}
            <div className="space-y-6">
              {/* Learning Objectives */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider flex items-center space-x-1">
                  <ListChecks className="h-4 w-4 text-accent-purple" />
                  <span>Learning Objectives</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-primary/80 font-sans font-medium">
                  {module.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start space-x-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-purple mt-1.5 shrink-0" />
                      <span className="leading-normal">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites & Skills */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
                <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Module Context</h3>
                
                {/* Prerequisites */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">Prerequisites</span>
                  <div className="flex flex-wrap gap-1">
                    {module.prerequisites.map((p, i) => (
                      <span
                        key={i}
                        className="bg-bg-light border border-border-light rounded px-2 py-0.5 text-[9px] font-semibold text-primary/70"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills gained */}
                <div className="space-y-1.5 pt-2 border-t border-border-light/70">
                  <span className="text-[10px] font-bold text-primary/45 uppercase tracking-wider">Takeaway Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {module.skills.map((s, i) => (
                      <span
                        key={i}
                        className="bg-accent-purple/5 border border-accent-purple/10 text-accent-purple rounded px-2 py-0.5 text-[9px] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Resources */}
              {module.resources && module.resources.length > 0 && (
                <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-4">
                  <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Reading & Resources</h3>
                  <div className="space-y-2.5">
                    {module.resources.map((res, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 group">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider">
                            {res.type}
                          </div>
                          <h4 className="text-xs font-bold text-primary truncate leading-snug group-hover:text-accent-purple transition-colors">
                            {res.title}
                          </h4>
                          {res.author && (
                            <span className="text-[9px] text-primary/50 font-medium">by {res.author}</span>
                          )}
                        </div>
                        <a
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary/30 group-hover:text-accent-purple p-1 shrink-0"
                          title="Open resource"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments / Deliverables Brief */}
              {module.assignments && module.assignments.length > 0 && (
                <div className="bg-white border border-border-light rounded-2xl p-5 shadow-premium space-y-3">
                  <h3 className="text-xs font-bold text-primary/45 uppercase tracking-wider">Applied Exercise</h3>
                  <p className="text-[11px] leading-relaxed text-primary/75 font-sans font-medium">
                    {module.assignments[0]}
                  </p>
                  <div className="pt-2 border-t border-border-light/60">
                    <Link
                      href="/projects"
                      className="text-[10px] font-bold text-accent-purple hover:underline flex items-center space-x-1"
                    >
                      <span>Explore Portfolio Templates</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
