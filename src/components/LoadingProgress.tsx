import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle, Sparkles, Cpu, BookOpen, GitFork } from 'lucide-react';

interface LoadingProgressProps {
  paperUrl: string;
}

const STAGES = [
  { id: 1, title: 'Validating arXiv URL & Canonical ID', desc: 'Parsing modern & legacy arXiv format identifiers' },
  { id: 2, title: 'Fetching arXiv Metadata & Abstract', desc: 'Connecting to export.arxiv.org Atom API feed' },
  { id: 3, title: 'Resolving Citation Index', desc: 'Retrieving bibliographic citation metrics' },
  { id: 4, title: 'Gemini 3.8 Flash Reasoning Engine', desc: 'Analyzing mathematical formulas and core methodology' },
  { id: 5, title: 'Compiling Architectural Flowchart', desc: 'Generating Mermaid.js graph TD data pipeline' },
  { id: 6, title: 'Formulating Student Project Extensions', desc: 'Tailoring 3 portfolio projects with tech stacks & metrics' },
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ paperUrl }) => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Progressively advance through stages to give transparent feedback
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STAGES.length ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min(100, Math.round((activeStep / STAGES.length) * 100));

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-3 border border-indigo-500/30 animate-pulse">
          <Cpu className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          Analyzing Research Paper
        </h3>
        <p className="text-xs text-slate-400 font-mono truncate max-w-md mx-auto">
          Target: {paperUrl}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>Synthesizing Academic Insights</span>
          <span className="font-mono text-indigo-400">{progressPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step checklist */}
      <div className="space-y-3">
        {STAGES.map((stage) => {
          const isDone = activeStep > stage.id;
          const isCurrent = activeStep === stage.id;
          const isPending = activeStep < stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3.5 p-2.5 rounded-xl transition-all border ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/40 shadow-sm'
                  : isDone
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-80'
                  : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${isCurrent ? 'text-indigo-200 font-semibold' : 'text-slate-300'}`}>
                  {stage.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Gemini 3.8 Flash is extracting core contributions & architecture flow</span>
      </div>
    </div>
  );
};
