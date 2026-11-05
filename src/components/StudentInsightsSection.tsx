import React, { useState } from 'react';
import { Terminal, Clock, HardDrive, AlertOctagon, BookOpen, Copy, Check } from 'lucide-react';
import { CSStudentInsights } from '../types/paper';

interface StudentInsightsSectionProps {
  insights: CSStudentInsights;
}

export const StudentInsightsSection: React.FC<StudentInsightsSectionProps> = ({ insights }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (!insights.sampleCodeSkeleton) return;
    navigator.clipboard.writeText(insights.sampleCodeSkeleton);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              CS Student Companion: Algorithmic Complexity & Foundations
            </h3>
            <p className="text-xs text-slate-400">
              Prerequisites, asymptotic runtime/space bounds, and tensor implementation blueprint
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Prerequisites and Bounds */}
        <div className="space-y-4">
          {/* Prerequisites */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Coursework Prerequisites
            </span>
            <ul className="space-y-1.5">
              {(insights.prerequisites || ['Linear Algebra: Matrix operations', 'Probability & Statistics', 'Algorithms & Data Structures']).map((prereq, pIdx) => (
                <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complexity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Time Complexity</span>
              </div>
              <p className="text-xs font-mono text-cyan-300 font-medium">
                {insights.algorithmicComplexity?.timeComplexity || 'O(N^2) sequence attention'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Space Complexity</span>
              </div>
              <p className="text-xs font-mono text-emerald-300 font-medium">
                {insights.algorithmicComplexity?.spaceComplexity || 'O(N^2) memory footprint'}
              </p>
            </div>
          </div>

          {/* Bottleneck Warning */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[11px] uppercase tracking-wider font-bold text-amber-300 mb-0.5">
                Primary Systems Bottleneck
              </strong>
              <span>{insights.algorithmicComplexity?.bottleneck || 'High memory bandwidth during token generation'}</span>
            </div>
          </div>
        </div>

        {/* PyTorch / Tensor Implementation Skeleton */}
        {insights.sampleCodeSkeleton && (
          <div className="flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-slate-900/60">
              <span className="text-xs font-mono text-slate-400">
                tensor_algorithm_blueprint.py
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto flex-1 leading-relaxed selection:bg-indigo-900">
              <code>{insights.sampleCodeSkeleton}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
