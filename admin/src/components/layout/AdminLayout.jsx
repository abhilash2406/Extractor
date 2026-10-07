import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Palette, 
  CreditCard, 
  Coins, 
  Bot, 
  Settings, 
  Zap, 
  Menu, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/templates', label: 'Templates', icon: Palette },
  { to: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: Coins },
  { to: '/admin/ai-usage', label: 'AI Usage', icon: Bot },
];

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
  const { user } = useAuthStore();
  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const userInitials = (user?.name || user?.username || 'Admin').charAt(0).toUpperCase();

  const renderNavLinks = (onItemClick = () => {}, collapsed = false) => (
    <div className={cn("flex flex-col gap-1 flex-1", collapsed ? "px-2 py-2 items-center" : "px-3 py-2")}>
      {!collapsed ? (
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Menu
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
                  ? "h-10 w-10 justify-center rounded-xl mx-auto"
                  : "gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary font-semibold shadow-xs border border-primary/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-transparent dark:ring-1 dark:ring-indigo-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn(collapsed ? "h-5 w-5" : "h-4 w-4", "shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary dark:bg-indigo-500 shadow-sm shadow-indigo-500/50" />
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
      
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col border-r border-border/80 bg-sidebar h-screen sticky top-0 z-30 shrink-0 shadow-xs transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Brand Header (Matches Image 1) */}
        <div className={cn(
          "flex h-16 items-center transition-all duration-300",
          isCollapsed ? "justify-center px-2 flex-col gap-1 py-3" : "justify-between px-4 pt-3 pb-1"
        )}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Zap className="h-4.5 w-4.5 fill-current" />
            </div>
            {!isCollapsed && (
              <span className="font-heading text-base font-bold tracking-tight text-foreground truncate">
                Extractor
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle className="h-8 w-8 text-foreground hover:bg-accent" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {renderNavLinks(() => {}, isCollapsed)}
        </nav>

        {/* Bottom User Area */}
        <div className={cn(
          "mt-auto flex flex-col gap-2 transition-all duration-300",
          isCollapsed ? "p-2 items-center" : "p-3"
        )}>
          {isCollapsed ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                      cn(
                        "group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 mx-auto",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold shadow-xs border border-primary/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-transparent dark:ring-1 dark:ring-indigo-500/25"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <Settings className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="font-semibold text-xs">
                  Settings
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs border border-primary/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-transparent dark:ring-1 dark:ring-indigo-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Settings className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          )}

          <UserMenu roleLabel="ADMIN" isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Mobile App Top Header Bar */}
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
              {/* Drawer Top Header */}
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
                      {user?.name || user?.username || 'Admin User'}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10">
                        Admin
                      </Badge>
                      <span className="text-[11px] text-muted-foreground truncate">{user?.email || 'admin@extractor.io'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Navigation
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

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-border/60 bg-muted/20 flex flex-col gap-2">
                <NavLink
                  to="/admin/settings"
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                </NavLink>

                <UserMenu roleLabel="Admin" isMobile={true} isCollapsed={false} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile App Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/80 bg-background/95 backdrop-blur-md px-2 flex items-center justify-around z-40 shadow-lg">
        <NavLink
          to="/admin"
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
          to="/admin/users"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Users className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">Users</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/admin/templates"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Palette className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">Templates</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/admin/ai-usage"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Bot className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
              <span className="text-[10px]">AI Usage</span>
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

export default AdminLayout;
