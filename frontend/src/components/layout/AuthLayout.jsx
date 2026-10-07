import React from 'react';
import { Zap, Sparkles, CheckCircle2, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Badge } from '@/components/ui/badge';

const AuthLayout = ({ children, title, subtitle, badgeText = "Next-Gen AI Extraction" }) => {
  return (
    <div className="relative min-h-screen w-full bg-background antialiased flex flex-col justify-between overflow-x-hidden">
      
      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-600/15 dark:bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-purple-500/15 dark:bg-purple-500/15 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/15 dark:bg-violet-600/15 blur-[120px]" />
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f10_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f10_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_60%,transparent_100%)] opacity-70 pointer-events-none" 
        />
      </div>

      {/* Top Floating Header */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Extractor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Section (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" /> {badgeText}
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Intelligent Document & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Talent Platform</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Extract structured JSON schemas from resumes and invoices with instant Groq LPU inference and ATS optimization.
              </p>
            </div>

            {/* Live Visual Card Preview */}
            <div className="rounded-2xl border border-border/80 bg-card/75 dark:bg-[#0F1C2E]/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-foreground">AI Schema Extraction Engine</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-medium border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5">
                  Live Preview
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/60 border border-border/50">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-indigo-500" />
                    <span className="font-medium text-foreground">Resume Parsing Accuracy</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">99.8%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/60 border border-border/50">
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-4 w-4 text-violet-500" />
                    <span className="font-medium text-foreground">Inference Speed</span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">&lt; 850ms</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-center">
                <div>
                  <div className="font-heading font-bold text-base text-foreground">10x</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">Faster Hiring</div>
                </div>
                <div>
                  <div className="font-heading font-bold text-base text-foreground">5,800+</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">Resumes</div>
                </div>
                <div>
                  <div className="font-heading font-bold text-base text-foreground">500+</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">Teams</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphic Auth Card */}
          <div className="lg:col-span-6 flex justify-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 dark:bg-[#0F1C2E]/95 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl transition-all">
              
              {/* Card Header */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xs">
                    <Zap className="h-3.5 w-3.5 fill-current" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Extractor Platform
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-muted-foreground">
        © 2026 Extractor Inc. Intelligent Document & Talent Automation. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
