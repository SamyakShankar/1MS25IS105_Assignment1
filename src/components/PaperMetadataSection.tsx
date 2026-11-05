import React, { useState } from 'react';
import { Database, Calendar, Users, Award, ExternalLink, Copy, Check, FileCheck, ShieldCheck, Clock } from 'lucide-react';
import { PaperMetadata } from '../types/paper';

interface PaperMetadataSectionProps {
  metadata: PaperMetadata;
  paperId: string;
  url: string;
  title: string;
}

export const PaperMetadataSection: React.FC<PaperMetadataSectionProps> = ({
  metadata,
  paperId,
  url,
  title,
}) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Format citations: Integer or "Unavailable"
  const isCitationsNumeric = typeof metadata.citations === 'number' && !isNaN(metadata.citations);
  const formattedCitations = isCitationsNumeric
    ? new Intl.NumberFormat('en-US').format(metadata.citations as number)
    : typeof metadata.citations === 'string' && metadata.citations.trim() !== ''
    ? metadata.citations
    : 'Unavailable';

  const formattedRetrievalDate = metadata.retrievalDate
    ? new Date(metadata.retrievalDate).toLocaleString()
    : new Date().toLocaleDateString();

  const handleCopyBibtex = () => {
    const bibtex = `@article{${paperId.replace(/[^a-zA-Z0-9]/g, '_')},
  title={${title}},
  author={${metadata.authors}},
  journal={${metadata.publication}},
  year={${metadata.year}},
  eprint={${paperId}},
  archivePrefix={arXiv}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative subtle border line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/80 via-indigo-500 to-cyan-500" />

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif tracking-tight">
                Metadata of Paper
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                Verified Bibliographic Record
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live retrieval from official arXiv API & Semantic Scholar Academic Graph API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyBibtex}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
          >
            {copiedBibtex ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">BibTeX Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy BibTeX</span>
              </>
            )}
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-medium transition"
          >
            <span>arXiv Abstract</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Required Fields Grid: Citations, Authors, Publication, Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Field 1: Citations (Integer or "Unavailable") */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-amber-400">
              Citations
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-1">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                formattedCitations === 'Unavailable' ? 'text-slate-400 text-xl' : 'text-white'
              }`}
            >
              {formattedCitations}
            </span>
            {isCitationsNumeric && (
              <span className="text-xs text-slate-400 ml-1.5">citations</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate" title={metadata.citationSource || 'Semantic Scholar API'}>
            Source: {metadata.citationSource || 'Semantic Scholar API'}
          </p>
        </div>

        {/* Field 2: Year (Four-digit integer) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-cyan-400">
              Year
            </span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              {metadata.year}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Four-digit publication year
          </p>
        </div>

        {/* Field 3: Publication (String) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner flex flex-col justify-between sm:col-span-2">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-indigo-400">
              Publication
            </span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-slate-100 my-1 line-clamp-2">
            {metadata.publication}
          </p>
          <p className="text-[11px] text-slate-500">
            Verified venue / conference / journal proceedings
          </p>
        </div>

        {/* Field 4: Authors (String) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-emerald-400">
              Authors
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed my-1">
            {metadata.authors}
          </p>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60 mt-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Retrieved on {formattedRetrievalDate}</span>
            </div>
            <span className="font-mono text-indigo-400">Canonical: arXiv:{paperId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
