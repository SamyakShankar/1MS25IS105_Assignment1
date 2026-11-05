/**
 * PaperScope – AI Research Paper Analyzer
 * Computer Science research paper analysis agent designed for third-year CS students.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInputSection } from './components/UrlInputSection';
import { LoadingProgress } from './components/LoadingProgress';
import { CoreConceptsSection } from './components/CoreConceptsSection';
import { MermaidChart } from './components/MermaidChart';
import { StudentExtensionsSection } from './components/StudentExtensionsSection';
import { PaperMetadataSection } from './components/PaperMetadataSection';
import { StudentInsightsSection } from './components/StudentInsightsSection';
import { ExportToolbar } from './components/ExportToolbar';
import { FullPaperAnalysis, SamplePaper } from './types/paper';
import { AlertCircle, FileText, Sparkles, BookOpen, ExternalLink, ArrowLeft, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<FullPaperAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [samplePapers, setSamplePapers] = useState<SamplePaper[]>([]);

  // Load sample papers on mount
  useEffect(() => {
    fetch('/api/sample-papers')
      .then((res) => res.json())
      .then((data) => {
        if (data.samples && Array.isArray(data.samples)) {
          setSamplePapers(data.samples);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch sample papers:', err);
      });
  }, []);

  // Handle URL query param on first load (e.g. ?paper=1706.03762)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paperParam = params.get('paper');
    if (paperParam) {
      handleAnalyze(paperParam);
    }
  }, []);

  const handleAnalyze = async (url: string) => {
    setError(null);
    setIsLoading(true);
    setCurrentUrl(url);

    // Update browser URL query param without reload
    const cleanId = url.replace(/^(?:https?:\/\/)?(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, '').replace(/\.pdf$/i, '');
    if (cleanId) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('paper', cleanId);
      window.history.replaceState({}, '', newUrl.toString());
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setAnalysis(data);
      // Smooth scroll down to analysis results
      setTimeout(() => {
        const dashboard = document.getElementById('analysis-dashboard');
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Paper analysis error:', err);
      setError(err.message || 'Failed to analyze research paper. Please check the arXiv URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setCurrentUrl('');
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('paper');
    window.history.replaceState({}, '', newUrl.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 pb-20">
        {/* Hero & Input Section */}
        <UrlInputSection
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          samplePapers={samplePapers}
          currentUrl={currentUrl}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <h4 className="font-bold text-rose-300 mb-1">Analysis Error</h4>
                <p className="text-slate-300 leading-relaxed">{error}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => handleAnalyze(currentUrl || '1706.03762')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Request</span>
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Progress State */}
        {isLoading && (
          <div className="px-4">
            <LoadingProgress paperUrl={currentUrl} />
          </div>
        )}

        {/* Analysis Dashboard */}
        {analysis && !isLoading && (
          <div id="analysis-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
            {/* Paper Overview Banner */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    arXiv:{analysis.paperId}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {analysis.primaryCategory}
                  </span>
                  <span className="text-xs font-mono px-2 py-1 rounded-md bg-slate-800/80 text-cyan-300">
                    Year: {analysis.metadata.year}
                  </span>
                </div>

                <a
                  href={analysis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  <span>Open on arXiv.org</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Section 1: Paper title and arXiv URL */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  Section 1 · Research Paper Overview
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight leading-tight mb-3">
                  {analysis.title}
                </h1>

                {/* Explicit arXiv URL */}
                <div className="inline-flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-indigo-300">
                  <span className="text-slate-500 font-sans font-medium">arXiv URL:</span>
                  <a
                    href={analysis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1 transition"
                  >
                    <span>{analysis.url}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-4xl font-sans leading-relaxed mt-4">
                {analysis.coreConcepts.accessibleSummary}
              </p>
            </div>

            {/* Export & Actions Toolbar */}
            <ExportToolbar analysis={analysis} onReset={handleReset} />

            {/* Section A: Core Concept Extraction */}
            <section className="scroll-mt-24">
              <CoreConceptsSection concepts={analysis.coreConcepts} />
            </section>

            {/* Section B: Architectural Flowchart (Mermaid.js) */}
            <section className="scroll-mt-24">
              <MermaidChart chartCode={analysis.mermaidDiagram} paperTitle={analysis.title} />
            </section>

            {/* Section 4: Future Work & Internship Opportunities */}
            <section className="scroll-mt-24">
              <StudentExtensionsSection
                extensions={analysis.futureWork}
                paperTitle={analysis.title}
              />
            </section>

            {/* Section 5: Metadata of Paper (Displayed at the very end of the analysis) */}
            <section className="scroll-mt-24 pt-4 border-t border-slate-800/80">
              <PaperMetadataSection
                metadata={analysis.metadata}
                paperId={analysis.paperId}
                url={analysis.url}
                title={analysis.title}
              />
            </section>
          </div>
        )}

        {/* Empty state when no paper analyzed yet */}
        {!analysis && !isLoading && !error && (
          <div className="max-w-4xl mx-auto px-4 mt-12 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">Under 300 Words</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Extracts problem statement, primary methodology, and mathematical breakthroughs without dense academic obfuscation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">Mermaid.js Flowchart</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Renders the tensor data pipeline, preprocessing, model architecture, and outputs visually with copyable Mermaid source code.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">3 Student Extensions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provides exact extensions with targeted performance metrics and recommended tech stacks for capstones & SWE internships.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            PaperScope – Computer Science Research Paper Analysis Agent for CS Undergraduates
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash & arXiv Open Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
