import React from 'react';

export const HeaderBannerControls = ({ design, setDesign, layout, setLayout }) => {
  const bannerPresets = [
    {
      id: 'transparent',
      label: 'Transparent',
      desc: 'Page color',
      bg: 'transparent',
      text: design.textColor,
      head: design.headingColor,
      pri: design.primaryColor,
    },
    {
      id: '#1e293b',
      label: 'Slate Dark',
      desc: 'Dark slate bar',
      bg: '#1e293b',
      text: '#cbd5e1',
      head: '#ffffff',
      pri: '#38bdf8',
    },
    {
      id: '#1e3a5f',
      label: 'Navy Blue',
      desc: 'Deep navy bar',
      bg: '#1e3a5f',
      text: '#cbd5e1',
      head: '#ffffff',
      pri: '#60a5fa',
    },
    {
      id: '#18181b',
      label: 'Obsidian',
      desc: 'Rich charcoal',
      bg: '#18181b',
      text: '#d4d4d8',
      head: '#ffffff',
      pri: '#2dd4bf',
    },
    {
      id: '#1e40af',
      label: 'Royal Azure',
      desc: 'Vibrant blue',
      bg: '#1e40af',
      text: '#dbeafe',
      head: '#ffffff',
      pri: '#93c5fd',
    },
    {
      id: '#064e3b',
      label: 'Deep Emerald',
      desc: 'Forest green',
      bg: '#064e3b',
      text: '#d1fae5',
      head: '#ffffff',
      pri: '#34d399',
    },
  ];

  const handleSelectBanner = (bp) => {
    setDesign({
      ...design,
      headerBackgroundColor: bp.bg,
      headerTextColor: bp.text,
      headerHeadingColor: bp.head,
      headerPrimaryColor: bp.pri,
    });
    if (bp.bg !== 'transparent' && layout?.columns === 2 && !layout?.headerFullWidth && setLayout) {
      setLayout({ ...layout, headerFullWidth: true });
    }
  };

  const isBannerActive = design.headerBackgroundColor && design.headerBackgroundColor !== 'transparent';

  return (
    <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Top Header Banner Theme
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Span a contrast colored banner across the top (e.g. Executive dark bar)
          </p>
        </div>
        {isBannerActive && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono border border-blue-700">
            Banner Active
          </span>
        )}
      </div>

      {/* Banner Presets */}
      <div className="grid grid-cols-3 gap-2">
        {bannerPresets.map((bp) => {
          const isActive = (design.headerBackgroundColor || 'transparent') === bp.bg;
          return (
            <button
              key={bp.id}
              type="button"
              onClick={() => handleSelectBanner(bp)}
              className={`p-2 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 shadow-xs"
                  style={{ backgroundColor: bp.bg === 'transparent' ? '#ffffff' : bp.bg }}
                />
                <span className="text-xs font-semibold truncate text-slate-200">{bp.label}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{bp.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Custom Header Background Color Input */}
      {isBannerActive && (
        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-300">Custom Banner Color:</span>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
            <input
              type="color"
              value={design.headerBackgroundColor}
              onChange={(e) =>
                setDesign({ ...design, headerBackgroundColor: e.target.value })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-xs text-slate-300 uppercase">
              {design.headerBackgroundColor}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderBannerControls;
