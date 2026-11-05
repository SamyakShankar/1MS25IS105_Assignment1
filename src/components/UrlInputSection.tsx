import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { SamplePaper } from '../types/paper';

interface UrlInputSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  samplePapers: SamplePaper[];
  currentUrl: string;
}

export const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  onAnalyze,
  isLoading,
  samplePapers,
  currentUrl,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl || '');
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAndSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);

    const val = inputUrl.trim();
    if (!val) {
      setLocalError('Please enter an arXiv paper URL or ID (e.g., https://arxiv.org/abs/1706.03762).');
      return;
    }

    // Basic client validation
    const hasArxivId = /(?:arxiv\.org\/(?:abs|pdf)\/|arxiv:)?([0-9]{4}\.[0-9]{4,5}|[a-z\-]+(?:\.[A-Z]{2})?\/[0-9]{7})/i.test(val);
    if (!hasArxivId && !val.includes('1706.03762')) {
      setLocalError('Please enter a valid arXiv URL or identifier (e.g., https://arxiv.org/abs/1706.03762 or 2106.09685).');
      return;
    }

    onAnalyze(val);
  };

  const handleSelectSample = (sample: SamplePaper) => {
    const url = `https://arxiv.org/abs/${sample.id}`;
    setInputUrl(url);
    setLocalError(null);
    onAnalyze(url);
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Academic Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-5 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Undergraduate Research Paper Breakdown & Architecture Extraction</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight font-serif">
          Decode Complex Research. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200">
            Build Better Systems.
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-sans">
          Paste any <strong className="text-slate-200 font-semibold">arXiv abstract or PDF URL</strong>. PaperScope synthesizes the core algorithms in under 300 words, renders interactive Mermaid architecture flowcharts, and provides 3 realistic student project extensions.
        </p>

        {/* Input Form */}
        <form onSubmit={validateAndSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (localError) setLocalError(null);
                }}
                placeholder="Paste arXiv URL (e.g. https://arxiv.org/abs/1706.03762 or 2106.09685)"
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none py-2.5"
                disabled={isLoading}
              />
              {inputUrl && (
                <button
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="p-1 text-slate-500 hover:text-slate-300 mr-2 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/60 disabled:cursor-not-allowed text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Paper...</span>
                </>
              ) : (
                <>
                  <span>Analyze Paper</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Validation or Error Message */}
          {localError && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-lg text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError}</span>
            </div>
          )}
        </form>

        {/* Seminal Paper Quick Selector */}
        <div className="mt-8 pt-6 border-t border-slate-800/60">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Or analyze a seminal CS benchmark paper in 1 click:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {samplePapers.map((paper) => {
              const isSelected = inputUrl.includes(paper.id);
              return (
                <button
                  key={paper.id}
                  onClick={() => handleSelectSample(paper)}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                  title={`${paper.title} (${paper.year}) - ${paper.description}`}
                >
                  <span className="font-mono text-[11px] text-indigo-400 font-medium">[{paper.id}]</span>
                  <span className="font-medium truncate max-w-[170px] sm:max-w-[210px]">{paper.title}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">{paper.year}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
