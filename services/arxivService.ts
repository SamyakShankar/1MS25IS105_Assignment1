/**
 * Service for parsing arXiv URLs/IDs and retrieving paper metadata from the arXiv API.
 */

export interface ArxivMetadata {
  id: string;
  cleanId: string;
  absUrl: string;
  pdfUrl: string;
  title: string;
  summary: string;
  authors: string[];
  publishedDate: string;
  year: number;
  primaryCategory: string;
  categories: string[];
  comment?: string;
  journalRef?: string;
  doi?: string;
}

/**
 * Extracts and cleans an arXiv ID from various user inputs:
 * - https://arxiv.org/abs/1706.03762
 * - https://arxiv.org/abs/1706.03762v5
 * - https://arxiv.org/pdf/1706.03762
 * - https://arxiv.org/pdf/1706.03762.pdf
 * - arxiv.org/abs/1706.03762
 * - 1706.03762 or 1706.03762v7
 * - cs/0101001 or math.PR/0001001
 */
export function extractArxivId(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Pattern for modern arXiv IDs (e.g. 1706.03762 or 2303.08774v2)
  const modernRegex = /(?:arxiv\.org\/(?:abs|pdf)\/|arxiv:)?([0-9]{4}\.[0-9]{4,5}(?:v[0-9]+)?)(?:\.pdf)?/i;
  const modernMatch = trimmed.match(modernRegex);
  if (modernMatch && modernMatch[1]) {
    return modernMatch[1];
  }

  // Pattern for legacy arXiv IDs (e.g. cs/0101001, math.PR/0001001)
  const legacyRegex = /(?:arxiv\.org\/(?:abs|pdf)\/|arxiv:)?([a-z\-]+(?:\.[A-Z]{2})?\/[0-9]{7}(?:v[0-9]+)?)(?:\.pdf)?/i;
  const legacyMatch = trimmed.match(legacyRegex);
  if (legacyMatch && legacyMatch[1]) {
    return legacyMatch[1];
  }

  return null;
}

/**
 * Strip version string (e.g., "1706.03762v5" -> "1706.03762")
 */
export function stripVersion(arxivId: string): string {
  return arxivId.replace(/v\d+$/i, '');
}

/**
 * Simple XML tag extractor for arXiv Atom feed without heavy external parsers
 */
function extractTagContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';
  return match[1].trim().replace(/\s+/g, ' ');
}

function extractAllAuthors(xml: string): string[] {
  const authorRegex = /<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/gi;
  const authors: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = authorRegex.exec(xml)) !== null) {
    if (match[1]) {
      authors.push(match[1].trim());
    }
  }
  return authors;
}

/**
 * Fetch paper metadata from the official arXiv export API
 */
export async function fetchArxivMetadata(arxivId: string): Promise<ArxivMetadata> {
  const cleanId = stripVersion(arxivId);
  const apiUrl = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PaperScope-Analyzer/1.0 (academic-research-tool)',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`arXiv API returned status HTTP ${res.status}`);
    }

    const xml = await res.text();

    // Check if entry exists in XML
    if (!xml.includes('<entry>')) {
      throw new Error(`Paper with arXiv ID "${arxivId}" was not found.`);
    }

    const entryStart = xml.indexOf('<entry>');
    const entryEnd = xml.indexOf('</entry>');
    const entryXml = entryStart !== -1 && entryEnd !== -1 ? xml.slice(entryStart, entryEnd + 8) : xml;

    // Check for error element in entry
    if (entryXml.includes('<error') || entryXml.includes('id_list not found')) {
      throw new Error(`arXiv paper ID "${arxivId}" could not be located.`);
    }

    let title = extractTagContent(entryXml, 'title');
    // Normalize newlines in title
    title = title.replace(/\n/g, ' ').replace(/\s+/g, ' ');

    let summary = extractTagContent(entryXml, 'summary');
    summary = summary.replace(/\n/g, ' ').replace(/\s+/g, ' ');

    const authors = extractAllAuthors(entryXml);
    const published = extractTagContent(entryXml, 'published');
    const publishedDate = published ? new Date(published).toISOString() : new Date().toISOString();
    const year = published ? new Date(published).getFullYear() : new Date().getFullYear();

    const comment = extractTagContent(entryXml, 'arxiv:comment');
    const journalRef = extractTagContent(entryXml, 'arxiv:journal_ref');
    const doi = extractTagContent(entryXml, 'arxiv:doi');

    // Primary category
    const catMatch = entryXml.match(/<arxiv:primary_category[^>]*term="([^"]+)"/i);
    const primaryCategory = catMatch ? catMatch[1] : 'cs.AI';

    return {
      id: arxivId,
      cleanId,
      absUrl: `https://arxiv.org/abs/${arxivId}`,
      pdfUrl: `https://arxiv.org/pdf/${arxivId}.pdf`,
      title: title || `arXiv:${arxivId}`,
      summary: summary || 'No summary available.',
      authors: authors.length > 0 ? authors : ['Unknown Author'],
      publishedDate,
      year: isNaN(year) ? new Date().getFullYear() : year,
      primaryCategory,
      categories: [primaryCategory],
      comment: comment || undefined,
      journalRef: journalRef || undefined,
      doi: doi || undefined,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout connecting to arXiv API. Please verify the URL and try again.');
    }
    throw error;
  }
}
