import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  FileText,
  User,
  Languages,
  CheckCircle2,
  Sparkles,
  Clock,
  FolderGit2,
  Wrench
} from 'lucide-react';

const isColorDark = (hex) => {
  if (!hex || hex === 'transparent') return false;
  const c = hex.replace('#', '');
  if (c.length !== 6 && c.length !== 3) return false;
  const r = parseInt(c.length === 3 ? c[0] + c[0] : c.substring(0, 2), 16);
  const g = parseInt(c.length === 3 ? c[1] + c[1] : c.substring(2, 4), 16);
  const b = parseInt(c.length === 3 ? c[2] + c[2] : c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.45;
};

const getSectionIcon = (type) => {
  switch (type) {
    case 'summary':
      return <User className="w-3.5 h-3.5" />;
    case 'experience':
      return <Briefcase className="w-3.5 h-3.5" />;
    case 'education':
      return <GraduationCap className="w-3.5 h-3.5" />;
    case 'skills':
      return <Wrench className="w-3.5 h-3.5" />;
    case 'projects':
      return <FolderGit2 className="w-3.5 h-3.5" />;
    case 'certifications':
      return <Award className="w-3.5 h-3.5" />;
    case 'languages':
      return <Languages className="w-3.5 h-3.5" />;
    case 'awards':
      return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'contact':
      return <Phone className="w-3.5 h-3.5" />;
    default:
      return <Sparkles className="w-3.5 h-3.5" />;
  }
};

const LinkedinIcon = ({ className = 'w-3.5 h-3.5', style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const cleanUrlDisplay = (url) => {
  if (!url) return '';
  return String(url)
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/$/, '');
};

const GithubIcon = ({ className = 'w-3.5 h-3.5', style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const FONT_OPTIONS = [
  { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif" },
  { label: 'Outfit (Clean Geometric)', value: "'Outfit', sans-serif" },
  { label: 'Roboto (Neutral Neo-grotesque)', value: "'Roboto', sans-serif" },
  { label: 'Plus Jakarta Sans (Crisp Contemporary)', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Poppins (Friendly Geometric)', value: "'Poppins', sans-serif" },
  { label: 'Merriweather (Classic Editorial Serif)', value: "'Merriweather', Georgia, serif" },
  { label: 'Playfair Display (Executive High-Contrast Serif)', value: "'Playfair Display', Georgia, serif" },
];

export const COLOR_PRESETS = [
  { name: 'Azure Tech', primary: '#2563eb', accent: '#3b82f6', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#f8fafc' },
  { name: 'Emerald Forest', primary: '#059669', accent: '#10b981', heading: '#064e3b', bg: '#ffffff', sidebarBg: '#f0fdf4' },
  { name: 'Executive Navy', primary: '#1e3a8a', accent: '#2563eb', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#f1f5f9' },
  { name: 'Crimson Heritage', primary: '#991b1b', accent: '#dc2626', heading: '#450a0a', bg: '#ffffff', sidebarBg: '#fef2f2' },
  { name: 'Obsidian Minimal', primary: '#18181b', accent: '#3f3f46', heading: '#09090b', bg: '#ffffff', sidebarBg: '#f4f4f5' },
  { name: 'Teal Modernist', primary: '#0d9488', accent: '#14b8a6', heading: '#134e4a', bg: '#ffffff', sidebarBg: '#f0fdfa' },
  { name: 'Warm Amber', primary: '#d97706', accent: '#f59e0b', heading: '#78350f', bg: '#fffdfa', sidebarBg: '#fffbeb' },
  { name: 'Navy Dark Sidebar', primary: '#1e3a5f', accent: '#3b82f6', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#1e293b' },
  { name: 'Charcoal Contrast', primary: '#334155', accent: '#64748b', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#1e293b' },
];

const marginMap = {
  compact: '14mm',
  normal: '20mm',
  spacious: '26mm',
};

const sectionGapMap = {
  compact: '14px',
  normal: '20px',
  generous: '28px',
};

const itemGapMap = {
  compact: '8px',
  normal: '14px',
  generous: '20px',
};

const fontSizeMap = {
  '7pt': { base: '9.3px', name: '20px', h2: '12px', title: '10.5px', small: '8.2px' },
  '7.5pt': { base: '10px', name: '21px', h2: '12.8px', title: '11.2px', small: '8.8px' },
  '8pt': { base: '10.7px', name: '22px', h2: '13.5px', title: '12px', small: '9.4px' },
  '8.5pt': { base: '11.3px', name: '23.5px', h2: '14.2px', title: '12.6px', small: '10px' },
  '9pt': { base: '12px', name: '25px', h2: '15px', title: '13.3px', small: '10.5px' },
  '9.5pt': { base: '12.7px', name: '26.5px', h2: '15.8px', title: '14px', small: '11px' },
  '10pt': { base: '13.3px', name: '28px', h2: '16.8px', title: '14.8px', small: '11.5px' },
  '10.5pt': { base: '14px', name: '29.5px', h2: '17.6px', title: '15.5px', small: '12px' },
  '11pt': { base: '14.7px', name: '31px', h2: '18.5px', title: '16.3px', small: '12.6px' },
  '11.5pt': { base: '15.3px', name: '32.5px', h2: '19.3px', title: '17px', small: '13.2px' },
  '12pt': { base: '16px', name: '34px', h2: '20.2px', title: '17.8px', small: '13.8px' },
  '12.5pt': { base: '16.7px', name: '35.5px', h2: '21px', title: '18.5px', small: '14.4px' },
  '13pt': { base: '17.3px', name: '37px', h2: '22px', title: '19.2px', small: '15px' },
  '14pt': { base: '18.7px', name: '40px', h2: '23.5px', title: '20.6px', small: '16px' },
};

const photoSizeMap = {
  small: { width: '64px', height: '64px' },
  medium: { width: '88px', height: '88px' },
  large: { width: '112px', height: '112px' },
};

/**
 * ResumeRenderer: A pure, configuration-driven React component
 * that renders an A4 resume based on template layout and design configs.
 */
const ResumeRenderer = ({
  template,
  data,
  scale = 1,
  isThumbnail = false,
  className = '',
  showPageGuidelines = false,
  spacers = {},
}) => {
  if (!template || !data) return null;

  const layout = template.layout_config || {};
  const design = template.design_config || {};

  const isTwoColumn = Number(layout.columns) === 2;
  const sidebarPosition = layout.sidebarPosition || 'left';
  const sidebarWidth = layout.sidebarWidth || '33%';
  const headerFullWidth = layout.headerFullWidth === true;

  const fontFamily = design.fontFamily || "'Inter', sans-serif";
  const headingFontFamily = design.headingFontFamily || fontFamily;
  const primaryColor = design.primaryColor || '#2563eb';
  const textColor = design.textColor || '#1e293b';
  const headingColor = design.headingColor || '#0f172a';
  const accentColor = design.accentColor || primaryColor;
  const backgroundColor = design.backgroundColor || '#ffffff';
  const sidebarBg = design.sidebarBackgroundColor || '#f8fafc';
  const headingStyle = design.headingStyle || 'underline'; // 'underline' | 'border-left' | 'pill' | 'uppercase' | 'minimal' | 'boxed' | 'icon-badge' | 'filled-bar' | 'accent-bar'
  const dividerStyle = design.dividerStyle || 'subtle'; // 'subtle' | 'solid' | 'dashed' | 'none'
  const headerAlignment = design.headerAlignment || 'left'; // 'left' | 'center' | 'split'
  const headerStyle = design.headerStyle || 'standard'; // 'standard' | 'boxed' | 'contact-card' | 'banner' | 'identity-card'
  const contactStyle = design.contactStyle || 'inline'; // 'inline' | 'pills' | 'capsule' | 'grid-card' | 'pipe-separated'
  const datePlacement = design.datePlacement || 'right'; // 'right' | 'left' | 'badge'
  const showSectionIcons = design.showSectionIcons === true;
  const skillsStyle = design.skillsStyle || 'tags'; // 'tags' | 'filled-pills' | 'bars' | 'dots' | 'text' | 'columns-3' | 'card-box'
  const showPhoto = design.showPhoto !== false; // default true for backward compat
  const photoShape = design.photoShape || 'circle'; // 'circle' | 'square' | 'rounded'
  const photoPlacement = design.photoPlacement || 'header'; // 'header' | 'sidebar'
  const photoSize = design.photoSize || 'small'; // 'small' | 'medium' | 'large'
  const contactPlacement = design.contactPlacement || 'header'; // 'header' | 'sidebar'
  const experienceStyle = design.experienceStyle || 'standard'; // 'standard' | 'timeline' | 'compact'
  const educationStyle = design.educationStyle || 'standard'; // 'standard' | 'timeline' | 'compact'
  const projectsStyle = design.projectsStyle || 'detailed'; // 'detailed' | 'compact'

  // Sidebar-specific colors (for dark sidebar support)
  const sidebarTextColor = design.sidebarTextColor || textColor;
  const sidebarHeadingColor = design.sidebarHeadingColor || headingColor;
  const sidebarPrimaryColor = design.sidebarPrimaryColor || primaryColor;

  // Header-specific colors (for dark/colored banner header support)
  const headerBackgroundColor = design.headerBackgroundColor || 'transparent';
  const hasHeaderBg = headerBackgroundColor && headerBackgroundColor !== 'transparent';
  const headerTextColor = design.headerTextColor || (hasHeaderBg ? '#e2e8f0' : textColor);
  const headerHeadingColor = design.headerHeadingColor || (hasHeaderBg ? '#ffffff' : headingColor);
  const headerPrimaryColor = design.headerPrimaryColor || (hasHeaderBg ? '#38bdf8' : primaryColor);

  const headerColors = {
    textColor: headerTextColor,
    headingColor: headerHeadingColor,
    primaryColor: headerPrimaryColor,
  };

  const fontSizes = fontSizeMap[design.fontSize] || fontSizeMap['10pt'];
  const pageMargin = marginMap[design.pageMargin] || marginMap.normal;
  const sectionSpacing = sectionGapMap[design.sectionSpacing] || sectionGapMap.normal;
  const itemSpacing = itemGapMap[design.itemSpacing] || itemGapMap.normal;

  // Color contexts for main vs sidebar rendering
  const mainColors = { textColor, headingColor, primaryColor };
  const sidebarColors = {
    textColor: sidebarTextColor,
    headingColor: sidebarHeadingColor,
    primaryColor: sidebarPrimaryColor,
  };

  // Filter visible sections
  let sections = (layout.sections || []).filter((s) => s.visible !== false);

  // If candidate has projects but projects section is not present in template's layout, dynamically inject it
  if (data.projects && data.projects.length > 0 && !sections.some((s) => s.type === 'projects')) {
    const expIdx = sections.findIndex((s) => s.type === 'experience');
    const projectsSection = {
      id: 'projects',
      type: 'projects',
      title: 'Key Projects',
      visible: true,
      column: 'main',
    };
    if (expIdx !== -1) {
      sections = [
        ...sections.slice(0, expIdx + 1),
        projectsSection,
        ...sections.slice(expIdx + 1),
      ];
    } else {
      sections = [...sections, projectsSection];
    }
  }

  // Filter out any user-hidden sections
  if (data.hiddenSections) {
    sections = sections.filter((s) => !data.hiddenSections[s.type] && !data.hiddenSections[s.id]);
  }

  // Apply user-defined sectionOrder if present
  if (Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0) {
    const orderMap = {};
    data.sectionOrder.forEach((type, idx) => {
      orderMap[type] = idx;
    });
    // Header always comes first if present
    sections.sort((a, b) => {
      if (a.type === 'header') return -1;
      if (b.type === 'header') return 1;
      const orderA = orderMap[a.type] !== undefined ? orderMap[a.type] : 999;
      const orderB = orderMap[b.type] !== undefined ? orderMap[b.type] : 999;
      return orderA - orderB;
    });
  }

  // Separate header if placed at top in single column or across top of 2-column
  const hasHeaderInLayout = sections.some((s) => s.type === 'header');
  const headerSection = sections.find((s) => s.type === 'header');
  const bodySections = sections.filter((s) => s.type !== 'header');

  const mainColumnSections = isTwoColumn
    ? bodySections.filter((s) => (s.column || 'main') === 'main')
    : bodySections;

  const sidebarColumnSections = isTwoColumn
    ? bodySections.filter((s) => s.column === 'sidebar')
    : [];

  // Photo shape class helper
  const getPhotoShapeClass = () => {
    switch (photoShape) {
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-lg';
      case 'circle':
      default: return 'rounded-full';
    }
  };

  // Render Heading Component (color-context aware)
  const renderSectionHeading = (title, icon, colors = mainColors, sectionType = null) => {
    const pc = colors.primaryColor;
    const hc = colors.headingColor;
    const resolvedIcon = icon || (sectionType ? getSectionIcon(sectionType) : null);

    switch (headingStyle) {
      case 'icon-badge':
        return (
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-2xs"
              style={{ backgroundColor: pc, color: '#ffffff' }}
            >
              {resolvedIcon}
            </div>
            <h2
              className="font-bold tracking-tight uppercase"
              style={{
                fontFamily: headingFontFamily,
                color: hc,
                fontSize: fontSizes.h2,
                letterSpacing: '0.04em',
              }}
            >
              {title}
            </h2>
          </div>
        );

      case 'filled-bar':
        return (
          <div
            className="px-3 py-1 mb-3 rounded-xs flex items-center justify-between"
            style={{
              backgroundColor: isColorDark(pc) ? pc : '#0f172a',
              color: '#ffffff',
            }}
          >
            <div className="flex items-center gap-2">
              {(showSectionIcons || resolvedIcon) && (
                <span className="text-white/90">{resolvedIcon}</span>
              )}
              <h2
                className="font-bold tracking-wider uppercase text-white"
                style={{
                  fontFamily: headingFontFamily,
                  fontSize: fontSizes.h2,
                  letterSpacing: '0.08em',
                }}
              >
                {title}
              </h2>
            </div>
          </div>
        );

      case 'accent-bar':
        return (
          <div className="mb-3">
            <div className="flex items-center gap-2 pb-1">
              {showSectionIcons && resolvedIcon && (
                <span style={{ color: pc }}>{resolvedIcon}</span>
              )}
              <h2
                className="font-extrabold tracking-tight uppercase"
                style={{
                  fontFamily: headingFontFamily,
                  color: hc,
                  fontSize: fontSizes.h2,
                  letterSpacing: '0.04em',
                }}
              >
                {title}
              </h2>
            </div>
            <div
              className="w-full"
              style={{
                height: '3px',
                backgroundColor: pc,
              }}
            />
          </div>
        );

      case 'border-left':
        return (
          <div
            className="flex items-center gap-2 mb-3 pb-0.5"
            style={{
              borderLeft: `3.5px solid ${pc}`,
              paddingLeft: '8px',
            }}
          >
            {showSectionIcons && resolvedIcon && (
              <span style={{ color: pc }}>{resolvedIcon}</span>
            )}
            <h2
              className="font-bold tracking-tight uppercase"
              style={{
                fontFamily: headingFontFamily,
                color: hc,
                fontSize: fontSizes.h2,
                letterSpacing: '0.05em',
              }}
            >
              {title}
            </h2>
          </div>
        );

      case 'pill':
        return (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${pc}18`,
                color: pc,
                fontFamily: headingFontFamily,
                fontSize: fontSizes.h2,
                border: `1px solid ${pc}30`,
              }}
            >
              {showSectionIcons && resolvedIcon}
              {title}
            </span>
          </div>
        );

      case 'boxed':
        return (
          <div
            className="px-2.5 py-1 mb-3 rounded flex items-center gap-2"
            style={{
              backgroundColor: pc,
              color: '#ffffff',
            }}
          >
            {showSectionIcons && resolvedIcon && (
              <span className="text-white">{resolvedIcon}</span>
            )}
            <h2
              className="font-bold tracking-wider uppercase text-white"
              style={{
                fontFamily: headingFontFamily,
                fontSize: fontSizes.h2,
              }}
            >
              {title}
            </h2>
          </div>
        );

      case 'uppercase':
        return (
          <div className="mb-3">
            <div className="flex items-center gap-2">
              {showSectionIcons && resolvedIcon && (
                <span style={{ color: pc }}>{resolvedIcon}</span>
              )}
              <h2
                className="font-bold uppercase"
                style={{
                  fontFamily: headingFontFamily,
                  color: pc,
                  fontSize: fontSizes.h2,
                  letterSpacing: '0.12em',
                }}
              >
                {title}
              </h2>
            </div>
            {dividerStyle !== 'none' && (
              <div
                className="mt-1.5 w-full"
                style={{
                  height: '1px',
                  backgroundColor: dividerStyle === 'solid' ? pc : `${hc}20`,
                  borderTop: dividerStyle === 'dashed' ? `1px dashed ${pc}` : undefined,
                }}
              />
            )}
          </div>
        );

      case 'minimal':
        return (
          <div className="flex items-center gap-2 mb-2.5">
            {showSectionIcons && resolvedIcon ? (
              <span style={{ color: pc }}>{resolvedIcon}</span>
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: pc }}
              />
            )}
            <h2
              className="font-semibold tracking-wide"
              style={{
                fontFamily: headingFontFamily,
                color: hc,
                fontSize: fontSizes.h2,
              }}
            >
              {title}
            </h2>
          </div>
        );

      case 'underline':
      default:
        return (
          <div className="mb-3">
            <div className="flex items-center gap-2 pb-1">
              {showSectionIcons && resolvedIcon && (
                <span style={{ color: pc }}>{resolvedIcon}</span>
              )}
              <h2
                className="font-bold tracking-tight uppercase"
                style={{
                  fontFamily: headingFontFamily,
                  color: hc,
                  fontSize: fontSizes.h2,
                  letterSpacing: '0.04em',
                }}
              >
                {title}
              </h2>
            </div>
            {dividerStyle !== 'none' && (
              <div
                className="w-full"
                style={{
                  height: dividerStyle === 'solid' ? '2px' : '1px',
                  backgroundColor: dividerStyle === 'solid' ? pc : `${hc}22`,
                  borderTop: dividerStyle === 'dashed' ? `1px dashed ${pc}80` : undefined,
                }}
              />
            )}
          </div>
        );
    }
  };

  // Helper for rendering skills with badges / pills / text (color-context aware)
  const renderSkillsList = (items, colors = mainColors) => {
    if (!items || items.length === 0) return null;
    const tc = colors.textColor;
    const hc = colors.headingColor;
    const pc = colors.primaryColor;

    if (skillsStyle === 'bars') {
      return (
        <div className="space-y-1.5">
          {items.map((item, i) => {
            const skillName = typeof item === 'string' ? item : item.name;
            return (
              <div key={i} className="flex items-center justify-between gap-2.5">
                <span className="truncate" style={{ fontSize: fontSizes.base, color: tc }}>
                  {skillName}
                </span>
                <div
                  className="w-16 sm:w-20 h-1.5 rounded-full overflow-hidden shrink-0"
                  style={{ backgroundColor: `${tc}20` }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${80 + (i % 3) * 10}%`,
                      backgroundColor: pc,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (skillsStyle === 'text' || skillsStyle === 'bullets') {
      return (
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-0.5">
          {items.map((item, i) => {
            const skillName = typeof item === 'string' ? item : item.name;
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 leading-snug shrink-0"
                style={{ fontSize: fontSizes.base, color: tc }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: pc }}
                />
                <span className="font-medium">{skillName}</span>
              </span>
            );
          })}
        </div>
      );
    }

    if (skillsStyle === 'filled-pills') {
      return (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => {
            const skillName = typeof item === 'string' ? item : item.name;
            return (
              <span
                key={i}
                className="inline-block px-3 py-1 rounded-full font-semibold shadow-2xs"
                style={{
                  fontSize: fontSizes.small,
                  backgroundColor: pc,
                  color: '#ffffff',
                }}
              >
                {skillName}
              </span>
            );
          })}
        </div>
      );
    }

    if (skillsStyle === 'columns-3' || skillsStyle === 'grid-columns') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-3 pt-0.5">
          {items.map((item, i) => {
            const skillName = typeof item === 'string' ? item : item.name;
            return (
              <div
                key={i}
                className="flex items-center gap-1.5 min-w-0"
                style={{ fontSize: fontSizes.base, color: tc }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: pc }} />
                <span className="font-medium truncate">{skillName}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (skillsStyle === 'card-box') {
      return (
        <div
          className="p-3.5 rounded-lg border shadow-xs"
          style={{
            backgroundColor: isColorDark(pc) ? pc : '#0f172a',
            borderColor: `${pc}40`,
            color: '#ffffff',
          }}
        >
          <div className="space-y-1.5">
            {items.map((item, i) => {
              const skillName = typeof item === 'string' ? item : item.name;
              return (
                <div key={i} className="flex items-center gap-2 text-white/95" style={{ fontSize: fontSizes.base }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span className="font-medium">{skillName}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Default 'tags' / badges
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => {
          const skillName = typeof item === 'string' ? item : item.name;
          return (
            <span
              key={i}
              className="inline-block px-2 py-0.5 rounded font-medium"
              style={{
                fontSize: fontSizes.small,
                backgroundColor: `${pc}14`,
                color: hc,
                border: `1px solid ${pc}28`,
              }}
            >
              {skillName}
            </span>
          );
        })}
      </div>
    );
  };

  // Render individual sections (color-context aware)
  const renderSection = (sec, colors = mainColors) => {
    const tc = colors.textColor;
    const hc = colors.headingColor;
    const pc = colors.primaryColor;

    switch (sec.type) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <section key={sec.id || 'summary'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Professional Summary', null, colors, 'summary')}
            <p
              className="leading-relaxed"
              style={{
                fontSize: fontSizes.base,
                color: tc,
                textAlign: 'justify',
                opacity: 0.92,
              }}
            >
              {data.summary}
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience || data.experience.length === 0) return null;
        return (
          <section key={sec.id || 'experience'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Work Experience', null, colors, 'experience')}
            
            {/* 1. Timeline Layout */}
            {experienceStyle === 'timeline' ? (
              <div className="relative pl-5 border-l-2 space-y-4 ml-1" style={{ borderColor: `${pc}35` }}>
                {data.experience.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    data-card-item="true"
                    data-avoid-break="true"
                    data-item-key={`exp-${exp.id || index}`}
                    className="relative"
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      ...(spacers && spacers[`exp-${exp.id || index}`] ? { marginTop: `${spacers[`exp-${exp.id || index}`]}px` } : {}),
                    }}
                  >
                    <div
                      className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-2xs"
                      style={{ backgroundColor: pc }}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                          {exp.title}
                        </div>
                        <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                          {exp.company}
                          {exp.location && (
                            <span className="ml-2 font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                              • {exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {exp.period && (
                        <span
                          className="text-right shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            fontSize: fontSizes.small,
                            color: pc,
                            backgroundColor: `${pc}14`,
                            border: `1px solid ${pc}30`,
                          }}
                        >
                          {exp.period}
                        </span>
                      )}
                    </div>
                    {Array.isArray(exp.description) ? (
                      <ul className="mt-1.5 space-y-1 pl-4 list-disc" style={{ color: tc }}>
                        {exp.description.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug" style={{ fontSize: fontSizes.base, opacity: 0.9 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : exp.description ? (
                      <p className="mt-1.5 leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                        {exp.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : experienceStyle === 'compact' ? (
              /* 2. Compact Senior / Executive Layout */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.experience.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    data-card-item="true"
                    data-avoid-break="true"
                    data-item-key={`exp-${exp.id || index}`}
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      ...(spacers && spacers[`exp-${exp.id || index}`] ? { marginTop: `${spacers[`exp-${exp.id || index}`]}px` } : {}),
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-2 border-b pb-0.5" style={{ borderColor: `${pc}20` }}>
                      <div className="flex items-baseline gap-2 truncate">
                        <span className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                          {exp.title}
                        </span>
                        <span className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                            ({exp.location})
                          </span>
                        )}
                      </div>
                      {exp.period && (
                        <span className="text-right shrink-0 font-mono font-medium" style={{ fontSize: fontSizes.small, color: `${tc}aa` }}>
                          {exp.period}
                        </span>
                      )}
                    </div>
                    {Array.isArray(exp.description) ? (
                      <ul className="mt-1 space-y-0.5 pl-4 list-disc" style={{ color: tc }}>
                        {exp.description.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : exp.description ? (
                      <p className="mt-1 leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                        {exp.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              /* 3. Standard / Left Date Layout */
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
                {data.experience.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    data-card-item="true"
                    data-avoid-break="true"
                    data-item-key={`exp-${exp.id || index}`}
                    className="group"
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      ...(spacers && spacers[`exp-${exp.id || index}`] ? { marginTop: `${spacers[`exp-${exp.id || index}`]}px` } : {}),
                    }}
                  >
                    {datePlacement === 'left' ? (
                      <div className="flex items-start gap-4">
                        {exp.period && (
                          <div className="w-24 shrink-0 pt-0.5">
                            <span className="font-bold block tracking-tight" style={{ fontSize: fontSizes.small, color: pc }}>
                              {exp.period}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                            {exp.title}
                          </div>
                          <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                            {exp.company}
                            {exp.location && (
                              <span className="ml-2 font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                                • {exp.location}
                              </span>
                            )}
                          </div>
                          {Array.isArray(exp.description) ? (
                            <ul className="mt-1.5 space-y-1 pl-4 list-disc" style={{ color: tc }}>
                              {exp.description.map((bullet, bIdx) => (
                                <li key={bIdx} className="leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          ) : exp.description ? (
                            <p className="mt-1.5 leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                              {exp.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                              {exp.title}
                            </div>
                            <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                              {exp.company}
                              {exp.location && (
                                <span className="ml-2 font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                                  • {exp.location}
                                </span>
                              )}
                            </div>
                          </div>
                          {exp.period && (
                            <span
                              className={`text-right shrink-0 font-medium ${
                                datePlacement === 'badge'
                                  ? 'px-2.5 py-0.5 rounded-full border font-semibold'
                                  : 'px-2 py-0.5 rounded'
                              }`}
                              style={{
                                fontSize: fontSizes.small,
                                color: datePlacement === 'badge' ? pc : `${tc}bb`,
                                backgroundColor: datePlacement === 'badge' ? `${pc}14` : `${tc}0d`,
                                borderColor: datePlacement === 'badge' ? `${pc}30` : undefined,
                              }}
                            >
                              {exp.period}
                            </span>
                          )}
                        </div>
                        {Array.isArray(exp.description) ? (
                          <ul className="mt-1.5 space-y-1 pl-4 list-disc" style={{ color: tc }}>
                            {exp.description.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-snug" style={{ fontSize: fontSizes.base, opacity: 0.9 }}>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        ) : exp.description ? (
                          <p className="mt-1.5 leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                            {exp.description}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case 'education':
        if (!data.education || data.education.length === 0) return null;
        return (
          <section key={sec.id || 'education'} data-section-type="education" data-avoid-break="true" style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Education', null, colors, 'education')}
            
            {/* 1. Timeline Layout */}
            {educationStyle === 'timeline' ? (
              <div className="relative pl-5 border-l-2 space-y-3 ml-1" style={{ borderColor: `${pc}35` }}>
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    data-card-item="true"
                    data-avoid-break="true"
                    data-item-key={`edu-${edu.id || idx}`}
                    className="relative"
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      ...(spacers && spacers[`edu-${edu.id || idx}`] ? { marginTop: `${spacers[`edu-${edu.id || idx}`]}px` } : {}),
                    }}
                  >
                    <div
                      className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-2xs"
                      style={{ backgroundColor: pc }}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                          {edu.degree}
                        </div>
                        <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                          {edu.institution}
                          {edu.location && (
                            <span className="ml-2 font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                              • {edu.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {edu.period && (
                        <span className="text-right shrink-0 font-medium" style={{ fontSize: fontSizes.small, color: `${tc}99` }}>
                          {edu.period}
                        </span>
                      )}
                    </div>
                    {edu.grade && (
                      <div className="mt-0.5 font-medium italic" style={{ fontSize: fontSizes.small, color: `${tc}aa` }}>
                        {edu.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : educationStyle === 'compact' ? (
              /* 2. Compact Layout */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    data-card-item="true"
                    data-avoid-break="true"
                    data-item-key={`edu-${edu.id || idx}`}
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      ...(spacers && spacers[`edu-${edu.id || idx}`] ? { marginTop: `${spacers[`edu-${edu.id || idx}`]}px` } : {}),
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2 truncate">
                        <span className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                          {edu.degree}
                        </span>
                        <span className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                          {edu.institution}
                        </span>
                      </div>
                      {edu.period && (
                        <span className="text-right shrink-0 font-mono font-medium" style={{ fontSize: fontSizes.small, color: `${tc}99` }}>
                          {edu.period}
                        </span>
                      )}
                    </div>
                    {edu.grade && (
                      <div className="italic" style={{ fontSize: fontSizes.small, color: `${tc}aa` }}>
                        {edu.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* 3. Standard Layout */
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    data-card-item="true"
                    data-avoid-break="true"
                    data-item-key={`edu-${edu.id || idx}`}
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      ...(spacers && spacers[`edu-${edu.id || idx}`] ? { marginTop: `${spacers[`edu-${edu.id || idx}`]}px` } : {}),
                    }}
                  >
                    {datePlacement === 'left' ? (
                      <div className="flex items-start gap-4">
                        {edu.period && (
                          <div className="w-24 shrink-0 pt-0.5">
                            <span className="font-bold block tracking-tight" style={{ fontSize: fontSizes.small, color: pc }}>
                              {edu.period}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                            {edu.degree}
                          </div>
                          <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                            {edu.institution}
                            {edu.location && (
                              <span className="ml-2 font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                                • {edu.location}
                              </span>
                            )}
                          </div>
                          {edu.grade && (
                            <div className="mt-0.5 font-medium italic" style={{ fontSize: fontSizes.small, color: `${tc}aa` }}>
                              {edu.grade}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                              {edu.degree}
                            </div>
                            <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                              {edu.institution}
                              {edu.location && (
                                <span className="ml-2 font-normal" style={{ color: `${tc}99`, fontSize: fontSizes.small }}>
                                  • {edu.location}
                                </span>
                              )}
                            </div>
                          </div>
                          {edu.period && (
                            <span
                              className={`text-right shrink-0 font-medium ${
                                datePlacement === 'badge'
                                  ? 'px-2.5 py-0.5 rounded-full border font-semibold'
                                  : 'px-2 py-0.5 rounded'
                              }`}
                              style={{
                                fontSize: fontSizes.small,
                                color: datePlacement === 'badge' ? pc : `${tc}bb`,
                                backgroundColor: datePlacement === 'badge' ? `${pc}14` : `${tc}0d`,
                                borderColor: datePlacement === 'badge' ? `${pc}30` : undefined,
                              }}
                            >
                              {edu.period}
                            </span>
                          )}
                        </div>
                        {edu.grade && (
                          <div className="mt-0.5 font-medium italic" style={{ fontSize: fontSizes.small, color: `${tc}aa` }}>
                            {edu.grade}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case 'skills':
        if (!data.skills || data.skills.length === 0) return null;
        return (
          <section key={sec.id || 'skills'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Skills & Competencies', null, colors, 'skills')}
            
            {/* If skills are grouped by category */}
            {data.skills[0]?.category ? (
              <div className="space-y-3">
                {data.skills.map((grp, idx) => (
                  <div key={idx}>
                    <div
                      className="font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                      style={{
                        fontSize: fontSizes.small,
                        color: pc,
                        letterSpacing: '0.05em',
                      }}
                    >
                      <span>{grp.category}</span>
                    </div>
                    {renderSkillsList(grp.items || [], colors)}
                  </div>
                ))}
              </div>
            ) : (
              renderSkillsList(data.skills, colors)
            )}
          </section>
        );

      case 'projects':
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <section key={sec.id || 'projects'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Featured Projects', null, colors, 'projects')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.projects.map((proj, idx) => {
                let rawBullets = (Array.isArray(proj.bullets) && proj.bullets.length > 0)
                  ? proj.bullets
                  : (typeof proj.description === 'string' && (proj.description.includes('•') || proj.description.includes('\n')))
                  ? proj.description.split(/\n+|•|\r+/).map(s => s.trim()).filter(Boolean)
                  : (typeof proj.description === 'string' && proj.description.trim())
                  ? [proj.description.trim()]
                  : [];

                const projectBullets = [];
                for (let i = 0; i < rawBullets.length; i++) {
                  const item = (rawBullets[i] || '').trim();
                  if (!item) continue;
                  if (projectBullets.length > 0 && /^[a-z]/.test(item)) {
                    const prev = projectBullets[projectBullets.length - 1];
                    if (prev.endsWith('-')) {
                      projectBullets[projectBullets.length - 1] = prev.slice(0, -1) + item;
                    } else if (prev.endsWith('gener') && item.startsWith('ation')) {
                      projectBullets[projectBullets.length - 1] = prev + item;
                    } else {
                      projectBullets[projectBullets.length - 1] = prev + ' ' + item;
                    }
                  } else {
                    projectBullets.push(item);
                  }
                }

                return projectsStyle === 'detailed' ? (
                  <div
                    key={proj.id || idx}
                    className="p-3 rounded-lg border shadow-2xs"
                    style={{
                      borderColor: `${pc}30`,
                      backgroundColor: `${pc}05`,
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-bold flex items-center gap-1.5" style={{ fontSize: fontSizes.title, color: hc }}>
                        <span>{proj.name}</span>
                        {proj.link && (
                          <ExternalLink className="w-3 h-3 inline-block opacity-70" style={{ color: pc }} />
                        )}
                      </div>
                      {proj.role && (
                        <span
                          className="px-2 py-0.5 rounded font-semibold"
                          style={{ fontSize: fontSizes.small, color: pc, backgroundColor: `${pc}14`, border: `1px solid ${pc}25` }}
                        >
                          {proj.role}
                        </span>
                      )}
                    </div>
                    {projectBullets.length > 0 ? (
                      <ul className="mt-1.5 space-y-1 list-disc list-inside">
                        {projectBullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : (
                  <div key={proj.id || idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-bold flex items-center gap-1.5" style={{ fontSize: fontSizes.title, color: hc }}>
                        <span>{proj.name}</span>
                        {proj.role && <span className="font-normal" style={{ fontSize: fontSizes.small, color: pc }}>({proj.role})</span>}
                        {proj.link && <ExternalLink className="w-3 h-3 opacity-60" style={{ color: pc }} />}
                      </div>
                    </div>
                    {projectBullets.length > 0 ? (
                      <ul className="mt-1.5 space-y-1 list-disc list-inside">
                        {projectBullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications || data.certifications.length === 0) return null;
        return (
          <section key={sec.id || 'certifications'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Certifications', null, colors, 'certifications')}
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-semibold leading-tight" style={{ fontSize: fontSizes.base, color: hc }}>
                      {cert.name}
                    </div>
                    {cert.issuer && (
                      <div className="font-medium" style={{ fontSize: fontSizes.small, color: `${tc}99` }}>
                        {cert.issuer}
                      </div>
                    )}
                  </div>
                  {cert.year && (
                    <span className="text-right shrink-0" style={{ fontSize: fontSizes.small, color: `${tc}88` }}>
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages || data.languages.length === 0) return null;
        return (
          <section key={sec.id || 'languages'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Languages', null, colors, 'languages')}
            <div className="space-y-2">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <span className="font-semibold shrink-0" style={{ fontSize: fontSizes.base, color: hc }}>
                    {lang.name}
                  </span>
                  <span className="opacity-80 font-normal" style={{ fontSize: fontSizes.small, color: tc }}>
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'awards':
        if (!data.awards || data.awards.length === 0) return null;
        return (
          <section key={sec.id || 'awards'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Awards & Honors', null, colors, 'awards')}
            <div className="space-y-1.5">
              {data.awards.map((award, idx) => (
                <div key={award.id || idx} className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold" style={{ fontSize: fontSizes.base, color: hc }}>
                      {award.title}
                    </div>
                    {award.issuer && (
                      <div className="text-xs" style={{ fontSize: fontSizes.small, color: `${tc}99` }}>
                        {award.issuer}
                      </div>
                    )}
                  </div>
                  {award.year && (
                    <span className="text-xs" style={{ fontSize: fontSizes.small, color: `${tc}88` }}>
                      {award.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'volunteering':
        const volItems = data.volunteering || [
          { role: 'Volunteer Contributor', organization: 'Code2Success Foundation', period: '2021 - Present', description: 'Coached underrepresented university students in web development.' }
        ];
        return (
          <section key={sec.id || 'volunteering'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Volunteer Experience', null, colors, 'volunteering')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {volItems.map((vol, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold" style={{ fontSize: fontSizes.title, color: hc }}>
                        {vol.role}
                      </div>
                      <div className="font-medium" style={{ fontSize: fontSizes.base, color: pc }}>
                        {vol.organization}
                      </div>
                    </div>
                    {vol.period && (
                      <span className="text-right shrink-0" style={{ fontSize: fontSizes.small, color: `${tc}88` }}>
                        {vol.period}
                      </span>
                    )}
                  </div>
                  {vol.description && (
                    <p className="mt-1 leading-snug" style={{ fontSize: fontSizes.base, color: tc, opacity: 0.9 }}>
                      {vol.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'publications':
        const pubItems = data.publications || [
          { title: 'Scaling Distributed Document Parsing on Micro-VMs', publisher: 'IEEE Cloud & Systems Letters', year: '2023', link: 'https://ieee.org' }
        ];
        return (
          <section key={sec.id || 'publications'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Publications & Research', null, colors, 'publications')}
            <div className="space-y-2">
              {pubItems.map((pub, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold flex items-center gap-1.5" style={{ fontSize: fontSizes.base, color: hc }}>
                      <span>{pub.title}</span>
                      {pub.link && <ExternalLink className="w-3 h-3 opacity-60" style={{ color: pc }} />}
                    </div>
                    {pub.publisher && (
                      <div className="italic" style={{ fontSize: fontSizes.small, color: `${tc}99` }}>
                        {pub.publisher}
                      </div>
                    )}
                  </div>
                  {pub.year && (
                    <span className="shrink-0" style={{ fontSize: fontSizes.small, color: `${tc}88` }}>
                      {pub.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'coursework':
        const courseItems = Array.isArray(data.coursework) ? data.coursework : (data.coursework?.split(',') || ['Distributed Systems', 'Advanced Database Internals', 'Cloud Infrastructure', 'Concurrent Programming']);
        return (
          <section key={sec.id || 'coursework'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Relevant Coursework', null, colors, 'coursework')}
            <div className="flex flex-wrap gap-1.5">
              {courseItems.map((cItem, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${pc}10`,
                    color: hc,
                    border: `1px solid ${pc}25`,
                    fontSize: fontSizes.small,
                  }}
                >
                  {typeof cItem === 'string' ? cItem.trim() : cItem.name}
                </span>
              ))}
            </div>
          </section>
        );

      case 'hobbies':
        const hobbyItems = Array.isArray(data.hobbies) ? data.hobbies : ['Open-source hardware', 'Trail marathon runner', 'Chess (1950 Elo)'];
        return (
          <section key={sec.id || 'hobbies'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Interests & Activities', null, colors, 'hobbies')}
            <div className="flex flex-wrap gap-1.5">
              {hobbyItems.map((hItem, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${tc}0a`,
                    color: tc,
                    border: `1px solid ${tc}20`,
                    fontSize: fontSizes.small,
                  }}
                >
                  {typeof hItem === 'string' ? hItem : hItem.name}
                </span>
              ))}
            </div>
          </section>
        );

      case 'references':
        const refText = data.references || 'Professional and academic references available upon request.';
        return (
          <section key={sec.id || 'references'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'References', null, colors, 'references')}
            <p className="italic leading-relaxed" style={{ fontSize: fontSizes.base, color: `${tc}bb` }}>
              {typeof refText === 'string' ? refText : 'Available upon request.'}
            </p>
          </section>
        );

      case 'custom':
        return (
          <section key={sec.id || 'custom'} style={{ marginBottom: sectionSpacing, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {renderSectionHeading(sec.title || 'Additional Information', null, colors, 'custom')}
            <p className="leading-relaxed" style={{ fontSize: fontSizes.base, color: tc }}>
              {sec.content || data.custom || 'Dedicated professional with passion for innovation, technical excellence, and driving collaborative business value.'}
            </p>
          </section>
        );

      default:
        return null;
    }
  };

  // Render Contact Info block (used in header or sidebar)
  const renderContactInfo = (colors = mainColors, layout = 'row', align = 'left') => {
    const tc = colors.textColor;
    const pc = colors.primaryColor;
    const isVertical = layout === 'column';
    const isRightAligned = align === 'right';

    // 1. Grid-Card Style (Template 1 & Template 8)
    if (contactStyle === 'grid-card') {
      const entries = [
        data.phone && { label: 'PHONE', value: data.phone },
        data.email && { label: 'EMAIL', value: data.email },
        data.location && { label: 'LOCATION', value: data.location },
        (data.experienceYears || data.yearsOfExperience) && {
          label: 'EXPERIENCE',
          value: data.experienceYears || data.yearsOfExperience,
        },
      ].filter(Boolean);

      return (
        <div
          className="p-3 rounded-xs border shadow-2xs"
          style={{
            backgroundColor: `${tc}06`,
            borderColor: `${pc}35`,
            fontSize: fontSizes.small,
            minWidth: '220px',
          }}
        >
          <div className="space-y-1.5">
            {entries.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <span
                  className="font-bold tracking-wider text-[9px] uppercase shrink-0"
                  style={{ color: pc }}
                >
                  {item.label}
                </span>
                <span className="font-medium truncate text-right" style={{ color: tc }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 2. Capsule Style (Template 7)
    if (contactStyle === 'capsule') {
      return (
        <div
          className="inline-flex flex-wrap items-center gap-4 px-4 py-2 rounded-full border shadow-2xs"
          style={{
            backgroundColor: `${pc}08`,
            borderColor: `${pc}30`,
            fontSize: fontSizes.small,
            color: tc,
          }}
        >
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: pc }} />
              <span>{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: pc }} />
              <span>{data.email}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: pc }} />
              <span>{data.location}</span>
            </div>
          )}
        </div>
      );
    }

    // 3. Pills Style (Template 3)
    if (contactStyle === 'pills') {
      return (
        <div
          className={`flex flex-wrap items-center gap-2 ${
            isRightAligned
              ? 'justify-end'
              : !isVertical && headerAlignment === 'center'
              ? 'justify-center'
              : 'justify-start'
          }`}
          style={{ fontSize: fontSizes.small, color: tc }}
        >
          {(data.experienceYears || data.yearsOfExperience) && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs font-semibold"
              style={{
                backgroundColor: `${pc}14`,
                borderColor: `${pc}35`,
                color: pc,
              }}
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{data.experienceYears || data.yearsOfExperience} Exp</span>
            </div>
          )}
          {data.phone && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs"
              style={{
                backgroundColor: `${tc}06`,
                borderColor: `${tc}20`,
              }}
            >
              <Phone className="w-3 h-3 shrink-0" style={{ color: pc }} />
              <span>{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs"
              style={{
                backgroundColor: `${tc}06`,
                borderColor: `${tc}20`,
              }}
            >
              <Mail className="w-3 h-3 shrink-0" style={{ color: pc }} />
              <span>{data.email}</span>
            </div>
          )}
          {data.location && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs"
              style={{
                backgroundColor: `${tc}06`,
                borderColor: `${tc}20`,
              }}
            >
              <MapPin className="w-3 h-3 shrink-0" style={{ color: pc }} />
              <span>{data.location}</span>
            </div>
          )}
        </div>
      );
    }

    // 4. Pipe-Separated Single Line (Template 4 & 5)
    if (contactStyle === 'pipe-separated') {
      const items = [
        data.phone,
        data.email,
        data.location,
        (data.experienceYears || data.yearsOfExperience) ? `Exp: ${data.experienceYears || data.yearsOfExperience}` : null,
        data.website ? data.website.replace('https://', '') : null,
        data.linkedin,
      ].filter(Boolean);

      return (
        <div
          className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 ${
            isRightAligned
              ? 'justify-end'
              : !isVertical && headerAlignment === 'center'
              ? 'justify-center'
              : 'justify-start'
          }`}
          style={{ fontSize: fontSizes.small, color: tc }}
        >
          {items.map((val, idx) => (
            <React.Fragment key={idx}>
              <span className="font-medium opacity-90">{val}</span>
              {idx < items.length - 1 && <span className="opacity-35 select-none font-light">|</span>}
            </React.Fragment>
          ))}
        </div>
      );
    }

    // 5. Default Standard / Inline Icon Style
    return (
      <div
        className={`flex flex-wrap ${isVertical ? 'flex-col gap-2 w-full min-w-0' : 'gap-y-1.5 gap-x-3.5 max-w-full'} ${
          isRightAligned
            ? 'items-end justify-end'
            : !isVertical && headerAlignment === 'center'
            ? 'justify-center items-center'
            : 'justify-start items-start'
        }`}
        style={{ fontSize: fontSizes.small, color: tc }}
      >
        {data.email && (
          <div className={`flex items-start gap-1.5 opacity-90 min-w-0 max-w-full ${isRightAligned ? 'justify-end' : ''}`}>
            <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pc }} />
            <span className="break-all [overflow-wrap:anywhere] min-w-0 leading-snug">{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className={`flex items-start gap-1.5 opacity-90 min-w-0 max-w-full ${isRightAligned ? 'justify-end' : ''}`}>
            <Phone className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pc }} />
            <span className="break-all [overflow-wrap:anywhere] min-w-0 leading-snug">{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className={`flex items-start gap-1.5 opacity-90 min-w-0 max-w-full ${isRightAligned ? 'justify-end' : ''}`}>
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pc }} />
            <span className="break-all [overflow-wrap:anywhere] min-w-0 leading-snug">{data.location}</span>
          </div>
        )}
        {data.website && (
          <div className={`flex items-start gap-1.5 opacity-90 min-w-0 max-w-full ${isRightAligned ? 'justify-end' : ''}`}>
            <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pc }} />
            <span className="break-all [overflow-wrap:anywhere] min-w-0 leading-snug">{cleanUrlDisplay(data.website)}</span>
          </div>
        )}
        {data.linkedin && (
          <div className={`flex items-start gap-1.5 opacity-90 min-w-0 max-w-full ${isRightAligned ? 'justify-end' : ''}`}>
            <LinkedinIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pc }} />
            <span className="break-all [overflow-wrap:anywhere] min-w-0 leading-snug">{cleanUrlDisplay(data.linkedin)}</span>
          </div>
        )}
        {data.github && (
          <div className={`flex items-start gap-1.5 opacity-90 min-w-0 max-w-full ${isRightAligned ? 'justify-end' : ''}`}>
            <GithubIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pc }} />
            <span className="break-all [overflow-wrap:anywhere] min-w-0 leading-snug">{cleanUrlDisplay(data.github)}</span>
          </div>
        )}
      </div>
    );
  };

  // Render photo block for sidebar placement
  const renderSidebarPhoto = () => {
    if (!showPhoto || !data.photo_url || photoPlacement !== 'sidebar') return null;
    const size = photoSizeMap[photoSize] || photoSizeMap.small;
    return (
      <div className="flex flex-col items-center mb-5">
        <img
          src={data.photo_url}
          alt={data.name}
          className={`object-cover border-2 shadow-md ${getPhotoShapeClass()}`}
          style={{
            width: size.width,
            height: size.height,
            borderColor: sidebarPrimaryColor || '#ffffff',
          }}
        />
      </div>
    );
  };

  // Render sidebar contact info section
  const renderSidebarContact = () => {
    if (contactPlacement !== 'sidebar') return null;
    return (
      <section className="w-full min-w-0 overflow-hidden" style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeading('Contact Details', null, sidebarColors, 'contact')}
        {renderContactInfo(sidebarColors, 'column')}
      </section>
    );
  };

  // Render Header Section
  const renderHeader = (customHeaderColors = (hasHeaderBg ? headerColors : mainColors), isBanner = false) => {
    if (!hasHeaderInLayout && !data.name) return null;

    const hc = customHeaderColors.headingColor;
    const pc = customHeaderColors.primaryColor;
    const tc = customHeaderColors.textColor;
    const showPhotoInHeader = showPhoto && data.photo_url && photoPlacement === 'header';
    const showContactInHeader = contactPlacement === 'header';
    const size = photoSizeMap[photoSize] || photoSizeMap.small;
    const isSplit = headerAlignment === 'split' || headerStyle === 'contact-card';

    // 1. Identity Card Header Style (Template 7)
    if (headerStyle === 'identity-card') {
      return (
        <header className="w-full mb-5">
          <div className="flex items-stretch gap-5">
            {/* Left Identity Card Block */}
            <div className="w-64 shrink-0 flex flex-col shadow-sm">
              {showPhotoInHeader && (
                <div className="w-full h-44 overflow-hidden rounded-t-sm mb-0">
                  <img
                    src={data.photo_url}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div
                className={`p-4 ${showPhotoInHeader ? 'rounded-b-sm' : 'rounded-sm'} flex-1`}
                style={{ backgroundColor: isColorDark(pc) ? pc : '#0f172a', color: '#ffffff' }}
              >
                <h1
                  className="font-extrabold text-white tracking-tight leading-tight uppercase"
                  style={{ fontFamily: headingFontFamily, fontSize: fontSizes.name }}
                >
                  {data.name}
                </h1>
                {data.title && (
                  <p className="text-white/80 font-medium text-xs uppercase tracking-widest mt-1">
                    {data.title}
                  </p>
                )}
                {data.location && (
                  <p className="text-white/70 text-xs mt-3 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white/60 shrink-0" />
                    <span>{data.location}</span>
                  </p>
                )}
                {(data.experienceYears || data.yearsOfExperience) && (
                  <p className="text-white/70 text-xs mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-white/60 shrink-0" />
                    <span>{data.experienceYears || data.yearsOfExperience} of experience</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Side: Profile Summary & Capsule Contact Bar */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                {data.summary && (
                  <div>
                    <h3
                      className="font-bold uppercase tracking-wider text-xs mb-1.5"
                      style={{ color: hc }}
                    >
                      Profile Summary
                    </h3>
                    <p className="leading-relaxed opacity-90" style={{ fontSize: fontSizes.base, color: tc }}>
                      {data.summary}
                    </p>
                  </div>
                )}
              </div>
              {showContactInHeader && (
                <div className="mt-4">
                  {renderContactInfo(customHeaderColors, 'row', 'left')}
                </div>
              )}
            </div>
          </div>
          {dividerStyle !== 'none' && (
            <div className="mt-4 w-full h-[1.5px]" style={{ backgroundColor: `${pc}25` }} />
          )}
        </header>
      );
    }

    // 2. Full-Width Colored Banner Style (Template 5 & 6)
    if (headerStyle === 'banner' || isBanner) {
      return (
        <header
          className="w-full px-6 py-5 mb-5 shadow-xs"
          style={{
            backgroundColor: isColorDark(pc) ? pc : '#1e3a8a',
            color: '#ffffff',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1
                className="font-extrabold tracking-tight text-white"
                style={{
                  fontFamily: headingFontFamily,
                  fontSize: fontSizes.name,
                  lineHeight: 1.15,
                }}
              >
                {data.name}
              </h1>
              {data.title && (
                <p
                  className="font-medium tracking-wide text-white/90"
                  style={{
                    fontSize: fontSizes.h2,
                    letterSpacing: '0.04em',
                  }}
                >
                  {data.title}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {showContactInHeader && isSplit && (
                <div className="text-right text-white">
                  {renderContactInfo({ ...customHeaderColors, textColor: '#ffffff', primaryColor: '#ffffff' }, 'column', 'right')}
                </div>
              )}
              {showPhotoInHeader && (
                <div className="shrink-0">
                  <img
                    src={data.photo_url}
                    alt={data.name}
                    className={`object-cover border-2 border-white/60 shadow-md ${getPhotoShapeClass()}`}
                    style={{ width: size.width, height: size.height }}
                  />
                </div>
              )}
            </div>
          </div>

          {showContactInHeader && !isSplit && (
            <div className="mt-3 pt-3 border-t border-white/20 text-white">
              {renderContactInfo({ ...customHeaderColors, textColor: '#ffffff', primaryColor: '#ffffff' }, 'row')}
            </div>
          )}
        </header>
      );
    }

    // 3. Standard, Boxed, or Contact-Card
    return (
      <header
        className={`w-full ${isBanner ? 'pb-0 mb-0' : 'pb-4 mb-4'}`}
        style={{
          borderBottom: !isBanner && dividerStyle !== 'none' ? `1.5px solid ${pc}25` : undefined,
          textAlign: headerAlignment === 'center' ? 'center' : 'left',
        }}
      >
        <div
          className={`flex ${
            headerAlignment === 'center'
              ? 'flex-col items-center justify-center'
              : 'flex-row items-center justify-between'
          } gap-4`}
        >
          {/* Left Side: Name and Title */}
          {headerStyle === 'boxed' ? (
            <div
              className="p-3.5 border-2 rounded-xs"
              style={{ borderColor: hc, backgroundColor: `${pc}06` }}
            >
              <h1
                className="font-extrabold tracking-tight uppercase"
                style={{
                  fontFamily: headingFontFamily,
                  color: hc,
                  fontSize: fontSizes.name,
                  lineHeight: 1.15,
                }}
              >
                {data.name}
              </h1>
              {data.title && (
                <p
                  className="font-bold tracking-widest uppercase mt-1"
                  style={{ fontSize: fontSizes.title, color: pc }}
                >
                  {data.title}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <h1
                className="font-extrabold tracking-tight"
                style={{
                  fontFamily: headingFontFamily,
                  color: hc,
                  fontSize: fontSizes.name,
                  lineHeight: 1.15,
                }}
              >
                {data.name}
              </h1>
              {data.title && (
                <p
                  className="font-medium tracking-wide uppercase"
                  style={{
                    fontSize: fontSizes.h2,
                    color: pc,
                    letterSpacing: '0.04em',
                  }}
                >
                  {data.title}
                </p>
              )}
              {headerStyle === 'contact-card' && (
                <div className="w-16 h-1 rounded-full mt-2" style={{ backgroundColor: pc }} />
              )}
            </div>
          )}

          {/* Right side for Split layout (contact info + photo) */}
          {isSplit ? (
            <div className="flex items-center gap-4 shrink-0 text-right">
              {showContactInHeader && (
                <div className="text-right">
                  {renderContactInfo(customHeaderColors, 'column', 'right')}
                </div>
              )}
              {showPhotoInHeader && (
                <div className="shrink-0">
                  <img
                    src={data.photo_url}
                    alt={data.name}
                    className={`object-cover border-2 shadow-xs ${getPhotoShapeClass()}`}
                    style={{
                      width: size.width,
                      height: size.height,
                      borderColor: pc,
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Standard: Photo on right if header photo enabled */
            showPhotoInHeader && (
              <div className="shrink-0">
                <img
                  src={data.photo_url}
                  alt={data.name}
                  className={`object-cover border-2 shadow-xs ${getPhotoShapeClass()}`}
                  style={{
                    width: size.width,
                    height: size.height,
                    borderColor: pc,
                  }}
                />
              </div>
            )
          )}
        </div>

        {/* Contact Info in header (only when contactPlacement is 'header' and NOT split) */}
        {showContactInHeader && !isSplit && (
          <div className="mt-3">
            {renderContactInfo(customHeaderColors, 'row')}
          </div>
        )}
      </header>
    );
  };

  // Page Standard Dimensions:
  // A4: 210mm x 297mm -> 794px x 1123px (at 96 DPI)
  // US Letter: 8.5in x 11in -> 816px x 1056px (at 96 DPI)
  const pageSize = layout.pageSize || 'A4';
  const docWidth = pageSize === 'Letter' ? 816 : 794;
  const docHeight = pageSize === 'Letter' ? 1056 : 1123;

  return (
    <div
      className={`resume-paper-container relative mx-auto transition-transform origin-top ${className}`}
      style={{
        width: `${docWidth}px`,
        minHeight: `${docHeight}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {/* Authentic Paper Sheet */}
      <div
        className="a4-sheet relative w-full text-left box-border select-none md:select-text shadow-xl rounded-sm transition-colors overflow-hidden"
        style={{
          minHeight: `${docHeight}px`,
          backgroundColor: backgroundColor,
          fontFamily: fontFamily,
          color: textColor,
          boxShadow: isThumbnail
            ? '0 2px 8px rgba(0,0,0,0.08)'
            : '0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* Printable/Preview Page Guidelines if toggled */}
        {showPageGuidelines && (
          <div className="absolute inset-0 pointer-events-none border border-dashed border-sky-400/50 z-20" />
        )}

        {isTwoColumn ? (
          // Two-Column Layout
          <div className="flex flex-col w-full" style={{ minHeight: `${docHeight}px` }}>
            {/* Full-width header (spans across both columns when headerFullWidth=true) */}
            {headerFullWidth && (
              <div
                className="w-full box-border"
                style={{
                  backgroundColor: hasHeaderBg ? headerBackgroundColor : undefined,
                  padding: hasHeaderBg
                    ? `26px ${pageMargin} 22px ${pageMargin}`
                    : `${pageMargin} ${pageMargin} 0 ${pageMargin}`,
                  borderBottom: hasHeaderBg
                    ? `3px solid ${headerPrimaryColor}`
                    : undefined,
                }}
              >
                {renderHeader(hasHeaderBg ? headerColors : mainColors, hasHeaderBg)}
              </div>
            )}

            <div className="flex flex-1">
              {/* Sidebar Column */}
              <div
                className={`shrink-0 box-border min-w-0 overflow-hidden ${
                  sidebarPosition === 'left' ? 'order-1' : 'order-2'
                }`}
                style={{
                  width: sidebarWidth,
                  backgroundColor: sidebarBg,
                  padding: pageMargin,
                  paddingTop: headerFullWidth ? sectionSpacing : pageMargin,
                  borderRight:
                    sidebarPosition === 'left'
                      ? dividerStyle !== 'none'
                        ? `1px solid ${sidebarTextColor}15`
                        : 'none'
                      : 'none',
                  borderLeft:
                    sidebarPosition === 'right'
                      ? dividerStyle !== 'none'
                        ? `1px solid ${sidebarTextColor}15`
                        : 'none'
                      : 'none',
                }}
              >
                {/* Photo at top of sidebar (when photoPlacement is 'sidebar') */}
                {renderSidebarPhoto()}

                {/* Contact info in sidebar (when contactPlacement is 'sidebar') */}
                {renderSidebarContact()}

                {/* Sidebar sections with sidebar color context */}
                {sidebarColumnSections.map((sec) => renderSection(sec, sidebarColors))}
              </div>

              {/* Main Column */}
              <div
                className={`grow box-border ${
                  sidebarPosition === 'left' ? 'order-2' : 'order-1'
                }`}
                style={{
                  padding: pageMargin,
                  paddingTop: headerFullWidth ? sectionSpacing : pageMargin,
                }}
              >
                {/* Header in main column (when headerFullWidth is false) */}
                {!headerFullWidth && renderHeader(mainColors)}
                {mainColumnSections.map((sec) => renderSection(sec, mainColors))}
              </div>
            </div>
          </div>
        ) : (
          // Single-Column Layout
          <div className="w-full box-border">
            {hasHeaderBg && (
              <div
                className="w-full box-border"
                style={{
                  backgroundColor: headerBackgroundColor,
                  padding: `26px ${pageMargin} 22px ${pageMargin}`,
                  borderBottom: `3px solid ${headerPrimaryColor}`,
                }}
              >
                {renderHeader(headerColors, true)}
              </div>
            )}
            <div
              style={{
                padding: pageMargin,
                paddingTop: hasHeaderBg ? sectionSpacing : pageMargin,
              }}
            >
              {!hasHeaderBg && renderHeader(mainColors)}
              {bodySections.map((sec) => renderSection(sec, mainColors))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeRenderer;
