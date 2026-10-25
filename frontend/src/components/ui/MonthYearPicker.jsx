import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatMonthYear } from '@/pages/public/ResumeBuilderPage';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function MonthYearPicker({
  value = '',
  onChange,
  placeholder = 'Select Month & Year',
  id,
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial year from value if available, else current year
  const currentDate = new Date();
  const currentRealYear = currentDate.getFullYear();
  const currentRealMonthNum = String(currentDate.getMonth() + 1).padStart(2, '0');

  const parsedParts = (value || '').split('-');
  const selectedYear = parsedParts[0] ? parseInt(parsedParts[0], 10) : null;
  const selectedMonth = parsedParts[1] || null;

  const [viewingYear, setViewingYear] = useState(selectedYear || currentRealYear);

  // Sync viewing year when value changes from outside
  useEffect(() => {
    if (selectedYear) {
      setViewingYear(selectedYear);
    }
  }, [selectedYear]);

  // Handle clicking outside to close popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Generate a list of years from currentYear + 6 down to 1975
  const yearOptions = [];
  const startY = currentRealYear + 6;
  for (let y = startY; y >= 1975; y--) {
    yearOptions.push(y);
  }

  const handleSelectMonth = (monthIdx) => {
    const mNum = String(monthIdx + 1).padStart(2, '0');
    const newIso = `${viewingYear}-${mNum}`;
    onChange(newIso);
    setIsOpen(false);
  };

  const handleThisMonth = () => {
    const nowIso = `${currentRealYear}-${currentRealMonthNum}`;
    setViewingYear(currentRealYear);
    onChange(nowIso);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex h-8 w-full items-center justify-between rounded-lg border bg-background/90 px-2.5 py-1 text-xs shadow-xs transition-colors cursor-pointer text-left ${
          isOpen
            ? 'border-primary ring-1 ring-primary'
            : 'border-input hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className={`truncate text-xs ${value ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            {value ? formatMonthYear(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Clear date"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* Styled Dark-Themed Popover */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1.5 w-64 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{ minWidth: '240px' }}
        >
          {/* Header: Year Selector */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-border/60">
            <button
              type="button"
              onClick={() => setViewingYear((y) => y - 1)}
              className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Previous Year"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1">
              <select
                value={viewingYear}
                onChange={(e) => setViewingYear(parseInt(e.target.value, 10))}
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer border border-border/60 rounded px-1.5 py-0.5"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y} className="bg-popover text-foreground">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setViewingYear((y) => y + 1)}
              className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Next Year"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m, idx) => {
              const mNum = String(idx + 1).padStart(2, '0');
              const isSelected = selectedYear === viewingYear && selectedMonth === mNum;
              const isCurrentMonth = currentRealYear === viewingYear && currentRealMonthNum === mNum;

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMonth(idx)}
                  className={`h-7 rounded-md text-xs font-medium transition-all flex items-center justify-center relative cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'hover:bg-primary/15 hover:text-primary text-foreground'
                  }`}
                >
                  {m}
                  {isCurrentMonth && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/60 text-[11px]">
            <button
              type="button"
              onClick={handleThisMonth}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              This Month
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
