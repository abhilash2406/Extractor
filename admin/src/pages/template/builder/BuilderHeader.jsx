import React from 'react';
import { 
  ArrowLeft, 
  Layout, 
  RotateCcw, 
  Save, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const BuilderHeader = ({
  name,
  code,
  category,
  status,
  selectedPersona,
  setSelectedPersona,
  zoomLevel,
  setZoomLevel,
  handleReset,
  handleSave,
  onBack,
}) => {
  return (
    <header className="h-16 shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shadow-lg z-20">
      {/* Left: Back Arrow + Title & Status */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800/80 hover:border-slate-700"
          title="Back to Templates"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
          <Layout className="h-5 w-5 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base tracking-tight text-slate-100 max-w-[200px] sm:max-w-xs md:max-w-sm truncate">
              {name || 'Untitled Template'}
            </span>
            <Badge
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shrink-0 ${
                status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : status === 'archived'
                  ? 'bg-slate-700/50 text-slate-400 border border-slate-600'
                  : status === 'deleted'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {status}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <span>code: {code || 'none'}</span>
            <span>•</span>
            <span className="text-blue-400 font-sans">{category}</span>
          </p>
        </div>
      </div>

      {/* Center: Persona Switcher & Zoom */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Persona selector */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <span className="text-slate-400 font-medium">Preview Persona:</span>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="software_engineer" className="bg-slate-900 text-white">
              Alex Morgan (Senior SWE)
            </option>
            <option value="student_fresher" className="bg-slate-900 text-white">
              Liam Parker (Student / Fresher)
            </option>
            <option value="executive_leader" className="bg-slate-900 text-white">
              Marcus Vance (Executive CTO)
            </option>
            <option value="product_designer" className="bg-slate-900 text-white">
              Sophia Martinez (Product Designer)
            </option>
            <option value="marketing_lead" className="bg-slate-900 text-white">
              Daniel Chen (Growth Executive)
            </option>
          </select>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.45, +(z - 0.08).toFixed(2)))}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-slate-300 min-w-12 text-center text-[11px]">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.25, +(z + 0.08).toFixed(2)))}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <div className="h-3 w-px bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={() => setZoomLevel(0.78)}
            className="px-1.5 py-0.5 rounded text-[10px] hover:bg-slate-700 text-slate-400 transition-colors"
          >
            Fit
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="px-1.5 py-0.5 rounded text-[10px] hover:bg-slate-700 text-slate-400 transition-colors"
          >
            100%
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 h-8"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => handleSave('draft')}
          className="text-xs bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 h-8"
        >
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Draft
        </Button>

        <Button
          size="sm"
          type="button"
          onClick={() => handleSave('published')}
          className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 h-8"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Publish Template
        </Button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Exit to Templates"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;
