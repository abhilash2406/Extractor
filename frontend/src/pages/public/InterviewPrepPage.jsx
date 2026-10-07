import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Briefcase, 
  Code, 
  UserCheck, 
  MessageSquare, 
  Award, 
  Zap, 
  RefreshCw, 
  Play, 
  Check, 
  Lock, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  Mic, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Layers,
  Sparkle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

// Sample Profiles & Job Descriptions for Quick Start
const sampleProfiles = [
  {
    id: 'fullstack',
    title: 'Senior Full-Stack (React & Node.js)',
    role: 'Senior Full-Stack Engineer',
    resumeSnippet: `Alex Rivera - Senior Full-Stack Engineer
• Engineered real-time notification engine using WebSockets & Redis pub/sub serving 120k active users.
• Slashed p99 PostgreSQL query latency by 45% via multi-column indexing & query plan optimization.
• Architected scalable micro-frontends with React 19, TypeScript, and Tailwind CSS.
• Deployed production Docker containers on AWS ECS with automated CI/CD pipelines.`,
    jdSnippet: `Target Role: Senior Full-Stack Engineer
Requirements:
- 5+ years experience with React, TypeScript, and Node.js backend services.
- Deep knowledge of PostgreSQL database indexing, transactions, and Redis caching.
- Hands-on experience with Docker containerization and AWS (ECS, Lambda, S3).
- Strong understanding of WebSocket architecture and distributed messaging.`
  },
  {
    id: 'ai_engineer',
    title: 'AI & ML Engineer (Python & LLMs)',
    role: 'AI / Machine Learning Engineer',
    resumeSnippet: `Dr. Sarah Chen - Machine Learning Specialist
• Deployed sub-second semantic search RAG pipelines handling 2.5M queries monthly on Groq LPU.
• Built custom tokenization & embedding classifiers using PyTorch, FastAPI, and Qdrant vector DB.
• Orchestrated model quantization (4-bit/8-bit AWQ) reducing GPU memory footprint by 60%.`,
    jdSnippet: `Target Role: AI / ML Engineer
Requirements:
- 4+ years building production ML systems with Python, PyTorch, and FastAPI.
- Hands-on experience with LLM orchestration, RAG architectures, and Vector databases.
- Experience with low-latency inference optimization on Groq LPU or TensorRT.`
  }
];

