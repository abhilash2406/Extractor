import React, { useState, useEffect } from 'react';
import { Layers, Palette, Info, RotateCcw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { samplePersonas } from '@/components/resume/sampleResumeData';

import {
  DEFAULT_LAYOUT,
  DEFAULT_DESIGN,
  isColorDark,
} from './builderConstants';
import BuilderHeader from './BuilderHeader';
import LayoutTab from './tabs/LayoutTab';
import DesignTab from './tabs/DesignTab';
import MetadataTab from './tabs/MetadataTab';
import PreviewPane from './PreviewPane';

export const TemplateBuilder = ({
  initialTemplate,
  onSave,
  onBack,
}) => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  // Form State
  const [name, setName] = useState(initialTemplate?.name || 'Modern Professional Resume');
  const [code, setCode] = useState(initialTemplate?.code || 'modern-pro');
  const [description, setDescription] = useState(
    initialTemplate?.description ||
      'A clean, ATS-compliant modern resume template tailored for technology and leadership roles.'
  );
  const [category, setCategory] = useState(initialTemplate?.category || 'Modern');
  const [status, setStatus] = useState(initialTemplate?.status || 'draft');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialTemplate?.thumbnail_url || '');

  // Layout & Design Configuration
  const [layout, setLayout] = useState(initialTemplate?.layout_config || DEFAULT_LAYOUT);
  const [design, setDesign] = useState(initialTemplate?.design_config || DEFAULT_DESIGN);

  // Active UI Controls
  const [activeTab, setActiveTab] = useState('structure'); // 'structure' | 'design' | 'details'
  const [selectedPersona, setSelectedPersona] = useState('software_engineer');
  const [zoomLevel, setZoomLevel] = useState(0.78);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Synchronize state if initialTemplate changes
  useEffect(() => {
    if (initialTemplate) {
      setName(initialTemplate.name || 'Untitled Template');
      setCode(initialTemplate.code || 'template-code');
      setDescription(initialTemplate.description || '');
      setCategory(initialTemplate.category || 'Modern');
      setStatus(initialTemplate.status || 'draft');
      setThumbnailUrl(initialTemplate.thumbnail_url || '');
      setLayout(initialTemplate.layout_config || DEFAULT_LAYOUT);
      setDesign(initialTemplate.design_config || DEFAULT_DESIGN);
    }
  }, [initialTemplate]);

  // Slugify code automatically when creating a new template
  const handleNameChange = (val) => {
    setName(val);
    if (!initialTemplate) {
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

  const removeSection = (id) => {
    const newSections = layout.sections.filter((s) => s.id !== id);
    setLayout({ ...layout, sections: newSections });
    toast.success('Section removed');
  };

  const applyCareerPreset = (preset) => {
    if (!preset) return;
    const newLayout = {
      ...layout,
      ...preset.layout,
      sections: layout.sections.map((sec) => {
        if (preset.layout.columns === 1) {
          return { ...sec, column: 'main' };
        }
        return sec;
      }),
    };

    if (preset.id === 'student-fresher') {
      const secOrder = ['header', 'summary', 'education', 'projects', 'skills', 'experience', 'certifications', 'languages', 'awards', 'coursework'];
      newLayout.sections = [...newLayout.sections].sort((a, b) => {
        const idxA = secOrder.indexOf(a.type);
        const idxB = secOrder.indexOf(b.type);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    }

    if (preset.id === 'executive-dense') {
      newLayout.sections = newLayout.sections.map((sec) => {
        if (['skills', 'certifications', 'languages'].includes(sec.type)) {
          return { ...sec, column: 'sidebar', visible: true };
        }
        return { ...sec, column: 'main' };
      });
    }

    setLayout(newLayout);
    setDesign((prev) => ({
      ...prev,
      ...preset.design,
    }));
    toast.success(`Applied ${preset.name} archetype`);
  };

  // Apply 1-Click Color Preset
  const applyPalettePreset = (preset) => {
    const isDarkSidebar = isColorDark(preset.sidebarBg);
    setDesign({
      ...design,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      headingColor: preset.heading,
      backgroundColor: preset.bg,
      sidebarBackgroundColor: preset.sidebarBg,
      ...(isDarkSidebar
        ? {
            sidebarTextColor: '#cbd5e1',
            sidebarHeadingColor: '#f1f5f9',
            sidebarPrimaryColor: '#94a3b8',
          }
        : {
            sidebarTextColor: preset.heading,
            sidebarHeadingColor: preset.heading,
            sidebarPrimaryColor: preset.primary,
          }),
    });
    toast.success(`Applied ${preset.name} palette`);
  };

  // Reset Configuration
  const handleReset = () => {
    setIsResetDialogOpen(true);
  };

  const handleConfirmReset = () => {
    setLayout(DEFAULT_LAYOUT);
    setDesign(DEFAULT_DESIGN);
    setIsResetDialogOpen(false);
    toast.info('Settings reset to default');
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
      id: initialTemplate?.id || undefined,
      name: name.trim(),
      code: code.trim().toLowerCase(),
      description: description.trim(),
      category,
      status: finalStatus,
      thumbnail_url: thumbnailUrl.trim(),
      layout_config: layout,
      design_config: design,
    };

    onSave(payload, finalStatus);
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
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden select-none">
      {/* Top Application Bar */}
      <BuilderHeader
        name={name}
        code={code}
        category={category}
        status={status}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        handleReset={handleReset}
        handleSave={handleSave}
        onBack={onBack}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Controls Workspace */}
        <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-10 shadow-2xl">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-3 pt-2">
            <button
              type="button"
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
              type="button"
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
              type="button"
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
            {activeTab === 'structure' && (
              <LayoutTab
                layout={layout}
                setLayout={setLayout}
                applyCareerPreset={applyCareerPreset}
                moveSection={moveSection}
                toggleSectionVisibility={toggleSectionVisibility}
                updateSectionTitle={updateSectionTitle}
                toggleSectionColumn={toggleSectionColumn}
                addOptionalSection={addOptionalSection}
                removeSection={removeSection}
                editingSectionId={editingSectionId}
                setEditingSectionId={setEditingSectionId}
              />
            )}

            {activeTab === 'design' && (
              <DesignTab
                design={design}
                setDesign={setDesign}
                layout={layout}
                setLayout={setLayout}
                applyPalettePreset={applyPalettePreset}
              />
            )}

            {activeTab === 'details' && (
              <MetadataTab
                name={name}
                handleNameChange={handleNameChange}
                code={code}
                setCode={setCode}
                category={category}
                setCategory={setCategory}
                status={status}
                setStatus={setStatus}
                description={description}
                setDescription={setDescription}
                thumbnailUrl={thumbnailUrl}
                setThumbnailUrl={setThumbnailUrl}
              />
            )}
          </div>
        </div>

        {/* Live Interactive A4 Document Preview Canvas */}
        <PreviewPane
          previewTemplate={previewTemplate}
          activePersonaData={activePersonaData}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          showGuidelines={showGuidelines}
          setShowGuidelines={setShowGuidelines}
        />
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="max-w-md p-6 bg-slate-900 border-slate-800 text-white shadow-2xl rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-slate-100">
                Reset Template Settings
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 leading-relaxed">
                Reset all layout configuration, section ordering, fonts, and color styles back to the initial defaults? Any unsaved edits will be discarded.
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsResetDialogOpen(false)}
              className="text-xs h-9 px-4 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="button"
              onClick={handleConfirmReset}
              className="text-xs h-9 px-4 gap-1.5 font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Defaults</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateBuilder;
