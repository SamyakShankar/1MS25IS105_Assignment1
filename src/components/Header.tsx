import React, { useState } from 'react';
import { BookOpen, Sparkles, HelpCircle, X, ExternalLink, GraduationCap, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  PaperScope
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    CS Student Edition
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Research Paper Analyzer for 3rd-Year CS Undergraduates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Powered by <strong className="text-slate-100 font-medium">Gemini 3.8 Flash</strong></span>
            </div>

            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Guide for CS Students"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>
          </div>
        </div>
      </header>

      {/* Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">PaperScope for CS Students</h3>
                <p className="text-xs text-slate-400">Designed to bridge the gap between lecture slides and top-tier research</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="font-semibold text-indigo-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Section A: Core Concept Extraction
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Breaks down the paper's core problem, methodology, and algorithmic breakthroughs in under 300 accessible words.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="font-semibold text-cyan-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Section B: Architectural Flowchart
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Renders the data inputs, preprocessing, model layers, loss functions, and outputs as an interactive Mermaid.js diagram with source code export.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Section C: Future Work & Internship Ideas
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generates 3 concrete, portfolio-worthy student extensions with targeted metrics and recommended tech stacks (PyTorch, Triton, ONNX, etc.).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="font-semibold text-amber-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Section D: Paper Metadata
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Accurate citations count, author lists, publication venue, and publication year.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
