import React, { useState } from 'react';
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
  Briefcase, 
  Send,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [companyName, setCompanyName] = useState('Stripe');
  const [hiringManager, setHiringManager] = useState('Hiring Team');
  const [tone, setTone] = useState('Confident & Impact-Driven');
  const [keySkills, setKeySkills] = useState('Distributed Systems, React/TypeScript, PostgreSQL, Groq LPU, AWS');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedLetter, setGeneratedLetter] = useState(`Dear ${hiringManager || 'Hiring Team'},

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With over 6 years of hands-on experience building distributed cloud systems and scalable microservices, I have consistently delivered high-availability architectures that accelerate product velocity and reduce infrastructure latency.

In my previous roles, I architected high-throughput ingestion pipelines handling 50M+ daily events and optimized Core Web Vitals across mission-critical customer portals. My deep background with ${keySkills} directly aligns with the technical vision and high-velocity engineering standards at ${companyName}.

I am particularly excited about ${companyName}'s focus on developer experience and high-reliability systems. I welcome the opportunity to discuss how my technical leadership and passion for building resilient software can contribute to your engineering goals.

Sincerely,
Alex Rivera
alex.rivera@dev.io • (555) 234-5678`);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedLetter(`Dear ${hiringManager || 'Hiring Team'},

I am excited to submit my application for the ${jobTitle} role at ${companyName}. As a software architect with a proven track record delivering scalable enterprise software, I have specialized in optimizing distributed systems and leading cross-functional engineering pods.

Throughout my career, I have leveraged ${keySkills} to engineer robust web platforms serving hundreds of thousands of users. At my previous company, my optimization initiatives slashed API response times by 45% and reduced operational cloud overhead by $180,000 annually.

${companyName}'s industry leadership and commitment to engineering excellence strongly resonate with my professional values. I look forward to the possibility of discussing how my technical background and problem-solving mindset can bring immediate value to your team.

Warm regards,
Alex Rivera
alex.rivera@dev.io • (555) 234-5678`);
      setGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
            <Bot className="h-4 w-4 text-indigo-500" />
            <span>AI Cover Letter Generator</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Generate Tailored <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Cover Letters in Seconds</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Personalized, role-specific letters tailored with your key achievements to capture hiring manager attention.
          </p>
        </div>

        {/* Generator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (5 cols) */}
          <Card className="lg:col-span-5 border-border/80 shadow-md bg-card">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-bold">Role & Company Information</CardTitle>
              <CardDescription>Enter details to personalize the AI letter</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Job Title</Label>
                <Input 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company Name</Label>
                <Input 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  placeholder="e.g. Stripe, Google, Acme Corp"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hiring Manager or Department</Label>
                <Input 
                  value={hiringManager} 
                  onChange={(e) => setHiringManager(e.target.value)} 
                  placeholder="e.g. Engineering Hiring Team"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Key Skills / Focus Areas</Label>
                <Input 
                  value={keySkills} 
                  onChange={(e) => setKeySkills(e.target.value)} 
                  placeholder="e.g. React, Node.js, AWS, Kubernetes"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tone of Voice</Label>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Confident & Impact-Driven">Confident & Impact-Driven</option>
                  <option value="Executive & Strategic">Executive & Strategic</option>
                  <option value="Warm & Collaborative">Warm & Collaborative</option>
                  <option value="Concise & Direct">Concise & Direct</option>
                </select>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={generating}
                variant="gradient"
                className="w-full h-11 rounded-xl text-xs font-bold gap-2 shadow-md shadow-indigo-500/25 mt-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Letter Output Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border/80 shadow-md bg-card">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-border/50">
                <div>
                  <CardTitle className="text-base font-bold">Generated Letter Preview</CardTitle>
                  <CardDescription>Formatted for clean email or PDF submission</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCopy}
                    className="h-8 text-xs rounded-xl gap-1.5"
                  >
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <textarea 
                  value={generatedLetter}
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  rows={14}
                  className="w-full rounded-2xl border border-border/60 bg-muted/20 p-5 text-xs leading-relaxed text-foreground font-sans focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button asChild variant="gradient" className="h-10 px-5 rounded-xl text-xs font-bold gap-2">
                <Link to="/builder">
                  <span>Attach to Resume in Builder</span>
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
