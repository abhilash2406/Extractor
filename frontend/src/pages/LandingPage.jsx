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
  UploadCloud, 
  BarChart3, 
  Search, 
  Target, 
  FileEdit, 
  Eye, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  Palette,
  LogIn,
  UserCheck,
  Award,
  Sparkle,
  Lock,
  ChevronRight,
  Clock,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthModalStore } from '@/store/authModalStore';

// Public services list configured as comprehensive card views
const extractorServices = [
  {
    id: 'builder',
    title: 'Resume Builder',
    badge: 'Popular • No Login Required',
    badgeVariant: 'indigo',
    icon: FileEdit,
    iconColor: 'from-indigo-600 to-violet-600',
    description: 'Build professional, ATS-optimized resumes with our interactive split-screen editor. Live formatting, multiple themes, and instant download.',
    workflow: [
      '1. Enter career details & skills',
      '2. Select modern/executive layout',
      '3. Instant real-time live preview',
      '4. Download clean ATS-compliant PDF'
    ],
    ctaText: 'Start Building Resume',
    to: '/builder',
    isPrimary: true
  },
  {
    id: 'analyzer',
    title: 'AI Resume Analyzer',
    badge: 'AI Diagnostic Engine',
    badgeVariant: 'purple',
    icon: Bot,
    iconColor: 'from-purple-600 to-indigo-600',
    description: 'Upload your current resume to get deep algorithmic scoring, impact verb suggestions, ATS format diagnostics, and bullet point rewrites.',
    workflow: [
      '1. Drag & drop existing PDF/DOCX',
      '2. Sub-second Groq LPU schema parsing',
      '3. View overall ATS score (0-100%)',
      '4. Apply 1-click bullet improvements'
    ],
    ctaText: 'Analyze My Resume',
    to: '/analyze',
    isPrimary: false
  },
  {
    id: 'ats-checker',
    title: 'ATS Resume Checker',
    badge: 'Free Job Match Tool',
    badgeVariant: 'emerald',
    icon: Search,
    iconColor: 'from-emerald-600 to-teal-600',
    description: 'Paste any job description alongside your resume. Instantly identify missing hard skills, critical keywords, and your recruiter match percentage.',
    workflow: [
      '1. Paste target job description',
      '2. Input your current resume text',
      '3. Get real-time match % score',
      '4. Fill missing keywords instantly'
    ],
    ctaText: 'Check ATS Match',
    to: '/ats-checker',
    isPrimary: false
  },
  {
    id: 'interview-prep',
    title: 'AI Interview Prep & Mock',
    badge: '1 Free Mock • Pro Feature',
    badgeVariant: 'indigo',
    icon: BrainCircuit,
    iconColor: 'from-indigo-600 via-purple-600 to-pink-600',
    description: 'Personalized interview questions tailored to your exact resume claims and target job description. Practice with our live AI mock interview simulator.',
    workflow: [
      '1. Load resume + target job description',
      '2. Generate tech & resume defense questions',
      '3. Review STAR method model answers',
      '4. Launch interactive AI Mock Interview'
    ],
    ctaText: 'Start Interview Prep',
    to: '/interview-prep',
    isPrimary: false
  },
  {
    id: 'templates',
    title: 'Resume Templates',
    badge: '100% ATS Verified',
    badgeVariant: 'blue',
    icon: Palette,
    iconColor: 'from-purple-600 to-violet-600',
    description: 'Browse modern, professional, minimalist, and executive templates designed specifically to pass automated applicant tracking systems without error.',
    workflow: [
      '1. Filter by Modern, Minimal, Exec',
      '2. View high-density ATS previews',
      '3. 1-click load into interactive builder',
      '4. Customize brand colors & fonts'
    ],
    ctaText: 'Browse Templates',
    to: '/templates',
    isPrimary: false
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Generator',
    badge: 'AI Tailored in Seconds',
    badgeVariant: 'pink',
    icon: FileText,
    iconColor: 'from-pink-600 to-rose-600',
    description: 'Generate hyper-personalized cover letters aligned with specific companies and roles. Choose from Professional, Confident, or Creative tones.',
    workflow: [
      '1. Enter role title & company name',
      '2. Select tone & key achievements',
      '3. AI synthesizes custom narrative',
      '4. Copy or download in seconds'
    ],
    ctaText: 'Generate Cover Letter',
    to: '/cover-letter',
    isPrimary: false
  },
  {
    id: 'pricing',
    title: 'Transparent Plans & Pricing',
    badge: 'Free Tier Available',
    badgeVariant: 'amber',
    icon: Zap,
    iconColor: 'from-amber-500 to-orange-600',
    description: 'Start for free with core ATS resume building and diagnostics. Upgrade anytime for unlimited AI generation, deep resume rewrites, and mock interviews.',
    workflow: [
      '1. Free access to core resume builder',
      '2. Instant ATS scoring & keywords',
      '3. Pro AI generation & deep audits',
      '4. Unlimited exports & cloud storage'
    ],
    ctaText: 'View Plans & Pricing',
    to: '/pricing',
    isPrimary: false
  }
];

