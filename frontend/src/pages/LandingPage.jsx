import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Sparkles, 
  FileText, 
  Bot, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Code2, 
  UploadCloud, 
  BarChart3, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Star,
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Sample resumes for the interactive live parser preview
const sampleResumes = [
  {
    role: "Senior Full-Stack Engineer",
    name: "Alex Rivera",
    experience: "7+ Years Exp",
    atsScore: 98,
    matchRate: "Excellent Match",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL"],
    summary: "Full-stack architect specialized in distributed cloud systems, real-time streaming, and modern React/TypeScript frontends.",
    education: "B.Tech Computer Science — 2019"
  },
  {
    role: "AI & ML Specialist",
    name: "Dr. Sarah Chen",
    experience: "5 Years Exp",
    atsScore: 95,
    matchRate: "High Match",
    skills: ["Python", "PyTorch", "LLMs", "Groq LPU", "FastAPI", "Vector DBs", "RAG"],
    summary: "Machine learning researcher focused on fast inference optimization, semantic search, and RAG pipelines.",
    education: "Ph.D. in Artificial Intelligence — 2021"
  },
  {
    role: "Lead Product Designer",
    name: "Marcus Vance",
    experience: "6 Years Exp",
    atsScore: 92,
    matchRate: "Good Match",
    skills: ["UI/UX", "Figma", "Design Systems", "User Research", "Prototyping", "Tailwind"],
    summary: "Product designer passionate about design systems, accessible SaaS interfaces, and developer handoffs.",
    education: "B.Des Interaction Design — 2020"
  }
];

const pricingPlans = [
  {
    name: "Free Tier",
    price: "₹0",
    period: "forever",
    description: "Ideal for testing AI extraction capabilities and occasional resume parsing.",
    features: [
      "50 Resume extractions / month",
      "Standard OCR & Schema Parser",
      "Basic ATS Match Scoring",
      "JSON Export via Web Dashboard",
      "Community Support"
    ],
    popular: false,
    cta: "Get Started Free"
  },
  {
    name: "Starter Plan",
    price: "₹499",
    period: "per month",
    description: "Perfect for growing hiring teams and individual recruitment consultants.",
    features: [
      "500 Resume extractions / month",
      "Groq LPU Sub-Second Inference",
      "Deep ATS Gap Analysis",
      "Custom Extraction Schemas",
      "Priority Email Support"
    ],
    popular: false,
    cta: "Start Starter Plan"
  },
  {
    name: "Pro Plan",
    price: "₹1,499",
    period: "per month",
    description: "Designed for high-velocity talent agencies and growing tech startups.",
    features: [
      "2,500 Resume extractions / month",
      "Batch PDF / DOCX Processing",
      "Automated Candidate Ranking",
      "REST API & Webhooks Access",
      "Dedicated Account Manager"
    ],
    popular: true,
    cta: "Upgrade to Pro"
  },
  {
    name: "Enterprise",
    price: "₹4,999",
    period: "per month",
    description: "Full-scale document intelligence pipeline with custom fine-tuned models.",
    features: [
      "Unlimited Resume Extractions",
      "Custom OCR Models & On-Prem Support",
      "99.9% SLA & Dedicated GPU/LPU Instances",
      "Single Sign-On (SAML / SSO)",
      "24/7 Phone & Slack Support"
    ],
    popular: false,
    cta: "Contact Enterprise"
  }
];

