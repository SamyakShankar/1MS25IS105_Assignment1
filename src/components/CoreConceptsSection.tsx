import React, { useState } from 'react';
import { Target, Cpu, Sigma, Lightbulb, Copy, Check, FileText } from 'lucide-react';
import { CoreConcepts } from '../types/paper';

interface CoreConceptsSectionProps {
  concepts: CoreConcepts;
}

export const CoreConceptsSection: React.FC<CoreConceptsSectionProps> = ({ concepts }) => {
  const [copied, setCopied] = useState(false);

  // Calculate total word count across the core concepts
  const fullText = `${concepts.problemStatement} ${concepts.primaryMethodology} ${concepts.keyContributions}`;
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  const handleCopyNotes = () => {
    const markdown = `## Core Concepts Summary (${wordCount} words)\n\n### 1. Problem Statement\n${concepts.problemStatement}\n\n### 2. Primary Methodology\n${concepts.primaryMethodology}\n\n### 3. Key Algorithmic Contributions\n${concepts.keyContributions}\n\n**CS Student Takeaway**: ${concepts.studentTakeaway}`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
              Core Concept Extraction
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${
                wordCount <= 300
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              {wordCount} / 300 words
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accessible, jargon-demystified synthesis designed for third-year CS students
          </p>
        </div>

        <button
          onClick={handleCopyNotes}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
          title="Copy study notes in Markdown"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Notes Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Section Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* 3rd Year CS Student Intuition Banner */}
      {concepts.studentTakeaway && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 shadow-lg flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-1">
              Third-Year CS Intuition
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {concepts.studentTakeaway}
            </p>
          </div>
        </div>
      )}

      {/* 3 Core Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Problem Statement */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800/80 shadow-lg relative flex flex-col hover:border-slate-700 transition">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Problem Statement
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans flex-1">
            {concepts.problemStatement}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Research Motivation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </div>
        </div>

        {/* 2. Primary Methodology */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800/80 shadow-lg relative flex flex-col hover:border-slate-700 transition">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Primary Methodology
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans flex-1">
            {concepts.primaryMethodology}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Proposed Architecture</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>

        {/* 3. Key Algorithmic Contributions */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800/80 shadow-lg relative flex flex-col hover:border-slate-700 transition">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sigma className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Algorithmic Breakthrough
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans flex-1">
            {concepts.keyContributions}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Mathematical Innovations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