const samplePreviewResumes = [
  {
    role: "Senior Full-Stack Engineer",
    name: "Alex Rivera",
    atsScore: 98,
    matchRate: "Top 2% Candidate",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Redis"],
    summary: "Full-stack architect specialized in distributed cloud systems, real-time streaming, and high-conversion React frontends.",
    experience: "Slashing p99 API latency by 45% with Groq LPU & Redis micro-caching."
  },
  {
    role: "AI & ML Specialist",
    name: "Dr. Sarah Chen",
    atsScore: 95,
    matchRate: "Top 5% Candidate",
    skills: ["Python", "PyTorch", "LLMs", "Groq LPU", "FastAPI", "Vector DBs", "RAG"],
    summary: "Machine learning researcher focused on sub-second inference optimization, semantic search, and RAG pipelines.",
    experience: "Deployed production RAG pipelines handling 2.5M queries monthly."
  },
  {
    role: "Lead Product Manager",
    name: "Marcus Vance",
    atsScore: 94,
    matchRate: "Top 4% Candidate",
    skills: ["Product Strategy", "User Research", "Agile / Scrum", "A/B Testing", "Mixpanel", "SQL"],
    summary: "Product leader passionate about design systems, accessible SaaS interfaces, and developer handoffs.",
    experience: "Spearheaded 0-to-1 SaaS launch driving $1.2M ARR in first 6 months."
  }
];

const featuredTemplates = [
  {
    id: 'modern',
    name: 'Modern Tech Pro',
    category: 'Engineering & Tech',
    atsScore: '99%',
    accent: '#3B82F6',
    desc: 'Clean sans-serif layout with dedicated skill badges and high density.'
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Management & C-Suite',
    atsScore: '98%',
    accent: '#4F46E5',
    desc: 'Structured career progression with revenue metrics and board advisory blocks.'
  },
  {
    id: 'minimal',
    name: 'Minimalist ATS Scanner',
    category: 'Enterprise Standard',
    atsScore: '100%',
    accent: '#0F172A',
    desc: 'Zero-distraction monochrome format guaranteed 100% OCR pass rate.'
  }
];

