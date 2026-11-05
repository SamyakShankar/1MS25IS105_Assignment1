import { GoogleGenAI } from '@google/genai';
import { ArxivMetadata } from './arxivService.js';
import { CitationMetadata } from './citationService.js';

export interface CoreConceptExtraction {
  problemStatement: string;
  primaryMethodology: string;
  keyContributions: string;
  studentTakeaway: string;
  accessibleSummary: string;
}

export interface StudentProjectExtension {
  id: number;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string;
  difficulty?: 'Intermediate' | 'Advanced' | 'Capstone';
  whyItMatters?: string;
}

export interface PaperMetadataSection {
  citations: number;
  authors: string;
  publication: string;
  year: number;
}

export interface CSStudentInsights {
  prerequisites: string[];
  algorithmicComplexity: {
    timeComplexity: string;
    spaceComplexity: string;
    bottleneck: string;
  };
  sampleCodeSkeleton?: string;
}

export interface FullPaperAnalysis {
  paperId: string;
  url: string;
  title: string;
  primaryCategory: string;
  coreConcepts: CoreConceptExtraction;
  mermaidDiagram: string;
  futureWork: StudentProjectExtension[];
  metadata: PaperMetadataSection;
  studentInsights: CSStudentInsights;
  analyzedAt: string;
}

/**
 * Initializes GoogleGenAI client with standard aistudio-build telemetry header
 */
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment. Please configure it in Settings > Secrets.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Cleans and sanitizes Mermaid.js syntax to guarantee flawless rendering.
 */
