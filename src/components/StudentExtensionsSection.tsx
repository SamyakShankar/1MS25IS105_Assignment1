import React, { useState } from 'react';
import { Rocket, Gauge, Layers, Sparkles, Check, Copy, ArrowUpRight, Award, Briefcase } from 'lucide-react';
import { StudentProjectExtension } from '../types/paper';

interface StudentExtensionsSectionProps {
  extensions: StudentProjectExtension[];
  paperTitle: string;
}

export const StudentExtensionsSection: React.FC<StudentExtensionsSectionProps> = ({
  extensions,
  paperTitle,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopySpec = (ext: StudentProjectExtension) => {
    const text = `# Project Extension: ${ext.exactExtension}
Based on: "${paperTitle}"

- Targeted Performance Metric: ${ext.targetedPerformanceMetric}
- Recommended Tech Stack: ${ext.recommendedTechStack}
- Project Level: ${ext.difficulty || 'Advanced'}
- Portfolio & Interview Value: ${ext.whyItMatters || 'Portfolio demonstration'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(ext.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight flex items-center gap-2.5">
              <span>Future Work & Internship Opportunities</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              3 Project Extensions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realistic student project extensions designed to stand out on GitHub, capstones, and engineering internships
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          <span>Resume & Portfolio Ready</span>
        </div>
      </div>

      {/* 3 Extensions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {extensions.slice(0, 3).map((ext, idx) => {
          const isCopied = copiedId === ext.id;
          const techChips = ext.recommendedTechStack.split(',').map((t) => t.trim());

          const difficultyColor =
            idx === 0
              ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
              : idx === 1
              ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
              : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

          return (
            <div
              key={ext.id || idx}
              className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition relative group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5" />
                    Extension #{ext.id || idx + 1}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${difficultyColor}`}>
                    {ext.difficulty || (idx === 0 ? 'Intermediate' : idx === 1 ? 'Advanced' : 'Capstone')}
                  </span>
                </div>

                {/* Exact Extension Title */}
                <h3 className="text-sm font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug">
                  {ext.exactExtension}
                </h3>

                {/* Targeted Performance Metric */}
                <div className="mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    Targeted Performance Metric
                  </span>
                  <p className="text-xs font-mono text-emerald-200 font-medium">
                    {ext.targetedPerformanceMetric}
                  </p>
                </div>

                {/* Recommended Technology Stack */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    Recommended Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {techChips.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/60 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why It Matters */}
                {ext.whyItMatters && (
                  <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/40 pl-2.5 my-3">
                    &ldquo;{ext.whyItMatters}&rdquo;
                  </p>
                )}
              </div>

              {/* Card Footer Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Student Blueprint</span>
                <button
                  onClick={() => handleCopySpec(ext)}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Spec Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Spec</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
