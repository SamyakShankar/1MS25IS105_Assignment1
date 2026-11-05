# PaperScope – AI Research Paper Analyzer

> **Computer Science research paper analysis agent designed for third-year CS undergraduates.**  
> Transforms dense arXiv research papers into concise core concept breakdowns, interactive Mermaid.js architectural flowcharts, and resume-ready student project opportunities.

---

## 🚀 Key Features

1. **Section 1 · Canonical Paper Overview**
   - Direct support for arXiv abstract URLs (e.g. `https://arxiv.org/abs/1706.03762`), PDF URLs (`https://arxiv.org/pdf/1706.03762.pdf`), and standalone identifiers (`1706.03762`).
   - One-click benchmark selectors for seminal CS papers (*Attention Is All You Need*, *LoRA*, *ResNet*, *Diffusion Models*, *FlashAttention*).

2. **Section 2 · Core Concept Extraction**
   - Synthesizes the **Problem Statement**, **Primary Methodology**, and **Key Algorithmic / Mathematical Contributions** in accessible language.
   - Enforces a strict **under 300-word constraint** with real-time word count tracking and a clear "CS Junior Intuition" analogy.

3. **Section 3 · Architectural Flowchart (Mermaid.js)**
   - Generates and renders a valid Mermaid `graph TD` data pipeline tracing data inputs, preprocessing, model layers, algorithms/loss functions, and outputs.
   - Features pan/zoom controls, fullscreen mode, SVG export, and an interactive toggle to view and copy the raw Mermaid source.

4. **Section 4 · Future Work & Internship Opportunities**
   - Formulates **exactly three realistic student project extensions** engineered to stand out in technical interviews and capstone portfolios.
   - Each project includes the exact extension title, targeted performance metric (e.g., latency reduction or accuracy gain), and recommended technology stack (PyTorch, Triton, ONNX, CUDA, etc.).

5. **Section 5 · Verified Metadata of Paper (Final Section)**
   - Displays authentic citations count, author lists, publication venue, and publication year.
   - Integrates directly with the **official arXiv API** and **Semantic Scholar Academic Graph API**.
   - Displays `"Unavailable"` when citation metrics are rate-limited or unindexed, with verifiable citation source and retrieval timestamps.

6. **Complete Export Capabilities**
   - **Download JSON**: Generates structured, schema-compliant JSON with exactly three future work items and null-safe numerical fields.
   - **Download TXT**: Generates a clean, human-readable plain-text study guide suitable for reading logs and Notion/Obsidian notes.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Diagrams & Visualizations**: Mermaid.js
- **Backend & Middleware**: Node.js, Express, `tsx`
- **AI Intelligence**: Google Gemini API (`@google/genai` TypeScript SDK, `gemini-3.8-flash`)
- **Bibliographic Services**: Official arXiv Atom Export API, Semantic Scholar Graph API

---

## 📁 Project Structure

```
├── services/
│   ├── metadataService.ts    # Official arXiv & Semantic Scholar citation service
│   ├── paperAgent.ts         # PaperScope research agent system instruction & Gemini pipeline
│   ├── arxivService.ts       # arXiv URL parsing and Atom XML extraction
│   └── citationService.ts    # Bibliographic caching and fallback benchmarks
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Academic branding and student guide modal
│   │   ├── UrlInputSection.tsx        # URL submission and seminal paper presets
│   │   ├── LoadingProgress.tsx        # Multi-stage animated analysis tracker
│   │   ├── CoreConceptsSection.tsx    # Section 2: Core Concept Extraction (< 300 words)
│   │   ├── MermaidChart.tsx           # Section 3: Interactive Mermaid.js Flowchart
│   │   ├── StudentExtensionsSection.tsx # Section 4: 3 Student Project Opportunities
│   │   ├── PaperMetadataSection.tsx   # Section 5: Metadata of Paper (Final Section)
│   │   ├── ExportToolbar.tsx          # Download JSON, Download TXT & Share
│   │   └── StudentInsightsSection.tsx # Algorithmic complexity and PyTorch blueprint
│   ├── types/
│   │   └── paper.ts          # Comprehensive TypeScript interfaces
│   ├── App.tsx               # Main application orchestration & 5-section layout
│   ├── main.tsx              # React entrypoint
│   └── index.css             # Tailwind CSS & academic typography styling
├── server.ts                 # Full-stack Express server with Vite middleware integration
├── .env.example              # Environment variables template (no secrets)
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/paperscope.git
cd paperscope
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment file to `.env`:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API key:
```env
# Required for Gemini AI paper analysis
GEMINI_API_KEY="your-gemini-api-key-here"
```

> **Note**: You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run the development server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📄 JSON Export Schema

The **Download JSON** export button outputs the following verified schema:

```json
{
  "title": "Attention Is All You Need",
  "url": "https://arxiv.org/abs/1706.03762",
  "coreConcept": {
    "problemStatement": "Dominant sequence transduction models were based on complex recurrent or convolutional neural networks...",
    "methodology": "The authors proposed the Transformer: an encoder-decoder architecture based solely on attention mechanisms...",
    "contributions": "Introduced Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V..."
  },
  "flowchart": "graph TD\n  InputTokens[\"Data Inputs: Raw Text Tokens\"] --> Embeddings[\"Token & Positional Embeddings\"]...",
  "futureWork": [
    {
      "extension": "Low-Bit Quantization and KV-Cache Memory Compression for Edge Inference",
      "metric": "3.8x memory reduction with <0.4 drop in BLEU score on Mobile GPUs",
      "techStack": "PyTorch, HuggingFace optimum, GGML/llama.cpp, ONNX Runtime"
    },
    {
      "extension": "Implementation of Linear Attention with Kernelized Feature Maps",
      "metric": "Linear O(N) sequence scaling allowing 32k token window training",
      "techStack": "PyTorch 2.x, Triton kernels, Weights & Biases"
    },
    {
      "extension": "Cross-Attention Multimodal Bridge for EEG Signal-to-Text Transcription",
      "metric": "Achieve >65% word accuracy rate on open-source BCI brainwave datasets",
      "techStack": "PyTorch, MNE-Python, HuggingFace Datasets, PyTorch Lightning"
    }
  ],
  "metadata": {
    "citations": 145000,
    "authors": "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones et al.",
    "publication": "Advances in Neural Information Processing Systems (NeurIPS 2017)",
    "year": 2017,
    "citationSource": "Semantic Scholar Academic Graph API",
    "retrievedAt": "2026-11-05T13:10:01.313Z"
  }
}
```

---

## 🔒 Security & Privacy

- The `GEMINI_API_KEY` is strictly managed server-side and never exposed to client-side bundles.
- All paper fetching and AI reasoning occur through secure backend Express routes.
- `.env.example` contains placeholder tokens only; secrets must never be committed to source control.

---

## 📜 License

Licensed under the Apache-2.0 License.
