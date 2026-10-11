import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Palette, 
  Type, 
  Layout, 
  Plus, 
  Check, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles,
  Layers,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Globe2,
  Columns,
  Square,
  PanelLeft,
  PanelRight,
  Info,
  CheckCircle2,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import ResumeRenderer, { FONT_OPTIONS, COLOR_PRESETS } from '@/components/resume/ResumeRenderer';
import { samplePersonas } from '@/components/resume/sampleResumeData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const DEFAULT_SECTIONS = [
  { id: 'header', type: 'header', title: 'Header Details', visible: true, column: 'main' },
  { id: 'summary', type: 'summary', title: 'Professional Summary', visible: true, column: 'main' },
  { id: 'experience', type: 'experience', title: 'Work Experience', visible: true, column: 'main' },
  { id: 'education', type: 'education', title: 'Education', visible: true, column: 'main' },
  { id: 'skills', type: 'skills', title: 'Skills & Proficiencies', visible: true, column: 'sidebar' },
  { id: 'projects', type: 'projects', title: 'Featured Projects', visible: true, column: 'main' },
  { id: 'certifications', type: 'certifications', title: 'Certifications', visible: true, column: 'sidebar' },
  { id: 'languages', type: 'languages', title: 'Languages', visible: true, column: 'sidebar' },
  { id: 'awards', type: 'awards', title: 'Awards & Honors', visible: false, column: 'main' },
];

const DEFAULT_DESIGN = {
  fontFamily: "'Inter', sans-serif",
  headingFontFamily: "'Inter', sans-serif",
  fontSize: '10pt',
  headingStyle: 'underline',
  primaryColor: '#2563eb',
  textColor: '#1e293b',
  headingColor: '#0f172a',
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  sidebarBackgroundColor: '#f8fafc',
  pageMargin: 'normal',
  sectionSpacing: 'normal',
  itemSpacing: 'normal',
  dividerStyle: 'subtle',
  headerAlignment: 'left',
  skillsStyle: 'tags',
};

const DEFAULT_LAYOUT = {
  pageSize: 'A4',
  columns: 1,
  sidebarPosition: 'left',
  sidebarWidth: '33%',
  sections: DEFAULT_SECTIONS,
};

const CATEGORIES = [
  'Modern',
  'Executive',
  'Minimalist',
  'Creative',
  'Technical',
  'Academic',
];

const HEADING_STYLES = [
  { id: 'underline', label: 'Underline Accent', desc: 'Sleek accent line under title' },
  { id: 'border-left', label: 'Left Border Bar', desc: 'Vertical colored block border' },
  { id: 'pill', label: 'Pill Badge', desc: 'Rounded soft background badge' },
  { id: 'uppercase', label: 'Tracked Uppercase', desc: 'High-contrast spaced letters' },
  { id: 'boxed', label: 'Solid Box', desc: 'Filled background banner' },
  { id: 'minimal', label: 'Minimalist Dot', desc: 'Clean dot with no line' },
];