export default function LandingPage() {
  const [selectedSample, setSelectedSample] = useState(0);
  const currentSample = samplePreviewResumes[selectedSample];
  const { openAuthModal } = useAuthModalStore();

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-indigo-600/15 dark:bg-indigo-600/20 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/15 dark:bg-purple-500/15 blur-[140px]" />
        <div className="absolute bottom-10 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 dark:bg-violet-600/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,#000_60%,transparent_100%)] opacity-70 pointer-events-none" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Extractor AI Platform Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs animate-in fade-in-0 duration-500">
          <Zap className="h-3.5 w-3.5 animate-pulse text-indigo-500" />
          <span>Extractor AI • Intelligent Resume & ATS Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.12]">
          Build a Resume That <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
            Gets You Interviewed
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI-powered resumes optimized for enterprise ATS parsers and real job descriptions. Land high-paying roles with sub-second diagnostic intelligence.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
          <Button asChild size="lg" variant="gradient" className="w-full sm:w-auto h-12 px-8 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/25 gap-2.5">
            <Link to="/builder">
              <Sparkles className="h-4 w-4" />
              <span>Create My Resume</span>
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-2xl font-semibold text-sm border-border/80 bg-card/80 backdrop-blur-md hover:bg-muted/70 gap-2">
            <Link to="/ats-checker">
              <Search className="h-4 w-4 text-primary" />
              <span>Check My Resume</span>
            </Link>
          </Button>
        </div>

        {/* Login Prompt Banner */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-indigo-500" />
          <span>Already have an account or saved resume?</span>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            Sign In Here <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Social Proof Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>99.8% ATS Parse Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>No Signup Required to Build</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Instant PDF Export</span>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 🚀 EXTRACTOR SERVICES & TOOLS (CARD GRID VIEW) */}
      {/* ========================================================================= */}
      <section id="services" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Layers className="h-3.5 w-3.5" />
            <span>Complete AI Career Suite</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Extractor AI Services
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to write, diagnose, test, and optimize your application materials from start to finish.
          </p>
        </div>

        {/* Grid of 6 Comprehensive Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {extractorServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link 
                key={service.id}
                to={service.to}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-primary hover:-translate-y-1.5 cursor-pointer text-left"
              >
                {/* Subtle top gradient line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="p-6 sm:p-7 space-y-4">
                  {/* Top Header: Icon & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${service.iconColor} text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        service.badgeVariant === 'indigo'
                          ? 'border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                          : service.badgeVariant === 'emerald'
                          ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                          : service.badgeVariant === 'purple'
                          ? 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10'
                          : service.badgeVariant === 'pink'
                          ? 'border-pink-500/30 text-pink-600 dark:text-pink-400 bg-pink-500/10'
                          : 'border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10'
                      }`}
                    >
                      {service.badge}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{service.title}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Workflow / Steps bullets */}
                  <div className="pt-2 space-y-1.5 border-t border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Service Workflow:
                    </span>
                    {service.workflow.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                        <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-6 sm:p-7 pt-0">
                  <div 
                    className={`w-full h-11 rounded-xl text-xs font-bold gap-2 flex items-center justify-center transition-all ${
                      service.isPrimary 
                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40" 
                        : "border border-border/80 bg-background/60 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    }`}
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📊 LIVE INTERACTIVE RESUME & ATS SCORE VISUAL */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/90 via-card/60 to-background p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border/60">
            <div>
              <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-500 bg-indigo-500/10 mb-2">
                Live Interactive Diagnostic
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                See How Extractor Scores Your Resume
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Recruiters use ATS algorithms. Extractor gives you the exact formula to score 95%+.
              </p>
            </div>

            {/* Candidate Role Switcher */}
            <div className="flex flex-wrap items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/50">
              {samplePreviewResumes.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSample(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSample === idx 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {sample.role.split(' ')[0]} {sample.role.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            
            {/* Left Column: Simulated Resume Sheet */}
            <div className="lg:col-span-7 rounded-2xl bg-card border border-border/80 p-6 sm:p-8 space-y-5 shadow-lg relative">
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {currentSample.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary mt-0.5">
                    {currentSample.role}
                  </p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold text-xs">
                  {currentSample.matchRate}
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  AI-Optimized Executive Summary
                </span>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
                  {currentSample.summary}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  High-Impact Experience Bullet (Groq Analyzed)
                </span>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 bg-primary/5 p-3 rounded-xl border border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{currentSample.experience}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Extracted Tech Stack & Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSample.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/60 text-foreground border border-border/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: ATS Score Engine Visual */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-background to-purple-950/20 border border-border/80 p-6 sm:p-8">
              
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  Overall ATS Compatibility
                </span>
                <div className="flex items-baseline justify-center gap-1 font-heading text-6xl font-black text-foreground">
                  <span>{currentSample.atsScore}</span>
                  <span className="text-2xl text-indigo-500 font-bold">%</span>
                </div>
                <p className="text-xs text-emerald-500 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Passes 99.4% of Fortune 500 ATS Filters
                </p>
              </div>

              {/* Sub Metrics */}
              <div className="space-y-3 bg-card/60 p-4 rounded-xl border border-border/60">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Action Verbs & Impact</span>
                    <span className="text-primary font-bold">98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Hard Skill Keyword Density</span>
                    <span className="text-emerald-500 font-bold">95%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>OCR Parsing & Layout Simplicity</span>
                    <span className="text-violet-500 font-bold">100%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <Button asChild variant="gradient" className="w-full h-11 rounded-xl text-xs font-bold gap-2">
                <Link to="/builder">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Build This Resume in Builder</span>
                </Link>
              </Button>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🎨 RESUME TEMPLATES SHOWCASE */}
      {/* ========================================================================= */}
      <section id="templates" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-500 bg-indigo-500/10 mb-2">
              ATS Optimized Designs
            </Badge>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Battle-Tested Resume Templates
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Engineered with clean typography, clear section hierarchy, and zero parsing blockers.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-xs font-bold text-primary hover:bg-primary/10 gap-1 self-start sm:self-auto">
            <Link to="/templates">
              <span>View All Templates</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTemplates.map((tpl) => (
            <Card key={tpl.id} className="group overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
              <div className="h-56 bg-slate-100 dark:bg-slate-900/90 p-5 relative flex flex-col justify-between overflow-hidden border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {tpl.category}
                  </span>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    ATS Score {tpl.atsScore}
                  </Badge>
                </div>
                
                {/* Mini Resume Representation */}
                <div className="bg-card p-4 rounded-xl border border-border/70 shadow-md space-y-2.5">
                  <div className="h-3 w-1/3 rounded-sm" style={{ backgroundColor: tpl.accent }} />
                  <div className="h-2 w-3/4 bg-muted rounded-xs" />
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-muted/60 rounded-xs" />
                    <div className="h-1.5 w-5/6 bg-muted/60 rounded-xs" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button asChild size="sm" variant="gradient" className="rounded-xl text-xs font-bold gap-1 shadow-lg">
                    <Link to={`/builder?template=${tpl.id}`}>
                      <span>Use Template</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h4 className="font-heading font-bold text-base text-foreground">
                  {tpl.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tpl.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ⚡ HOW EXTRACTOR WORKS */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-500 bg-indigo-500/10">
            Intelligent Workflow
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How Extractor Works
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            From raw draft to interview-ready application in 3 intuitive steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-heading font-extrabold text-lg flex items-center justify-center mx-auto border border-indigo-500/20">
              1
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Create or Upload</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Start building directly in the browser or upload your existing resume to extract structured history.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-purple-600/15 text-purple-600 dark:text-purple-400 font-heading font-extrabold text-lg flex items-center justify-center mx-auto border border-purple-500/20">
              2
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">AI Diagnostics & Scoring</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan for missing keywords, format errors, weak action verbs, and calculate comprehensive ATS match scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-violet-600/15 text-violet-600 dark:text-violet-400 font-heading font-extrabold text-lg flex items-center justify-center mx-auto border border-violet-500/20">
              3
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Export & Apply</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Save your resume to your account, download pixel-perfect PDFs, and generate matching cover letters.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ❓ FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-500 bg-indigo-500/10">
            Got Questions?
          </Badge>
          <h2 className="font-heading text-3xl font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              Do I need an account to start building my resume?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              No! You can freely explore the resume builder, customize sections, and preview templates without creating an account. When you're ready to save your resume to the cloud or export, you can sign up in 10 seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              What makes Extractor templates ATS-friendly?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              Our templates avoid multi-column tables, floating text boxes, and complex graphics that confuse ATS parsers like Workday, Greenhouse, and Taleo. They are 100% readable by OCR scanners.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              How does the ATS Resume Checker calculate score match?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              Our Groq LPU engine compares your resume against the target job description to measure hard skill presence, job title relevance, impact metrics, and keyword frequency.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 BOTTOM CONVERSION CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-gradient-to-b from-indigo-950/20 via-card to-card shadow-2xl backdrop-blur-xl space-y-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25">
            <Zap className="h-7 w-7" />
          </div>
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to Land Your Next Dream Opportunity?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join thousands of tech candidates using Extractor to craft high-converting, ATS-proof resumes and cover letters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" variant="gradient" className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/25 gap-2">
              <Link to="/builder">
                <Sparkles className="h-4 w-4" />
                <span>Start Building for Free</span>
              </Link>
            </Button>
            <Button 
              type="button" 
              size="lg" 
              variant="outline" 
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold text-xs border-border/80 hover:bg-accent gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4 text-primary" />
              <span>Sign In to Account</span>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
