import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Sparkles, 
  FileText, 
  Bot, 
  Search, 
  Palette, 
  FileEdit, 
  CheckCircle2, 
  Menu, 
  X, 
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Award,
  Sparkle,
  LogIn,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import AuthModal from '@/components/auth/AuthModal';
import { cn } from '@/lib/utils';

export const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/builder', label: 'Resume Builder', icon: FileEdit, badge: 'Popular' },
    { to: '/analyze', label: 'AI Analyzer', icon: Bot, badge: 'AI' },
    { to: '/ats-checker', label: 'ATS Checker', icon: Search, badge: 'Free' },
    { to: '/interview-prep', label: 'Interview Prep', icon: BrainCircuit, badge: 'Hot' },
    { to: '/templates', label: 'Templates', icon: Palette },
    { to: '/cover-letter', label: 'Cover Letter', icon: FileText },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full h-16 sm:h-20 bg-background/95 backdrop-blur-xl border-b border-border/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        {/* Top-Left Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
              Extractor
            </span>
            <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline-block leading-tight">
              Resume & ATS Suite
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-muted/60 dark:bg-card/50 p-1.5 rounded-2xl border border-border/70 backdrop-blur-md shadow-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "group relative px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2",
                  isActive 
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 dark:bg-card/90 dark:text-foreground font-bold" 
                    : "text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-background/60 dark:hover:bg-muted/40"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-slate-400 group-hover:text-foreground"
                    )} />
                    <span className="whitespace-nowrap">{link.label}</span>
                    {link.badge && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-tight uppercase leading-none border transition-colors shadow-2xs",
                        link.badge === 'AI' 
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" 
                          : link.badge === 'Free' 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : link.badge === 'Hot'
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                      )}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions: Login & CTAs */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle className="h-9 w-9" />

          {isAuthenticated ? (
            <Button asChild className="h-9 sm:h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs">
              <Link to="/dashboard">
                <span>My Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => openAuthModal('login')}
                className="h-9 sm:h-10 px-3.5 sm:px-4 text-xs font-semibold border-border hover:bg-accent rounded-xl gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5 text-primary" />
                <span>Sign In</span>
              </Button>
              <Button asChild className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs">
                <Link to="/builder">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Create Resume</span>
                  <span className="sm:hidden">Build</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-xl text-foreground hover:bg-muted">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm p-6 flex flex-col bg-background/95 backdrop-blur-2xl border-l border-border/80">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xs">
                    <Zap className="h-4.5 w-4.5 fill-current" />
                  </div>
                  <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                    Extractor
                  </span>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto py-6 space-y-2">
                <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Products & Tools
                </div>
                {navLinks.map((link) => {
                  const Icon = link.icon || FileText;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold border border-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight uppercase leading-none border shadow-2xs",
                          link.badge === 'AI' 
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" 
                            : link.badge === 'Free' 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : link.badge === 'Hot'
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        )}>
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border/60 space-y-2.5">
                {isAuthenticated ? (
                  <Button asChild variant="gradient" className="w-full h-11 rounded-xl text-xs font-bold justify-center">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="gradient" className="w-full h-11 rounded-xl text-xs font-bold justify-center gap-2">
                      <Link to="/builder" onClick={() => setMobileMenuOpen(false)}>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Build Resume Free</span>
                      </Link>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full h-11 rounded-xl text-xs font-semibold justify-center"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
};

export const PublicFooter = () => {
  const { openAuthModal } = useAuthModalStore();
  
  return (
    <footer className="w-full border-t border-border/70 bg-card/60 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-border/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                Extractor
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The all-in-one AI career intelligence platform. Build ATS-optimized resumes, run deep diagnostic scans, and match job descriptions with sub-second Groq LPU speed.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Enterprise-Grade Encryption • 99.8% ATS Precision</span>
            </div>
          </div>

          {/* Column 1: Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Tools
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link to="/analyze" className="hover:text-primary transition-colors">AI Resume Analyzer</Link></li>
              <li><Link to="/ats-checker" className="hover:text-primary transition-colors">ATS Resume Checker</Link></li>
              <li><Link to="/interview-prep" className="hover:text-primary transition-colors">AI Interview Prep & Mock</Link></li>
              <li><Link to="/cover-letter" className="hover:text-primary transition-colors">Cover Letter AI</Link></li>
              <li><Link to="/templates" className="hover:text-primary transition-colors">ATS Resume Templates</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Templates
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/templates?category=modern" className="hover:text-primary transition-colors">Modern Tech Resume</Link></li>
              <li><Link to="/templates?category=executive" className="hover:text-primary transition-colors">Executive Leadership</Link></li>
              <li><Link to="/templates?category=minimal" className="hover:text-primary transition-colors">Clean Minimalist</Link></li>
              <li><Link to="/templates?category=professional" className="hover:text-primary transition-colors">Corporate Standard</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  type="button" 
                  onClick={() => openAuthModal('login')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Candidate Login
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => openAuthModal('register')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Create Free Account
                </button>
              </li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Candidate Portal</Link></li>
              <li><a href="http://localhost:5174/admin" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">Admin Portal</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 AI Resume SaaS Platform. Intelligent Document Automation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-400">
      <PublicNavbar />
      <main className="flex-1 pt-16 sm:pt-20">
        <Outlet />
      </main>
      <PublicFooter />
      <AuthModal />
    </div>
  );
};

export default PublicLayout;
