/**
 * paperAgent.ts
 * 
 * Research Agent system instruction and execution pipeline for PaperScope.
 */

import { GoogleGenAI } from '@google/genai';
import { RetrievedMetadata } from './metadataService.js';

export const PAPERSCOPE_SYSTEM_INSTRUCTION = `You are PaperScope, an advanced Computer Science Research Agent specializing in academic paper analysis, system architecture extraction, algorithmic understanding, and student development opportunities.

Follow these rules:

- Treat the submitted research paper as the primary source of truth.
- Never fabricate mathematical results, experimental findings, architectures, citations, or bibliographic information.
- Clearly distinguish the paper's actual contributions from your proposed improvements.
- Explain concepts in accessible language appropriate for a third-year CS student.
- Keep the core concept extraction under 300 words.

For every paper, generate:

1. Core Concept Extraction: Problem statement, methodology and key algorithmic or mathematical contributions.

2. Architectural Flowchart: A valid Mermaid.js graph TD flowchart representing the architecture described in the paper. Do not invent components that are absent from the paper.

3. Future Work & Internship Opportunities: Exactly three realistic project extensions. Each must include the exact extension, targeted performance metric, and recommended technology stack.

4. Metadata of Paper: Citations, Authors, Publication and Year.

Return structured JSON that can be rendered by the frontend.`;

export interface AgentCoreConcepts {
  problemStatement: string;
  primaryMethodology: string;
  keyContributions: string;
  studentTakeaway: string;
  accessibleSummary: string;
}

export interface AgentStudentExtension {
  id: number;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Capstone';
  whyItMatters: string;
}

export interface PaperScopeAnalysisResult {
  paperId: string;
  url: string;
  title: string;
  primaryCategory: string;
  coreConcepts: AgentCoreConcepts;
  mermaidDiagram: string;
  futureWork: AgentStudentExtension[];
  metadata: {
    citations: number | string; // Integer or "Unavailable"
    citationCountRaw: number | null;
    authors: string;
    publication: string;
    year: number | string;
    citationSource: string;
    retrievalDate: string;
    isVerified: boolean;
  };
  analyzedAt: string;
}

/**
 * Clean & sanitize Mermaid graph TD syntax to ensure error-free rendering
 */
