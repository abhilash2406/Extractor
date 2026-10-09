import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
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
  LogOut,
  BrainCircuit,
  User,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import AuthModal from '@/components/auth/AuthModal';
import { useProfile } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';

export const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
  };

  const getUserInitials = (u) => {
    const nameStr = (u?.name || u?.username || u?.email || '').trim();
    if (!nameStr) return 'A';
    const clean = nameStr.includes('@') ? nameStr.split('@')[0] : nameStr;
    const parts = clean.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (u) => {
    if (u?.name && u.name.trim()) return u.name;
    if (u?.username && u.username.trim() && u.username.toLowerCase() !== 'user') return u.username;
    if (u?.email) return u.email.split('@')[0];
    return u?.username || 'Account';
  };

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
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Top-Left Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105 shrink-0">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
              Extractor
            </span>
            <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline-block leading-tight">
              Resume & ATS Suite
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 bg-muted/60 dark:bg-card/50 p-1 2xl:p-1.5 rounded-2xl border border-border/70 backdrop-blur-md shadow-xs shrink-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "group relative px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11.5px] 2xl:text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 2xl:gap-2 shrink-0",
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
                        "inline-flex items-center px-1.5 py-0.5 rounded-md text-[8.5px] 2xl:text-[9px] font-bold tracking-tight uppercase leading-none border transition-colors shadow-2xs shrink-0",
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

        {/* Right Actions: Login / Logout & CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggle className="h-9 w-9 shrink-0" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <Button asChild className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs shrink-0">
                <Link to="/builder">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Create Resume</span>
                  <span className="sm:hidden">Build</span>
                </Link>
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-border/80 bg-background/60 hover:bg-accent hover:border-primary/40 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer shrink-0"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      {user?.profile_pic ? (
                        <AvatarImage src={user.profile_pic} alt={getDisplayName(user)} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 text-white text-xs font-bold">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-foreground max-w-[100px] truncate hidden md:inline-block">
                      {getDisplayName(user)}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl">
                  {/* User Info Header */}
                  <div className="px-3 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">
                        {getDisplayName(user)}
                      </p>
                      {user?.email && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>
                    {user?.role === 'ADMIN' ? (
                      <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0.5 uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shrink-0">
                        Admin
                      </Badge>
                    ) : (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 uppercase shrink-0",
                          user?.plan_code === 'PRO' || user?.plan_code === 'PREMIUM'
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                            : "bg-muted/80 text-muted-foreground border-border/80"
                        )}
                      >
                        {user?.plan_code || 'FREE'}
                      </Badge>
                    )}
                  </div>

                  <DropdownMenuSeparator className="my-1 bg-border/60" />

                  {/* Admin Console Shortcut for Admins */}
                  {user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <a
                          href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-indigo-500" />
                            <span>Admin Console</span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 bg-border/60" />
                    </>
                  )}

                  {/* Account Actions */}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent cursor-pointer">
                      <User className="h-4 w-4 text-primary" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/change-password" className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent cursor-pointer">
                      <KeyRound className="h-4 w-4 text-primary" />
                      <span>Change Password</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-border/60" />

                  {/* Sign Out Button */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-destructive" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => openAuthModal('login')}
                className="h-9 sm:h-10 px-3.5 sm:px-4 text-xs font-semibold border-border hover:bg-accent rounded-xl gap-1.5 shrink-0"
              >
                <LogIn className="h-3.5 w-3.5 text-primary" />
                <span>Sign In</span>
              </Button>
              <Button asChild className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs shrink-0">
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
              <Button variant="ghost" size="icon" className="xl:hidden h-9 sm:h-10 w-9 sm:w-10 rounded-xl text-foreground hover:bg-muted shrink-0">
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

              {/* Mobile User Profile Section */}
              {isAuthenticated && (
                <div className="my-4 p-3 bg-muted/60 dark:bg-card/70 rounded-2xl border border-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20 shrink-0">
                      {user?.profile_pic ? (
                        <AvatarImage src={user.profile_pic} alt={getDisplayName(user)} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold text-foreground truncate">
                        {getDisplayName(user)}
                      </span>
                      {user?.email && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  {user?.role === 'ADMIN' ? (
                    <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0.5 uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shrink-0">
                      Admin
                    </Badge>
                  ) : (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 uppercase shrink-0",
                        user?.plan_code === 'PRO' || user?.plan_code === 'PREMIUM'
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                          : "bg-muted/80 text-muted-foreground border-border/80"
                      )}
                    >
                      {user?.plan_code || 'FREE'}
                    </Badge>
                  )}
                </div>
              )}

              <nav className="flex-1 overflow-y-auto py-2 space-y-1.5">
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
                        "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all",
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

                {isAuthenticated && (
                  <>
                    <div className="pt-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Account & Security
                    </div>
                    {user?.role === 'ADMIN' && (
                      <a
                        href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-4 w-4 text-indigo-500" />
                          <span>Admin Console</span>
                        </div>
                        <ExternalLink className="h-4 w-4 opacity-70" />
                      </a>
                    )}
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span>Profile</span>
                    </NavLink>
                    <NavLink
                      to="/change-password"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                    >
                      <KeyRound className="h-4 w-4 text-primary" />
                      <span>Change Password</span>
                    </NavLink>
                  </>
                )}
              </nav>

              <div className="pt-4 border-t border-border/60 space-y-2.5">
                <Button asChild variant="gradient" className="w-full h-11 rounded-xl text-xs font-bold justify-center gap-2">
                  <Link to="/builder" onClick={() => setMobileMenuOpen(false)}>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Build Resume Free</span>
                  </Link>
                </Button>

                {isAuthenticated ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full h-11 rounded-xl text-xs font-semibold justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full h-11 rounded-xl text-xs font-semibold justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4 text-primary" />
                    <span>Sign In</span>
                  </Button>
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
                  Sign In
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
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { openAuthModal } = useAuthModalStore();
  const { isAuthenticated, setUser, logout } = useAuthStore();

  // Deduplicated and cached profile query
  const { data: profileData } = useProfile({
    enabled: isAuthenticated,
  });

  // Keep store in sync and handle blocked status
  useEffect(() => {
    if (!profileData) return;
    if (profileData?.status === 'BLOCKED') {
      logout();
      toast.error('Your account has been blocked. Please contact support.', { id: 'account-status-error' });
    } else {
      setUser(profileData);
    }
  }, [profileData, logout, setUser]);

  useEffect(() => {
    const otp = searchParams.get('otp');
    const auth = searchParams.get('auth');
    const email = searchParams.get('email') || '';

    if (otp) {
      openAuthModal('otp', { otp, email });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (
      auth === 'login' ||
      auth === 'register' ||
      auth === 'otp' ||
      auth === 'forgot-password' ||
      auth === 'reset-password'
    ) {
      openAuthModal(auth, { email });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams, openAuthModal]);

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
