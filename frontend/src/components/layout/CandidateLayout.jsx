import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardCheck, 
  CheckSquare, 
  Zap, 
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase, end: false },
  { to: '/applications', label: 'Applied Jobs', icon: ClipboardCheck, end: true },
  { to: '/tests', label: 'Tests', icon: CheckSquare, end: false },
  { to: '/pricing', label: 'Plans & Pricing', icon: Zap, end: true },
];

const CandidateLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed_candidate') === 'true';
  });
  const { user } = useAuthStore();

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed_candidate', String(next));
      return next;
    });
  };

  const userInitials = (user?.name || user?.username || 'Candidate').charAt(0).toUpperCase();

  const renderNavLinks = (onItemClick = () => {}, collapsed = false) => (
    <div className={cn("flex flex-col gap-1.5 flex-1", collapsed ? "px-2 py-2 items-center" : "px-3 py-2")}>
      {!collapsed ? (
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          Explore
        </div>
      ) : (
        <div className="h-px w-8 bg-border/60 my-1 mx-auto" />
      )}

      {navItems.map((item) => {
        const Icon = item.icon;
        
        const linkElement = (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "group flex items-center transition-all duration-200",
                collapsed
                  ? "h-11 w-11 justify-center rounded-xl mx-auto"
                  : "gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                isActive
                  ? "bg-primary/15 text-primary font-semibold shadow-xs ring-1 ring-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn(collapsed ? "h-5 w-5" : "h-4 w-4", "shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        );

        if (collapsed) {
          return (
            <TooltipProvider key={item.to} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {linkElement}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="font-semibold text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return linkElement;
      })}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background antialiased">
      {/* Desktop Sidebar (Collapsible) */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col border-r border-border/80 bg-sidebar h-screen sticky top-0 z-30 shrink-0 shadow-xs transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-border/60 transition-all duration-300",
          isCollapsed ? "justify-center px-2 flex-col gap-1 py-2" : "justify-between px-4"
        )}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            {!isCollapsed && (
              <span className="font-heading text-lg font-bold tracking-tight text-foreground truncate">
                Extractor
              </span>
            )}
          </div>

          {!isCollapsed ? (
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                title="Collapse sidebar"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Collapse sidebar</span>
              </Button>
            </div>
          ) : null}
        </div>

        {/* Collapsed State Toggle Button under header */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-1.5 pt-3 pb-1 border-b border-border/40">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              title="Expand sidebar"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-all"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Expand sidebar</span>
            </Button>
            <ThemeToggle />
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-3">
          {renderNavLinks(() => {}, isCollapsed)}
        </nav>

        {/* Bottom User Area */}
        <div className={cn(
          "border-t border-border/60 mt-auto flex flex-col gap-2 bg-muted/20 transition-all duration-300",
          isCollapsed ? "p-2 items-center" : "p-4"
        )}>
          <UserMenu roleLabel="Candidate" isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Mobile Top Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 flex items-center justify-between z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xs">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            Extractor
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          
          {/* Mobile Right Drawer Trigger */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-foreground hover:bg-accent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col bg-sidebar shadow-2xl border-l border-border/80 rounded-l-3xl">
              {/* Drawer Header */}
              <div className="h-16 px-5 border-b border-border/60 flex items-center justify-between bg-card/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xs">
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-heading text-base font-bold tracking-tight text-foreground">
                    Extractor
                  </span>
                </div>
              </div>

              {/* Drawer User Card */}
              <div className="p-4 border-b border-border/60 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border-2 border-primary/20 shadow-xs">
                    <AvatarFallback className="bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 text-white font-bold text-base">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {user?.name || user?.username || 'Candidate'}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10">
                        Candidate
                      </Badge>
                      <span className="text-[11px] text-muted-foreground truncate">{user?.email || 'candidate@extractor.io'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Navigation List */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Explore
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/25 shadow-xs"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-0.5", isActive ? "text-primary" : "text-muted-foreground/40")} />
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border/60 bg-muted/20">
                <UserMenu roleLabel="Candidate" isMobile={true} isCollapsed={false} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile App Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/80 bg-background/95 backdrop-blur-md px-2 flex items-center justify-around z-40 shadow-lg">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Briefcase className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">Jobs</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <ClipboardCheck className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">Applied</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/tests"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <CheckSquare className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">Tests</span>
            </>
          )}
        </NavLink>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-muted-foreground hover:text-foreground transition-all"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px]">More</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:h-screen lg:overflow-hidden transition-all duration-300">
        <main className="flex-1 overflow-y-auto pt-20 pb-24 lg:pt-8 lg:pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in-up duration-300">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
