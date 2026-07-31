"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, Shield, ArrowRight, Sparkles } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = usePlatform();
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"learner" | "admin">("learner");
  
  const [error, setError] = useState("");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Sync tab with URL search parameter if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "signup") {
      setActiveTab("signup");
    } else {
      setActiveTab("signin");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeTab === "signin") {
      if (!email || !password) {
        setError("Please enter all fields.");
        return;
      }
      // Simple credentials check
      login(name || "Learner Explorer", email, "learner");
    } else {
      if (!name || !email || !password) {
        setError("Please fill out all fields.");
        return;
      }
      setIsSigningUp(true);
      setOnboardingStep(2); // move to onboarding questionnaire
    }
  };

  const handleCompleteOnboarding = () => {
    login(name, email, "learner");
  };

  // One-click demo bypass login
  const triggerDemoLogin = () => {
    login("Redd Learner", "redd.learner@pmfoundations.com", "learner");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light relative px-6 py-12">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-cyan/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white border border-border-light rounded-2xl shadow-premium p-8 relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex items-center space-x-2 font-display text-2xl font-bold tracking-tight">
            <span className="gradient-bg flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm">P</span>
            <span className="text-primary font-bold">PM Foundations</span>
          </Link>
          <p className="text-xs text-primary/50 font-medium">
            Learn Product Management from Fundamentals to AI
          </p>
        </div>

        {onboardingStep === 1 ? (
          <>
            {/* Tabs */}
            <div className="grid grid-cols-2 bg-bg-light p-1.5 rounded-xl border border-border-light/80 text-sm font-semibold text-primary/65">
              <button
                onClick={() => {
                  setActiveTab("signin");
                  setError("");
                }}
                className={`py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "signin"
                    ? "bg-white text-primary shadow-sm"
                    : "hover:text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setError("");
                }}
                className={`py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "signup"
                    ? "bg-white text-primary shadow-sm"
                    : "hover:text-primary"
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs border border-red-200 rounded-lg p-3 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary/60">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-primary/30" />
                    <input
                      type="text"
                      placeholder="e.g. Redd"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light text-sm font-medium bg-[#F8FAFC]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary/60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-primary/30" />
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light text-sm font-medium bg-[#F8FAFC]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-primary/60">Password</label>
                  {activeTab === "signin" && (
                    <a href="#" className="text-[10px] font-bold text-accent-purple hover:underline">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary/30" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light text-sm font-medium bg-[#F8FAFC]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="gradient-bg w-full rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-95 transition-opacity flex items-center justify-center space-x-1.5 cursor-pointer mt-6"
              >
                <span>{activeTab === "signin" ? "Sign In" : "Continue to Onboarding"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-light"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-primary/30 uppercase tracking-widest">
                or use demo accounts
              </span>
              <div className="flex-grow border-t border-border-light"></div>
            </div>

            {/* Demo buttons */}
            <button
              onClick={triggerDemoLogin}
              className="w-full flex items-center justify-center space-x-2 border border-border-light/75 hover:bg-bg-light/60 transition-colors py-2.5 rounded-xl text-xs font-bold text-primary cursor-pointer shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-accent-purple animate-pulse" />
              <span>Test Learner</span>
            </button>
            
            <button
              onClick={() => {
                login("Guest User", "guest@pmfoundations.com", "learner");
              }}
              className="w-full flex items-center justify-center space-x-2 border border-dashed border-border-light/100 hover:bg-bg-light/40 transition-colors py-2.5 rounded-xl text-xs font-semibold text-primary/60 cursor-pointer"
            >
              <span>Explore as Guest</span>
            </button>
          </>
        ) : (
          /* Onboarding Questionnaire */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary">Customize your Roadmap</h3>
              <p className="text-xs text-primary/50">Help us tailor your Product Management syllabus</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/60">Current Career Role</label>
                <select
                  value="learner"
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-border-light text-sm font-semibold bg-bg-light text-primary/45 focus:outline-none"
                >
                  <option value="learner">Career Switcher (Engineer/Designer/Ops)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/60">Syllabus Preference</label>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-3 p-3 rounded-xl border border-accent-purple bg-accent-purple/5">
                    <input type="radio" defaultChecked className="mt-0.5 accent-accent-purple" />
                    <div>
                      <div className="font-bold text-primary">Standard PM Curriculum</div>
                      <div className="text-primary/60 mt-0.5">Phases 1-12. Deep dive from fundamentals to portfolios.</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-xl border border-border-light/80 hover:border-accent-purple transition-all">
                    <input type="radio" disabled className="mt-0.5" />
                    <div>
                      <div className="font-bold text-primary/40">AI-PM Accelerated Track (Coming Soon)</div>
                      <div className="text-primary/30 mt-0.5">Jump directly to Phase 7 AI Modules.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-border-light">
              <button
                onClick={() => setOnboardingStep(1)}
                className="w-1/3 border border-border-light hover:bg-bg-light/60 py-2.5 rounded-xl text-xs font-bold text-primary transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleCompleteOnboarding}
                className="w-2/3 gradient-bg hover:opacity-95 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-xs font-bold text-primary/45 uppercase tracking-widest animate-pulse">
          Loading Onboarding...
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
