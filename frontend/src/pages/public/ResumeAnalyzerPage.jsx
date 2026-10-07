import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  Award,
  RefreshCw,
  Copy,
  ChevronRight,
  ExternalLink,
  X,
  FileCheck,
  Search,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const sampleResumesForAnalysis = [
  {
    name: "Senior Full-Stack Resume (Alex R.)",
    role: "Senior Software Engineer",
    score: 89,
    rating: "Strong ATS Score",
    summary: "Strong quantitative impact metrics and robust skill density. Missing 2 cloud infrastructure security keywords.",
    hardSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "GraphQL", "Redis"],
    missingSkills: ["Kubernetes", "OAuth 2.0", "Terraform"],
    weakBullets: [
      {
        original: "Worked on improving database queries and backend response times.",
        optimized: "Optimized PostgreSQL relational indexes and query execution plans, slashing p99 database latency by 45%."
      },
      {
        original: "Helped team build new features for the client web app.",
        optimized: "Engineered 14+ responsive React/TypeScript micro-frontend modules, accelerating customer feature adoption by 30%."
      }
    ]
  },
  {
    name: "Product Manager Resume (Priya M.)",
    role: "Lead Product Manager",
    score: 82,
    rating: "Good Match",
    summary: "Solid cross-functional leadership and roadmap metrics. Formatting could be simplified for automated parsing.",
    hardSkills: ["Product Strategy", "User Research", "Agile / Scrum", "A/B Testing", "Mixpanel", "SQL", "Jira"],
    missingSkills: ["Go-To-Market (GTM)", "Unit Economics", "B2B SaaS Metrics"],
    weakBullets: [
      {
        original: "Managed sprint planning and talked with design and engineering teams.",
        optimized: "Orchestrated bi-weekly Agile sprint cadences across 18 engineers & designers, boosting team sprint velocity by 28%."
      }
    ]
  },
  {
    name: "Data Scientist Resume (Dr. Chen)",
    role: "AI / Data Scientist",
    score: 94,
    rating: "Top 3% ATS Score",
    summary: "Exceptional metric-driven accomplishments and strong machine learning taxonomy coverage.",
    hardSkills: ["Python", "PyTorch", "TensorFlow", "Groq LPU", "Vector Databases", "FastAPI", "RAG"],
    missingSkills: ["MLOps Pipeline", "Model Quantization"],
    weakBullets: [
      {
        original: "Built a machine learning model to classify user search queries.",
        optimized: "Architected sub-second semantic search classifier leveraging vector embeddings, lifting search conversion by 34%."
      }
    ]
  }
];

