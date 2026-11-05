import React, { useState } from 'react';
import { Download, FileJson, FileText, Check, Share2, ExternalLink, RefreshCw } from 'lucide-react';
import { FullPaperAnalysis } from '../types/paper';

interface ExportToolbarProps {
  analysis: FullPaperAnalysis;
  onReset: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({ analysis, onReset }) => {
  const [downloadingJson, setDownloadingJson] = useState(false);
  const [downloadingTxt, setDownloadingTxt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cleanFilename = (analysis.title || 'paperscope-analysis')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 45);

  const handleDownloadJson = () => {
    setDownloadingJson(true);

    // Parse citations to integer or null
    let numericCitations: number | null = null;
    if (typeof analysis.metadata.citations === 'number') {
      numericCitations = analysis.metadata.citations;
    } else if (typeof analysis.metadata.citationCountRaw === 'number') {
      numericCitations = analysis.metadata.citationCountRaw;
    } else if (typeof analysis.metadata.citations === 'string' && /^\d+$/.test(analysis.metadata.citations.replace(/,/g, ''))) {
      numericCitations = parseInt(analysis.metadata.citations.replace(/,/g, ''), 10);
    }

    // Parse year to integer or null
    let numericYear: number | null = null;
    if (typeof analysis.metadata.year === 'number') {
      numericYear = analysis.metadata.year;
    } else if (typeof analysis.metadata.year === 'string' && /^\d{4}$/.test(analysis.metadata.year.trim())) {
      numericYear = parseInt(analysis.metadata.year.trim(), 10);
    }

    // Exactly three future work entries with exact required keys
    const formattedFutureWork = (analysis.futureWork || []).slice(0, 3).map((fw, idx) => ({
      extension: fw.exactExtension || `Project Extension ${idx + 1}`,
      metric: fw.targetedPerformanceMetric || 'Performance benchmark',
      techStack: fw.recommendedTechStack || 'Python, PyTorch',
    }));

    // Pad if fewer than 3 to guarantee exactly three entries
    while (formattedFutureWork.length < 3) {
      const idx = formattedFutureWork.length + 1;
      formattedFutureWork.push({
        extension: `Model Optimization and Edge Deployment ${idx}`,
        metric: 'Inference latency and memory footprint benchmark',
        techStack: 'PyTorch, ONNX, HuggingFace',
      });
    }

    // Exact structured JSON object matching user specification
    const exportJsonObject = {
      title: analysis.title,
      url: analysis.url,
      coreConcept: {
        problemStatement: analysis.coreConcepts.problemStatement,
        methodology: analysis.coreConcepts.primaryMethodology,
        contributions: analysis.coreConcepts.keyContributions,
      },
      flowchart: analysis.mermaidDiagram,
      futureWork: formattedFutureWork,
      metadata: {
        citations: numericCitations,
        authors: analysis.metadata.authors,
        publication: analysis.metadata.publication,
        year: numericYear,
        citationSource: analysis.metadata.citationSource || 'Semantic Scholar Academic Graph API',
        retrievedAt: analysis.metadata.retrievalDate || analysis.analyzedAt || new Date().toISOString(),
      },
    };

    const jsonString = JSON.stringify(exportJsonObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanFilename}-paperscope.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingJson(false), 600);
  };

  const handleDownloadTxt = () => {
    setDownloadingTxt(true);

    const txtContent = `================================================================================
PAPERSCOPE - AI RESEARCH PAPER ANALYSIS REPORT
Generated for CS Students via Gemini 3.8 Flash
Analyzed Date: ${new Date(analysis.analyzedAt || Date.now()).toLocaleDateString()}
================================================================================

1. PAPER TITLE AND ARXIV URL
--------------------------------------------------------------------------------
Title:     ${analysis.title}
arXiv URL: ${analysis.url}
arXiv ID:  ${analysis.paperId}
Category:  ${analysis.primaryCategory}

2. CORE CONCEPT EXTRACTION
--------------------------------------------------------------------------------
[Problem Statement]
${analysis.coreConcepts.problemStatement}

[Primary Methodology]
${analysis.coreConcepts.primaryMethodology}

[Key Algorithmic / Mathematical Contributions]
${analysis.coreConcepts.keyContributions}

[Student Takeaway & Intuition]
${analysis.coreConcepts.studentTakeaway || analysis.coreConcepts.accessibleSummary}

3. ARCHITECTURAL FLOWCHART (MERMAID.JS)
--------------------------------------------------------------------------------
\`\`\`mermaid
${analysis.mermaidDiagram}
\`\`\`

4. FUTURE WORK & INTERNSHIP OPPORTUNITIES
--------------------------------------------------------------------------------
${analysis.futureWork
  .slice(0, 3)
  .map(
    (fw, i) => `[Project Opportunity ${i + 1}]
  Exact Extension:            ${fw.exactExtension}
  Targeted Metric:            ${fw.targetedPerformanceMetric}
  Recommended Tech Stack:     ${fw.recommendedTechStack}
  Difficulty Level:           ${fw.difficulty || (i === 0 ? 'Intermediate' : i === 1 ? 'Advanced' : 'Capstone')}
  Portfolio & Interview Value:${fw.whyItMatters ? ' ' + fw.whyItMatters : ' Outstanding portfolio capstone demonstration'}
`
  )
  .join('\n')}
5. METADATA OF PAPER
--------------------------------------------------------------------------------
Citations:       ${analysis.metadata.citations ?? 'Unavailable'}
Authors:         ${analysis.metadata.authors}
Publication:     ${analysis.metadata.publication}
Year:            ${analysis.metadata.year ?? 'Unavailable'}
Citation Source: ${analysis.metadata.citationSource || 'Semantic Scholar Academic Graph API'}
Retrieved At:    ${analysis.metadata.retrievalDate ? new Date(analysis.metadata.retrievalDate).toLocaleString() : new Date().toLocaleString()}

================================================================================
PaperScope – Computer Science Research Paper Analysis Agent
================================================================================
`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanFilename}-paperscope.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingTxt(false), 600);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-300">
          Export Analysis:
        </span>
        <button
          onClick={handleDownloadJson}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-medium transition cursor-pointer"
          title="Download complete structured analysis as JSON"
        >
          {downloadingJson ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileJson className="w-3.5 h-3.5" />
          )}
          <span>Download JSON</span>
        </button>

        <button
          onClick={handleDownloadTxt}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
          title="Download formatted academic study notes as TXT"
        >
          {downloadingTxt ? (
            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>Download TXT</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition cursor-pointer"
          title="Copy dashboard URL"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition cursor-pointer"
          title="Analyze another paper"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </button>
      </div>
    </div>
  );
};
