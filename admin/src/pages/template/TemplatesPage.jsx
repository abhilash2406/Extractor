import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Plus, 
  Search, 
  Sparkles, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Layers, 
  CheckCircle2,
  FileCode2,
  FileText,
  Sliders,
  Check,
  Columns,
  Square,
  Globe2,
  Maximize2,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TemplateBuilderModal from './TemplateBuilderModal';
import ResumeRenderer from '@/components/resume/ResumeRenderer';
import { samplePersonas } from '@/components/resume/sampleResumeData';
import toast from 'react-hot-toast';

// Initial curated resume templates
export const INITIAL_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Modern Azure Chronological',
    code: 'modern-azure-chrono',
    category: 'Modern',
    status: 'published',
    description: 'Clean single-column layout with vibrant azure accents and high readability. Ideal for software engineers and technology professionals.',
    layout_config: {
      pageSize: 'A4',
      columns: 1,
      sections: [
        { id: 'header', type: 'header', title: 'Header Details', visible: true, column: 'main' },
        { id: 'summary', type: 'summary', title: 'Professional Summary', visible: true, column: 'main' },
        { id: 'experience', type: 'experience', title: 'Work Experience', visible: true, column: 'main' },
        { id: 'education', type: 'education', title: 'Education', visible: true, column: 'main' },
        { id: 'skills', type: 'skills', title: 'Technical Skills', visible: true, column: 'main' },
        { id: 'projects', type: 'projects', title: 'Key Projects', visible: true, column: 'main' },
        { id: 'certifications', type: 'certifications', title: 'Certifications', visible: true, column: 'main' },
      ],
    },
    design_config: {
      fontFamily: "'Inter', sans-serif",
      headingFontFamily: "'Inter', sans-serif",
      fontSize: '10pt',
      headingStyle: 'underline',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      headingColor: '#0f172a',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      sidebarBackgroundColor: '#f8fafc',
      pageMargin: 'normal',
      sectionSpacing: 'normal',
      itemSpacing: 'normal',
      dividerStyle: 'solid',
      headerAlignment: 'left',
      skillsStyle: 'tags',
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },

  {
    id: 'tpl-2',
    name: 'Executive Navy Split-Column',
    code: 'executive-navy-split',
    category: 'Executive',
    status: 'published',
    description: 'Two-column sidebar structure with distinguished serif typography and deep navy tones. Perfect for leadership, consulting, and finance roles.',
    layout_config: {
      pageSize: 'A4',
      columns: 2,
      sidebarPosition: 'left',
      sidebarWidth: '33%',
      sections: [
        { id: 'header', type: 'header', title: 'Profile Header', visible: true, column: 'main' },
        { id: 'summary', type: 'summary', title: 'Executive Summary', visible: true, column: 'main' },
        { id: 'experience', type: 'experience', title: 'Leadership Experience', visible: true, column: 'main' },
        { id: 'education', type: 'education', title: 'Academic Background', visible: true, column: 'main' },
        { id: 'skills', type: 'skills', title: 'Core Competencies', visible: true, column: 'sidebar' },
        { id: 'certifications', type: 'certifications', title: 'Certifications', visible: true, column: 'sidebar' },
        { id: 'languages', type: 'languages', title: 'Languages', visible: true, column: 'sidebar' },
        { id: 'awards', type: 'awards', title: 'Honors & Recognitions', visible: true, column: 'sidebar' },
      ],
    },
    design_config: {
      fontFamily: "'Outfit', sans-serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      fontSize: '10pt',
      headingStyle: 'pill',
      primaryColor: '#1e3a8a',
      accentColor: '#2563eb',
      headingColor: '#0f172a',
      textColor: '#334155',
      backgroundColor: '#ffffff',
      sidebarBackgroundColor: '#f1f5f9',
      pageMargin: 'normal',
      sectionSpacing: 'normal',
      itemSpacing: 'normal',
      dividerStyle: 'subtle',
      headerAlignment: 'left',
      skillsStyle: 'tags',
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },

  {
    id: 'tpl-3',
    name: 'Minimalist Obsidian',
    code: 'minimalist-obsidian',
    category: 'Minimalist',
    status: 'published',
    description: 'Monochrome, distraction-free typographic hierarchy with clean dot accents. High ATS pass rate and understated Scandinavian elegance.',
    layout_config: {
      pageSize: 'A4',
      columns: 1,
      sections: [
        { id: 'header', type: 'header', title: 'Personal Info', visible: true, column: 'main' },
        { id: 'summary', type: 'summary', title: 'About Me', visible: true, column: 'main' },
        { id: 'experience', type: 'experience', title: 'Work History', visible: true, column: 'main' },
        { id: 'skills', type: 'skills', title: 'Capabilities', visible: true, column: 'main' },
        { id: 'projects', type: 'projects', title: 'Selected Works', visible: true, column: 'main' },
        { id: 'education', type: 'education', title: 'Education', visible: true, column: 'main' },
      ],
    },
    design_config: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      headingFontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '9pt',
      headingStyle: 'minimal',
      primaryColor: '#18181b',
      accentColor: '#52525b',
      headingColor: '#09090b',
      textColor: '#27272a',
      backgroundColor: '#ffffff',
      sidebarBackgroundColor: '#f4f4f5',
      pageMargin: 'compact',
      sectionSpacing: 'compact',
      itemSpacing: 'compact',
      dividerStyle: 'none',
      headerAlignment: 'split',
      skillsStyle: 'text',
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },

  {
    id: 'tpl-4',
    name: 'Creative Emerald Designer',
    code: 'creative-emerald',
    category: 'Creative',
    status: 'draft',
    description: 'Rich two-column layout with sidebar right, bold left-border accents, and emerald styling tailored for designers, content creators, and marketers.',
    layout_config: {
      pageSize: 'A4',
      columns: 2,
      sidebarPosition: 'right',
      sidebarWidth: '34%',
      sections: [
        { id: 'header', type: 'header', title: 'Header Details', visible: true, column: 'main' },
        { id: 'summary', type: 'summary', title: 'Creative Statement', visible: true, column: 'main' },
        { id: 'projects', type: 'projects', title: 'Featured Portfolio', visible: true, column: 'main' },
        { id: 'experience', type: 'experience', title: 'Experience Timeline', visible: true, column: 'main' },
        { id: 'skills', type: 'skills', title: 'Design & Tools', visible: true, column: 'sidebar' },
        { id: 'education', type: 'education', title: 'Degree', visible: true, column: 'sidebar' },
        { id: 'languages', type: 'languages', title: 'Languages', visible: true, column: 'sidebar' },
      ],
    },
    design_config: {
      fontFamily: "'Poppins', sans-serif",
      headingFontFamily: "'Poppins', sans-serif",
      fontSize: '10pt',
      headingStyle: 'border-left',
      primaryColor: '#059669',
      accentColor: '#10b981',
      headingColor: '#064e3b',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      sidebarBackgroundColor: '#f0fdf4',
      pageMargin: 'normal',
      sectionSpacing: 'normal',
      itemSpacing: 'normal',
      dividerStyle: 'subtle',
      headerAlignment: 'left',
      skillsStyle: 'bars',
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },

  {
    id: 'tpl-5',
    name: 'Nordic Heritage Academic',
    code: 'nordic-heritage',
    category: 'Academic',
    status: 'draft',
    description: 'Traditional editorial layout featuring Merriweather serif fonts, crimson accents, and comprehensive academic section hierarchies.',
    layout_config: {
      pageSize: 'A4',
      columns: 1,
      sections: [
        { id: 'header', type: 'header', title: 'Curriculum Vitae', visible: true, column: 'main' },
        { id: 'summary', type: 'summary', title: 'Research Overview', visible: true, column: 'main' },
        { id: 'education', type: 'education', title: 'Higher Education', visible: true, column: 'main' },
        { id: 'experience', type: 'experience', title: 'Academic Appointments', visible: true, column: 'main' },
        { id: 'projects', type: 'projects', title: 'Grants & Publications', visible: true, column: 'main' },
        { id: 'awards', type: 'awards', title: 'Fellowships & Honors', visible: true, column: 'main' },
        { id: 'skills', type: 'skills', title: 'Technical Methodologies', visible: true, column: 'main' },
      ],
    },
    design_config: {
      fontFamily: "'Merriweather', Georgia, serif",
      headingFontFamily: "'Merriweather', Georgia, serif",
      fontSize: '10pt',
      headingStyle: 'uppercase',
      primaryColor: '#991b1b',
      accentColor: '#dc2626',
      headingColor: '#450a0a',
      textColor: '#1c1917',
      backgroundColor: '#fffdfa',
      sidebarBackgroundColor: '#fef2f2',
      pageMargin: 'spacious',
      sectionSpacing: 'generous',
      itemSpacing: 'normal',
      dividerStyle: 'dashed',
      headerAlignment: 'center',
      skillsStyle: 'text',
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'extractor_resume_templates_v1';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load templates from localStorage', e);
    }
    return INITIAL_TEMPLATES;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Quick Fullscreen Preview Modal State
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);
  const [previewPersona, setPreviewPersona] = useState('software_engineer');

  // Save templates to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
      console.error('Failed to save templates to localStorage', e);
    }
  }, [templates]);

  // Handle Create or Edit Save
  const handleSaveTemplate = (templateData) => {
    if (templateData.id) {
      // Update existing
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateData.id
            ? { ...templateData, updated_at: new Date().toISOString() }
            : t
        )
      );
    } else {
      // Create new
      const newTemplate = {
        ...templateData,
        id: `tpl-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTemplates((prev) => [newTemplate, ...prev]);
    }
    setIsBuilderOpen(false);
    setEditingTemplate(null);
  };

  // Duplicate Template
  const handleDuplicate = (tpl, e) => {
    e.stopPropagation();
    const cloned = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      code: `${tpl.code}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTemplates((prev) => [cloned, ...prev]);
    toast.success(`Duplicated "${tpl.name}" as draft`);
  };

  // Toggle Publish / Draft status
  const handleToggleStatus = (tpl, e) => {
    e.stopPropagation();
    const newStatus = tpl.status === 'published' ? 'draft' : 'published';
    setTemplates((prev) =>
      prev.map((t) => (t.id === tpl.id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
    );
    toast.success(`Template marked as ${newStatus}`);
  };

  // Delete Template
  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete template "${title}"?`)) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success('Template deleted');
    }
  };

  const categories = ['All', 'Modern', 'Executive', 'Minimalist', 'Creative', 'Academic'];

  // Filtering
  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.code.toLowerCase().includes(search.toLowerCase()) ||
      (tpl.description && tpl.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || tpl.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Summary counts
  const totalCount = templates.length;
  const publishedCount = templates.filter((t) => t.status === 'published').length;
  const draftCount = templates.filter((t) => t.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>Resume Templates</span>
            <Badge variant="outline" className="text-xs font-mono">
              FlowCV Engine
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Design, configure visual styles, inspect live A4 previews, and publish resume templates for users.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTemplate(null);
            setIsBuilderOpen(true);
          }}
          className="gap-2 self-start sm:self-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Create Template</span>
        </Button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-card/60 backdrop-blur-xs">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Templates
          </div>
          <div className="text-2xl font-bold text-foreground mt-1 font-heading">
            {totalCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Configured layouts</div>
        </Card>

        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Published Live
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">
            {publishedCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Available to users</div>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Drafts in Design
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-heading">
            {draftCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Unpublished models</div>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/20">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Categories
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-heading">
            {categories.length - 1}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Modern, Exec & more</div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by title or code..."
              className="pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status dropdown filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold bg-muted/80 text-foreground border border-border rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border p-8">
          <Palette className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="font-heading font-semibold text-lg text-foreground">No templates found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or create a new template using the builder.
          </p>
          <Button
            onClick={() => {
              setEditingTemplate(null);
              setIsBuilderOpen(true);
            }}
            className="mt-4 gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Template</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => {
            const columnsCount = tpl.layout_config?.columns || 1;
            const primaryColor = tpl.design_config?.primaryColor || '#2563eb';
            const fontFamily = tpl.design_config?.fontFamily || "'Inter', sans-serif";
            const visibleSections = (tpl.layout_config?.sections || []).filter((s) => s.visible !== false);

            return (
              <Card
                key={tpl.id}
                className="group hover:shadow-xl hover:border-primary/40 transition-all duration-200 flex flex-col justify-between overflow-hidden bg-card"
              >
                {/* Visual Thumbnail Area with Real Live Mini-Preview */}
                <div
                  className="relative h-48 bg-slate-100 dark:bg-slate-900/90 overflow-hidden border-b border-border/70 flex items-center justify-center cursor-pointer group/preview"
                  onClick={() => setPreviewModalTemplate(tpl)}
                >
                  {/* Scaled-down live A4 representation */}
                  <div className="absolute top-2 transform-gpu transition-transform duration-300 group-hover/preview:scale-[0.34] scale-[0.31] pointer-events-none select-none origin-top">
                    <ResumeRenderer
                      template={tpl}
                      data={samplePersonas.software_engineer}
                      isThumbnail={true}
                    />
                  </div>

                  {/* Gradient Overlay & Hover Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end justify-between p-3.5 z-10">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-blue-400" />
                      <span>Click to preview A4 document</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] text-white bg-slate-900/80 border-slate-700">
                      {tpl.category}
                    </Badge>
                  </div>

                  {/* Status Tag on top right */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm ${
                        tpl.status === 'published'
                          ? 'bg-emerald-500/90 hover:bg-emerald-500 text-white'
                          : tpl.status === 'archived'
                          ? 'bg-slate-600 text-white'
                          : 'bg-amber-500/90 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {tpl.status}
                    </Badge>
                  </div>

                  {/* Column badge on top left */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-700/60 shadow-xs">
                    {columnsCount === 2 ? (
                      <>
                        <Columns className="h-3 w-3 text-purple-400" />
                        <span>2 Columns</span>
                      </>
                    ) : (
                      <>
                        <Square className="h-3 w-3 text-blue-400" />
                        <span>1 Column</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Info Content */}
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {tpl.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>{tpl.code}</span>
                        <span>•</span>
                        <span className="text-foreground font-sans font-medium">{tpl.category}</span>
                      </div>
                    </div>

                    {/* Primary Color Indicator */}
                    <div
                      className="w-5 h-5 rounded-full border-2 border-background shadow-xs shrink-0"
                      style={{ backgroundColor: primaryColor }}
                      title={`Primary theme: ${primaryColor}`}
                    />
                  </div>

                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                    {tpl.description || 'Configured resume styling layout.'}
                  </CardDescription>
                </CardHeader>

                {/* Metadata & Controls Footer */}
                <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <span>{visibleSections.length} visible sections</span>
                    </div>

                    <span className="text-[11px] truncate max-w-[120px]" style={{ fontFamily }}>
                      {fontFamily.split(',')[0].replace(/'/g, '')}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingTemplate(tpl);
                        setIsBuilderOpen(true);
                      }}
                      className="flex-1 text-xs gap-1.5 h-8 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none font-semibold"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit & Design</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleToggleStatus(tpl, e)}
                      className={`h-8 w-8 ${
                        tpl.status === 'published'
                          ? 'text-emerald-500 hover:text-amber-500 hover:bg-amber-500/10'
                          : 'text-amber-500 hover:text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                      title={tpl.status === 'published' ? 'Unpublish (set to draft)' : 'Publish template'}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDuplicate(tpl, e)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Duplicate template"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(tpl.id, tpl.name, e)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Full-Featured Visual Template Builder Modal */}
      {isBuilderOpen && (
        <TemplateBuilderModal
          isOpen={isBuilderOpen}
          template={editingTemplate}
          onClose={() => {
            setIsBuilderOpen(false);
            setEditingTemplate(null);
          }}
          onSave={handleSaveTemplate}
        />
      )}

      {/* Quick A4 Preview Modal */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="font-heading font-semibold text-base">
                    {previewModalTemplate.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {previewModalTemplate.category} • {previewModalTemplate.layout_config?.columns || 1}-Column Layout
                  </p>
                </div>
              </div>

              {/* Persona Switcher & Close */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                  <span className="text-slate-400">Persona:</span>
                  <select
                    value={previewPersona}
                    onChange={(e) => setPreviewPersona(e.target.value)}
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="software_engineer" className="bg-slate-900">
                      Alex Morgan (Tech Lead)
                    </option>
                    <option value="product_designer" className="bg-slate-900">
                      Sophia Martinez (UX Designer)
                    </option>
                    <option value="marketing_lead" className="bg-slate-900">
                      Daniel Chen (Marketing)
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => setPreviewModalTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Preview */}
            <div className="flex-1 overflow-auto p-6 sm:p-8 flex justify-center items-start bg-slate-950">
              <ResumeRenderer
                template={previewModalTemplate}
                data={samplePersonas[previewPersona] || samplePersonas.software_engineer}
                scale={0.88}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950/70 text-xs text-slate-400">
              <span>Standard A4 Output (210mm × 297mm)</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const tpl = previewModalTemplate;
                    setPreviewModalTemplate(null);
                    setEditingTemplate(tpl);
                    setIsBuilderOpen(true);
                  }}
                  className="text-xs h-7 gap-1.5"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Customize in Builder</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewModalTemplate(null)}
                  className="text-xs h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
