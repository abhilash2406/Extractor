import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Bot, 
  Palette, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Save,
  Lock,
  Copy,
  Zap,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const templates = [
  { id: 'modern', name: 'Modern Tech', accent: '#3B82F6', font: 'sans', description: 'Clean layout with bold headers, optimal for tech roles.' },
  { id: 'executive', name: 'Executive Clean', accent: '#4F46E5', font: 'heading', description: 'Sophisticated header and structured timeline for leaders.' },
  { id: 'minimal', name: 'Minimalist ATS', accent: '#0F172A', font: 'mono', description: 'High-speed OCR parsing with zero graphic overhead.' },
  { id: 'creative', name: 'Creative Portfolio', accent: '#06B6D4', font: 'sans', description: 'Dual-column layout highlighting technical proficiencies.' },
];

export default function ResumeBuilderPage() {
  const [searchParams] = useSearchParams();
  const selectedTemplateParam = searchParams.get('template') || 'modern';
  
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState(selectedTemplateParam);
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Resume State
  const [resumeData, setResumeData] = useState({
    fullName: 'Alex Rivera',
    jobTitle: 'Senior Full-Stack Engineer',
    email: 'alex.rivera@dev.io',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.dev',
    linkedin: 'linkedin.com/in/alexrivera',
    summary: 'High-impact Full-Stack Engineer with 6+ years building scalable cloud architectures, real-time distributed microservices, and high-conversion React web applications. Proven track record reducing API latency by 45% with Groq & Redis caching.',
    experiences: [
      {
        id: 1,
        company: 'CloudScale Technologies',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        period: '2022 - Present',
        bullets: [
          'Architected and deployed high-throughput ingestion pipelines handling 50M+ daily events using Node.js, Kafka, and PostgreSQL.',
          'Spearheaded frontend performance optimizations with Vite and Next.js, cutting Core Web Vitals LCP by 60%.',
          'Mentored a cross-functional team of 6 engineers across Agile sprints and CI/CD best practices.'
        ]
      },
      {
        id: 2,
        company: 'Nexus AI Solutions',
        position: 'Full-Stack Developer',
        location: 'Austin, TX',
        period: '2019 - 2022',
        bullets: [
          'Developed micro-frontend architecture for enterprise dashboard used by over 120,000 monthly active users.',
          'Integrated LLM automated document extraction pipelines resulting in $180k annual operational cost reduction.'
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: 'B.S. in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        year: '2015 - 2019',
        gpa: '3.85 / 4.0'
      }
    ],
    skills: ['TypeScript', 'React.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS ECS', 'GraphQL', 'Tailwind CSS', 'Redis', 'CI/CD']
  });

  const handlePersonalChange = (field, val) => {
    setResumeData(prev => ({ ...prev, [field]: val }));
  };

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      period: '2024 - Present',
      bullets: ['Led development of core features and improved system performance.']
    };
    setResumeData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const handleUpdateExperience = (id, field, val) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: val } : e)
    }));
  };

  const handleAddBullet = (expId) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id === expId) {
          return { ...e, bullets: [...e.bullets, 'Achieved measurable results utilizing modern best practices.'] };
        }
        return e;
      })
    }));
  };

  const handleUpdateBullet = (expId, bulletIdx, val) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id === expId) {
          const newBullets = [...e.bullets];
          newBullets[bulletIdx] = val;
          return { ...e, bullets: newBullets };
        }
        return e;
      })
    }));
  };

  const handleDeleteBullet = (expId, bulletIdx) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id === expId) {
          return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIdx) };
        }
        return e;
      })
    }));
  };

  const handleDeleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  const handleAddSkill = (skillText) => {
    if (!skillText.trim()) return;
    if (!resumeData.skills.includes(skillText.trim())) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, skillText.trim()] }));
    }
  };

  const handleDeleteSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAiEnhanceSummary = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        summary: `Strategic and results-driven ${prev.jobTitle || 'Engineer'} with deep technical expertise in modern cloud architectures, scalable microservices, and intuitive frontends. Proven track record boosting system throughput by 45% and reducing infrastructure overhead.`
      }));
      setAiGenerating(false);
    }, 800);
  };

  const { openAuthModal } = useAuthModalStore();

  const handleDownloadClick = () => {
    if (isAuthenticated) {
      window.print();
    } else {
      openAuthModal('register', () => {
        window.print();
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 mb-2">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Free Interactive Resume Builder
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Build Your ATS-Optimized Resume
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Edit in real-time, choose from recruiter-approved templates, and export with 99.8% ATS accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="h-10 rounded-xl text-xs font-semibold gap-2 border-border/80 hover:bg-muted"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button 
              variant="gradient" 
              onClick={handleDownloadClick}
              className="h-10 rounded-xl text-xs font-bold gap-2 shadow-md shadow-indigo-500/20"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Builder Workspace: Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step Tabs */}
            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'personal' ? 'bg-card text-primary shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Contact</span>
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'experience' ? 'bg-card text-primary shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Experience</span>
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'skills' ? 'bg-card text-primary shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>Skills & Edu</span>
              </button>
              <button
                onClick={() => setActiveTab('template')}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'template' ? 'bg-card text-primary shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Template</span>
              </button>
            </div>

            {/* Tab 1: Personal Contact Info */}
            {activeTab === 'personal' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-base font-bold">Personal & Contact Information</CardTitle>
                  <CardDescription>Enter your primary contact info so recruiters can reach you easily.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Full Name</Label>
                      <Input 
                        value={resumeData.fullName}
                        onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                        placeholder="e.g. Alex Rivera" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Target Job Title</Label>
                      <Input 
                        value={resumeData.jobTitle}
                        onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                        placeholder="e.g. Senior Full-Stack Engineer" 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Email Address</Label>
                      <Input 
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        placeholder="alex@example.com" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Phone Number</Label>
                      <Input 
                        value={resumeData.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000" 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Location (City, State)</Label>
                      <Input 
                        value={resumeData.location}
                        onChange={(e) => handlePersonalChange('location', e.target.value)}
                        placeholder="San Francisco, CA" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">LinkedIn / Portfolio</Label>
                      <Input 
                        value={resumeData.linkedin}
                        onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/alex" 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Professional Summary</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleAiEnhanceSummary}
                        disabled={aiGenerating}
                        className="h-7 text-xs text-primary hover:bg-primary/10 gap-1.5"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>{aiGenerating ? 'Enhancing...' : 'AI Rewrite'}</span>
                      </Button>
                    </div>
                    <textarea 
                      value={resumeData.summary}
                      onChange={(e) => handlePersonalChange('summary', e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Write a concise overview of your key accomplishments..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Work Experience */}
            {activeTab === 'experience' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Work Experience</CardTitle>
                    <CardDescription>Highlight your roles, quantifiable metrics, and impact.</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddExperience}
                    className="h-8 rounded-xl text-xs gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Role
                  </Button>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-6">
                  {resumeData.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group">
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-foreground">Position #{idx + 1}</span>
                        {resumeData.experiences.length > 1 && (
                          <button 
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            title="Remove Position"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">Job Title</Label>
                          <Input 
                            value={exp.position} 
                            onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">Company Name</Label>
                          <Input 
                            value={exp.company} 
                            onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">Dates / Period</Label>
                          <Input 
                            value={exp.period} 
                            onChange={(e) => handleUpdateExperience(exp.id, 'period', e.target.value)}
                            placeholder="e.g. 2022 - Present"
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">Location</Label>
                          <Input 
                            value={exp.location} 
                            onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                            placeholder="e.g. San Francisco, CA"
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Bullet points */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] font-semibold">Accomplishments & Bullets</Label>
                          <button 
                            type="button" 
                            onClick={() => handleAddBullet(exp.id)}
                            className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Plus className="h-3 w-3" /> Add Bullet
                          </button>
                        </div>
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-primary font-bold mt-1.5 text-xs">•</span>
                            <textarea 
                              value={bullet}
                              onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                              rows={2}
                              className="flex-1 rounded-lg border border-input bg-background p-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            />
                            {exp.bullets.length > 1 && (
                              <button 
                                onClick={() => handleDeleteBullet(exp.id, bIdx)}
                                className="text-muted-foreground hover:text-destructive p-1 mt-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tab 3: Skills & Education */}
            {activeTab === 'skills' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Skills */}
                <Card className="border-border/80 shadow-sm">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-base font-bold">Skills & Proficiencies</CardTitle>
                    <CardDescription>Add keywords that ATS scanners look for in your role.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        id="newSkillInput"
                        placeholder="Type a skill and press Enter (e.g. GraphQL, AWS)..." 
                        className="rounded-xl text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          const el = document.getElementById('newSkillInput');
                          if (el) {
                            handleAddSkill(el.value);
                            el.value = '';
                          }
                        }}
                        className="rounded-xl text-xs"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {resumeData.skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="px-2.5 py-1 text-xs font-semibold gap-1.5 group cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => handleDeleteSkill(skill)}
                          title="Click to delete skill"
                        >
                          <span>{skill}</span>
                          <span className="text-[10px] text-muted-foreground group-hover:text-destructive">×</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="border-border/80 shadow-sm">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-base font-bold">Education & Credentials</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-2 space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/70 bg-card/60">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">Degree / Major</Label>
                          <Input 
                            value={edu.degree} 
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed)
                            }))}
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">University / Institute</Label>
                          <Input 
                            value={edu.school} 
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(ed => ed.id === edu.id ? { ...ed, school: e.target.value } : ed)
                            }))}
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab 4: Template Customization */}
            {activeTab === 'template' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-base font-bold">Choose Layout & Accent</CardTitle>
                  <CardDescription>Select a layout tailored for your industry and target ATS score.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {templates.map((tpl) => (
                      <div 
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTemplate(tpl.id);
                          setAccentColor(tpl.accent);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedTemplate === tpl.id 
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs' 
                            : 'border-border/80 bg-card/60 hover:border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-foreground">{tpl.name}</span>
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tpl.accent }} />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{tpl.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <Label className="text-xs font-semibold">Custom Accent Color</Label>
                    <div className="flex items-center gap-3">
                      {['#3B82F6', '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#E11D48', '#0F172A'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`h-7 w-7 rounded-full transition-transform ${
                            accentColor === color ? 'scale-125 ring-2 ring-foreground ring-offset-2' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Right Column: Live Printable Resume Preview (6 cols) */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="p-4 rounded-3xl border border-border/80 bg-card/40 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="font-bold text-foreground">Live ATS Preview</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                    Score: 96%
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground capitalize">Template: {selectedTemplate}</span>
              </div>

              {/* Rendered Live Resume Sheet */}
              <div 
                id="printableResume"
                className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 min-h-[620px] text-xs space-y-5 font-sans break-words overflow-hidden"
              >
                {/* Header */}
                <div className="border-b border-slate-200 pb-4 space-y-1.5">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900" style={{ color: selectedTemplate === 'minimal' ? '#0F172A' : accentColor }}>
                    {resumeData.fullName || 'Your Name'}
                  </h2>
                  <div className="text-sm font-semibold text-slate-700">
                    {resumeData.jobTitle || 'Target Position'}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1">
                    {resumeData.email && <span>{resumeData.email}</span>}
                    {resumeData.phone && <span>• {resumeData.phone}</span>}
                    {resumeData.location && <span>• {resumeData.location}</span>}
                    {resumeData.linkedin && <span>• {resumeData.linkedin}</span>}
                  </div>
                </div>

                {/* Summary */}
                {resumeData.summary && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1" style={{ color: accentColor }}>
                      Professional Summary
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed pt-0.5">
                      {resumeData.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.experiences.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1" style={{ color: accentColor }}>
                      Experience
                    </h3>
                    {resumeData.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900">{exp.position} <span className="font-normal text-slate-600">at {exp.company}</span></span>
                          <span className="text-slate-500 font-mono text-[10px]">{exp.period}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 leading-normal pl-1">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="text-[10.5px]">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1" style={{ color: accentColor }}>
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {resumeData.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1" style={{ color: accentColor }}>
                      Education
                    </h3>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between text-[11px] text-slate-700">
                        <span className="font-semibold text-slate-900">{edu.degree} — <span className="font-normal">{edu.school}</span></span>
                        <span className="text-slate-500 font-mono text-[10px]">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
