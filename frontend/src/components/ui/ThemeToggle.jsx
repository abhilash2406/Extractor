import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${className}`}
      title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform rotate-0 scale-100 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 transition-transform rotate-0 scale-100 text-indigo-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
