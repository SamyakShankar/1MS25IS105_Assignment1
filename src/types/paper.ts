export interface CoreConcepts {
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

export interface PaperMetadata {
  citations: number | string; // Integer or "Unavailable"
  citationCountRaw?: number | null;
  authors: string;
  publication: string;
  year: number | string;
  citationSource?: string;
  retrievalDate?: string;
  isVerified?: boolean;
}

export interface CSStudentInsights {
  prerequisites?: string[];
  algorithmicComplexity?: {
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
  coreConcepts: CoreConcepts;
  mermaidDiagram: string;
  futureWork: StudentProjectExtension[];
  metadata: PaperMetadata;
  studentInsights?: CSStudentInsights;
  analyzedAt: string;
}

export interface SamplePaper {
  id: string;
  title: string;
  authors: string;
  category: string;
  year: number;
  tag: string;
  description: string;
}
