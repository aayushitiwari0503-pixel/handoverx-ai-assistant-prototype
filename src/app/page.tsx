"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  Stethoscope, 
  Briefcase, 
  GraduationCap, 
  LayoutGrid, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Loader2,
  ChevronRight,
  ShieldAlert,
  ListTodo,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// --- Types ---

type HandoverContext = "healthcare" | "workplace" | "student" | "general";

interface FollowUpQuestion {
  id: string;
  question: string;
  category: string;
}

interface HandoverAnalysis {
  overview: string;
  responsibilities: string[];
  tasks: string[];
  risks: { severity: "high" | "medium"; message: string }[];
  nextActions: string[];
  confidenceScore: number;
}

type Step = "setup" | "analyzing" | "follow-up" | "generating" | "summary";

// --- Mock Data & Logic ---

const CONTEXT_CONFIG = {
  healthcare: {
    icon: Stethoscope,
    label: "Healthcare",
    description: "Shift changes, patient status, clinical handovers",
    placeholder: "Describe the patient status, meds given, upcoming vitals, and any urgent concerns...",
    sample: "Patient in room 302, John Doe, post-op day 1. Stable but needs vitals every 4h. Dr. Smith wants to be notified if BP drops below 100/60. Meds given at 2pm. Pain management started."
  },
  workplace: {
    icon: Briefcase,
    label: "Workplace",
    description: "Project status, out-of-office, task delegation",
    placeholder: "List pending tasks, blockers, deadlines, and key contacts...",
    sample: "Finalizing the Q4 marketing report. Most slides done but need Sarah to verify the budget figures in slide 12. Deadline is Thursday 5pm. Client call scheduled for tomorrow morning."
  },
  student: {
    icon: GraduationCap,
    label: "Student Project",
    description: "Group assignments, lab work, research sharing",
    placeholder: "Detail your contribution, next steps for the team, and resource locations...",
    sample: "Finished the literature review section. Still need to run the data analysis on the new survey results. All files are in the shared Drive folder under 'Drafts'. Meeting set for Friday."
  },
  general: {
    icon: LayoutGrid,
    label: "General",
    description: "Household chores, pet care, event planning",
    placeholder: "General handover details, instructions, or status updates...",
    sample: "Feeding the cat twice a day, 1 scoop each. Please water the plants in the living room on Wednesday. Keys are under the mat if the neighbor stops by."
  }
};

// Simulation helper to generate "AI" responses
const simulateAnalysis = (context: HandoverContext, text: string): { questions: FollowUpQuestion[], analysis: HandoverAnalysis } => {
  // In a real app, this would be an LLM call
  const questions: FollowUpQuestion[] = [];
  
  if (context === "healthcare") {
    if (!text.toLowerCase().includes("allergy")) {
      questions.push({ id: "q1", question: "Does the patient have any known allergies?", category: "Safety" });
    }
    if (!text.toLowerCase().includes("fluid") && !text.toLowerCase().includes("intake")) {
      questions.push({ id: "q2", question: "Is the patient on strict I/O monitoring or specific IV fluids?", category: "Clinical" });
    }
  } else if (context === "workplace") {
    if (!text.toLowerCase().includes("link") && !text.toLowerCase().includes("drive")) {
      questions.push({ id: "q1", question: "Where are the relevant project documents or dashboards located?", category: "Resources" });
    }
    if (!text.toLowerCase().includes("backup") && !text.toLowerCase().includes("contact")) {
      questions.push({ id: "q2", question: "Who is the primary point of contact if an emergency arises?", category: "Communication" });
    }
  }

  // Generic analysis generation
  const analysis: HandoverAnalysis = {
    overview: `Structured handover for ${text.length > 50 ? text.substring(0, 50) + "..." : "provided information"} in a ${context} context.`,
    responsibilities: [
      "Monitoring ongoing status",
      "Ensuring deadline compliance",
      "Coordinating with relevant stakeholders"
    ],
    tasks: [
      "Review current documentation",
      "Execute pending items mentioned in input",
      "Confirm receipt of handover"
    ],
    risks: [
      { severity: "high", message: "Potential information gap in specific procedural details." },
      { severity: "medium", message: "Dependency on external party verification." }
    ],
    nextActions: [
      "Schedule follow-up check-in",
      "Update central tracking system",
      "Verify resource access"
    ],
    confidenceScore: text.length > 100 ? 85 : 65
  };

  return { questions, analysis };
};

