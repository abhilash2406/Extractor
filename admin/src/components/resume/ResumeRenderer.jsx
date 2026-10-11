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
  CheckCircle2
} from 'lucide-react';

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
  '9pt': { base: '11px', name: '22px', h2: '13px', title: '12px', small: '10px' },
  '10pt': { base: '12.5px', name: '26px', h2: '14.5px', title: '13.5px', small: '11px' },
  '11pt': { base: '14px', name: '30px', h2: '16px', title: '14.5px', small: '12px' },
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
}) => {
  if (!template || !data) return null;

  const layout = template.layout_config || {};
  const design = template.design_config || {};

  const isTwoColumn = Number(layout.columns) === 2;
  const sidebarPosition = layout.sidebarPosition || 'left';
  const sidebarWidth = layout.sidebarWidth || '33%';

  const fontFamily = design.fontFamily || "'Inter', sans-serif";
  const headingFontFamily = design.headingFontFamily || fontFamily;
  const primaryColor = design.primaryColor || '#2563eb';
  const textColor = design.textColor || '#1e293b';
  const headingColor = design.headingColor || '#0f172a';
  const accentColor = design.accentColor || primaryColor;
  const backgroundColor = design.backgroundColor || '#ffffff';
  const sidebarBg = design.sidebarBackgroundColor || '#f8fafc';
  const headingStyle = design.headingStyle || 'underline'; // 'underline' | 'border-left' | 'pill' | 'uppercase' | 'minimal' | 'boxed'
  const dividerStyle = design.dividerStyle || 'subtle'; // 'subtle' | 'solid' | 'dashed' | 'none'
  const headerAlignment = design.headerAlignment || 'left'; // 'left' | 'center' | 'split'
  const skillsStyle = design.skillsStyle || 'tags'; // 'tags' | 'bars' | 'dots' | 'text'

  const fontSizes = fontSizeMap[design.fontSize] || fontSizeMap['10pt'];
  const pageMargin = marginMap[design.pageMargin] || marginMap.normal;
  const sectionSpacing = sectionGapMap[design.sectionSpacing] || sectionGapMap.normal;
  const itemSpacing = itemGapMap[design.itemSpacing] || itemGapMap.normal;

  // Filter visible sections
  const sections = (layout.sections || []).filter((s) => s.visible !== false);

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

  // Render Heading Component
  const renderSectionHeading = (title, icon) => {
    switch (headingStyle) {
      case 'border-left':
        return (
          <div
            className="flex items-center gap-2 mb-3 pb-0.5"
            style={{
              borderLeft: `3.5px solid ${primaryColor}`,
              paddingLeft: '8px',
            }}
          >
            <h2
              className="font-bold tracking-tight uppercase"
              style={{
                fontFamily: headingFontFamily,
                color: headingColor,
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
              className="inline-block px-3 py-1 rounded-full font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${primaryColor}18`,
                color: primaryColor,
                fontFamily: headingFontFamily,
                fontSize: fontSizes.small,
                border: `1px solid ${primaryColor}30`,
              }}
            >
              {title}
            </span>
          </div>
        );

      case 'boxed':
        return (
          <div
            className="px-2.5 py-1 mb-3 rounded"
            style={{
              backgroundColor: primaryColor,
              color: '#ffffff',
            }}
          >
            <h2
              className="font-bold tracking-wider uppercase text-white"
              style={{
                fontFamily: headingFontFamily,
                fontSize: fontSizes.small,
              }}
            >
              {title}
            </h2>
          </div>
        );

      case 'uppercase':
        return (
          <div className="mb-3">
            <h2
              className="font-bold uppercase"
              style={{
                fontFamily: headingFontFamily,
                color: primaryColor,
                fontSize: fontSizes.h2,
                letterSpacing: '0.12em',
              }}
            >
              {title}
            </h2>
            {dividerStyle !== 'none' && (
              <div
                className="mt-1.5 w-full"
                style={{
                  height: '1px',
                  backgroundColor: dividerStyle === 'solid' ? primaryColor : `${headingColor}20`,
                  borderTop: dividerStyle === 'dashed' ? `1px dashed ${primaryColor}` : undefined,
                }}
              />
            )}
          </div>
        );

      case 'minimal':
        return (
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <h2
              className="font-semibold tracking-wide"
              style={{
                fontFamily: headingFontFamily,
                color: headingColor,
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
            <div className="flex items-center justify-between pb-1">
              <h2
                className="font-bold tracking-tight uppercase"
                style={{
                  fontFamily: headingFontFamily,
                  color: headingColor,
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
                  backgroundColor: dividerStyle === 'solid' ? primaryColor : `${headingColor}22`,
                  borderTop: dividerStyle === 'dashed' ? `1px dashed ${primaryColor}80` : undefined,
                }}
              />
            )}
          </div>
        );
    }
  };

  // Render individual sections
  const renderSection = (sec) => {
    switch (sec.type) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <section key={sec.id || 'summary'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Professional Summary')}
            <p
              className="leading-relaxed"
              style={{
                fontSize: fontSizes.base,
                color: textColor,
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
            {renderSectionHeading(sec.title || 'Work Experience')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div
                        className="font-bold"
                        style={{
                          fontSize: fontSizes.title,
                          color: headingColor,
                        }}
                      >
                        {exp.title}
                      </div>
                      <div
                        className="font-medium"
                        style={{
                          fontSize: fontSizes.base,
                          color: primaryColor,
                        }}
                      >
                        {exp.company}
                        {exp.location && (
                          <span
                            className="ml-2 font-normal"
                            style={{ color: `${textColor}99`, fontSize: fontSizes.small }}
                          >
                            • {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {exp.period && (
                      <span
                        className="text-right shrink-0 font-medium px-2 py-0.5 rounded"
                        style={{
                          fontSize: fontSizes.small,
                          color: `${textColor}bb`,
                          backgroundColor: `${textColor}0d`,
                        }}
                      >
                        {exp.period}
                      </span>
                    )}
                  </div>

                  {/* Bullet points */}
                  {Array.isArray(exp.description) ? (
                    <ul className="mt-1.5 space-y-1 pl-4 list-disc" style={{ color: textColor }}>
                      {exp.description.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="leading-snug"
                          style={{ fontSize: fontSizes.base, opacity: 0.9 }}
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : exp.description ? (
                    <p
                      className="mt-1.5 leading-snug"
                      style={{ fontSize: fontSizes.base, color: textColor, opacity: 0.9 }}
                    >
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education || data.education.length === 0) return null;
        return (
          <section key={sec.id || 'education'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Education')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div
                        className="font-bold"
                        style={{ fontSize: fontSizes.title, color: headingColor }}
                      >
                        {edu.degree}
                      </div>
                      <div
                        className="font-medium"
                        style={{ fontSize: fontSizes.base, color: primaryColor }}
                      >
                        {edu.institution}
                        {edu.location && (
                          <span
                            className="ml-2 font-normal"
                            style={{ color: `${textColor}99`, fontSize: fontSizes.small }}
                          >
                            • {edu.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {edu.period && (
                      <span
                        className="text-right shrink-0 font-medium px-2 py-0.5 rounded"
                        style={{
                          fontSize: fontSizes.small,
                          color: `${textColor}bb`,
                          backgroundColor: `${textColor}0d`,
                        }}
                      >
                        {edu.period}
                      </span>
                    )}
                  </div>
                  {edu.grade && (
                    <div
                      className="mt-0.5 font-medium italic"
                      style={{ fontSize: fontSizes.small, color: `${textColor}aa` }}
                    >
                      {edu.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills || data.skills.length === 0) return null;
        return (
          <section key={sec.id || 'skills'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Skills & Competencies')}
            
            {/* If skills are grouped by category */}
            {data.skills[0]?.category ? (
              <div className="space-y-2.5">
                {data.skills.map((grp, idx) => (
                  <div key={idx}>
                    <div
                      className="font-semibold mb-1"
                      style={{ fontSize: fontSizes.small, color: primaryColor }}
                    >
                      {grp.category}
                    </div>
                    {renderSkillsList(grp.items || [])}
                  </div>
                ))}
              </div>
            ) : (
              renderSkillsList(data.skills)
            )}
          </section>
        );

      case 'projects':
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <section key={sec.id || 'projects'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Featured Projects')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="font-bold flex items-center gap-1.5"
                      style={{ fontSize: fontSizes.title, color: headingColor }}
                    >
                      <span>{proj.name}</span>
                      {proj.link && (
                        <ExternalLink
                          className="w-3 h-3 inline-block opacity-60"
                          style={{ color: primaryColor }}
                        />
                      )}
                    </div>
                    {proj.role && (
                      <span
                        className="font-medium"
                        style={{ fontSize: fontSizes.small, color: primaryColor }}
                      >
                        {proj.role}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p
                      className="mt-1 leading-snug"
                      style={{ fontSize: fontSizes.base, color: textColor, opacity: 0.9 }}
                    >
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications || data.certifications.length === 0) return null;
        return (
          <section key={sec.id || 'certifications'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Certifications')}
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-start gap-2">
                  <div>
                    <div
                      className="font-semibold leading-tight"
                      style={{ fontSize: fontSizes.base, color: headingColor }}
                    >
                      {cert.name}
                    </div>
                    {cert.issuer && (
                      <div
                        className="text-xs font-medium"
                        style={{ fontSize: fontSizes.small, color: `${textColor}99` }}
                      >
                        {cert.issuer}
                      </div>
                    )}
                  </div>
                  {cert.year && (
                    <span
                      className="text-right shrink-0"
                      style={{ fontSize: fontSizes.small, color: `${textColor}88` }}
                    >
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
          <section key={sec.id || 'languages'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Languages')}
            <div className="space-y-1.5">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span
                    className="font-medium"
                    style={{ fontSize: fontSizes.base, color: headingColor }}
                  >
                    {lang.name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ fontSize: fontSizes.small, color: `${textColor}99` }}
                  >
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
          <section key={sec.id || 'awards'} style={{ marginBottom: sectionSpacing }}>
            {renderSectionHeading(sec.title || 'Awards & Honors')}
            <div className="space-y-1.5">
              {data.awards.map((award, idx) => (
                <div key={award.id || idx} className="flex justify-between items-start">
                  <div>
                    <div
                      className="font-semibold"
                      style={{ fontSize: fontSizes.base, color: headingColor }}
                    >
                      {award.title}
                    </div>
                    {award.issuer && (
                      <div
                        className="text-xs"
                        style={{ fontSize: fontSizes.small, color: `${textColor}99` }}
                      >
                        {award.issuer}
                      </div>
                    )}
                  </div>
                  {award.year && (
                    <span
                      className="text-xs"
                      style={{ fontSize: fontSizes.small, color: `${textColor}88` }}
                    >
                      {award.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Helper for rendering skills with badges / pills / text
  const renderSkillsList = (items) => {
    if (!items || items.length === 0) return null;

    if (skillsStyle === 'bars') {
      return (
        <div className="space-y-1.5">
          {items.map((item, i) => {
            const skillName = typeof item === 'string' ? item : item.name;
            return (
              <div key={i} className="flex items-center justify-between gap-3">
                <span style={{ fontSize: fontSizes.base, color: textColor }}>{skillName}</span>
                <div className="w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${80 + (i % 3) * 10}%`,
                      backgroundColor: primaryColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (skillsStyle === 'text') {
      return (
        <p
          className="leading-relaxed"
          style={{ fontSize: fontSizes.base, color: textColor }}
        >
          {items.map((item) => (typeof item === 'string' ? item : item.name)).join(' • ')}
        </p>
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
                backgroundColor: `${primaryColor}14`,
                color: headingColor,
                border: `1px solid ${primaryColor}28`,
              }}
            >
              {skillName}
            </span>
          );
        })}
      </div>
    );
  };

  // Render Header Section
  const renderHeader = () => {
    if (!hasHeaderInLayout && !data.name) return null;

    return (
      <header
        className="w-full pb-4 mb-4"
        style={{
          borderBottom: dividerStyle !== 'none' ? `1.5px solid ${primaryColor}25` : undefined,
          textAlign: headerAlignment === 'center' ? 'center' : 'left',
        }}
      >
        <div
          className={`flex ${
            headerAlignment === 'center'
              ? 'flex-col items-center justify-center'
              : headerAlignment === 'split'
              ? 'flex-row items-center justify-between'
              : 'flex-row items-start justify-between'
          } gap-4`}
        >
          <div className="space-y-1">
            <h1
              className="font-extrabold tracking-tight"
              style={{
                fontFamily: headingFontFamily,
                color: headingColor,
                fontSize: fontSizes.name,
                lineHeight: 1.15,
              }}
            >
              {data.name}
            </h1>
            {data.title && (
              <p
                className="font-medium tracking-wide"
                style={{
                  fontSize: fontSizes.h2,
                  color: primaryColor,
                  letterSpacing: '0.02em',
                }}
              >
                {data.title}
              </p>
            )}
          </div>

          {/* Optional Photo if provided */}
          {data.photo_url && (
            <div className="shrink-0">
              <img
                src={data.photo_url}
                alt={data.name}
                className="w-16 h-16 rounded-full object-cover border-2 shadow-xs"
                style={{ borderColor: primaryColor }}
              />
            </div>
          )}
        </div>

        {/* Contact Info Pills / Icons */}
        <div
          className={`mt-3 flex flex-wrap gap-y-1.5 gap-x-3.5 ${
            headerAlignment === 'center' ? 'justify-center' : 'justify-start'
          }`}
          style={{ fontSize: fontSizes.small, color: textColor }}
        >
          {data.email && (
            <div className="flex items-center gap-1.5 opacity-90">
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1.5 opacity-90">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span>{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span>{data.location}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-1.5 opacity-90">
              <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span>{data.website.replace('https://', '')}</span>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1.5 opacity-90">
              <LinkedinIcon className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span>{data.linkedin}</span>
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1.5 opacity-90">
              <GithubIcon className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span>{data.github}</span>
            </div>
          )}
        </div>
      </header>
    );
  };

  // A4 Standard Dimensions: 210mm x 297mm (Ratio approx 1 : 1.4142)
  // Base pixel width: 794px, height: 1123px (at 96 DPI A4)
  const a4Width = 794;
  const a4Height = 1123;

  return (
    <div
      className={`resume-paper-container relative mx-auto transition-transform origin-top ${className}`}
      style={{
        width: `${a4Width}px`,
        minHeight: `${a4Height}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {/* Authentic A4 Paper Sheet */}
      <div
        className="a4-sheet relative w-full text-left box-border select-none md:select-text shadow-xl rounded-sm transition-colors overflow-hidden"
        style={{
          minHeight: `${a4Height}px`,
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
          <div
            className={`flex w-full min-h-[1123px] ${
              sidebarPosition === 'right' ? 'flex-row' : 'flex-row'
            }`}
          >
            {/* Sidebar Left or Right */}
            <div
              className={`shrink-0 box-border ${
                sidebarPosition === 'left' ? 'order-1' : 'order-2'
              }`}
              style={{
                width: sidebarWidth,
                backgroundColor: sidebarBg,
                padding: pageMargin,
                borderRight:
                  sidebarPosition === 'left'
                    ? dividerStyle !== 'none'
                      ? `1px solid ${textColor}15`
                      : 'none'
                    : 'none',
                borderLeft:
                  sidebarPosition === 'right'
                    ? dividerStyle !== 'none'
                      ? `1px solid ${textColor}15`
                      : 'none'
                    : 'none',
              }}
            >
              {sidebarColumnSections.map(renderSection)}
            </div>

            {/* Main Column */}
            <div
              className={`grow box-border ${
                sidebarPosition === 'left' ? 'order-2' : 'order-1'
              }`}
              style={{
                padding: pageMargin,
              }}
            >
              {renderHeader()}
              {mainColumnSections.map(renderSection)}
            </div>
          </div>
        ) : (
          // Single-Column Layout
          <div
            className="w-full box-border"
            style={{
              padding: pageMargin,
            }}
          >
            {renderHeader()}
            {bodySections.map(renderSection)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeRenderer;