// Pre-generated comprehensive questions data based on profile
const mockGeneratedPrep = {
  technical: [
    {
      category: 'React.js & Frontend Architecture',
      question: 'What is the exact difference between useMemo and useCallback in React, and when can misuse hurt performance?',
      idealAnswer: 'useMemo caches the result of a calculated value, while useCallback caches the function definition itself between renders. Misuse happens when wrapping trivial calculations or simple inline functions—adding memoization overhead, memory pressure, and dependency array comparison costs without any render performance gain.',
      keyPoints: ['useMemo returns value, useCallback returns function', 'Prevents unnecessary child re-renders with React.memo', 'Avoid premature optimization on cheap primitives'],
      difficulty: 'Intermediate'
    },
    {
      category: 'React.js Reconciliation',
      question: 'How does the React Fiber reconciliation algorithm work when rendering virtual DOM trees?',
      idealAnswer: 'React Fiber breaks rendering work into incremental units (fibers). It uses a two-phase architecture: a reconciler/render phase (can be paused, aborted, or prioritized) and a commit phase (synchronous DOM mutations). The diffing algorithm uses key props and component types to achieve O(n) heuristic tree comparisons.',
      keyPoints: ['Fiber allows interruptible work & concurrency', 'Render phase vs Commit phase', 'Heuristic O(n) tree diffing with unique keys'],
      difficulty: 'Advanced'
    },
    {
      category: 'Node.js & Backend Concurrency',
      question: 'How does the Node.js event loop handle asynchronous I/O across its different execution phases?',
      idealAnswer: 'The libuv event loop processes operations through distinct phases: Timers (setTimeout/setInterval) -> Pending Callbacks (I/O errors) -> Idle/Prepare -> Poll (retrieves new I/O events) -> Check (setImmediate) -> Close callbacks. process.nextTick and microtask queues execute immediately after each operation before moving phases.',
      keyPoints: ['Libuv event loop lifecycle phases', 'Poll phase handles incoming I/O', 'Microtasks (Promises, nextTick) have highest priority'],
      difficulty: 'Advanced'
    },
    {
      category: 'Database & Performance',
      question: 'How do B-Tree indexes work in PostgreSQL, and what steps do you take to diagnose and optimize a slow query?',
      idealAnswer: 'B-Tree indexes keep data sorted in a balanced tree structure, allowing O(log n) lookups. To optimize a slow query, I run `EXPLAIN (ANALYZE, BUFFERS)` to check execution plans for Sequential Scans vs Index Scans, examine missing indexes or filter selectivity, eliminate N+1 queries, and tune work_mem or connection pooling.',
      keyPoints: ['EXPLAIN ANALYZE execution plan breakdown', 'Sequential Scan vs Index Scan / Index Only Scan', 'Composite index column ordering (Leftmost prefix)'],
      difficulty: 'Advanced'
    }
  ],
  resumeBased: [
    {
      sourceClaim: 'Resume: "Engineered real-time notification engine using WebSockets & Redis pub/sub serving 120k active users."',
      question: 'Why did you choose WebSockets instead of Server-Sent Events (SSE) or HTTP long-polling for this notification system?',
      followUp: 'How did you handle WebSocket connection reconnects and horizontal scaling across multiple server instances?',
      starFramework: {
        situation: 'Real-time alert delivery required sub-100ms latency for 120,000 active concurrent connections.',
        task: 'Deliver bidirectional events without overwhelming HTTP request throughput.',
        action: 'Selected WebSockets with Redis Pub/Sub adapter to sync socket events across 4 Node.js instances behind an AWS ALB with sticky sessions and exponential backoff on client reconnects.',
        result: 'Achieved 35ms average latency with 99.98% socket delivery uptime.'
      }
    },
    {
      sourceClaim: 'Resume: "Slashed p99 PostgreSQL query latency by 45% via multi-column indexing & query plan optimization."',
      question: 'Walk me through a specific slow query you found. What did EXPLAIN ANALYZE show, and why did a multi-column index solve it?',
      followUp: 'How did you ensure the new index didn’t adversely slow down write-heavy INSERT operations?',
      starFramework: {
        situation: 'A user analytics report query took 2.4 seconds during peak hours causing database connection pool saturation.',
        task: 'Bring p99 latency under 200ms without restructuring table schemas.',
        action: 'Identified a Bitmap Heap Scan filtering by `user_id` and `created_at`. Created a composite index `(user_id, created_at DESC)` and eliminated unnecessary JOINs.',
        result: 'Reduced query execution from 2.4s to 120ms (45% aggregate p99 reduction) with negligible 2% write overhead.'
      }
    }
  ],
  jobDescriptionBased: [
    {
      jdRequirement: 'Docker Containerization & Multi-Stage Builds',
      question: 'How do you Dockerize a Node.js/React application for production, and how do multi-stage builds help?',
      idealAnswer: 'A multi-stage build separates build dependencies (TypeScript compiler, npm devDependencies) from the lean production runtime. In stage 1 (build), we compile assets. In stage 2 (runtime), we copy only production node_modules and compiled dist files into an Alpine Linux base image, reducing image size from 800MB to under 90MB and removing attack vectors.',
      keyPoints: ['Separates build environment from runtime', 'Alpine Linux for minimal attack surface & small images', 'Run as non-root user (`USER node`) for container security']
    },
    {
      jdRequirement: 'AWS ECS & Infrastructure Architecture',
      question: 'What is the difference between AWS ECS Fargate vs EC2 launch types, and how do you secure environment secrets in ECS?',
      idealAnswer: 'Fargate is serverless container management where AWS manages the underlying EC2 instances, while EC2 gives you direct OS-level control over cluster nodes. For secrets, we inject AWS Secrets Manager or SSM Parameter Store values directly into task definition environment variables at runtime using IAM task execution roles, avoiding hardcoded keys.',
      keyPoints: ['Fargate (serverless) vs EC2 (managed instances)', 'IAM Task Execution Roles for fine-grained permissions', 'AWS Secrets Manager / SSM parameter injection']
    }
  ],
  behavioralHR: [
    {
      question: 'Tell me about yourself and your journey as a Senior Software Engineer.',
      personalizedAnswer: 'I am a Full-Stack Engineer with 6+ years of experience building high-throughput distributed systems and intuitive React applications. Most recently at CloudScale, I led real-time microservices and database performance initiatives, scaling services to 120k users while slashing p99 latency by 45%. I focus on engineering clean, maintainable software and mentoring engineering teams.',
      proTip: 'Keep it to 90 seconds. Focus on: Past Experience -> Core Strengths & Impact -> Why This Specific Role.'
    },
    {
      question: 'Why are you interested in joining our team for this position?',
      personalizedAnswer: 'Your team is solving real scalability challenges at high velocity. Looking at your tech stack (React, Node.js, and AWS microservices), it directly aligns with my track record in optimizing real-time streaming and distributed architectures. I am excited to contribute to your core platform reliability and feature delivery.',
      proTip: 'Tie your past accomplishments directly to the company’s product mission and tech stack.'
    },
    {
      question: 'Describe a time you had a technical disagreement with a teammate. How did you resolve it?',
      personalizedAnswer: 'When designing our caching layer, a teammate proposed caching all API responses at the gateway layer, while I advocated for targeted Redis micro-caching at the service layer to avoid serving stale authenticated data. We set up an A/B benchmark measuring cache invalidation complexity and p99 latency. The data proved service-level caching provided 98% cache hit rates with zero stale data issues, and we documented this as our team standard.',
      proTip: 'Demonstrate data-driven decision making, respect for peers, and zero ego.'
    }
  ],
  mockQuestions: [
    {
      id: 1,
      category: 'System Design & Real-Time Arch',
      question: 'Your application needs to send real-time price updates to 50,000 active browser clients. How would you design the architecture from frontend WebSocket connections to backend message brokers?',
      sampleGoodResponse: 'I would use a React frontend connected via WebSocket to an AWS Application Load Balancer with sticky sessions and TLS termination. The ALB distributes connections across Node.js WebSocket gateway pods. The gateways subscribe to a Redis Pub/Sub cluster or Kafka topic. When pricing updates occur, the worker publishes to Redis, and each gateway broadcasts to its connected clients.',
      evaluationCriteria: ['WebSocket connection lifecycle', 'Redis/Kafka pub-sub broadcast', 'Load balancing & client reconnection']
    },
    {
      id: 2,
      category: 'Frontend Performance & State',
      question: 'A critical dashboard page in React is freezing when rendering 10,000 live data rows. What specific strategies would you use to diagnose and fix this rendering bottleneck?',
      sampleGoodResponse: 'First, I would use React DevTools Profiler to inspect render durations and identify unnecessary re-renders. To solve the 10,000 row issue, I would implement windowing/virtualization using react-virtual to render only visible DOM nodes (e.g. 30 rows at a time). I would also memoize row components with React.memo and move heavy transformations into Web Workers or useTransition.',
      evaluationCriteria: ['Virtualization / Windowing (react-virtual)', 'Profiling before optimizing', 'useTransition or Web Workers for CPU compute']
    },
    {
      id: 3,
      category: 'Database Resilience & Concurrency',
      question: 'How do you prevent race conditions and handle concurrent seat bookings or transaction updates in PostgreSQL?',
      sampleGoodResponse: 'I would use database transactions with appropriate isolation levels (Repeatable Read or Serializable) along with pessimistic row locking using `SELECT ... FOR UPDATE` on the specific seat record. Alternatively, for optimistic concurrency, I would use an integer `version` column and update with `WHERE version = current_version`.',
      evaluationCriteria: ['Pessimistic locking (SELECT FOR UPDATE)', 'Optimistic locking with version column', 'Transaction isolation levels']
    }
  ]
};

