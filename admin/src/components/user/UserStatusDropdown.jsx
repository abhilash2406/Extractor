import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export const UserStatusDropdown = ({ status, onStatusChange, disabled = false, align = 'start' }) => {
  const isActive = status === 'ACTIVE';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? 'bg-emerald-500 shadow-xs shadow-emerald-500/60' : 'bg-rose-500 shadow-xs shadow-rose-500/60'
            }`}
          />
          <span>{isActive ? 'Active' : 'Blocked'}</span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-36 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
        <DropdownMenuItem
          onClick={() => onStatusChange('ACTIVE')}
          className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-foreground hover:bg-accent'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Active</span>
          </div>
          {isActive && <Check className="h-3.5 w-3.5 text-emerald-500" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onStatusChange('BLOCKED')}
          className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
            !isActive
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
              : 'text-foreground hover:bg-accent'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Blocked</span>
          </div>
          {!isActive && <Check className="h-3.5 w-3.5 text-rose-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserStatusDropdown;