export default function HandoverX() {
  const [step, setStep] = useState<Step>("setup");
  const [context, setContext] = useState<HandoverContext>("general");
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<HandoverAnalysis | null>(null);

  const handleStartAnalysis = () => {
    if (!input.trim()) return;
    setStep("analyzing");
    
    // Simulate network delay
    setTimeout(() => {
      const result = simulateAnalysis(context, input);
      setQuestions(result.questions);
      setAnalysis(result.analysis);
      
      if (result.questions.length > 0) {
        setStep("follow-up");
      } else {
        setStep("generating");
        setTimeout(() => setStep("summary"), 1500);
      }
    }, 2000);
  };

  const handleFollowUpSubmit = () => {
    setStep("generating");
    // Enrich analysis with answers
    setTimeout(() => {
      if (analysis) {
        const updatedAnalysis = { ...analysis };
        updatedAnalysis.confidenceScore = Math.min(analysis.confidenceScore + 15, 100);
        Object.entries(answers).forEach(([id, answer]) => {
          const q = questions.find(q => q.id === id);
          if (q) {
            updatedAnalysis.tasks.push(`Follow-up: ${q.question} - ${answer}`);
          }
        });
        setAnalysis(updatedAnalysis);
      }
      setStep("summary");
    }, 1500);
  };

  const loadDemo = () => {
    setContext("healthcare");
    setInput(CONTEXT_CONFIG.healthcare.sample);
  };

  const reset = () => {
    setStep("setup");
    setInput("");
    setAnswers({});
    setQuestions([]);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={reset}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">HandOver<span className="text-indigo-600">X</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Templates</a>
            <Button variant="outline" size="sm" className="rounded-full" onClick={loadDemo}>
              Try Demo
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          
          {/* STEP: SETUP */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 text-sm rounded-full">
                  AI-Powered Handover Intelligence
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  Zero Information Loss. <br />
                  <span className="text-indigo-600">Seamless Transitions.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  HandOverX structures your messy notes into professional, risk-aware handover reports in seconds.
                </p>
              </div>

              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">New Handover Analysis</CardTitle>
                      <CardDescription>Select context and enter your notes below</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700" onClick={loadDemo}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Quick Demo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(Object.entries(CONTEXT_CONFIG) as [HandoverContext, typeof CONTEXT_CONFIG.healthcare][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setContext(key)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          context === key 
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" 
                            : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        <cfg.icon className={`w-6 h-6 ${context === key ? "text-indigo-600" : "text-slate-400"}`} />
                        <span className="text-xs font-semibold uppercase tracking-wider">{cfg.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">Handover Information</label>
                      <span className="text-[10px] text-slate-400 font-mono">{input.length} characters</span>
                    </div>
                    <Textarea 
                      placeholder={CONTEXT_CONFIG[context].placeholder}
                      className="min-h-[200px] resize-none border-slate-200 focus:ring-indigo-500 rounded-xl text-base p-4 leading-relaxed"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t p-6 flex justify-end items-center gap-4">
                  <p className="text-xs text-slate-400 hidden sm:block">
                    AI will analyze risks, deadlines, and dependencies.
                  </p>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 h-auto text-lg font-bold shadow-lg shadow-indigo-200"
                    disabled={!input.trim()}
                    onClick={handleStartAnalysis}
                  >
                    Analyze Handover
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* STEP: ANALYZING */}
          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 blur-2xl rounded-full opacity-20 animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">AI Engine Analyzing...</h2>
                <p className="text-slate-500">Extracting entities, checking safety protocols, and mapping dependencies.</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <Progress value={45} className="h-2" />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  <span>Context: {context}</span>
                  <span>Scanning text</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: FOLLOW UP */}
          {step === "follow-up" && (
            <motion.div
              key="follow-up"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Smart Clarification</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">One quick thing...</h2>
                <p className="text-slate-600">The AI identified potential gaps that could lead to information loss. Please clarify these points for a high-confidence handover.</p>
              </div>

              <div className="space-y-4">
                {questions.map((q) => (
                  <Card key={q.id} className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 py-3 px-4 border-b">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter bg-white">
                        {q.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <p className="font-semibold text-slate-800">{q.question}</p>
                      <Textarea 
                        placeholder="Your answer..."
                        className="bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" className="text-slate-400" onClick={() => setStep("summary")}>
                  Skip questions
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 px-8" onClick={handleFollowUpSubmit}>
                  Complete Analysis
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP: GENERATING */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                <p className="text-slate-500">Generating structured summary and risk report...</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-indigo-600"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: SUMMARY */}
          {step === "summary" && analysis && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <Badge className="bg-green-100 text-green-700 border-green-200">Analysis Verified</Badge>
                  <h2 className="text-4xl font-extrabold text-slate-900">Handover Ready</h2>
                  <p className="text-slate-500">Structured report for {context} transition.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Report
                  </Button>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Confidence Score */}
                <Card className="md:col-span-1 border-none shadow-lg bg-indigo-900 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Target className="w-24 h-24" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Confidence Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-2 pb-8">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-indigo-800"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={364.4}
                          strokeDashoffset={364.4 - (364.4 * analysis.confidenceScore) / 100}
                          className="text-indigo-400 transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-3xl font-bold">{analysis.confidenceScore}%</span>
                    </div>
                    <p className="mt-4 text-xs text-indigo-300 text-center px-4">
                      {analysis.confidenceScore > 80 ? "High reliability. Information is well-structured and complete." : "Moderate reliability. Some gaps may still exist."}
                    </p>
                  </CardContent>
                </Card>

                {/* Risks / Alerts */}
                <Card className="md:col-span-2 border-none shadow-lg bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      Critical Alerts & Risks
                    </CardTitle>
                    <Badge variant="destructive" className="rounded-full">
                      {analysis.risks.length} Detected
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.risks.map((risk, i) => (
                      <Alert key={i} variant={risk.severity === "high" ? "destructive" : "default"} className={risk.severity === "medium" ? "border-amber-200 bg-amber-50 text-amber-900" : ""}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="font-bold">{risk.severity === "high" ? "High Risk" : "Safety Warning"}</AlertTitle>
                        <AlertDescription className="text-xs">
                          {risk.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Overview & Responsibilities */}
                <Card className="border-none shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Handover Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm italic border-l-4 border-indigo-500 pl-4 bg-slate-50 py-3 rounded-r-lg">
                      "{analysis.overview}"
                    </p>
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Core Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {analysis.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <ChevronRight className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks & Actions */}
                <Card className="border-none shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Action Roadmap</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ListTodo className="w-4 h-4" />
                        Pending Tasks
                      </h4>
                      <div className="space-y-2">
                        {analysis.tasks.map((t, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group hover:bg-indigo-50 transition-colors">
                            <div className="w-5 h-5 rounded border border-slate-300 bg-white flex-shrink-0 flex items-center justify-center group-hover:border-indigo-400">
                              <CheckCircle2 className="w-3 h-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-sm text-slate-700">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Next Recommended Actions
                      </h4>
                      <div className="space-y-2">
                        {analysis.nextActions.map((a, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 border-b border-slate-100 last:border-0">
                            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px] w-6 h-6 flex items-center justify-center rounded-full p-0">
                              {i + 1}
                            </Badge>
                            <span className="text-sm text-slate-600">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col items-center justify-center py-12 border-t border-dashed border-slate-200 mt-12 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                      </div>
                    ))}
                   </div>
                   <p className="text-sm text-slate-500">Shared with 3 team members automatically.</p>
                </div>
                <Button variant="ghost" className="text-indigo-600" onClick={reset}>
                  Create another handover
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900">HandOverX</span>
          </div>
          <p className="text-slate-400 text-xs">
            © 2024 HandOverX AI. Built for the Future of Work Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