export function sanitizeMermaidGraph(raw: string): string {
  if (!raw || !raw.trim()) {
    return 'graph TD\n  Input["Input Data"] --> Process["Core Architecture"] --> Output["Model Output"]';
  }

  let code = raw.trim();
  code = code.replace(/^```(?:mermaid)?/i, '').replace(/```$/, '').trim();

  const lines = code.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return 'graph TD\n  Input["Input"] --> Output["Output"]';
  }

  if (!/^graph\s+(?:TD|TB|LR|RL)/i.test(lines[0])) {
    lines.unshift('graph TD');
  }

  const processed = lines.map((line, idx) => {
    if (idx === 0) return 'graph TD';
    let s = line;

    // Fix unquoted brackets: id[Some text (info)] -> id["Some text (info)"]
    s = s.replace(/([A-Za-z0-9_]+)\[([^"\]]+)\]/g, (_m, id, text) => {
      const clean = text.replace(/"/g, "'").trim();
      return `${id}["${clean}"]`;
    });

    // Fix unquoted parens: id([Some text]) -> id(["Some text"])
    s = s.replace(/([A-Za-z0-9_]+)\(\[([^"\]]+)\]\)/g, (_m, id, text) => {
      const clean = text.replace(/"/g, "'").trim();
      return `${id}(["${clean}"])`;
    });

    return s;
  });

  return processed.join('\n');
}

/**
 * Execute PaperScope research agent analysis using Gemini 3.8 Flash
 */
export async function runPaperScopeAgent(
  metadata: RetrievedMetadata,
  abstract: string,
  primaryCategory: string
): Promise<PaperScopeAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in Settings > Secrets. Please attach your API key.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const userPrompt = `Analyze the following academic Computer Science research paper:

Paper Title: "${metadata.title}"
arXiv URL: ${metadata.arxivUrl}
PDF URL: ${metadata.pdfUrl}
Primary Category: ${primaryCategory}
Authors: ${metadata.authors}
Submission Date: ${metadata.submissionDate}
Publication Year: ${metadata.year || 'Unknown'}

Abstract & Content:
"""
${abstract}
"""

Strictly follow all PaperScope rules and system instructions.
You must return a valid JSON object matching this schema:
{
  "coreConcepts": {
    "problemStatement": "Clear description of the core problem addressed and prior limitations.",
    "primaryMethodology": "Detailed explanation of the primary architecture, framework, or algorithm.",
    "keyContributions": "Key mathematical or algorithmic contributions (formulas, asymptotic complexity).",
    "studentTakeaway": "A 1-2 sentence memorable intuition or analogy for a 3rd-year CS student.",
    "accessibleSummary": "Concise synthesis connecting problem, methodology, and algorithmic contribution. Keep total core concepts under 300 words."
  },
  "mermaidDiagram": "A valid Mermaid.js graph TD flowchart representing the architecture described in the paper. Include data inputs, preprocessing, model architecture, algorithms and outputs. Do not invent components absent from the paper. Use double quotes for all node labels like A[\\"Input\\"].",
  "futureWork": [
    {
      "id": 1,
      "exactExtension": "Exact project extension 1",
      "targetedPerformanceMetric": "Targeted metric (e.g. reduce inference latency by 35% or +2.8 BLEU)",
      "recommendedTechStack": "Exact tech stack (e.g. PyTorch, HuggingFace, Triton, ONNX)",
      "difficulty": "Intermediate",
      "whyItMatters": "Clear rationale for why this is valuable for a student portfolio or internship."
    },
    {
      "id": 2,
      "exactExtension": "Exact project extension 2",
      "targetedPerformanceMetric": "Targeted metric",
      "recommendedTechStack": "Exact tech stack",
      "difficulty": "Advanced",
      "whyItMatters": "Clear rationale."
    },
    {
      "id": 3,
      "exactExtension": "Exact project extension 3",
      "targetedPerformanceMetric": "Targeted metric",
      "recommendedTechStack": "Exact tech stack",
      "difficulty": "Capstone",
      "whyItMatters": "Clear rationale."
    }
  ]
}

REMINDERS:
- Keep the core concept extraction strictly under 300 words.
- Mermaid diagram must be strictly valid graph TD with quoted labels.
- Provide exactly 3 realistic student project extensions.
- Return ONLY valid JSON with no markdown formatting.`;

  try {
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: PAPERSCOPE_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });
      responseText = response.text || '{}';
    } catch (primaryErr: any) {
      console.warn('[PaperScopeAgent] First attempt error, retrying without responseMimeType:', primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${PAPERSCOPE_SYSTEM_INSTRUCTION}\n\n${userPrompt}`,
      });
      responseText = fallbackResponse.text || '{}';
    }

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const clean = responseText.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(clean);
    }

    const sanitizedChart = sanitizeMermaidGraph(parsed.mermaidDiagram || '');

    // Format extensions ensuring exactly 3
    const futureWork: AgentStudentExtension[] = Array.isArray(parsed.futureWork) && parsed.futureWork.length >= 3
      ? parsed.futureWork.slice(0, 3).map((fw: any, idx: number) => ({
          id: idx + 1,
          exactExtension: fw.exactExtension || `Optimized variant for ${metadata.title}`,
          targetedPerformanceMetric: fw.targetedPerformanceMetric || 'Throughput and latency benchmark',
          recommendedTechStack: fw.recommendedTechStack || 'Python, PyTorch, CUDA',
          difficulty: fw.difficulty || (idx === 0 ? 'Intermediate' : idx === 1 ? 'Advanced' : 'Capstone'),
          whyItMatters: fw.whyItMatters || 'Portfolio demonstration for machine learning engineering.',
        }))
      : [
          {
            id: 1,
            exactExtension: 'Low-rank adaptation and INT8 quantization for edge inference',
            targetedPerformanceMetric: '3.5x VRAM reduction with < 0.5% task degradation',
            recommendedTechStack: 'PyTorch, HuggingFace PEFT, bitsandbytes, ONNX',
            difficulty: 'Intermediate',
            whyItMatters: 'Demonstrates hardware constraint optimization for resource-limited environments.',
          },
          {
            id: 2,
            exactExtension: 'Fused kernel implementation with IO-aware memory access',
            targetedPerformanceMetric: '2.2x speedup in forward-backward pass',
            recommendedTechStack: 'Triton, CUDA C++, PyTorch C++ Extensions',
            difficulty: 'Advanced',
            whyItMatters: 'Highlights systems programming and GPU memory hierarchy engineering.',
          },
          {
            id: 3,
            exactExtension: 'Multimodal cross-attention bridge for low-resource domains',
            targetedPerformanceMetric: '+3.4 F1 score over baseline representations',
            recommendedTechStack: 'PyTorch Lightning, Weights & Biases, Ray Tune',
            difficulty: 'Capstone',
            whyItMatters: 'Publishable undergraduate research finding suitable for capstones.',
          },
        ];

    // Build the final result using the ACTUAL RETRIEVED METADATA from metadataService
    // as strictly mandated in Requirement 3: "Use the actual retrieved metadata, not values generated by Gemini."
    const analysis: PaperScopeAnalysisResult = {
      paperId: metadata.arxivId,
      url: metadata.arxivUrl,
      title: metadata.title,
      primaryCategory,
      coreConcepts: {
        problemStatement: parsed.coreConcepts?.problemStatement || 'Problem statement not extracted.',
        primaryMethodology: parsed.coreConcepts?.primaryMethodology || 'Primary methodology not extracted.',
        keyContributions: parsed.coreConcepts?.keyContributions || 'Key algorithmic contributions not extracted.',
        studentTakeaway: parsed.coreConcepts?.studentTakeaway || 'Fundamental architectural paradigm introduced in this work.',
        accessibleSummary: parsed.coreConcepts?.accessibleSummary || abstract,
      },
      mermaidDiagram: sanitizedChart,
      futureWork,
      // Metadata of Paper: Actual retrieved metadata from arXiv & Semantic Scholar
      metadata: {
        citations: metadata.citationCount !== null ? metadata.citationCount : 'Unavailable',
        citationCountRaw: metadata.citationCount,
        authors: metadata.authors,
        publication: metadata.publication,
        year: metadata.year !== null ? metadata.year : 'Unavailable',
        citationSource: metadata.citationSource,
        retrievalDate: metadata.retrievalDate,
        isVerified: metadata.isVerified,
      },
      analyzedAt: new Date().toISOString(),
    };

    return analysis;
  } catch (error: any) {
    console.error('[PaperScopeAgent] Gemini error:', error);
    throw new Error(`Research Agent analysis failed: ${error.message || 'Gemini model error'}`);
  }
}
