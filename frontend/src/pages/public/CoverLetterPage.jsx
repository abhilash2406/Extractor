import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Bot,
  Copy,
  CheckCircle2,
  ArrowRight,
  Download,
  RefreshCw,
  Zap,
  StopCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { getMyResumes } from '@/api/resumes.api';
import { streamCoverLetter } from '@/api/coverLetter.api';

const TONE_OPTIONS = [
  'Confident & Impact-Driven',
  'Executive & Strategic',
  'Warm & Collaborative',
  'Concise & Direct',
];

const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short', hint: '~105 words' },
  { id: 'standard', label: 'Standard', hint: '~170 words' },
  { id: 'detailed', label: 'Detailed', hint: '~255 words' },
];

export default function CoverLetterPage() {
  const { user, isAuthenticated } = useAuthStore();

  // Form Inputs
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('Hiring Team');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdField, setShowJdField] = useState(false);
  const [tone, setTone] = useState('Confident & Impact-Driven');
  const [length, setLength] = useState('standard');

  // Optional Saved Resume Context (for signed-in users)
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  // Generation & Real-time Progress State
  const [generating, setGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [metaInfo, setMetaInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  const abortRef = useRef(null);

  // Pre-fill name/email and load saved resumes when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setSavedResumes([]);
      setSelectedResumeId('');
      return;
    }

    if (user) {
      setCandidateName((prev) => prev || user.name || user.username || '');
      setCandidateEmail((prev) => prev || user.email || '');
    }

    let mounted = true;
    getMyResumes({ limit: 20 })
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.data || [];
        setSavedResumes(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        // non-blocking optional enhancement
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  // Abort in-flight stream on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Auto-fill skills/contact when user selects one of their saved resumes
  const handleSelectResume = (resumeId) => {
    setSelectedResumeId(resumeId);
    if (!resumeId) return;
    const found = savedResumes.find((r) => r.id === resumeId);
    const content = found?.content;
    if (!content || typeof content !== 'object') return;

    const personal = content.personal || content.personalInfo || {};
    if (personal.fullName || personal.name) {
      setCandidateName(personal.fullName || personal.name);
    }
    if (personal.email) {
      setCandidateEmail(personal.email);
    }
    if (Array.isArray(content.skills) && content.skills.length > 0) {
      const skillNames = content.skills
        .map((s) => (typeof s === 'string' ? s : s?.name || s?.label || ''))
        .filter(Boolean)
        .slice(0, 10)
        .join(', ');
      if (skillNames) setKeySkills(skillNames);
    }
    toast.success(`Tailoring with "${found.title || 'Saved Resume'}"`);
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setGenerating(false);
    setProgressStage('Generation stopped');
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();

    if (!jobTitle.trim() || jobTitle.trim().length < 2) {
      toast.error('Please enter your target job title.');
      return;
    }
    if (!companyName.trim() || companyName.trim().length < 2) {
      toast.error('Please enter the company name.');
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setGenerating(true);
    setGeneratedLetter('');
    setMetaInfo(null);
    setProgressPercent(2);
    setProgressStage('Initializing AI request...');

    try {
      await streamCoverLetter(
        {
          jobTitle: jobTitle.trim(),
          companyName: companyName.trim(),
          hiringManager: hiringManager.trim() || 'Hiring Team',
          candidateName: candidateName.trim(),
          candidateEmail: candidateEmail.trim(),
          keySkills: keySkills.trim(),
          jobDescription: jobDescription.trim(),
          tone,
          length,
          resumeId: selectedResumeId || undefined,
        },
        {
          signal: controller.signal,
          onProgress: ({ percent, stage }) => {
            if (typeof percent === 'number') setProgressPercent(percent);
            if (stage) setProgressStage(stage);
          },
          onChunk: ({ chunk, percent, stage }) => {
            if (chunk) setGeneratedLetter((prev) => prev + chunk);
            if (typeof percent === 'number') setProgressPercent(percent);
            if (stage) setProgressStage(stage);
          },
          onDone: ({ percent, stage, text, wordCount, latencyMs }) => {
            if (text) setGeneratedLetter(text);
            setProgressPercent(percent ?? 100);
            setProgressStage(stage || 'Cover letter ready!');
            setMetaInfo({ wordCount, latencyMs });
          },
        }
      );
      toast.success('Cover letter generated! Ready to copy.');
    } catch (err) {
      if (err.name === 'AbortError') return;
      toast.error(err.message || 'Failed to generate cover letter.');
      setProgressPercent(0);
      setProgressStage('');
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  };

  const handleCopy = async () => {
    if (!generatedLetter.trim()) return;
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      toast.success('Copied cover letter to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy automatically. Please select and copy the text.');
    }
  };

  const handleDownloadTxt = () => {
    if (!generatedLetter.trim()) return;
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeCompany = (companyName || 'cover-letter').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `cover-letter-${safeCompany}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const liveWordCount = generatedLetter.trim()
    ? generatedLetter.trim().split(/\s+/).length
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
            <Bot className="h-4 w-4 text-indigo-500" />
            <span>Free AI Cover Letter Generator • Groq LPU</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Generate Tailored{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
              Cover Letters in Seconds
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Completely free, private, and instant — we never store your cover letters. Generate, fine-tune, and copy straight into your application.
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Controls Form (5 cols) */}
          <Card className="lg:col-span-5 border-border/80 shadow-md bg-card">
            <CardHeader className="p-5 sm:p-6 pb-3">
              <CardTitle className="text-base font-bold">Role & Personalization Details</CardTitle>
              <CardDescription className="text-xs">
                Enter the target role and company — optionally attach a saved resume or job description.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-2">
              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Optional Saved Resume Import (authenticated users only) */}
                {isAuthenticated && savedResumes.length > 0 && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-primary">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Tailor from Saved Resume (Optional)</span>
                    </Label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => handleSelectResume(e.target.value)}
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">None — use manual inputs below</option>
                      {savedResumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title || 'Untitled Resume'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cl-title" className="text-xs font-semibold">
                      Target Job Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cl-title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Full-Stack Engineer"
                      required
                      className="rounded-xl text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cl-company" className="text-xs font-semibold">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cl-company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, Vercel"
                      required
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cl-name" className="text-xs font-semibold">
                      Your Name
                    </Label>
                    <Input
                      id="cl-name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="rounded-xl text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cl-email" className="text-xs font-semibold">
                      Your Email (Sign-off)
                    </Label>
                    <Input
                      id="cl-email"
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cl-manager" className="text-xs font-semibold">
                    Hiring Manager or Department
                  </Label>
                  <Input
                    id="cl-manager"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                    placeholder="e.g. Engineering Hiring Team"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cl-skills" className="text-xs font-semibold">
                    Key Skills & Highlights
                  </Label>
                  <Input
                    id="cl-skills"
                    value={keySkills}
                    onChange={(e) => setKeySkills(e.target.value)}
                    placeholder="e.g. React, Node.js, PostgreSQL, AWS, System Design"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                {/* Collapsible Job Description Paste */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setShowJdField((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {showJdField ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    <span>{showJdField ? 'Hide Job Description' : '+ Paste Job Description for sharper matching'}</span>
                  </button>
                  {showJdField && (
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={4}
                      placeholder="Paste key responsibilities or requirements from the job posting..."
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  )}
                </div>

                {/* Tone & Length */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Tone of Voice</Label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {TONE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Letter Length</Label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 border border-border/60">
                      {LENGTH_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setLength(opt.id)}
                          title={opt.hint}
                          className={`h-7 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            length === opt.id
                              ? 'bg-primary text-primary-foreground shadow-xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generate / Stop Button */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="submit"
                    disabled={generating}
                    variant="gradient"
                    className="flex-1 h-11 rounded-xl text-xs font-bold gap-2 shadow-md shadow-indigo-500/25"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Generating ({progressPercent}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>{generatedLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}</span>
                      </>
                    )}
                  </Button>

                  {generating && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleStop}
                      className="h-11 px-3.5 rounded-xl text-xs font-semibold gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                      title="Stop generating"
                    >
                      <StopCircle className="h-4 w-4" />
                      <span>Stop</span>
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Letter Output Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border/80 shadow-md bg-card overflow-hidden">
              <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <span>Generated Cover Letter</span>
                    {metaInfo?.latencyMs ? (
                      <Badge variant="secondary" className="text-[10px] font-mono gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {(metaInfo.latencyMs / 1000).toFixed(1)}s
                      </Badge>
                    ) : null}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Edit freely and copy directly into your job application or email
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!generatedLetter.trim() || generating}
                    onClick={handleDownloadTxt}
                    className="h-8 text-xs rounded-xl gap-1.5"
                    title="Download as .txt file"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">.txt</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={copied ? 'default' : 'outline'}
                    disabled={!generatedLetter.trim()}
                    onClick={handleCopy}
                    className="h-8 text-xs rounded-xl gap-1.5 font-semibold"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </Button>
                </div>
              </CardHeader>

              {/* Live Exact Percentage Progress Bar */}
              {(generating || (progressPercent > 0 && progressPercent <= 100 && progressStage)) && (
                <div className="px-5 sm:px-6 pt-4 pb-1 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      {generating ? (
                        <Zap className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      <span>{progressStage || 'Generating...'}</span>
                    </span>
                    <span className="font-mono font-bold text-primary tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ease-out ${
                        progressPercent === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <CardContent className="p-5 sm:p-6 space-y-3">
                {!generatedLetter && !generating ? (
                  <div className="min-h-[340px] rounded-2xl border border-dashed border-border/80 bg-muted/15 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="font-heading text-sm font-bold text-foreground">
                        Your tailored cover letter will stream here
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Fill in the target job title and company name on the left, then click{' '}
                        <span className="font-semibold text-foreground">Generate Cover Letter</span>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    rows={16}
                    placeholder="Streaming cover letter..."
                    className="w-full rounded-2xl border border-border/60 bg-muted/20 p-5 text-xs sm:text-sm leading-relaxed text-foreground font-sans focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>{liveWordCount} words • Free & never saved on our servers</span>
                  {generatedLetter.trim() && !generating && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Quick Copy
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button asChild variant="gradient" className="h-10 px-5 rounded-xl text-xs font-bold gap-2">
                <Link to="/resume-builder">
                  <span>Build Matching Resume in Builder</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
