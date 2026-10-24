import React from 'react';
import { Search, X, ChevronDown, Check, RotateCcw, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { planLabels, statusLabels, dateLabels } from './constants';

export const UserFilters = ({
  filters,
  totalUsers = 0,
  currentCount = 0,
}) => {
  const {
    search,
    setSearch,
    selectedPlan,
    setSelectedPlan,
    selectedStatus,
    setSelectedStatus,
    dateRangePreset,
    handleDatePresetChange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilters,
    hasActiveFilters,
  } = filters;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email..."
            className="pl-9 pr-8 bg-background/80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Modern Filter Dropdown Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Plan Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Plan:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${
                    selectedPlan !== 'ALL'
                      ? 'bg-primary/10 border-primary/40 text-primary shadow-xs'
                      : 'bg-background hover:bg-muted/60 border-border/80 text-foreground'
                  }`}
                >
                  <span>{planLabels[selectedPlan] || 'All Plans'}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                {[
                  { code: 'ALL', label: 'All Plans', dot: null },
                  { code: 'FREE', label: 'Free', dot: 'bg-slate-400' },
                  { code: 'BASIC', label: 'Basic', dot: 'bg-blue-500' },
                  { code: 'PRO', label: 'Pro', dot: 'bg-violet-500' },
                  { code: 'PREMIUM', label: 'Premium', dot: 'bg-amber-500' },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.code}
                    onClick={() => setSelectedPlan(item.code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === item.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.dot ? <span className={`h-2 w-2 rounded-full ${item.dot}`} /> : <span className="h-2 w-2" />}
                      <span>{item.label}</span>
                    </div>
                    {selectedPlan === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Status:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${
                    selectedStatus !== 'ALL'
                      ? 'bg-primary/10 border-primary/40 text-primary shadow-xs'
                      : 'bg-background hover:bg-muted/60 border-border/80 text-foreground'
                  }`}
                >
                  <span>{statusLabels[selectedStatus] || 'All Statuses'}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                {[
                  { code: 'ALL', label: 'All Statuses', dot: null },
                  { code: 'ACTIVE', label: 'Active', dot: 'bg-emerald-500' },
                  { code: 'BLOCKED', label: 'Blocked', dot: 'bg-rose-500' },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.code}
                    onClick={() => setSelectedStatus(item.code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                      selectedStatus === item.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.dot ? <span className={`h-2 w-2 rounded-full ${item.dot}`} /> : <span className="h-2 w-2" />}
                      <span>{item.label}</span>
                    </div>
                    {selectedStatus === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Joined Date Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Joined:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${
                    dateRangePreset !== 'all'
                      ? 'bg-primary/10 border-primary/40 text-primary shadow-xs'
                      : 'bg-background hover:bg-muted/60 border-border/80 text-foreground'
                  }`}
                >
                  <span>{dateLabels[dateRangePreset] || 'All Time'}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                {[
                  { code: 'all', label: 'All Time' },
                  { code: 'last_7_days', label: 'Last 7 Days' },
                  { code: 'last_30_days', label: 'Last 30 Days' },
                  { code: 'custom', label: 'Custom Range...' },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.code}
                    onClick={() => handleDatePresetChange(item.code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                      dateRangePreset === item.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <span>{item.label}</span>
                    {dateRangePreset === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-xl border border-dashed border-border hover:border-foreground/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Custom Date Range Row when 'custom' is selected */}
      {dateRangePreset === 'custom' && (
        <div className="flex flex-wrap items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/40 border border-border/70 text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Custom Range:
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="h-8 text-xs w-36 bg-background rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-muted-foreground font-medium">to</span>
            <Input
              type="date"
              className="h-8 text-xs w-36 bg-background rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-1">
        <div>
          Showing <span className="font-semibold text-foreground">{currentCount}</span> of <span className="font-semibold text-foreground">{totalUsers}</span> users
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