export function sanitizeMermaidGraph(raw: string): string {
  if (!raw) return 'graph TD\n  Start["Input Data"] --> End["Output"]';

  // Remove markdown code block markers
  let code = raw.trim();
  code = code.replace(/^```(?:mermaid)?/i, '');
  code = code.replace(/```$/, '');
  code = code.trim();

  // Ensure graph TD header exists
  const lines = code.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return 'graph TD\n  A["Input"] --> B["Processing"] --> C["Output"]';
  }

  // If first line isn't graph TD or similar, prepend graph TD
  if (!/^graph\s+(?:TD|TB|LR|RL)/i.test(lines[0])) {
    lines.unshift('graph TD');
  }

  // Sanitize individual node definitions to prevent unescaped brackets or symbols
  const processedLines = lines.map((line, idx) => {
    if (idx === 0) return 'graph TD';
    
    // If line has node label with square brackets like id[Some text (with parens)]
    // Convert to id["Some text (with parens)"] if not already quoted
    let sanitized = line;

    // Pattern: NodeID[Unquoted Text] -> NodeID["Quoted Text"]
    sanitized = sanitized.replace(/([A-Za-z0-9_]+)\[([^"\]]+)\]/g, (_match, id, text) => {
      // Clean inner quotes
      const cleanText = text.replace(/"/g, "'").trim();
      return `${id}["${cleanText}"]`;
    });

    // Pattern: NodeID([Unquoted Text]) -> NodeID(["Quoted Text"])
    sanitized = sanitized.replace(/([A-Za-z0-9_]+)\(\[([^"\]]+)\]\)/g, (_match, id, text) => {
      const cleanText = text.replace(/"/g, "'").trim();
      return `${id}(["${cleanText}"])`;
    });

    return sanitized;
  });

  return processedLines.join('\n');
}

/**
 * Executes paper analysis using Gemini 3.8 Flash model with URL context and academic prompting.
 */
export async function analyzeResearchPaper(
  arxiv: ArxivMetadata,
  citation: CitationMetadata
): Promise<FullPaperAnalysis> {
  const ai = getGenAIClient();

  const prompt = `You are PaperScope, an expert Computer Science research paper analysis agent designed specifically for third-year undergraduate CS students.
You are analyzing the following CS research paper from arXiv:

Paper Title: "${arxiv.title}"
arXiv URL: ${arxiv.absUrl}
PDF URL: ${arxiv.pdfUrl}
Primary Category: ${arxiv.primaryCategory}
Authors: ${arxiv.authors.join(', ')}
Publication Year: ${arxiv.year}
Abstract / Content Summary:
"""
${arxiv.summary}
"""

Execute a deep, academically rigorous yet accessible analysis strictly tailored for a third-year CS student who knows data structures, algorithms, discrete math, and basic machine learning, but needs intuitive explanations of cutting-edge architectures.

You MUST produce a JSON response matching this exact structure:

{
  "coreConcepts": {
    "problemStatement": "Clear description of the core problem and limitations of previous state-of-the-art methods.",
    "primaryMethodology": "Detailed explanation of the primary architecture, framework, or algorithm proposed.",
    "keyContributions": "The key mathematical formulas, complexity improvements, or algorithmic contributions.",
    "studentTakeaway": "An accessible, memorable 1-2 sentence intuition or analogy for a 3rd-year CS student.",
    "accessibleSummary": "Synthesized summary connecting problem, method, and impact in accessible language. (Strictly keep core concept text under 300 words)."
  },
  "mermaidDiagram": "Mermaid diagram code starting with 'graph TD'. Must include 5 clearly connected stages: Data Inputs, Preprocessing/Embeddings, Model Architecture/Layers, Algorithms/Loss Functions, and Outputs. Use double quotes for all node labels like Node1[\\"Label\\"] to prevent syntax breakage. Do NOT include markdown ticks inside this string.",
  "futureWork": [
    {
      "id": 1,
      "exactExtension": "Specific student project extension 1",
      "targetedPerformanceMetric": "Targeted metric (e.g., reduce inference latency by 35% on RTX 4090, or +2.4 BLEU on low-resource language)",
      "recommendedTechStack": "Exact tech stack (e.g. PyTorch 2.x, HuggingFace Transformers, Triton, ONNX Runtime)",
      "difficulty": "Intermediate",
      "whyItMatters": "Why this extension makes a standout portfolio project or internship interview discussion topic."
    },
    {
      "id": 2,
      "exactExtension": "Specific student project extension 2",
      "targetedPerformanceMetric": "Targeted metric",
      "recommendedTechStack": "Exact tech stack",
      "difficulty": "Advanced",
      "whyItMatters": "Real-world engineering relevance."
    },
    {
      "id": 3,
      "exactExtension": "Specific student project extension 3",
      "targetedPerformanceMetric": "Targeted metric",
      "recommendedTechStack": "Exact tech stack",
      "difficulty": "Capstone",
      "whyItMatters": "Real-world engineering relevance."
    }
  ],
  "studentInsights": {
    "prerequisites": [
      "Key mathematical or CS concept 1 (e.g., Matrix Multiplication & Dot-product scaling)",
      "Key concept 2 (e.g., Autoregressive decoding & causal masking)",
      "Key concept 3"
    ],
    "algorithmicComplexity": {
      "timeComplexity": "e.g., O(N^2 * d) for sequence length N",
      "spaceComplexity": "e.g., O(N^2) memory footprint for attention map",
      "bottleneck": "e.g., Quadratic KV-cache memory bandwidth during long-context generation"
    },
    "sampleCodeSkeleton": "A concise 10-18 line Python/PyTorch pseudo-code or tensor dimension blueprint showing the primary algorithm."
  }
}

CRITICAL RULES:
1. Core Concept Extraction must be max 300 words total across problem, methodology, and contributions.
2. In the Mermaid diagram, start strictly with 'graph TD'. Connect inputs -> preprocessing -> core architecture -> algorithms -> outputs with clean edges like A --> B. Use double quotes around all node labels.
3. Future Work must have EXACTLY 3 student project extensions with exact extension, targeted performance metric, and recommended technology stack.
4. Return ONLY valid raw JSON with NO markdown backticks or commentary.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are PaperScope, a world-class academic CS research analyzer. Always produce valid JSON matching the user schema.',
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Strip potential backticks if returned despite responseMimeType
      const clean = responseText.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(clean);
    }

    const sanitizedDiagram = sanitizeMermaidGraph(parsed.mermaidDiagram || '');

    // Construct full analysis adhering strictly to user requirements
    const analysis: FullPaperAnalysis = {
      paperId: arxiv.id,
      url: arxiv.absUrl,
      title: arxiv.title,
      primaryCategory: arxiv.primaryCategory,
      coreConcepts: {
        problemStatement: parsed.coreConcepts?.problemStatement || 'Problem statement not extracted.',
        primaryMethodology: parsed.coreConcepts?.primaryMethodology || 'Primary methodology not extracted.',
        keyContributions: parsed.coreConcepts?.keyContributions || 'Key contributions not extracted.',
        studentTakeaway: parsed.coreConcepts?.studentTakeaway || 'Key algorithmic paradigm introduced in this work.',
        accessibleSummary: parsed.coreConcepts?.accessibleSummary || arxiv.summary,
      },
      mermaidDiagram: sanitizedDiagram,
      futureWork: Array.isArray(parsed.futureWork) && parsed.futureWork.length >= 3
        ? parsed.futureWork.slice(0, 3).map((fw: any, idx: number) => ({
            id: idx + 1,
            exactExtension: fw.exactExtension || 'Novel optimization variant',
            targetedPerformanceMetric: fw.targetedPerformanceMetric || 'Latency & throughput benchmark',
            recommendedTechStack: fw.recommendedTechStack || 'Python, PyTorch, CUDA',
            difficulty: fw.difficulty || (idx === 0 ? 'Intermediate' : idx === 1 ? 'Advanced' : 'Capstone'),
            whyItMatters: fw.whyItMatters || 'High impact student systems project.',
          }))
        : [
            {
              id: 1,
              exactExtension: 'Low-rank adaptation and INT8 quantization for edge inference',
              targetedPerformanceMetric: '4x memory footprint reduction with < 0.5% degradation',
              recommendedTechStack: 'PyTorch, HuggingFace PEFT, bitsandbytes, ONNX',
              difficulty: 'Intermediate',
              whyItMatters: 'Enables deploying massive architectures on consumer GPUs.',
            },
            {
              id: 2,
              exactExtension: 'Hardware-aware kernel fusion with FlashAttention mechanisms',
              targetedPerformanceMetric: '2.5x speedup in forward-backward pass',
              recommendedTechStack: 'Triton, CUDA C++, PyTorch C++ extension',
              difficulty: 'Advanced',
              whyItMatters: 'Direct demonstration of systems engineering and GPU architecture skills.',
            },
            {
              id: 3,
              exactExtension: 'Cross-domain transfer evaluation on low-resource multimodal datasets',
              targetedPerformanceMetric: '+3.2 F1 score over baseline few-shot models',
              recommendedTechStack: 'PyTorch Lightning, Weights & Biases, Ray Tune',
              difficulty: 'Capstone',
              whyItMatters: 'Publishable undergraduate research finding.',
            },
          ],
      // Required Metadata Section at the very end
      metadata: {
        citations: citation.citations,
        authors: citation.authors,
        publication: citation.publication,
        year: citation.year,
      },
      studentInsights: {
        prerequisites: Array.isArray(parsed.studentInsights?.prerequisites)
          ? parsed.studentInsights.prerequisites
          : ['Linear Algebra: Vector Dot Products & Projections', 'Probability: Softmax distributions', 'Computational Complexity: Matrix Multiplications'],
        algorithmicComplexity: {
          timeComplexity: parsed.studentInsights?.algorithmicComplexity?.timeComplexity || 'O(N^2) dependent on sequence length',
          spaceComplexity: parsed.studentInsights?.algorithmicComplexity?.spaceComplexity || 'O(N^2) activation cache footprint',
          bottleneck: parsed.studentInsights?.algorithmicComplexity?.bottleneck || 'High memory bandwidth during token-by-token generation',
        },
        sampleCodeSkeleton: parsed.studentInsights?.sampleCodeSkeleton || undefined,
      },
      analyzedAt: new Date().toISOString(),
    };

    return analysis;
  } catch (error: any) {
    console.error('Error during Gemini research analysis:', error);
    throw new Error(`Gemini paper analysis failed: ${error.message || 'Unknown model error'}`);
  }
}