const LandingPage = () => {
  const [selectedSample, setSelectedSample] = useState(0);
  const [showJsonView, setShowJsonView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSample = sampleResumes[selectedSample];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-blue-600/15 dark:bg-blue-600/20 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-10 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 dark:bg-indigo-600/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f10_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,#000_60%,transparent_100%)] opacity-70 pointer-events-none" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Extractor
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a 
              href="http://localhost:5174" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl border border-border/80 bg-card hover:bg-accent transition-all shadow-xs"
            >
              <span>Admin Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link to="/login">
              <Button size="sm" className="rounded-xl px-4 text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md shadow-cyan-500/20">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-6 flex flex-col bg-sidebar shadow-2xl">
                <div className="flex items-center gap-2.5 pb-6 border-b border-border/60">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xs">
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-heading text-lg font-bold">Extractor</span>
                </div>

                <div className="flex flex-col gap-4 py-6 text-base font-medium">
                  <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Features</a>
                  <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">How It Works</a>
                  <a href="#demo" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Live Demo</a>
                  <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Pricing</a>
                </div>

                <div className="mt-auto pt-6 border-t border-border/60 flex flex-col gap-3">
                  <a 
                    href="http://localhost:5174" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border/80 text-sm font-semibold hover:bg-accent"
                  >
                    <span>Admin Portal</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full h-11 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-6 backdrop-blur-md shadow-xs animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Next-Generation Resume & Document Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.12]">
          Turn Unstructured Resumes into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            Structured Talent Intelligence
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Powered by sub-second Groq LPU inference. Extract candidate skills, experience schemas, and ATS match scores with 99.8% precision.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a href="#demo" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-[0.99] gap-2">
              <span>Try Live AI Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a 
            href="http://localhost:5174" 
            target="_blank" 
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold text-sm border-border/80 hover:bg-accent gap-2">
              <span>Admin Telemetry</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
            <div className="font-heading text-3xl font-extrabold text-foreground">10x</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Faster Screening</div>
          </div>
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
            <div className="font-heading text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">99.8%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">OCR Precision</div>
          </div>
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
            <div className="font-heading text-3xl font-extrabold text-foreground">&lt; 850ms</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Groq LPU Speed</div>
          </div>
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
            <div className="font-heading text-3xl font-extrabold text-blue-600 dark:text-blue-400">5,800+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Resumes Parsed</div>
          </div>
        </div>

      </section>

      {/* Interactive Live Demo Section */}
      <section id="demo" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="outline" className="px-3 py-1 text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 mb-3">
            Interactive Showcase
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Experience Instant AI Extraction
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
            Select a sample candidate resume below to see real-time schema parsing, skills extraction, and ATS benchmarking.
          </p>
        </div>

        {/* Sample Profile Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {sampleResumes.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSample(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedSample === idx
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {sample.role}
            </button>
          ))}
        </div>

        {/* Live Card Showcase */}
        <div className="rounded-3xl border border-border/80 bg-card/90 dark:bg-[#0F1C2E]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-border/60 flex flex-wrap items-center justify-between gap-3 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold">
                {currentSample.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">{currentSample.name}</h3>
                <p className="text-xs text-muted-foreground">{currentSample.role} • {currentSample.experience}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showJsonView ? "default" : "outline"}
                size="sm"
                onClick={() => setShowJsonView(!showJsonView)}
                className="h-8 text-xs font-semibold gap-1.5 rounded-lg"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>{showJsonView ? "Visual View" : "View JSON Schema"}</span>
              </Button>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 text-xs">
                Parsed in 640ms
              </Badge>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8">
            {showJsonView ? (
              <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
{JSON.stringify({
  candidate: currentSample.name,
  targetRole: currentSample.role,
  experienceLevel: currentSample.experience,
  atsScore: currentSample.atsScore,
  matchClassification: currentSample.matchRate,
  extractedSkills: currentSample.skills,
  summary: currentSample.summary,
  education: currentSample.education,
  modelUsed: "Groq-LPU-llama-3.3-70b-versatile",
  schemaValidation: "PASSED_100%"
}, null, 2)}
              </pre>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Overview */}
                <div className="lg:col-span-8 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Extracted Professional Summary
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed p-4 rounded-2xl bg-muted/20 border border-border/50">
                      {currentSample.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Identified Technical & Domain Skills ({currentSample.skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSample.skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Education Credentials
                    </h4>
                    <p className="text-xs font-medium text-foreground">{currentSample.education}</p>
                  </div>
                </div>

                {/* Right Metric Card */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/20 space-y-4 text-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      ATS Benchmark Score
                    </span>
                    <div className="font-heading text-5xl font-extrabold text-cyan-500 mt-2">
                      {currentSample.atsScore}%
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 mt-2 font-semibold">
                      {currentSample.matchRate}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs text-left pt-4 border-t border-border/60">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Keywords Matched:</span>
                      <span className="font-semibold text-foreground">94%</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Format Compatibility:</span>
                      <span className="font-semibold text-foreground">100%</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Contact Info OCR:</span>
                      <span className="font-semibold text-emerald-500">Verified</span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 mb-3">
            Core Architecture
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Engineered for High-Speed Talent Workflows
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
            Everything you need to automate candidate intake, extract structured schemas, and power hiring portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Card className="hover:shadow-lg transition-all duration-200 border-border/80 bg-card/75 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">Groq LPU Acceleration</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sub-second inference that parses complete multi-page resumes and extracts 40+ attributes in under 850 milliseconds.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border/80 bg-card/75 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">ATS Gap & Keyword Scoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automated comparison against target job descriptions with actionable missing skill recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border/80 bg-card/75 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">Strict JSON Schemas</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deterministic, schema-validated JSON outputs that plug directly into PostgreSQL, MySQL, or webhooks.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border/80 bg-card/75 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">Multi-Format Document OCR</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Flawless text and layout extraction from PDF, DOCX, TXT, scanned images, and multi-column formats.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border/80 bg-card/75 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">Privacy & Enterprise Security</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zero training on customer document data. Encrypted in-transit and at-rest with strict data retention rules.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border/80 bg-card/75 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">Real-Time Admin Telemetry</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Live monitoring dashboard with AI request token meters, user growth analytics, and subscription tracking.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge variant="outline" className="px-3 py-1 text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 mb-3">
            Workflow
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How Extractor Works in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 rounded-2xl bg-card border border-border/60">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white font-heading font-bold text-xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Upload Document</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drop resumes or invoices in PDF/DOCX format via API or web studio.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-2xl bg-card border border-border/60">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500 text-white font-heading font-bold text-xl flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">AI Schema Extraction</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Groq LPU parses entities, work experience, tech stack, and skills graph.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-2xl bg-card border border-border/60">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white font-heading font-bold text-xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Export & Match</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Receive structured JSON, candidate score, and automatic pipeline placement.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 mb-3">
            Pricing Plans
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
            Choose the plan that fits your candidate extraction scale. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={`flex flex-col justify-between transition-all duration-200 ${
                plan.popular 
                  ? 'border-2 border-primary shadow-xl shadow-cyan-500/10 scale-[1.03] bg-card' 
                  : 'border-border/80 bg-card/80'
              }`}
            >
              <CardContent className="p-6 space-y-5">
                {plan.popular && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-[10px] uppercase tracking-wider">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Link to="/register">
                  <Button 
                    className={`w-full h-11 rounded-xl text-xs font-bold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25' 
                        : 'border-border hover:bg-accent'
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl border border-border/80 bg-gradient-to-b from-primary/10 via-card/80 to-card shadow-2xl backdrop-blur-xl">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Ready to Automate Your Document Intake?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join forward-thinking hiring teams using Extractor for intelligent talent schema parsing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25">
                Create Free Account
              </Button>
            </Link>
            <a 
              href="http://localhost:5174" 
              target="_blank" 
              rel="noreferrer"
            >
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl font-semibold text-sm border-border/80">
                Launch Admin Portal
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/80 bg-background/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xs">
              <Zap className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="font-heading text-sm font-bold text-foreground">Extractor Inc.</span>
          </div>
          <div>
            © 2026 Extractor. All rights reserved. Sub-second Groq LPU Document Intelligence.
          </div>
          <div className="flex items-center gap-4">
            <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="hover:text-foreground">Admin Portal (5174)</a>
            <Link to="/login" className="hover:text-foreground">Sign In</Link>
            <Link to="/register" className="hover:text-foreground">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
