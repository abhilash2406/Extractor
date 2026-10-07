import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Download, 
  Star, 
  Layers, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const templateList = [
  {
    id: 'modern',
    name: 'Modern Tech Pro',
    category: 'Modern',
    popular: true,
    atsScore: '99%',
    accent: '#3B82F6',
    bestFor: 'Software Engineers, Product Managers, Tech Leads',
    description: 'Crisp sans-serif typography, clean visual hierarchy, and dedicated skill badges that scan with 99.8% precision on Taleo & Workday.',
    features: ['1-Page Layout', 'High ATS Parse Rate', 'Skills Emphasis', 'Custom Header Color']
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Executive',
    popular: true,
    atsScore: '98%',
    accent: '#4F46E5',
    bestFor: 'Directors, VPs, C-Suite, Principal Architects',
    description: 'Designed for high-impact leadership with prominent revenue metrics, core competencies grid, and structured career timeline.',
    features: ['Executive Summary Focus', 'Revenue & Scale Metrics', 'Board & Advisory Section', 'Clean Serif Styling']
  },
  {
    id: 'minimal',
    name: 'Minimalist ATS Scanner',
    category: 'Minimal',
    popular: false,
    atsScore: '100%',
    accent: '#0F172A',
    bestFor: 'Enterprise Recruiters, Defense, Banking, Federal',
    description: 'Ultra-clean pure text layout with zero graphical noise. 100% compatibility across legacy and modern OCR parsing engines.',
    features: ['100% OCR Guaranteed', 'Zero Formatting Blockers', 'Clean Mono Headers', 'Maximum Word Density']
  },
  {
    id: 'professional',
    name: 'Corporate Standard',
    category: 'Professional',
    popular: false,
    atsScore: '97%',
    accent: '#06B6D4',
    bestFor: 'Consultants, Finance, Operations, Legal',
    description: 'Classic single-column architecture trusted by Fortune 500 hiring managers and executive search firms.',
    features: ['Chronological Standard', 'Traditional Divider Lines', 'Balanced Whitespace', 'High Print Clarity']
  },
  {
    id: 'creative',
    name: 'Full-Stack Developer',
    category: 'Modern',
    popular: false,
    atsScore: '96%',
    accent: '#10B981',
    bestFor: 'DevOps, Frontend, Backend, UI/UX Engineers',
    description: 'Dual-panel technical summary highlighting languages, cloud tools, open-source repositories, and system architecture.',
    features: ['Dual Column Skills', 'GitHub / Project Links', 'Tech Stack Pills', 'Fast Screening']
  },
  {
    id: 'compact',
    name: 'Compact 1-Page Senior',
    category: 'Executive',
    popular: false,
    atsScore: '98%',
    accent: '#F59E0B',
    bestFor: 'Senior ICs with 10+ years of dense experience',
    description: 'Tight micro-spacing and streamlined bullet formatting fit 10+ years of accomplishments into a strictly structured single page.',
    features: ['Micro-Padding Design', 'High Information Density', 'Accomplishment Highlights', 'ATS Optimized']
  }
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const categories = ['All', 'Modern', 'Executive', 'Minimal', 'Professional'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templateList 
    : templateList.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
            <Palette className="h-4 w-4 text-indigo-500" />
            <span>Recruiter-Approved Design System</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            ATS-Friendly <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Resume Templates</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Every template is rigorously tested against Workday, Greenhouse, Taleo, and Lever ATS systems to ensure 100% human readability.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-indigo-500/25' 
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tpl) => (
            <Card key={tpl.id} className="border-border/80 shadow-md bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Visual Mockup Card Preview */}
                <div className="relative h-64 bg-slate-900/90 border-b border-border/60 p-6 flex flex-col justify-between overflow-hidden">
                  
                  {/* Mock resume layout visual */}
                  <div className="bg-white rounded-xl p-4 text-slate-900 shadow-2xl h-full space-y-2 text-[8px] transform group-hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                      <div>
                        <div className="h-3 w-24 rounded font-bold" style={{ backgroundColor: tpl.accent }} />
                        <div className="h-1.5 w-16 bg-slate-400 rounded mt-1" />
                      </div>
                      <div className="h-1.5 w-12 bg-slate-300 rounded" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full bg-slate-200 rounded" />
                      <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                      <div className="h-1.5 w-4/6 bg-slate-200 rounded" />
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="h-2 w-16 rounded font-semibold" style={{ backgroundColor: tpl.accent }} />
                      <div className="h-1.5 w-full bg-slate-200 rounded" />
                      <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {tpl.popular && (
                      <Badge variant="default" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white text-[10px] font-bold">
                        <Sparkles className="h-3 w-3 mr-1" /> Popular
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-md text-[10px] text-emerald-500 border-emerald-500/30">
                      ATS: {tpl.atsScore}
                    </Badge>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-foreground">{tpl.name}</h3>
                    <span className="text-xs text-muted-foreground font-semibold">{tpl.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="text-[11px] text-primary font-semibold">
                    Best for: {tpl.bestFor}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 border-t border-border/40 flex items-center justify-between gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex-1 rounded-xl text-xs font-semibold gap-1.5 h-10"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
                <Button 
                  asChild
                  variant="gradient" 
                  size="sm" 
                  className="flex-1 rounded-xl text-xs font-bold gap-1.5 h-10 shadow-md shadow-indigo-500/20"
                >
                  <Link to={`/builder?template=${tpl.id}`}>
                    <span>Use Template</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 bg-card border-border/80">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="font-heading text-xl font-bold">
                  {previewTemplate.name}
                </DialogTitle>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-xs">
                  {previewTemplate.atsScore} ATS Score
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                {previewTemplate.description}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3 my-2 text-xs">
              <span className="font-bold text-foreground">Core Template Features:</span>
              <div className="grid grid-cols-2 gap-2">
                {previewTemplate.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="ghost" onClick={() => setPreviewTemplate(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button asChild variant="gradient" className="rounded-xl text-xs font-bold gap-2">
                <Link to={`/builder?template=${previewTemplate.id}`}>
                  <span>Customize in Resume Builder</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