const TemplateBuilderModal = ({ isOpen, onClose, template, onSave }) => {
  if (!isOpen) return null;

  // Template Form State
  const [name, setName] = useState(template?.name || 'Modern Professional Resume');
  const [code, setCode] = useState(template?.code || 'modern-pro');
  const [description, setDescription] = useState(
    template?.description || 'A clean, ATS-compliant modern resume template tailored for technology and leadership roles.'
  );
  const [category, setCategory] = useState(template?.category || 'Modern');
  const [status, setStatus] = useState(template?.status || 'draft');
  const [thumbnailUrl, setThumbnailUrl] = useState(template?.thumbnail_url || '');

  // Layout & Design State
  const [layout, setLayout] = useState(template?.layout_config || DEFAULT_LAYOUT);
  const [design, setDesign] = useState(template?.design_config || DEFAULT_DESIGN);

  // Active UI Controls
  const [activeTab, setActiveTab] = useState('structure'); // 'details' | 'structure' | 'design'
  const [selectedPersona, setSelectedPersona] = useState('software_engineer');
  const [zoomLevel, setZoomLevel] = useState(0.78); // Fit standard screen
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Sync state if template prop changes
  useEffect(() => {
    if (template) {
      setName(template.name || 'Untitled Template');
      setCode(template.code || 'template-code');
      setDescription(template.description || '');
      setCategory(template.category || 'Modern');
      setStatus(template.status || 'draft');
      setThumbnailUrl(template.thumbnail_url || '');
      setLayout(template.layout_config || DEFAULT_LAYOUT);
      setDesign(template.design_config || DEFAULT_DESIGN);
    }
  }, [template]);

  // Auto-slugify code from name if creating new
  const handleNameChange = (val) => {
    setName(val);
    if (!template) {
      const generatedCode = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setCode(generatedCode);
    }
  };

  // Section Management Helpers
  const moveSection = (index, direction) => {
    const newSections = [...layout.sections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setLayout({ ...layout, sections: newSections });
  };

  const toggleSectionVisibility = (id) => {
    const newSections = layout.sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setLayout({ ...layout, sections: newSections });
  };

  const updateSectionTitle = (id, newTitle) => {
    const newSections = layout.sections.map((s) =>
      s.id === id ? { ...s, title: newTitle } : s
    );
    setLayout({ ...layout, sections: newSections });
  };

  const toggleSectionColumn = (id) => {
    const newSections = layout.sections.map((s) =>
      s.id === id ? { ...s, column: s.column === 'sidebar' ? 'main' : 'sidebar' } : s
    );
    setLayout({ ...layout, sections: newSections });
  };

  const addOptionalSection = (type, title) => {
    const exists = layout.sections.some((s) => s.type === type);
    if (exists) {
      // just make it visible
      const newSections = layout.sections.map((s) =>
        s.type === type ? { ...s, visible: true } : s
      );
      setLayout({ ...layout, sections: newSections });
      toast.success(`${title} section made visible`);
    } else {
      const newSec = {
        id: `${type}-${Date.now()}`,
        type,
        title,
        visible: true,
        column: layout.columns === 2 ? 'sidebar' : 'main',
      };
      setLayout({ ...layout, sections: [...layout.sections, newSec] });
      toast.success(`${title} section added`);
    }
  };

  // Preset Colors Apply
  const applyPalettePreset = (preset) => {
    setDesign({
      ...design,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      headingColor: preset.heading,
      backgroundColor: preset.bg,
      sidebarBackgroundColor: preset.sidebarBg,
    });
    toast.success(`Applied ${preset.name} palette`);
  };

  // Reset to Defaults
  const handleReset = () => {
    if (window.confirm('Reset all layout and design settings back to defaults?')) {
      setLayout(DEFAULT_LAYOUT);
      setDesign(DEFAULT_DESIGN);
      toast.info('Settings reset to default');
    }
  };

  // Save / Publish
  const handleSave = (publishStatus = null) => {
    if (!name.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    if (!code.trim()) {
      toast.error('Please enter a unique template code');
      return;
    }

    const finalStatus = publishStatus || status;

    const payload = {
      id: template?.id || undefined,
      name: name.trim(),
      code: code.trim().toLowerCase(),
      description: description.trim(),
      category,
      status: finalStatus,
      thumbnail_url: thumbnailUrl.trim(),
      layout_config: layout,
      design_config: design,
    };

    onSave(payload);
    toast.success(`Template ${finalStatus === 'published' ? 'published' : 'saved'} successfully!`);
    onClose();
  };

  // Composite Template Object for Live Preview
  const previewTemplate = {
    name,
    category,
    layout_config: layout,
    design_config: design,
  };

  const activePersonaData = samplePersonas[selectedPersona] || samplePersonas.software_engineer;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in-0 duration-200">
      {/* Top Application Bar */}
      <header className="h-16 shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shadow-lg">
        {/* Left: Title & Status */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
            <Layout className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base tracking-tight text-slate-100">
                {name || 'Untitled Template'}
              </span>
              <Badge
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                  status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : status === 'archived'
                    ? 'bg-slate-700/50 text-slate-400 border border-slate-600'
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
                Alex Morgan (Tech Lead)
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
              onClick={() => setZoomLevel((z) => Math.min(1.25, +(z + 0.08).toFixed(2)))}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <div className="h-3 w-px bg-slate-700 mx-1" />
            <button
              onClick={() => setZoomLevel(0.78)}
              className="px-1.5 py-0.5 rounded text-[10px] hover:bg-slate-700 text-slate-400 transition-colors"
            >
              Fit
            </button>
            <button
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
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 h-8"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave('draft')}
            className="text-xs bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 h-8"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Draft
          </Button>

          <Button
            size="sm"
            onClick={() => handleSave('published')}
            className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 h-8"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Publish Template
          </Button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace (3-Panel Architecture) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1 & 2 Left Controls Workspace */}
        <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-10 shadow-2xl">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-3 pt-2">
            <button
              onClick={() => setActiveTab('structure')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                activeTab === 'structure'
                  ? 'border-blue-500 text-blue-400 bg-slate-900 shadow-xs'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Layout & Sections</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {layout.sections.filter((s) => s.visible).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                activeTab === 'design'
                  ? 'border-blue-500 text-blue-400 bg-slate-900 shadow-xs'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Design & Styles</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-400 bg-slate-900 shadow-xs'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>Template Details</span>
            </button>
          </div>

          {/* Controls Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-slate-200 text-sm">
            {/* TAB: STRUCTURE & SECTIONS */}
            {activeTab === 'structure' && (
              <div className="space-y-6">
                {/* Columns & Layout Mode */}
                <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                        Page Grid & Columns
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Choose between single column flow or split sidebar
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
                      Format: A4
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
                      <span className="text-[10px] opacity-70">Single Flow</span>
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
                    <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                      <span className="text-xs text-slate-300">Sidebar Width Ratio:</span>
                      <div className="flex items-center gap-1.5">
                        {['30%', '34%', '38%'].map((w) => (
                          <button
                            key={w}
                            onClick={() => setLayout({ ...layout, sidebarWidth: w })}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-mono ${
                              layout.sidebarWidth === w
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Order & Visibility Manager */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                        Resume Sections
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Reorder sections with arrows, toggle visibility, or assign column
                      </p>
                    </div>

                    {/* Quick Add Optional Section */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Section</span>
                      </button>
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-30 space-y-0.5">
                        <button
                          onClick={() => addOptionalSection('certifications', 'Certifications')}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                        >
                          <Award className="h-3.5 w-3.5 text-amber-400" />
                          <span>Certifications</span>
                        </button>
                        <button
                          onClick={() => addOptionalSection('languages', 'Languages')}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                        >
                          <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Languages</span>
                        </button>
                        <button
                          onClick={() => addOptionalSection('awards', 'Awards & Honors')}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                        >
                          <Award className="h-3.5 w-3.5 text-purple-400" />
                          <span>Awards</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sections List */}
                  <div className="space-y-2">
                    {layout.sections.map((sec, idx) => (
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

                        {/* Right: Column Tag (if 2-column) & Visibility Toggle */}
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DESIGN & STYLES */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* 1. Quick Color Palette Presets */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                      Color Palette Themes
                    </h4>
                    <span className="text-[10px] text-slate-400">1-Click Presets</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PRESETS.map((p) => {
                      const isSelected = design.primaryColor === p.primary;
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

                {/* 3. Typography Selection */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                    Typography & Fonts
                  </h4>

                  {/* Body Font Family */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Primary Font Family</label>
                    <div className="space-y-1">
                      {FONT_OPTIONS.map((f) => {
                        const isSelected = design.fontFamily === f.value;
                        return (
                          <button
                            key={f.label}
                            type="button"
                            onClick={() =>
                              setDesign({ ...design, fontFamily: f.value, headingFontFamily: f.value })
                            }
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                                : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                            }`}
                          >
                            <span className="text-xs font-medium" style={{ fontFamily: f.value }}>
                              {f.label}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Size Selector */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-300">Base Font Scale:</span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: '9pt', label: 'Small (9pt)' },
                        { id: '10pt', label: 'Regular (10pt)' },
                        { id: '11pt', label: 'Large (11pt)' },
                      ].map((fs) => (
                        <button
                          key={fs.id}
                          onClick={() => setDesign({ ...design, fontSize: fs.id })}
                          className={`text-xs px-2.5 py-1 rounded-lg border ${
                            design.fontSize === fs.id
                              ? 'bg-blue-600 text-white border-blue-500 font-semibold'
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
                  <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                    Heading Styles
                  </h4>
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

                {/* 5. Margins & Spacing */}
                <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-4">
                  <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                    Spacing & Geometry
                  </h4>

                  {/* Margins */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Page Margin:</span>
                    <div className="flex items-center gap-1.5">
                      {['compact', 'normal', 'spacious'].map((m) => (
                        <button
                          key={m}
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

                  {/* Header Alignment */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Header Align:</span>
                    <div className="flex items-center gap-1.5">
                      {['left', 'center', 'split'].map((h) => (
                        <button
                          key={h}
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

                  {/* Skills Style */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Skills Visual:</span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'tags', label: 'Badges' },
                        { id: 'bars', label: 'Bars' },
                        { id: 'text', label: 'Bullets' },
                      ].map((sk) => (
                        <button
                          key={sk.id}
                          onClick={() => setDesign({ ...design, skillsStyle: sk.id })}
                          className={`text-xs px-2.5 py-1 rounded-lg border ${
                            design.skillsStyle === sk.id
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
            )}

            {/* TAB: TEMPLATE METADATA */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Template Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Modern Executive Chronological"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Unique Code (Identifier)
                  </label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. modern-exec-pro"
                    className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Unique URL-safe code used in backend database and user template selection.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Publication Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'draft', label: 'Draft', color: 'text-amber-400 border-amber-500/30' },
                      { id: 'published', label: 'Published', color: 'text-emerald-400 border-emerald-500/30' },
                      { id: 'archived', label: 'Archived', color: 'text-slate-400 border-slate-700' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStatus(st.id)}
                        className={`p-2 rounded-xl border text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                          status === st.id
                            ? `bg-slate-800 ring-2 ring-blue-500 ${st.color}`
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of when candidates should choose this layout..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Thumbnail Preview URL (Optional)
                  </label>
                  <Input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://.../preview.jpg"
                    className="bg-slate-800 border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Live Interactive A4 Document Preview Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          {/* Canvas Sub-header */}
          <div className="h-10 shrink-0 bg-slate-900/70 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-400 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-300">Live A4 Document Preview</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-[11px]">210 × 297 mm (Standard A4)</span>
            </div>

            <div className="flex items-center gap-3">
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
                onClick={() => setIsFullScreenPreview(!isFullScreenPreview)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                title="Full Preview"
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
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilderModal;
