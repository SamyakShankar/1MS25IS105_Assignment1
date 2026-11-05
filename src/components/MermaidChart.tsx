import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  Code2,
  Eye,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  AlertTriangle,
  GitBranch,
} from 'lucide-react';

interface MermaidChartProps {
  chartCode: string;
  paperTitle?: string;
}

// Initialize mermaid once
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0b0f19',
    primaryColor: '#3730a3',
    primaryTextColor: '#f1f5f9',
    primaryBorderColor: '#6366f1',
    lineColor: '#38bdf8',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    mainBkg: '#1e1b4b',
    nodeBorder: '#6366f1',
    clusterBkg: '#0f172a',
    clusterBorder: '#334155',
    titleColor: '#e0e7ff',
  },
  flowchart: {
    curve: 'basis',
    htmlLabels: true,
    useMaxWidth: true,
  },
});

export const MermaidChart: React.FC<MermaidChartProps> = ({ chartCode, paperTitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'source'>('visual');
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      setRenderError(null);
      if (!chartCode || !chartCode.trim()) {
        setSvgContent('');
        return;
      }

      // Generate a unique clean ID
      const uniqueId = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;

      try {
        // Clean graph code
        let clean = chartCode.trim();
        clean = clean.replace(/^```(?:mermaid)?/i, '').replace(/```$/, '').trim();
        if (!clean.startsWith('graph')) {
          clean = `graph TD\n${clean}`;
        }

        const { svg } = await mermaid.render(uniqueId, clean);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn('Mermaid rendering error:', err);
        if (isMounted) {
          setRenderError(err.message || 'Syntax parsing error in generated flowchart.');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chartCode]);

  const handleCopySource = () => {
    navigator.clipboard.writeText(chartCode.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(paperTitle || 'architecture-flowchart').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, prev + 0.15));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.15));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-slate-950 border-indigo-500/50 shadow-2xl' : ''
      }`}
    >
      {/* Chart Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Architectural Flowchart
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                graph TD
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Data inputs, preprocessing, model architecture, algorithms & outputs
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Diagram</span>
            </button>
            <button
              onClick={() => setViewMode('source')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'source'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Mermaid Source</span>
            </button>
          </div>

          {/* Copy Mermaid Source Button (Explicitly requested by user) */}
          <button
            onClick={handleCopySource}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
            title="Copy Mermaid.js Source Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Source</span>
              </>
            )}
          </button>

          {/* Download SVG */}
          {viewMode === 'visual' && svgContent && (
            <button
              onClick={handleDownloadSvg}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition cursor-pointer"
              title="Download as SVG Image"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Zoom controls for visual mode */}
          {viewMode === 'visual' && (
            <div className="hidden sm:flex items-center gap-0.5 pl-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Diagram'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`p-6 overflow-auto flex-1 ${isFullscreen ? 'min-h-[500px]' : 'min-h-[360px] max-h-[620px]'}`}>
        {viewMode === 'visual' ? (
          renderError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">Mermaid Render Notice</p>
              <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
                The diagram code has complex nested tokens. You can inspect or copy the raw Mermaid source below:
              </p>
              <button
                onClick={() => setViewMode('source')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Switch to Mermaid Source Code
              </button>
            </div>
          ) : svgContent ? (
            <div
              ref={containerRef}
              className="mermaid-container flex justify-center items-center w-full min-h-[300px] transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoom})` }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex items-center justify-center py-16 text-slate-500 text-xs">
              <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mr-2" />
              Rendering architectural diagram...
            </div>
          )
        ) : (
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto leading-relaxed selection:bg-indigo-800">
              <code>{chartCode.trim()}</code>
            </pre>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Standard Mermaid.js Graph TD syntax</span>
              <button
                onClick={handleCopySource}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Notes for 3rd-Year CS Students */}
      <div className="px-5 py-2.5 border-t border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Flow: Raw Inputs &rarr; Preprocessing &rarr; Layers &rarr; Softmax/Algorithms &rarr; Output Representations</span>
        </div>
        <span className="text-slate-500 font-mono">Compatible with GitHub Markdown & Mermaid Live Editor</span>
      </div>
    </div>
  );
};
