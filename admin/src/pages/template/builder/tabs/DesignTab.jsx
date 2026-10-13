import React from 'react';
import { 
  Check, 
  Contact, 
  LayoutTemplate, 
  Clock, 
  Sparkles, 
  Layers,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Sliders,
  Type
} from 'lucide-react';
import { COLOR_PRESETS, FONT_OPTIONS } from '@/components/resume/ResumeRenderer';
import { HEADING_STYLES } from '../builderConstants';
import PhotoControls from '../controls/PhotoControls';
import HeaderBannerControls from '../controls/HeaderBannerControls';
import SidebarColorControls from '../controls/SidebarColorControls';

export const DesignTab = ({
  design,
  setDesign,
  layout,
  setLayout,
  applyPalettePreset,
}) => {
  const handleMonochromeMode = () => {
    setDesign({
      ...design,
      primaryColor: '#0f172a',
      accentColor: '#334155',
      headingColor: '#0f172a',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      sidebarBackgroundColor: '#f8fafc',
      sidebarTextColor: '#1e293b',
      sidebarHeadingColor: '#0f172a',
      sidebarPrimaryColor: '#334155',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Color Palette Presets & Monochrome Mode */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Color Palette Themes
          </h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMonochromeMode}
              className="text-[10px] px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-500 font-mono transition-colors"
              title="Switch to 100% ATS / Monochrome Grayscale"
            >
              1-Click Monochrome
            </button>
            <span className="text-[10px] text-slate-400">Presets</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {COLOR_PRESETS.map((p) => {
            const isSelected = design.primaryColor === p.primary && design.sidebarBackgroundColor === p.sidebarBg;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPalettePreset(p)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-slate-800 ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex -space-x-1 shrink-0">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-900 shadow-xs"
                    style={{ backgroundColor: p.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-slate-900 shadow-xs"
                    style={{ backgroundColor: p.accent }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-slate-900 shadow-xs"
                    style={{ backgroundColor: p.sidebarBg }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {p.name}
                  </div>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Color Pickers */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
        <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
          Custom Color Fine-Tuning
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {/* Primary Color */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Primary Accent
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
              <input
                type="color"
                value={design.primaryColor}
                onChange={(e) =>
                  setDesign({ ...design, primaryColor: e.target.value })
                }
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-300 uppercase">
                {design.primaryColor}
              </span>
            </div>
          </div>

          {/* Heading Color */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Heading Color
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
              <input
                type="color"
                value={design.headingColor}
                onChange={(e) =>
                  setDesign({ ...design, headingColor: e.target.value })
                }
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-300 uppercase">
                {design.headingColor}
              </span>
            </div>
          </div>

          {/* Body Text Color */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Body Text Color
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
              <input
                type="color"
                value={design.textColor}
                onChange={(e) => setDesign({ ...design, textColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-300 uppercase">
                {design.textColor}
              </span>
            </div>
          </div>

          {/* Sidebar Background */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Sidebar Background
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
              <input
                type="color"
                value={design.sidebarBackgroundColor}
                onChange={(e) =>
                  setDesign({ ...design, sidebarBackgroundColor: e.target.value })
                }
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-300 uppercase">
                {design.sidebarBackgroundColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography Selection (Separate Heading & Body Fonts) */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-slate-400" />
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Typography & Font Pairing
          </h4>
        </div>

        {/* Body Font Family */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-300 font-medium">Body Font Family</label>
            <span className="text-[10px] text-slate-500 font-mono">Paragraphs & Details</span>
          </div>
          <select
            value={design.fontFamily}
            onChange={(e) => setDesign({ ...design, fontFamily: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.label} value={f.value} className="bg-slate-900 text-white">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Heading Font Family */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-300 font-medium">Heading Font Family</label>
            <span className="text-[10px] text-slate-500 font-mono">Name & Section Titles</span>
          </div>
          <select
            value={design.headingFontFamily || design.fontFamily}
            onChange={(e) => setDesign({ ...design, headingFontFamily: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value={design.fontFamily} className="bg-slate-900 text-slate-300">
              Same as Body Font
            </option>
            {FONT_OPTIONS.map((f) => (
              <option key={f.label} value={f.value} className="bg-slate-900 text-white">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-300">Base Font Scale:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: '9pt', label: 'Small (9pt)' },
              { id: '10pt', label: 'Regular (10pt)' },
              { id: '11pt', label: 'Large (11pt)' },
            ].map((fs) => (
              <button
                key={fs.id}
                type="button"
                onClick={() => setDesign({ ...design, fontSize: fs.id })}
                className={`text-xs px-2.5 py-1 rounded-lg border ${
                  design.fontSize === fs.id
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-xs'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Heading Style */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Heading Styles
          </h4>
          <button
            type="button"
            onClick={() =>
              setDesign({ ...design, showSectionIcons: !design.showSectionIcons })
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
              design.showSectionIcons
                ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Section Icons: {design.showSectionIcons ? 'ON' : 'OFF'}</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {HEADING_STYLES.map((hs) => {
            const isSelected = design.headingStyle === hs.id;
            return (
              <button
                key={hs.id}
                type="button"
                onClick={() => setDesign({ ...design, headingStyle: hs.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>{hs.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{hs.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Section Presentation Styles (Experience, Education, Projects) */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-slate-400" />
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Section Presentation Styles
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 -mt-1">
          Customize individual section rendering beyond global theme defaults
        </p>

        {/* Experience Presentation Style */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Briefcase className="h-3.5 w-3.5 text-blue-400" />
              <span>Work Experience Layout:</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              {design.experienceStyle || 'standard'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'standard', label: 'Standard', desc: 'Full details & bullets' },
              { id: 'timeline', label: 'Timeline', desc: 'Vertical dot track' },
              { id: 'compact', label: 'Compact', desc: 'Dense 1-line format' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setDesign({ ...design, experienceStyle: st.id })}
                className={`p-2 rounded-lg border text-left transition-all ${
                  (design.experienceStyle || 'standard') === st.id
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{st.label}</div>
                <div className="text-[9px] text-slate-500">{st.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Education Presentation Style */}
        <div className="space-y-1.5 pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
              <span>Education Layout:</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              {design.educationStyle || 'standard'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'standard', label: 'Standard', desc: 'Degree & Institution' },
              { id: 'timeline', label: 'Timeline', desc: 'Connected nodes' },
              { id: 'compact', label: 'Compact', desc: 'Single row summary' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setDesign({ ...design, educationStyle: st.id })}
                className={`p-2 rounded-lg border text-left transition-all ${
                  (design.educationStyle || 'standard') === st.id
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{st.label}</div>
                <div className="text-[9px] text-slate-500">{st.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Presentation Style */}
        <div className="space-y-1.5 pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <FolderGit2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Projects Layout:</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              {design.projectsStyle || 'detailed'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'detailed', label: 'Detailed Cards', desc: 'Bordered card with badges & bullets' },
              { id: 'compact', label: 'Compact Rows', desc: 'Clean inline title & link' },
            ].map((pt) => (
              <button
                key={pt.id}
                type="button"
                onClick={() => setDesign({ ...design, projectsStyle: pt.id })}
                className={`p-2 rounded-lg border text-left transition-all ${
                  (design.projectsStyle || 'detailed') === pt.id
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{pt.label}</div>
                <div className="text-[9px] text-slate-500">{pt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Header Style & Structure */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-slate-400" />
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Header Layout & Style
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 -mt-1">
          Choose identity presentation (standard, boxed frame, contact card, or banner)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'standard', label: 'Standard Clean', desc: 'Clean flow with alignment' },
            { id: 'boxed', label: 'Boxed Frame', desc: 'Bordered box around name (T2)' },
            { id: 'contact-card', label: 'Contact Grid Card', desc: 'Accent line + info table (T1, T8)' },
            { id: 'banner', label: 'Solid Top Banner', desc: 'High-contrast colored header (T5, T6)' },
            { id: 'identity-card', label: 'Left Identity Card', desc: 'Photo + dark card on left (T7)' },
          ].map((hs) => {
            const isSelected = (design.headerStyle || 'standard') === hs.id;
            return (
              <button
                key={hs.id}
                type="button"
                onClick={() => setDesign({ ...design, headerStyle: hs.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold flex items-center justify-between">
                  <span>{hs.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{hs.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Photo Controls Component */}
      <PhotoControls design={design} setDesign={setDesign} />

      {/* 8. Contact Info Placement & Format */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
        <div className="flex items-center gap-2">
          <Contact className="h-4 w-4 text-slate-400" />
          <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Contact Details Placement & Format
          </h4>
        </div>
        
        {/* Placement */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-300 block">Placement:</span>
          <div className="flex items-center gap-2">
            {[
              { id: 'header', label: 'In Header', desc: 'Across top banner or below name' },
              { id: 'sidebar', label: 'In Sidebar', desc: 'Vertical list in sidebar' },
            ].map((cp) => (
              <button
                key={cp.id}
                type="button"
                onClick={() => setDesign({ ...design, contactPlacement: cp.id })}
                className={`flex-1 p-2.5 rounded-xl border text-left transition-all ${
                  (design.contactPlacement || 'header') === cp.id
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{cp.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{cp.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Display Format */}
        <div className="space-y-1.5 pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-300 block">Visual Format:</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'inline', label: 'Inline Icons', desc: 'Standard flex with colored icons' },
              { id: 'pills', label: 'Pill Badges', desc: 'Rounded badge pills with icons (T3)' },
              { id: 'capsule', label: 'Capsule Bar', desc: 'Enclosed rounded capsule pill (T7)' },
              { id: 'grid-card', label: 'Key-Value Card', desc: 'PHONE, EMAIL, EXP table (T1, T8)' },
              { id: 'pipe-separated', label: 'Pipe Separated', desc: 'Clean text | text for ATS (T4, T5)' },
            ].map((cs) => {
              const isSelected = (design.contactStyle || 'inline') === cs.id;
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setDesign({ ...design, contactStyle: cs.id })}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                      : 'border-slate-800 bg-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{cs.label}</span>
                    {isSelected && <Check className="h-3 w-3 text-blue-400" />}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{cs.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 9. Header Banner Controls Component */}
      <HeaderBannerControls
        design={design}
        setDesign={setDesign}
        layout={layout}
        setLayout={setLayout}
      />

      {/* 10. Sidebar Colors Controls Component (for 2-column mode) */}
      {layout?.columns === 2 && (
        <SidebarColorControls design={design} setDesign={setDesign} />
      )}

      {/* 11. Dates / Timeline Configuration */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Dates / Timeline:
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'right', label: 'Right Aligned' },
              { id: 'left', label: 'Timeline Left (T2)' },
              { id: 'badge', label: 'Pill Badge (T3)' },
            ].map((dp) => (
              <button
                key={dp.id}
                type="button"
                onClick={() => setDesign({ ...design, datePlacement: dp.id })}
                className={`text-xs px-2.5 py-1 rounded-lg border ${
                  (design.datePlacement || 'right') === dp.id
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {dp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 12. Margins, Spacing & Geometry */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
        <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
          Spacing, Dividers & Geometry
        </h4>

        {/* Page Margins */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Page Margin:</span>
          <div className="flex items-center gap-1.5">
            {['compact', 'normal', 'spacious'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDesign({ ...design, pageMargin: m })}
                className={`text-xs capitalize px-2.5 py-1 rounded-lg border ${
                  design.pageMargin === m
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Section Spacing */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Section Gap:</span>
          <div className="flex items-center gap-1.5">
            {['compact', 'normal', 'generous'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDesign({ ...design, sectionSpacing: s })}
                className={`text-xs capitalize px-2.5 py-1 rounded-lg border ${
                  design.sectionSpacing === s
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Divider Style */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Divider Style:</span>
          <div className="flex items-center gap-1.5">
            {['subtle', 'solid', 'dashed', 'none'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDesign({ ...design, dividerStyle: d })}
                className={`text-xs capitalize px-2.5 py-1 rounded-lg border ${
                  (design.dividerStyle || 'subtle') === d
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Header Alignment */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Header Align:</span>
          <div className="flex items-center gap-1.5">
            {['left', 'center', 'split'].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setDesign({ ...design, headerAlignment: h })}
                className={`text-xs capitalize px-2.5 py-1 rounded-lg border ${
                  design.headerAlignment === h
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Visual Style */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Skills Visual:</span>
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {[
              { id: 'tags', label: 'Badges' },
              { id: 'filled-pills', label: 'Pills (T6)' },
              { id: 'columns-3', label: '3-Col Grid (T4)' },
              { id: 'text', label: 'Bullets (T1)' },
              { id: 'bars', label: 'Bars' },
              { id: 'card-box', label: 'Dark Card (T8)' },
            ].map((sk) => (
              <button
                key={sk.id}
                type="button"
                onClick={() => setDesign({ ...design, skillsStyle: sk.id })}
                className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                  design.skillsStyle === sk.id ||
                  (sk.id === 'text' && design.skillsStyle === 'bullets')
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {sk.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTab;
