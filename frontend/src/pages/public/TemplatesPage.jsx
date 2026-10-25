import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Layers, 
  Zap,
  Loader2,
  Columns,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { getPublishedTemplates } from '@/api/templates.api';

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Load published templates with React Query (shares cache with builder)
  const {
    data: publishedTemplates = [],
    isLoading: loadingTemplates,
    isError: templatesError,
  } = useQuery({
    queryKey: ['published-templates'],
    queryFn: async () => {
      const res = await getPublishedTemplates({ limit: 50 });
      return res.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Dynamically compute available categories from published templates
  const dynamicCategories = [
    'All',
    ...Array.from(new Set(publishedTemplates.map((t) => t.category || 'General'))),
  ];

  const filteredTemplates = selectedCategory === 'All' 
    ? publishedTemplates 
    : publishedTemplates.filter(
        (t) => (t.category || 'General').toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-14">
      <div className="w-full max-w-[1460px] mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
        
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
            Every template is configured and tested against automated applicant tracking systems to ensure high readability and flawless scoring.
          </p>
        </div>

        {/* Category Filter Pills */}
        {publishedTemplates.length > 0 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {dynamicCategories.map((cat) => (
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
        )}

        {/* Loading State */}
        {loadingTemplates ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-semibold">Loading published templates...</span>
          </div>
        ) : filteredTemplates.length === 0 ? (
          /* Empty / Failed State (NO Hardcoded Mock Templates) */
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground border border-border/80">
              <Palette className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">No Published Templates Found</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {templatesError 
                  ? 'Failed to fetch templates from the server. Please check your network connection.'
                  : 'There are currently no templates published in the system.'}
              </p>
            </div>
          </div>
        ) : (
          /* Templates Grid (Mapped directly from publishedTemplates) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => {
              const primaryColor = tpl.design_config?.primaryColor || '#3B82F6';
              const columns = tpl.layout_config?.columns || 1;

              return (
                <Card 
                  key={tpl.id} 
                  className="border-border/80 shadow-md bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Mockup Card Preview */}
                    <div className="relative h-60 bg-slate-900/90 border-b border-border/60 p-6 flex flex-col justify-between overflow-hidden">
                      <div className="bg-white rounded-xl p-4 text-slate-900 shadow-2xl h-full space-y-2 text-[8px] transform group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                          <div>
                            <div className="h-3 w-24 rounded font-bold" style={{ backgroundColor: primaryColor }} />
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
                          <div className="h-2 w-16 rounded font-semibold" style={{ backgroundColor: primaryColor }} />
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] bg-slate-950/80 text-white border-white/20">
                          {columns === 2 ? '2 Columns' : '1 Column'}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content Info */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {tpl.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs font-semibold">
                          {tpl.category || 'General'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {tpl.description || 'Recruiter-approved, ATS-compliant resume architecture.'}
                      </p>
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
                      <Eye className="h-3.5 w-3.5" /> Details
                    </Button>
                    <Button 
                      asChild
                      variant="gradient" 
                      size="sm" 
                      className="flex-1 rounded-xl text-xs font-bold gap-1.5 h-10 shadow-md shadow-indigo-500/20"
                    >
                      <Link to={`/resume-builder?template=${tpl.code || tpl.id}`}>
                        <span>Use Template</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      {/* Details Modal */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7 bg-card border-border/80">
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="font-heading text-lg font-bold">
                  {previewTemplate.name}
                </DialogTitle>
                <Badge variant="outline" className="text-xs">
                  {previewTemplate.category || 'General'}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                {previewTemplate.description || 'ATS optimized resume template.'}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2.5 my-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Layout Style:</span>
                <span className="font-semibold text-foreground">
                  {previewTemplate.layout_config?.columns === 2 ? '2 Column Layout' : 'Single Column Standard'}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Primary Accent:</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: previewTemplate.design_config?.primaryColor || '#3B82F6' }}
                  />
                  <span className="font-mono text-[11px] text-foreground">
                    {previewTemplate.design_config?.primaryColor || '#3B82F6'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="ghost" onClick={() => setPreviewTemplate(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button asChild variant="gradient" className="rounded-xl text-xs font-bold gap-2">
                <Link to={`/resume-builder?template=${previewTemplate.code || previewTemplate.id}`}>
                  <span>Customize in Builder</span>
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
