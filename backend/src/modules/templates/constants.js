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
  pageSize: 'A4',
  columns: 1,
  sidebarPosition: 'left',
  sidebarWidth: '33%',
  headerFullWidth: false,
  sections: DEFAULT_SECTIONS,
};

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
