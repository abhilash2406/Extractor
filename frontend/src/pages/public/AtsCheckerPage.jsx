import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  Target, 
  Zap, 
  ShieldCheck, 
  RefreshCw,
  Copy,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const sampleJobs = [
  {
    title: "Senior Full-Stack Engineer @ FinTech",
    jd: `Requirements:
- 5+ years of experience with React, TypeScript, and Node.js
- Strong proficiency in PostgreSQL database indexing and distributed Redis caching
- Deep understanding of AWS cloud infrastructure (ECS, Lambda, S3) and Docker containerization
- Experience with Kafka real-time streaming pipelines
- Proven background with GraphQL API development and microservices architecture
- Bachelor's degree in Computer Science or equivalent`
  },
  {
    title: "AI / ML Engineer @ TechScale",
    jd: `Requirements:
- 4+ years building production ML models with Python, PyTorch, and FastAPI
- Hands-on experience with LLM orchestration, RAG architectures, and Vector databases (Pinecone, Chroma)
- Experience running sub-second model inference on Groq LPU or TensorRT
- Strong knowledge of Docker, Kubernetes, and automated CI/CD pipelines
- Master's or Ph.D. in Computer Science or Artificial Intelligence`
  }
];

export default function AtsCheckerPage() {
  const [jobDescription, setJobDescription] = useState(sampleJobs[0].jd);
  const [resumeText, setResumeText] = useState(`Senior Software Engineer with 6+ years experience in React, TypeScript, Node.js, and PostgreSQL. Built distributed microservices on AWS ECS with Docker and Redis caching. Deployed real-time data streaming pipelines with Kafka. Strong experience with GraphQL and modern Agile software development.`);
  const [checking, setChecking] = useState(false);
  const [matchResult, setMatchResult] = useState({
    matchScore: 86,
    verdict: "Strong Recruiter Match",
    matchedKeywords: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS", "Docker", "Kafka", "GraphQL"],
    missingKeywords: ["ECS", "Lambda", "S3", "Database Indexing", "Computer Science Degree"],
    recommendations: [
      "Explicitly mention 'AWS Lambda' and 'S3' in your Cloud Projects section.",
      "Add 'Database Indexing' into your PostgreSQL accomplishment bullets.",
      "Ensure your degree matches the 'Computer Science' educational requirement."
    ]
  });

  const handleRunCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setMatchResult({
        matchScore: 88,
        verdict: "High ATS Match",
        matchedKeywords: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS", "Docker", "Kafka", "GraphQL", "Microservices"],
        missingKeywords: ["Lambda", "S3", "Database Indexing"],
        recommendations: [
          "Add 2 missing cloud keywords ('Lambda', 'S3') to pass initial ATS filtering.",
          "Quantify database performance metrics directly near 'PostgreSQL'."
        ]
      });
      setChecking(false);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-xs">
            <Target className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span>Job-Specific ATS Match Engine</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Free <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">ATS Resume Checker</span> vs Job Description
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Compare your resume directly against any target job description. Identify missing keywords and get recruiter-ready in seconds.
          </p>
        </div>

        {/* Dual Input Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left: Target Job Description */}
          <Card className="border-border/80 shadow-md bg-card flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Target Job Description
                </CardTitle>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setJobDescription(sampleJobs[0].jd)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Sample 1
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    onClick={() => setJobDescription(sampleJobs[1].jd)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Sample 2
                  </button>
                </div>
              </div>
              <CardDescription>Paste the job post or requirements you want to apply for</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-1 flex flex-col">
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="w-full flex-1 rounded-xl border border-input bg-background p-3.5 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
                placeholder="Paste job description requirements here..."
              />
            </CardContent>
          </Card>

          {/* Right: Your Resume Content */}
          <Card className="border-border/80 shadow-md bg-card flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Your Resume Summary & Skills
                </CardTitle>
                <span className="text-[11px] text-muted-foreground font-mono">Editable</span>
              </div>
              <CardDescription>Paste or edit your resume text to match against the job</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-1 flex flex-col">
              <textarea 
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                className="w-full flex-1 rounded-xl border border-input bg-background p-3.5 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
                placeholder="Paste your resume content or skills here..."
              />
            </CardContent>
          </Card>

        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            size="lg"
            variant="gradient"
            disabled={checking}
            onClick={handleRunCheck}
            className="h-12 px-8 rounded-2xl text-sm font-bold gap-2.5 shadow-xl shadow-indigo-500/25"
          >
            {checking ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Comparing with Groq LPU Engine...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Calculate ATS Match Score</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Match Result Analysis */}
        {matchResult && (
          <div className="space-y-6 animate-in fade-in-up duration-400">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Score Gauge Card */}
              <Card className="md:col-span-4 border-border/80 shadow-md bg-card text-center flex flex-col justify-between">
                <CardHeader className="p-6 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ATS Target Match</span>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-3">
                  <div className="text-6xl font-extrabold font-heading text-foreground">
                    {matchResult.matchScore}<span className="text-2xl text-muted-foreground font-normal">%</span>
                  </div>
                  <Badge variant="success" className="text-xs px-3 py-1">
                    {matchResult.verdict}
                  </Badge>
                  <p className="text-xs text-muted-foreground pt-1">
                    Your resume aligns strongly with 86% of the mandatory job requirements.
                  </p>
                </CardContent>
              </Card>

              {/* Keyword Comparison Matrix */}
              <Card className="md:col-span-8 border-border/80 shadow-md bg-card">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-base font-bold">Keyword Coverage Breakdown</CardTitle>
                  <CardDescription>Matched skills vs critical missing target keywords</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-1 space-y-4">
                  
                  {/* Matched */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Matched Keywords ({matchResult.matchedKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchedKeywords.map((k) => (
                        <Badge key={k} variant="secondary" className="text-xs px-2.5 py-1">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="space-y-1.5 pt-3 border-t border-border/60">
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-rose-500" />
                      Missing Mandatory Keywords ({matchResult.missingKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missingKeywords.map((k) => (
                        <Badge key={k} variant="destructive" className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          + {k}
                        </Badge>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* Recommendations List */}
            <Card className="border-border/80 shadow-md bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold">Actionable Tailoring Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-2.5">
                {matchResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs">
                    <span className="flex h-5 w-5 rounded-full bg-primary/10 text-primary font-bold items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-relaxed">{rec}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
}
