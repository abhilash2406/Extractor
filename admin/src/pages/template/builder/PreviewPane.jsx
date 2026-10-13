import React, { useState } from 'react';
import { Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import ResumeRenderer from '@/components/resume/ResumeRenderer';

export const PreviewPane = ({
  previewTemplate,
  activePersonaData,
  zoomLevel,
  setZoomLevel,
  showGuidelines,
  setShowGuidelines,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const pageSize = previewTemplate?.layout_config?.pageSize || 'A4';
  const pageLabel = pageSize === 'Letter' ? 'US Letter' : 'A4';
  const pageDimensions = pageSize === 'Letter' ? '8.5 × 11 in (216 × 279 mm)' : '210 × 297 mm (Standard A4)';

  return (
    <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Canvas Sub-header */}
      <div className="h-10 shrink-0 bg-slate-900/80 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">Live {pageLabel} Preview</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-[11px] text-slate-400">{pageDimensions}</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Zoom Pill Selector */}
          {setZoomLevel && (
            <div className="hidden md:flex items-center gap-1 bg-slate-800/90 px-1.5 py-0.5 rounded-lg border border-slate-700/60 text-[11px]">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              {[
                { label: '50%', val: 0.5 },
                { label: '75%', val: 0.75 },
                { label: '90%', val: 0.9 },
                { label: '100%', val: 1.0 },
                { label: 'Fit', val: 0.78 },
              ].map((zp) => (
                <button
                  key={zp.label}
                  type="button"
                  onClick={() => setZoomLevel(zp.val)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    Math.abs(zoomLevel - zp.val) < 0.04
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {zp.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.3, +(z + 0.08).toFixed(2)))}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
              showGuidelines
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Page Margins
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(true)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Full Screen Preview"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Document Viewport */}
      <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start bg-radial from-slate-900/40 to-slate-950">
        <div className="transition-all duration-150">
          <ResumeRenderer
            template={previewTemplate}
            data={activePersonaData}
            scale={zoomLevel}
            showPageGuidelines={showGuidelines}
          />
        </div>
      </div>

      {/* Fullscreen Overlay Modal if active */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col">
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white">
            <span className="font-semibold text-sm">Full Size Document Preview</span>
            <button
              type="button"
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
            <ResumeRenderer
              template={previewTemplate}
              data={activePersonaData}
              scale={0.95}
              showPageGuidelines={showGuidelines}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPane;