export default function ResumeAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'text'
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef(null);

  const triggerAnalysis = (sample = null) => {
    setAnalyzing(true);
    setScanStep(1);
    
    setTimeout(() => setScanStep(2), 350);
    setTimeout(() => setScanStep(3), 700);
    setTimeout(() => {
      setAnalysisResult(sample || sampleResumesForAnalysis[0]);
      setAnalyzing(false);
    }, 1050);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setFileSize((file.size / 1024).toFixed(1) + ' KB');
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setFileSize((file.size / 1024).toFixed(1) + ' KB');
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = (sample) => {
    setSelectedFile(sample.name + ".pdf");
    setFileSize("142.4 KB");
    triggerAnalysis(sample);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
            <Bot className="h-4 w-4 animate-pulse text-indigo-500" />
            <span>AI Resume Diagnostics Engine</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Instant AI Resume Analyzer & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">ATS Score Checker</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Drop your resume below to detect formatting errors, missing keywords, and weak bullet points with instant Groq LPU inference.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center">
          <div className="flex p-1 bg-muted/60 border border-border/80 rounded-2xl">
            <button
              onClick={() => setInputMode('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'upload' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Upload Resume File
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'text' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Paste Resume Text
            </button>
          </div>
        </div>

        {/* Upload & Action Card */}
        <Card className="max-w-3xl mx-auto border-border/80 shadow-2xl shadow-black/40 bg-card/90 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-10 space-y-6">
            
            {inputMode === 'upload' ? (
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all ${
                  selectedFile 
                    ? 'border-primary/50 bg-primary/5 cursor-default' 
                    : 'border-primary/30 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 cursor-pointer'
                } flex flex-col items-center justify-center space-y-4`}
              >
                <input 
                  ref={fileInputRef}
                  id="resumeFileInput" 
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {selectedFile ? (
                  /* State with File Selected */
                  <div className="w-full max-w-md space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/80 shadow-md">
                      <div className="flex items-center gap-3 truncate text-left">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FileCheck className="h-6 w-6" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-foreground truncate">{selectedFile}</h4>
                          <p className="text-xs text-muted-foreground">{fileSize || 'Ready for Analysis'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 ml-2"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <Button 
                        type="button"
                        onClick={() => triggerAnalysis()}
                        disabled={analyzing}
                        variant="gradient" 
                        size="lg"
                        className="w-full h-12 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-indigo-500/25 justify-center"
                      >
                        {analyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Analyzing Resume...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 fill-current" />
                            <span>Check & Analyze Resume</span>
                          </>
                        )}
                      </Button>

                      <Button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto h-12 px-4 rounded-xl text-xs font-semibold"
                      >
                        Change File
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Empty Dropzone State */
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-base text-foreground">
                        Upload your resume (PDF, DOCX, TXT)
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop your file here, or click to browse from your computer
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Browse Files</span>
                      </Button>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Private & Secure • Evaluated with Sub-Second Groq Inference</span>
                </div>
              </div>
            ) : (
              /* Paste Resume Text Mode */
              <div className="space-y-4">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your full resume text, work experience bullets, and skills here..."
                  rows={8}
                  className="w-full rounded-2xl border border-input bg-background p-4 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-xs"
                />
                <Button
                  onClick={() => triggerAnalysis()}
                  disabled={analyzing || !pastedText.trim()}
                  variant="gradient"
                  size="lg"
                  className="w-full h-12 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-indigo-500/25 justify-center"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Analyzing Resume Text...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 fill-current" />
                      <span>Check & Analyze Resume</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Quick Sample Selector */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-border/60">
              <span className="text-muted-foreground font-semibold">Or test with ready samples:</span>
              <div className="flex flex-wrap gap-2">
                {sampleResumesForAnalysis.map((s, i) => (
                  <Button 
                    key={i} 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleLoadSample(s)}
                    className="h-8 text-xs rounded-xl hover:border-primary hover:text-primary transition-all"
                  >
                    {s.role}
                  </Button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Live Analysis Progress Overlay */}
        {analyzing && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-primary/30 bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/40 text-center space-y-5 animate-in fade-in duration-300">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <RefreshCw className="h-7 w-7 animate-spin text-primary" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-lg text-foreground">Analyzing Resume Architecture...</h3>
              <p className="text-xs text-muted-foreground">
                {scanStep === 1 && "1/3: Extracting structured JSON schema & OCR text..."}
                {scanStep === 2 && "2/3: Calculating ATS keyword density and recruiter readability..."}
                {scanStep === 3 && "3/3: Running Groq LPU inference for bullet point optimization..."}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden max-w-md mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 transition-all duration-300"
                style={{ width: `${scanStep * 33.3}%` }}
              />
            </div>
          </div>
        )}

        {/* Detailed Results Dashboard */}
        {!analyzing && analysisResult && (
          <div className="space-y-8 animate-in fade-in-up duration-500">
            
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Overall ATS Score Card */}
              <Card className="md:col-span-4 border-border/80 shadow-md bg-card flex flex-col justify-between rounded-3xl">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall ATS Score</span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs border-emerald-500/30">
                      {analysisResult.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4 text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="text-6xl font-black font-heading text-foreground">
                      {analysisResult.score}<span className="text-2xl text-primary font-bold">/100</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Sub-Metrics Breakdown */}
              <Card className="md:col-span-8 border-border/80 shadow-md bg-card rounded-3xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-base font-bold">Category Health Breakdown</CardTitle>
                  <CardDescription>How your resume performs against top enterprise ATS algorithms</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-1 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Hard Skills & Technical Keywords</span>
                      <span className="font-bold text-emerald-500">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Action Verbs & Quantifiable Impact</span>
                      <span className="font-bold text-indigo-500">78%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Formatting & Layout Simplicity</span>
                      <span className="font-bold text-violet-500">95%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full w-[95%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Keyword Matrix & Actionable Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Detected vs Missing Skills */}
              <Card className="lg:col-span-5 border-border/80 shadow-md rounded-3xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-base font-bold">Skills Analysis</CardTitle>
                  <CardDescription>Extracted keywords vs high-demand industry requirements</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-5">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Detected Strong Skills ({analysisResult.hardSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.hardSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs px-2.5 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border/60">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Recommended Missing Keywords ({analysisResult.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs px-2.5 py-1 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Bullet Enhancements */}
              <Card className="lg:col-span-7 border-border/80 shadow-md rounded-3xl">
                <CardHeader className="p-6 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-bold">AI Bullet Point Enhancements</CardTitle>
                  </div>
                  <CardDescription>Transform weak responsibilities into high-impact metric achievements</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                  {analysisResult.weakBullets.map((bullet, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Original (Low Impact)</span>
                        <p className="text-xs text-muted-foreground line-through">
                          "{bullet.original}"
                        </p>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-border/50">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          AI-Optimized (Metric-Driven)
                        </span>
                        <p className="text-xs font-medium text-foreground leading-relaxed">
                          "{bullet.optimized}"
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>

            {/* Bottom Conversion Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-violet-600/15 border border-primary/30 text-center space-y-4 shadow-xl">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Ready to Upgrade Your Resume with These Enhancements?
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Open our interactive builder to apply these AI optimizations in 1 click and download a clean, ATS-compliant PDF.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button asChild variant="gradient" className="h-11 px-6 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-indigo-500/25">
                  <Link to="/builder">
                    <span>Open in Resume Builder</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6 rounded-xl text-xs font-semibold">
                  <Link to="/register">Create Free Account</Link>
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