export default function InterviewPrepPage() {
  const [selectedProfileId, setSelectedProfileId] = useState('fullstack');
  const [resumeText, setResumeText] = useState(sampleProfiles[0].resumeSnippet);
  const [jdText, setJdText] = useState(sampleProfiles[0].jdSnippet);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');
  const [prepData, setPrepData] = useState(mockGeneratedPrep);
  const [expandedIndex, setExpandedIndex] = useState(0);

  // Mock Interview State
  const [mockState, setMockState] = useState('idle'); // 'idle' | 'in_progress' | 'evaluated'
  const [currentMockQuestionIndex, setCurrentMockQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [mockFeedbackList, setMockFeedbackList] = useState([]);
  const [mockSeconds, setMockSeconds] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Freemium tracking: 1 free mock interview
  const [mockInterviewsCompleted, setMockInterviewsCompleted] = useState(() => {
    return parseInt(localStorage.getItem('extractor_mock_interview_count') || '0', 10);
  });

  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();

  // Timer effect for mock interview
  useEffect(() => {
    let timer;
    if (mockState === 'in_progress') {
      timer = setInterval(() => setMockSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mockState]);

  const handleProfileSelect = (profile) => {
    setSelectedProfileId(profile.id);
    setResumeText(profile.resumeSnippet);
    setJdText(profile.jdSnippet);
    toast.success(`Loaded ${profile.title} preset!`);
  };

  const handleGeneratePrep = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPrepData(mockGeneratedPrep);
      setIsGenerating(false);
      toast.success('Generated tailored interview prep materials!');
    }, 900);
  };

  // Mock Interview Start
  const handleStartMockInterview = () => {
    // Check if free session is already used
    if (mockInterviewsCompleted >= 1) {
      setShowSubscriptionModal(true);
      return;
    }

    setMockState('in_progress');
    setCurrentMockQuestionIndex(0);
    setCandidateAnswer('');
    setMockFeedbackList([]);
    setMockSeconds(0);
    toast.success('Mock Interview Started! Answer question 1.');
  };

  // Submit Mock Answer
  const handleSubmitMockAnswer = () => {
    if (!candidateAnswer.trim()) {
      toast.error('Please provide an answer before submitting.');
      return;
    }

    setIsEvaluatingAnswer(true);

    setTimeout(() => {
      const currentQ = prepData.mockQuestions[currentMockQuestionIndex];
      const newFeedback = {
        questionId: currentQ.id,
        question: currentQ.question,
        category: currentQ.category,
        userAnswer: candidateAnswer,
        score: Math.floor(Math.random() * 15) + 80, // 80 - 95 score
        strengths: [
          'Directly addressed the core architectural mechanism.',
          'Demonstrated clear understanding of scalability trade-offs.',
          'Used correct technical terminology and terminology precision.'
        ],
        improvements: [
          'Could explicitly mention error recovery and retry strategies.',
          'Consider quantifying throughput thresholds in real-world scenarios.'
        ],
        idealPoints: currentQ.sampleGoodResponse
      };

      const updatedList = [...mockFeedbackList, newFeedback];
      setMockFeedbackList(updatedList);
      setIsEvaluatingAnswer(false);
      setCandidateAnswer('');

      if (currentMockQuestionIndex < prepData.mockQuestions.length - 1) {
        setCurrentMockQuestionIndex(prev => prev + 1);
        toast.success('Answer recorded! Next question loaded.');
      } else {
        // Complete mock interview
        setMockState('evaluated');
        const nextCount = mockInterviewsCompleted + 1;
        setMockInterviewsCompleted(nextCount);
        localStorage.setItem('extractor_mock_interview_count', String(nextCount));
        toast.success('Mock Interview Completed! Review your evaluation report.');
      }
    }, 850);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ========================================================================= */}
        {/* 🌟 HERO HEADER */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
            <BrainCircuit className="h-4 w-4 animate-pulse text-indigo-500" />
            <span>AI Interview Prep & Mock Simulator</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Targeted AI Interview Prep & <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
              Live Mock Interview Simulator
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Generate customized technical deep-dives, resume defense questions, and job-tailored STAR responses. Practice with real-time AI evaluation.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🛠️ DUAL INPUT STUDIO: RESUME + JOB DESCRIPTION */}
        {/* ========================================================================= */}
        <Card className="border-border bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  Personalize Your Interview Prep
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Load your resume claims and target job requirements to generate role-specific questions.
                </CardDescription>
              </div>

              {/* Sample Preset Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-semibold text-muted-foreground hidden md:inline">Presets:</span>
                {sampleProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProfileSelect(p)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                      selectedProfileId === p.id
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {p.role.split(' ')[0]} {p.role.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Resume Snippet */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Your Resume Highlights & Achievements
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-input bg-background p-4 text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none shadow-xs text-foreground"
                  placeholder="Paste your resume experience bullets or achievements here..."
                />
              </div>

              {/* Right: Target Job Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Target Job Description & Stack
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-input bg-background p-4 text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none shadow-xs text-foreground"
                  placeholder="Paste target job requirements and tech stack..."
                />
              </div>

            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/80">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>100% Customized to your specific resume bullets & job spec</span>
              </div>

              <Button
                type="button"
                onClick={handleGeneratePrep}
                disabled={isGenerating}
                className="w-full sm:w-auto h-10 px-6 rounded-xl font-semibold text-xs gap-2 shadow-xs justify-center"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Tailored Prep...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-current" />
                    <span>Generate Tailored Interview Prep</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* 📚 5 PREP MODULES WITH INTERACTIVE TABS */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          
          {/* Navigation Tab Bar */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2">
            <div className="flex p-1.5 bg-card border border-border rounded-2xl gap-1.5 shadow-xs">
              
              <button
                onClick={() => setActiveTab('technical')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'technical'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <Code className="h-4 w-4" />
                <span>1. Technical Questions</span>
              </button>

              <button
                onClick={() => setActiveTab('resume')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'resume'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>2. Resume Defense</span>
              </button>

              <button
                onClick={() => setActiveTab('jd')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'jd'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>3. Job-Based Questions</span>
              </button>

              <button
                onClick={() => setActiveTab('behavioral')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'behavioral'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>4. Behavioral & HR</span>
              </button>

              <button
                onClick={() => setActiveTab('mock')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'mock'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>5. AI Mock Interview</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[9px] uppercase">
                  1 Free
                </span>
              </button>

            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: 💻 TECHNICAL QUESTIONS */}
          {/* ========================================================= */}
          {activeTab === 'technical' && (
            <div className="space-y-4 animate-in fade-in-0 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Deep Technical Questions & Solutions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    High-yield conceptual and architectural questions expected for this stack.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {prepData.technical.length} Core Questions
                </Badge>
              </div>

              <div className="space-y-3">
                {prepData.technical.map((item, idx) => (
                  <Card key={idx} className="border-border/80 shadow-xs bg-card/80 overflow-hidden">
                    <div 
                      onClick={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {item.category}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {item.difficulty}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-foreground">
                          {item.question}
                        </h4>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0">
                        {expandedIndex === idx ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>

                    {expandedIndex === idx && (
                      <div className="p-5 pt-0 border-t border-border/50 bg-muted/10 space-y-4 animate-in fade-in-0 duration-200">
                        <div className="space-y-1.5 pt-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            Ideal Technical Explanation
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed bg-card p-3 rounded-xl border border-border/60">
                            {item.idealAnswer}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                            Key Talking Points to Mention:
                          </span>
                          <div className="space-y-1">
                            {item.keyPoints.map((pt, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 📄 RESUME DEFENSE (STAR METHOD) */}
          {/* ========================================================= */}
          {activeTab === 'resume' && (
            <div className="space-y-4 animate-in fade-in-0 duration-300">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Resume-Specific Deep Dive Questions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Questions generated specifically based on what you claim on your resume.
                </p>
              </div>

              <div className="space-y-4">
                {prepData.resumeBased.map((item, idx) => (
                  <Card key={idx} className="border-border/80 shadow-sm bg-card p-6 space-y-4 rounded-3xl">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2 text-xs font-semibold text-primary">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>{item.sourceClaim}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        "{item.question}"
                      </h4>
                      <p className="text-xs text-muted-foreground pl-6">
                        <strong>Follow-up expected:</strong> {item.followUp}
                      </p>
                    </div>

                    {/* STAR Framework Response */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        Suggested STAR Method Response Strategy:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-card border border-border/50 space-y-1">
                          <strong className="text-indigo-500 uppercase text-[10px]">Situation:</strong>
                          <p className="text-muted-foreground leading-relaxed">{item.starFramework.situation}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/50 space-y-1">
                          <strong className="text-indigo-500 uppercase text-[10px]">Task:</strong>
                          <p className="text-muted-foreground leading-relaxed">{item.starFramework.task}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/50 space-y-1">
                          <strong className="text-purple-500 uppercase text-[10px]">Action:</strong>
                          <p className="text-muted-foreground leading-relaxed">{item.starFramework.action}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/50 space-y-1">
                          <strong className="text-emerald-500 uppercase text-[10px]">Result:</strong>
                          <p className="text-muted-foreground leading-relaxed">{item.starFramework.result}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: 🎯 JOB DESCRIPTION MATCHING */}
          {/* ========================================================= */}
          {activeTab === 'jd' && (
            <div className="space-y-4 animate-in fade-in-0 duration-300">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Job Description Alignment Questions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Targeted questions verifying your qualifications against stated job requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prepData.jobDescriptionBased.map((item, idx) => (
                  <Card key={idx} className="border-border/80 shadow-sm bg-card p-6 flex flex-col justify-between space-y-4 rounded-3xl">
                    <div className="space-y-3">
                      <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-bold">
                        Requirement: {item.jdRequirement}
                      </Badge>
                      <h4 className="font-heading font-bold text-sm text-foreground leading-snug">
                        {item.question}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                        {item.idealAnswer}
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-border/50">
                      <span className="text-[10px] font-bold uppercase text-primary">Key Concepts:</span>
                      {item.keyPoints.map((kp, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                          <span>{kp}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: 🤝 BEHAVIORAL & HR QUESTIONS */}
          {/* ========================================================= */}
          {activeTab === 'behavioral' && (
            <div className="space-y-4 animate-in fade-in-0 duration-300">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Profile-Customized HR & Culture Questions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Personalized answers tailored to your real background rather than generic textbook scripts.
                </p>
              </div>

              <div className="space-y-4">
                {prepData.behavioralHR.map((item, idx) => (
                  <Card key={idx} className="border-border/80 shadow-sm bg-card p-6 space-y-3 rounded-3xl">
                    <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary shrink-0" />
                      "{item.question}"
                    </h4>

                    <div className="space-y-1.5 pl-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                        Your Tailored Pitch:
                      </span>
                      <p className="text-xs text-foreground/90 leading-relaxed bg-muted/30 p-3.5 rounded-2xl border border-border/60">
                        "{item.personalizedAnswer}"
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-500 pt-1 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Pro Tip: {item.proTip}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: ⭐ LIVE AI MOCK INTERVIEW SIMULATOR */}
          {/* ========================================================= */}
          {activeTab === 'mock' && (
            <div className="space-y-6 animate-in fade-in-0 duration-300">
              
              {/* Mock Status Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-violet-600/15 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-lg text-foreground">
                      Live AI Mock Interview Simulator
                    </span>
                    <Badge className="bg-amber-400/20 text-amber-500 dark:text-amber-400 border-amber-400/30 text-[10px] font-bold">
                      {mockInterviewsCompleted === 0 ? "1 Free Session Available" : "Pro Feature"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Experience an interactive hiring manager interview with sub-second feedback and scoring.
                  </p>
                </div>

                {mockState === 'idle' && (
                  <Button
                    type="button"
                    onClick={handleStartMockInterview}
                    variant="gradient"
                    size="lg"
                    className="h-11 px-6 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-indigo-500/25 shrink-0"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Start Mock Interview</span>
                  </Button>
                )}
              </div>

              {/* State 1: In Progress Active Session */}
              {mockState === 'in_progress' && (
                <Card className="border-primary/50 shadow-2xl bg-card p-6 sm:p-8 space-y-6 rounded-3xl animate-in zoom-in-95 duration-200">
                  
                  {/* Top Bar: Progress & Timer */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-bold border-indigo-500/40 text-indigo-500">
                        Question {currentMockQuestionIndex + 1} of {prepData.mockQuestions.length}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {prepData.mockQuestions[currentMockQuestionIndex].category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold px-3 py-1 rounded-lg bg-muted/60 text-primary border border-border/50">
                      <span>⏱️ {formatTimer(mockSeconds)}</span>
                    </div>
                  </div>

                  {/* AI Question Box */}
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      <Bot className="h-4 w-4" />
                      <span>Interviewer Question:</span>
                    </div>
                    <p className="font-heading font-bold text-base sm:text-lg text-foreground">
                      "{prepData.mockQuestions[currentMockQuestionIndex].question}"
                    </p>
                  </div>

                  {/* Candidate Answer Input */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Your Response:</span>
                      <span className="text-[11px] text-muted-foreground font-normal">Speak or type your full technical answer</span>
                    </label>

                    <textarea
                      value={candidateAnswer}
                      onChange={(e) => setCandidateAnswer(e.target.value)}
                      rows={5}
                      placeholder="Type your structured answer here (mention technologies, trade-offs, and architecture)..."
                      className="w-full rounded-2xl border border-input bg-background p-4 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-xs font-sans"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setMockState('idle')}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Exit Session
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmitMockAnswer}
                      disabled={isEvaluatingAnswer || !candidateAnswer.trim()}
                      variant="gradient"
                      className="h-11 px-6 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-indigo-500/25"
                    >
                      {isEvaluatingAnswer ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>AI Evaluating Response...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer & Next</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                </Card>
              )}

              {/* State 2: Final Evaluation Report */}
              {mockState === 'evaluated' && (
                <div className="space-y-6 animate-in fade-in-up duration-300">
                  
                  {/* Evaluation Score Card */}
                  <Card className="border-border/80 shadow-2xl bg-card p-6 sm:p-8 rounded-3xl">
                    <div className="text-center space-y-2 pb-6 border-b border-border/60">
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs border-emerald-500/30">
                        Interview Simulation Complete
                      </Badge>
                      <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                        Overall Performance Score: <span className="text-primary font-black">78%</span>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Strong architectural instincts. Ready for mid-to-senior level engineering loops.
                      </p>
                    </div>

                    {/* Breakdown Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Technical Depth</span>
                        <div className="text-2xl font-black text-foreground">82%</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Communication</span>
                        <div className="text-2xl font-black text-indigo-500">76%</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Problem Solving</span>
                        <div className="text-2xl font-black text-emerald-500">80%</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Confidence</span>
                        <div className="text-2xl font-black text-violet-500">71%</div>
                      </div>
                    </div>

                    {/* Question Feedback Cards */}
                    <div className="space-y-4 pt-2">
                      <h4 className="font-heading font-bold text-sm text-foreground">
                        Detailed Question Evaluations:
                      </h4>

                      {mockFeedbackList.map((fb, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <span className="font-heading font-bold text-xs text-foreground">
                              Q{idx + 1}: {fb.question}
                            </span>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold shrink-0">
                              Score: {fb.score}%
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                            <div className="p-3 rounded-xl bg-card border border-border/50 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-emerald-500 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Key Strengths:
                              </span>
                              {fb.strengths.map((s, i) => (
                                <p key={i} className="text-muted-foreground leading-relaxed">• {s}</p>
                              ))}
                            </div>

                            <div className="p-3 rounded-xl bg-card border border-border/50 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Improvement Areas:
                              </span>
                              {fb.improvements.map((imp, i) => (
                                <p key={i} className="text-muted-foreground leading-relaxed">• {imp}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-border/60 mt-6">
                      <Button
                        type="button"
                        onClick={() => setShowSubscriptionModal(true)}
                        variant="gradient"
                        className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs gap-2 shadow-md shadow-indigo-500/25"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Unlock Unlimited Mock Interviews</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMockState('idle')}
                        className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-semibold"
                      >
                        Back to Overview
                      </Button>
                    </div>

                  </Card>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🔒 SUBSCRIPTION MODAL FOR PAID MOCK INTERVIEWS */}
      {/* ========================================================================= */}
      <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl rounded-3xl">
          
          <div className="p-6 sm:p-8 text-center space-y-4 bg-gradient-to-b from-indigo-500/15 via-card to-card border-b border-border/60">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25">
              <Star className="h-7 w-7 fill-amber-300 text-amber-300" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="font-heading text-2xl font-extrabold text-foreground">
                Unlock Unlimited Mock Interviews
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
                You have completed your 1 free mock interview session. Upgrade to Pro to unlock continuous interview loops and AI speech grading.
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Unlimited Full-Length Technical & Behavioral Mocks</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Live Speech & Vocal Tone AI Evaluation</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>FAANG & Fortune 500 Company-Specific Question Banks</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button
                type="button"
                onClick={() => {
                  setShowSubscriptionModal(false);
                  if (isAuthenticated) {
                    window.location.href = '/pricing';
                  } else {
                    openAuthModal('register');
                  }
                }}
                variant="gradient"
                className="w-full h-12 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-indigo-500/25 justify-center"
              >
                <Sparkles className="h-4 w-4" />
                <span>Upgrade to Pro Interview Pass</span>
              </Button>

              <Button
                type="button"
                onClick={() => setShowSubscriptionModal(false)}
                variant="ghost"
                className="w-full h-10 rounded-xl text-xs font-semibold text-muted-foreground"
              >
                Maybe Later
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}
