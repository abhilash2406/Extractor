import React from 'react';
import { Image, Circle, RectangleHorizontal, Square } from 'lucide-react';

export const PhotoControls = ({ design, setDesign }) => {
  return (
    <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
      <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
        Photo & Image Settings
      </h4>
      <p className="text-[11px] text-slate-400 -mt-2">
        Control profile photo display, placement, size, and shape
      </p>

      {/* Show / Hide Photo Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-300">Show Profile Photo:</span>
        </div>
        <button
          type="button"
          onClick={() => setDesign({ ...design, showPhoto: !design.showPhoto })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            design.showPhoto ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              design.showPhoto ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Photo controls (only when showPhoto is true) */}
      {design.showPhoto && (
        <>
          {/* Photo Placement */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span className="text-xs text-slate-300">Photo Placement:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'header', label: 'Header' },
                { id: 'sidebar', label: 'Sidebar Top' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDesign({ ...design, photoPlacement: p.id })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    (design.photoPlacement || 'header') === p.id
                      ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Size */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">Photo Size:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'small', label: 'S (64px)' },
                { id: 'medium', label: 'M (88px)' },
                { id: 'large', label: 'L (112px)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setDesign({ ...design, photoSize: s.id })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    (design.photoSize || 'small') === s.id
                      ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Shape Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">Photo Shape:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'circle', label: 'Circle', icon: <Circle className="h-3.5 w-3.5" /> },
                { id: 'rounded', label: 'Rounded', icon: <RectangleHorizontal className="h-3.5 w-3.5" /> },
                { id: 'square', label: 'Square', icon: <Square className="h-3.5 w-3.5" /> },
              ].map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setDesign({ ...design, photoShape: shape.id })}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    design.photoShape === shape.id
                      ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {shape.icon}
                  {shape.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoControls;
