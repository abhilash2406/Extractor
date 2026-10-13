export const LOCAL_STORAGE_KEY = 'extractor_resume_templates_v3';

export const DEFAULT_SECTIONS = [
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

export const DEFAULT_DESIGN = {
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
  headerStyle: 'standard', // 'standard' | 'boxed' | 'contact-card' | 'banner' | 'identity-card'
  contactStyle: 'inline', // 'inline' | 'pills' | 'capsule' | 'grid-card' | 'pipe-separated'
  datePlacement: 'right', // 'right' | 'left' | 'badge'
  showSectionIcons: false,
  skillsStyle: 'tags', // 'tags' | 'filled-pills' | 'bars' | 'text' | 'columns-3' | 'card-box'
  showPhoto: true,
  photoShape: 'circle',
  photoPlacement: 'header',
  photoSize: 'small',
  contactPlacement: 'header',
  sidebarTextColor: '#1e293b',
  sidebarHeadingColor: '#0f172a',
  sidebarPrimaryColor: '#2563eb',
  experienceStyle: 'standard', // 'standard' | 'timeline' | 'compact'
  educationStyle: 'standard', // 'standard' | 'timeline' | 'compact'
  projectsStyle: 'detailed', // 'detailed' | 'compact'
  headerBackgroundColor: 'transparent',
  headerTextColor: '#e2e8f0',
  headerHeadingColor: '#ffffff',
  headerPrimaryColor: '#38bdf8',
};

export const DEFAULT_LAYOUT = {
  pageSize: 'A4', // 'A4' | 'Letter'
  columns: 1,
  sidebarPosition: 'left',
  sidebarWidth: '33%',
  headerFullWidth: false,
  sections: DEFAULT_SECTIONS,
};

export const SIDEBAR_WIDTH_OPTIONS = [
  { id: '25%', label: '25 / 75', desc: 'Compact rail' },
  { id: '30%', label: '30 / 70', desc: 'Classic slim' },
  { id: '33%', label: '33 / 67', desc: 'Standard 1/3' },
  { id: '38%', label: '38 / 62', desc: 'Wide balanced' },
  { id: '45%', label: '45 / 55', desc: 'Prominent sidebar' },
  { id: '50%', label: '50 / 50', desc: 'Even split' },
];

export const PAGE_SIZE_OPTIONS = [
  { id: 'A4', label: 'A4', dimensions: '210 × 297 mm', widthPx: 794, heightPx: 1123 },
  { id: 'Letter', label: 'US Letter', dimensions: '8.5 × 11 in', widthPx: 816, heightPx: 1056 },
];

export const CAREER_PRESETS = [
  {
    id: 'ats-standard',
    name: 'ATS Clean Minimalist',
    tag: '100% ATS-Safe',
    desc: 'Single column, high-contrast, pipe contact, no tables/bars',
    category: 'Minimalist',
    layout: {
      columns: 1,
      pageSize: 'A4',
      headerFullWidth: false,
    },
    design: {
      headingStyle: 'underline',
      headerAlignment: 'left',
      headerStyle: 'standard',
      contactStyle: 'pipe-separated',
      showPhoto: false,
      primaryColor: '#0f172a',
      accentColor: '#334155',
      headingColor: '#0f172a',
      textColor: '#1e293b',
      skillsStyle: 'columns-3',
      datePlacement: 'right',
      experienceStyle: 'standard',
    },
  },
  {
    id: 'student-fresher',
    name: 'Student & Academic',
    tag: 'Education-First',
    desc: 'Education & detailed projects prioritized at the top',
    category: 'Academic',
    layout: {
      columns: 1,
      pageSize: 'A4',
      headerFullWidth: false,
    },
    design: {
      headingStyle: 'accent-bar',
      headerAlignment: 'center',
      headerStyle: 'standard',
      contactStyle: 'inline',
      showPhoto: false,
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      headingColor: '#1e3a8a',
      skillsStyle: 'tags',
      datePlacement: 'right',
      educationStyle: 'standard',
      projectsStyle: 'detailed',
    },
  },
  {
    id: 'executive-dense',
    name: 'Executive & Leadership',
    tag: 'Senior Professional',
    desc: 'Dense, split header, key-value contact card, timeline layout',
    category: 'Executive',
    layout: {
      columns: 2,
      sidebarPosition: 'left',
      sidebarWidth: '30%',
      pageSize: 'A4',
      headerFullWidth: true,
    },
    design: {
      headingStyle: 'border-left',
      headerAlignment: 'split',
      headerStyle: 'contact-card',
      contactStyle: 'grid-card',
      showPhoto: false,
      primaryColor: '#0f766e',
      accentColor: '#14b8a6',
      headingColor: '#134e4a',
      textColor: '#1e293b',
      skillsStyle: 'tags',
      datePlacement: 'left',
      experienceStyle: 'compact',
    },
  },
  {
    id: 'creative-tech',
    name: 'Modern Tech & Creative',
    tag: 'Portfolio Ready',
    desc: 'Asymmetric 35/65 sidebar with solid banner, badges & photo',
    category: 'Creative',
    layout: {
      columns: 2,
      sidebarPosition: 'left',
      sidebarWidth: '35%',
      pageSize: 'A4',
      headerFullWidth: false,
    },
    design: {
      headingStyle: 'icon-badge',
      headerAlignment: 'left',
      headerStyle: 'banner',
      contactStyle: 'pills',
      showPhoto: true,
      photoPlacement: 'sidebar',
      photoShape: 'rounded',
      photoSize: 'medium',
      primaryColor: '#6366f1',
      accentColor: '#818cf8',
      sidebarBackgroundColor: '#0f172a',
      sidebarTextColor: '#cbd5e1',
      sidebarHeadingColor: '#ffffff',
      sidebarPrimaryColor: '#818cf8',
      skillsStyle: 'filled-pills',
      datePlacement: 'badge',
      experienceStyle: 'timeline',
      projectsStyle: 'detailed',
    },
  },
];

export const CUSTOM_SECTION_TYPES = [
  { type: 'volunteering', title: 'Volunteer Experience', defaultColumn: 'main' },
  { type: 'publications', title: 'Publications & Research', defaultColumn: 'main' },
  { type: 'coursework', title: 'Relevant Coursework', defaultColumn: 'sidebar' },
  { type: 'hobbies', title: 'Interests & Activities', defaultColumn: 'sidebar' },
  { type: 'references', title: 'Professional References', defaultColumn: 'main' },
  { type: 'custom', title: 'Additional Information', defaultColumn: 'main' },
];

export const CATEGORIES = [
  'Modern',
  'Executive',
  'Minimalist',
  'Creative',
  'Technical',
  'Academic',
];

export const HEADING_STYLES = [
  { id: 'underline', label: 'Underline Accent', desc: 'Sleek accent line under title' },
  { id: 'border-left', label: 'Left Border Bar', desc: 'Vertical colored block border' },
  { id: 'pill', label: 'Pill Badge', desc: 'Rounded soft background badge' },
  { id: 'uppercase', label: 'Tracked Uppercase', desc: 'High-contrast spaced letters' },
  { id: 'boxed', label: 'Solid Box', desc: 'Filled background banner' },
  { id: 'minimal', label: 'Minimalist Dot', desc: 'Clean dot with no line' },
  { id: 'icon-badge', label: 'Icon Badge', desc: 'Circular/square icon badge beside title' },
  { id: 'filled-bar', label: 'Full-Width Bar', desc: 'Solid high-contrast band across section' },
  { id: 'accent-bar', label: 'Thick Accent Line', desc: 'Solid bold accent underline' },
];

// Helper: detect if a hex color is dark
export const isColorDark = (hex) => {
  if (!hex || hex === 'transparent') return false;
  const c = hex.replace('#', '');
  if (c.length !== 6 && c.length !== 3) return false;
  const r = parseInt(c.length === 3 ? c[0] + c[0] : c.substring(0, 2), 16);
  const g = parseInt(c.length === 3 ? c[1] + c[1] : c.substring(2, 4), 16);
  const b = parseInt(c.length === 3 ? c[2] + c[2] : c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.45;
};
