import React, { useState } from 'react';
import { 
  Square, 
  PanelLeft, 
  PanelRight, 
  Maximize, 
  Plus, 
  Award, 
  Globe2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff,
  Trash2,
  Sparkles,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  FileCheck2,
  Smile,
  Users2,
  Check,
  ShieldCheck,
  Briefcase,
  Code2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  CAREER_PRESETS, 
  SIDEBAR_WIDTH_OPTIONS, 
  PAGE_SIZE_OPTIONS, 
  CUSTOM_SECTION_TYPES 
} from '../builderConstants';

const PRESET_CONFIGS = {
  'ats-standard': {
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/60',
    hoverText: 'group-hover:text-emerald-300',
  },
  'student-fresher': {
    icon: GraduationCap,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/60',
    hoverText: 'group-hover:text-blue-300',
  },
  'executive-dense': {
    icon: Briefcase,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
    tagColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    hoverBorder: 'hover:border-teal-500/60',
    hoverText: 'group-hover:text-teal-300',
  },
  'creative-tech': {
    icon: Code2,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    tagColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    hoverBorder: 'hover:border-purple-500/60',
    hoverText: 'group-hover:text-purple-300',
  },
};

export const LayoutTab = ({
  layout,
  setLayout,
  applyCareerPreset,
  moveSection,
  toggleSectionVisibility,
  updateSectionTitle,
  toggleSectionColumn,
  addOptionalSection,
  removeSection,
  editingSectionId,
  setEditingSectionId,
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const pageSize = layout.pageSize || 'A4';
  const currentWidth = layout.sidebarWidth || '33%';

  return (
    <div className="space-y-6">
      {/* 1. 1-Click Career Archetypes Bar */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 rounded-xl p-4 border border-blue-500/20 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              1-Click Career Archetypes
            </h4>
          </div>
          <span className="text-[10px] text-blue-400 font-medium">Auto-Layout & Design</span>
        </div>
        <p className="text-[11px] text-slate-400 -mt-1 leading-relaxed">
          Instantly reconfigure columns, hierarchy, and styling tailored for specific career stages.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {CAREER_PRESETS.map((preset) => {
            const config = PRESET_CONFIGS[preset.id] || {
              icon: Sparkles,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10 border-blue-500/20',
              tagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
              hoverBorder: 'hover:border-blue-500/60',
              hoverText: 'group-hover:text-blue-300',
            };
            const IconComp = config.icon;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyCareerPreset && applyCareerPreset(preset)}
                className={`group relative p-3 rounded-xl border text-left transition-all bg-slate-900/80 border-slate-700/80 ${config.hoverBorder} hover:bg-slate-850 hover:shadow-lg flex flex-col justify-between`}
              >
                <div className="w-full space-y-1.5">
                  {/* Top row: Icon on left, crisp tag pill on right */}
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`p-1 rounded-md border ${config.iconBg} ${config.iconColor}`}>
                      <IconComp className="h-3.5 w-3.5" />
                    </span>
                    <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap leading-none shrink-0 ${config.tagColor}`}>
                      {preset.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h5 className={`font-semibold text-xs text-slate-100 ${config.hoverText} transition-colors leading-tight pt-0.5`}>
                    {preset.name}
                  </h5>

                  {/* Description */}
                  <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Page Geometry & Document Size */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Page Standard & Orientation
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select standard print sheet geometry
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700">
            {PAGE_SIZE_OPTIONS.map((ps) => (
              <button
                key={ps.id}
                type="button"
                onClick={() => setLayout({ ...layout, pageSize: ps.id })}
                className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                  pageSize === ps.id
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {ps.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Page Columns & Layout Mode */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Page Grid & Columns
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Choose single column flow or multi-column sidebar
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
            {layout.columns === 1 ? 'Single Flow' : `2-Cols (${layout.sidebarPosition})`}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setLayout({ ...layout, columns: 1 })}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              layout.columns === 1
                ? 'border-blue-500 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500'
                : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Square className="h-5 w-5 mb-1.5" />
            <span className="text-xs font-semibold">1 Column</span>
            <span className="text-[10px] opacity-70">Single Flow (ATS)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setLayout({ ...layout, columns: 2, sidebarPosition: 'left' })
            }
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              layout.columns === 2 && layout.sidebarPosition === 'left'
                ? 'border-blue-500 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500'
                : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <PanelLeft className="h-5 w-5 mb-1.5" />
            <span className="text-xs font-semibold">2 Columns</span>
            <span className="text-[10px] opacity-70">Sidebar Left</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setLayout({ ...layout, columns: 2, sidebarPosition: 'right' })
            }
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              layout.columns === 2 && layout.sidebarPosition === 'right'
                ? 'border-blue-500 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500'
                : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <PanelRight className="h-5 w-5 mb-1.5" />
            <span className="text-xs font-semibold">2 Columns</span>
            <span className="text-[10px] opacity-70">Sidebar Right</span>
          </button>
        </div>

        {/* Sidebar Width Control (when 2-column) */}
        {layout.columns === 2 && (
          <>
            <div className="pt-2 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Sidebar Width Ratio:</span>
                <span className="text-[11px] text-blue-400 font-mono font-semibold">{currentWidth}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {SIDEBAR_WIDTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLayout({ ...layout, sidebarWidth: opt.id })}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      currentWidth === opt.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                        : 'bg-slate-850 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">{opt.label}</div>
                    <div className="text-[9px] opacity-80 truncate">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Header Full Width Toggle */}
            <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Maximize className="h-3.5 w-3.5 text-slate-400" />
                <div>
                  <span className="text-xs text-slate-200 block">Header Spans Full Width</span>
                  <span className="text-[10px] text-slate-400">Banner spans across both columns at top</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLayout({ ...layout, headerFullWidth: !layout.headerFullWidth })
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  layout.headerFullWidth ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    layout.headerFullWidth ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 4. Section Order & Visibility Manager */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Resume Sections ({layout.sections.length})
            </h4>
            <p className="text-[11px] text-slate-400">
              Reorder sections, toggle visibility, assign column, or add custom blocks
            </p>
          </div>

          {/* Quick Add Custom Section Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Section</span>
            </button>

            {isAddMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsAddMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-30 space-y-0.5">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Add Supported Section
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addOptionalSection('certifications', 'Certifications');
                      setIsAddMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>Certifications</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addOptionalSection('languages', 'Languages');
                      setIsAddMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Languages</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addOptionalSection('awards', 'Awards & Honors');
                      setIsAddMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <Award className="h-3.5 w-3.5 text-purple-400" />
                    <span>Awards & Honors</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Custom Sections
                  </div>
                  {CUSTOM_SECTION_TYPES.map((cSec) => (
                    <button
                      key={cSec.type}
                      type="button"
                      onClick={() => {
                        addOptionalSection(cSec.type, cSec.title);
                        setIsAddMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      {cSec.type === 'volunteering' && <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />}
                      {cSec.type === 'publications' && <BookOpen className="h-3.5 w-3.5 text-cyan-400" />}
                      {cSec.type === 'coursework' && <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />}
                      {cSec.type === 'hobbies' && <Smile className="h-3.5 w-3.5 text-amber-400" />}
                      {cSec.type === 'references' && <Users2 className="h-3.5 w-3.5 text-teal-400" />}
                      {cSec.type === 'custom' && <FileCheck2 className="h-3.5 w-3.5 text-blue-400" />}
                      <span>{cSec.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-2">
          {layout.sections.map((sec, idx) => {
            const isStandardCore = ['header', 'summary', 'experience', 'education', 'skills', 'projects'].includes(sec.type);
            return (
              <div
                key={sec.id || idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  sec.visible
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 shadow-xs'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                {/* Left: Drag / Order Controls & Title */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Order buttons */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 1)}
                      disabled={idx === layout.sections.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Section Title or inline edit */}
                  <div className="flex-1 min-w-0">
                    {editingSectionId === sec.id ? (
                      <input
                        type="text"
                        value={sec.title}
                        autoFocus
                        onBlur={() => setEditingSectionId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingSectionId(null)}
                        onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                        className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingSectionId(sec.id)}
                        className="cursor-pointer group/title flex items-center gap-1.5"
                        title="Click to rename"
                      >
                        <span className="font-semibold text-xs truncate">
                          {sec.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({sec.type})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Column Tag (if 2-column) & Visibility Toggle & Delete */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {/* Column switcher for 2-column mode */}
                  {layout.columns === 2 && sec.type !== 'header' && (
                    <button
                      type="button"
                      onClick={() => toggleSectionColumn(sec.id)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border transition-colors ${
                        sec.column === 'sidebar'
                          ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                          : 'bg-blue-950/60 border-blue-800 text-blue-300'
                      }`}
                      title="Click to toggle between Main Column and Sidebar"
                    >
                      {sec.column === 'sidebar' ? 'Sidebar' : 'Main'}
                    </button>
                  )}

                  {/* Eye toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      sec.visible
                        ? 'bg-slate-700/60 border-slate-600 text-slate-200 hover:bg-slate-700'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title={sec.visible ? 'Hide section' : 'Show section'}
                  >
                    {sec.visible ? (
                      <Eye className="h-3.5 w-3.5 text-blue-400" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Trash delete for non-core sections */}
                  {!isStandardCore && removeSection && (
                    <button
                      type="button"
                      onClick={() => removeSection(sec.id)}
                      className="p-1.5 rounded-lg border border-transparent text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LayoutTab;
