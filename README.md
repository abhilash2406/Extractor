# Extractor — Intelligent AI Document & Talent Platform

Extractor is a high-speed, AI-driven talent intelligence and document parsing platform. It utilizes Large Language Models (LLMs) with Groq LPU sub-second inference to automatically extract, structure, and analyze candidate data directly from PDF/DOCX resumes.

## Architecture & Local Development Ports

| Service | Local URL | Directory | Purpose |
|---|---|---|---|
| **User Frontend** | `http://localhost:5173` | `/frontend` | Landing Page & Candidate / User Portal |
| **Admin Frontend** | `http://localhost:5174` | `/admin` | Admin Dashboard, Telemetry, Templates, Subscriptions, AI Usage |
| **API Backend** | `http://localhost:5000` | `/backend` | Node.js Express REST API & Database |

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL
- Python 3.8+ (for PyMuPDF4LLM PDF extraction script)

### 2. Running Locally

```bash
# Terminal 1: Backend API (Port 5000)
cd backend
npm install
npm run dev

# Terminal 2: User Frontend & Landing Page (Port 5173)
cd frontend
npm install
npm run dev

# Terminal 3: Admin Portal (Port 5174)
cd admin
npm install
npm run dev
```

### 3. Database Setup
```bash
cd backend
npx sequelize-cli db:migrate
```

### 4. Python Setup
```bash
pip install pymupdf4llm
```
