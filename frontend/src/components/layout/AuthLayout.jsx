import React from 'react';
import { Zap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen w-full bg-background antialiased">
      {/* Left Panel: Hero & Branding (Hidden on mobile) */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white">
        {/* Background gradient orbs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Zap className="h-5 w-5 fill-current text-white" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            Extractor
          </span>
        </div>

        {/* Middle Hero Feature Card */}
        <div className="relative z-10 my-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Extraction
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white leading-tight">
            Intelligent Document & Talent Intelligence Platform
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Extract structured schemas from resumes, invoices, and documents with instant Groq LPU inference.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <div className="font-heading text-2xl font-bold text-white">10x</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Faster Hiring</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-white">99.8%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Accuracy</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Teams</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400">
          © 2026 Extractor Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Extractor
            </span>
          </div>

          <div className="text-center lg:text-left space-y-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
