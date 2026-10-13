import React from 'react';

export const SidebarColorControls = ({ design, setDesign }) => {
  return (
    <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
      <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
        Sidebar Text Colors
      </h4>
      <p className="text-[11px] text-slate-400 -mt-1">
        Customize text colors for dark-background sidebars
      </p>

      <div className="grid grid-cols-3 gap-3">
        {/* Sidebar Text Color */}
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            Body Text
          </label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
            <input
              type="color"
              value={design.sidebarTextColor || '#1e293b'}
              onChange={(e) =>
                setDesign({ ...design, sidebarTextColor: e.target.value })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-[10px] text-slate-300 uppercase">
              {design.sidebarTextColor || '#1e293b'}
            </span>
          </div>
        </div>

        {/* Sidebar Heading Color */}
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            Headings
          </label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
            <input
              type="color"
              value={design.sidebarHeadingColor || '#0f172a'}
              onChange={(e) =>
                setDesign({ ...design, sidebarHeadingColor: e.target.value })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-[10px] text-slate-300 uppercase">
              {design.sidebarHeadingColor || '#0f172a'}
            </span>
          </div>
        </div>

        {/* Sidebar Accent Color */}
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            Accent
          </label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
            <input
              type="color"
              value={design.sidebarPrimaryColor || '#2563eb'}
              onChange={(e) =>
                setDesign({ ...design, sidebarPrimaryColor: e.target.value })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-[10px] text-slate-300 uppercase">
              {design.sidebarPrimaryColor || '#2563eb'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick preset for dark sidebar */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
        <span className="text-[11px] text-slate-400">Quick:</span>
        <button
          type="button"
          onClick={() =>
            setDesign({
              ...design,
              sidebarTextColor: '#cbd5e1',
              sidebarHeadingColor: '#f1f5f9',
              sidebarPrimaryColor: '#94a3b8',
            })
          }
          className="text-[11px] px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        >
          Light on Dark
        </button>
        <button
          type="button"
          onClick={() =>
            setDesign({
              ...design,
              sidebarTextColor: '#ffffff',
              sidebarHeadingColor: '#ffffff',
              sidebarPrimaryColor: '#e2e8f0',
            })
          }
          className="text-[11px] px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        >
          White on Dark
        </button>
        <button
          type="button"
          onClick={() =>
            setDesign({
              ...design,
              sidebarTextColor: design.textColor,
              sidebarHeadingColor: design.headingColor,
              sidebarPrimaryColor: design.primaryColor,
            })
          }
          className="text-[11px] px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        >
          Same as Main
        </button>
      </div>
    </div>
  );
};

export default SidebarColorControls;
