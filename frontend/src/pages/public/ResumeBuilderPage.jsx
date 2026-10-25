import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  Bot, 
  Palette, 
  Briefcase, 
  Wrench,
  User, 
  Save,
  Columns,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Loader2,
  FileDown,
  FolderCheck,
  ArrowDownToLine,
  BookmarkCheck,
  Lock,
  Camera,
  UploadCloud,
  Check,
  CheckCircle2,
  Type,
  Calendar,
  Search,
  Layers,
  LayoutGrid,
  FolderGit2,
  Globe,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getPublishedTemplates } from '@/api/templates.api';
import { saveResume, updateResume, downloadResumePdf, getResumeById } from '@/api/resumes.api';
import toast from 'react-hot-toast';
import ResumeRenderer from '@/components/resume/ResumeRenderer';
import MonthYearPicker from '@/components/ui/MonthYearPicker';

// Color presets matching Admin template builder (with Free vs Pro tier tagging)
export const COLOR_PRESETS = [
  { name: 'Azure Tech', primary: '#2563eb', accent: '#3b82f6', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#f8fafc', isPro: false },
  { name: 'Emerald Forest', primary: '#059669', accent: '#10b981', heading: '#064e3b', bg: '#ffffff', sidebarBg: '#f0fdf4', isPro: false },
  { name: 'Executive Navy', primary: '#1e3a8a', accent: '#2563eb', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#f1f5f9', isPro: false },
  { name: 'Obsidian Minimal', primary: '#18181b', accent: '#3f3f46', heading: '#09090b', bg: '#ffffff', sidebarBg: '#f4f4f5', isPro: false },
  { name: 'Teal Modernist', primary: '#0d9488', accent: '#14b8a6', heading: '#134e4a', bg: '#ffffff', sidebarBg: '#f0fdfa', isPro: false },
  // Premium / Pro locked colors:
  { name: 'Crimson Heritage', primary: '#991b1b', accent: '#dc2626', heading: '#450a0a', bg: '#ffffff', sidebarBg: '#fef2f2', isPro: true },
  { name: 'Warm Amber', primary: '#d97706', accent: '#f59e0b', heading: '#78350f', bg: '#fffdfa', sidebarBg: '#fffbeb', isPro: true },
  { name: 'Navy Dark Sidebar', primary: '#1e3a5f', accent: '#3b82f6', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#1e293b', isPro: true },
  { name: 'Charcoal Contrast', primary: '#334155', accent: '#64748b', heading: '#0f172a', bg: '#ffffff', sidebarBg: '#1e293b', isPro: true },
];

// Font options matching Admin builder (with Free vs Pro tier tagging)
export const FONT_OPTIONS = [
  { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif", isPro: false },
  { label: 'Roboto (Neutral Neo-grotesque)', value: "'Roboto', sans-serif", isPro: false },
  { label: 'Plus Jakarta Sans (Crisp Contemporary)', value: "'Plus Jakarta Sans', sans-serif", isPro: false },
  // Premium / Pro locked fonts:
  { label: 'Outfit (Clean Geometric)', value: "'Outfit', sans-serif", isPro: true },
  { label: 'Poppins (Friendly Geometric)', value: "'Poppins', sans-serif", isPro: true },
  { label: 'Merriweather (Classic Editorial Serif)', value: "'Merriweather', Georgia, serif", isPro: true },
  { label: 'Playfair Display (Executive High-Contrast Serif)', value: "'Playfair Display', Georgia, serif", isPro: true },
];

export const FONT_SIZE_OPTIONS = [
  { id: '7pt', label: '7pt', desc: 'Ultra Compact' },
  { id: '7.5pt', label: '7.5pt', desc: 'Dense Small' },
  { id: '8pt', label: '8pt', desc: 'Extra Small' },
  { id: '8.5pt', label: '8.5pt', desc: 'Compact Small' },
  { id: '9pt', label: '9pt', desc: 'Small' },
  { id: '9.5pt', label: '9.5pt', desc: 'Dense Standard' },
  { id: '10pt', label: '10pt', desc: 'Standard (ATS)' },
  { id: '10.5pt', label: '10.5pt', desc: 'Medium' },
  { id: '11pt', label: '11pt', desc: 'Comfortable' },
  { id: '11.5pt', label: '11.5pt', desc: 'Spacious' },
  { id: '12pt', label: '12pt', desc: 'Large' },
  { id: '12.5pt', label: '12.5pt', desc: 'Extra Large' },
  { id: '13pt', label: '13pt', desc: 'Prominent' },
];

export const formatMonthYear = (val) => {
  if (!val) return '';
  const parts = String(val).trim().split('-');
  const year = parts[0];
  const month = parts[1];
  if (!year) return val;
  if (!month) return year;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(month, 10) - 1;
  const monthStr = monthNames[monthIdx] || month;
  return `${monthStr} ${year}`;
};

export const parsePeriodToDates = (periodStr) => {
  if (!periodStr) return { startDate: '', endDate: '', current: false };
  const isCurrent = /present|current|now/i.test(periodStr);
  const parts = periodStr.split(/\s*[-–—to]\s*/i);
  const start = (parts[0] || '').trim();
  const end = isCurrent ? '' : (parts[1] || '').trim();

  const toIsoMonth = (str) => {
    if (!str) return '';
    if (/^\d{4}-\d{2}$/.test(str)) return str;
    if (/^\d{4}$/.test(str)) return `${str}-01`;
    const match = str.match(/([a-zA-Z]+)[,\s]+(\d{4})/);
    if (match) {
      const monthMap = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
      const mStr = match[1].slice(0, 3).toLowerCase();
      const mNum = monthMap[mStr] || '01';
      return `${match[2]}-${mNum}`;
    }
    return '';
  };

  return {
    startDate: toIsoMonth(start),
    endDate: isCurrent ? '' : toIsoMonth(end),
    current: isCurrent,
  };
};

export const buildPeriodString = (startDate, endDate, isCurrent) => {
  const formattedStart = formatMonthYear(startDate);
  if (isCurrent) {
    return formattedStart ? `${formattedStart} - Present` : 'Present';
  }
  const formattedEnd = formatMonthYear(endDate);
  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }
  return formattedStart || formattedEnd || '';
};

export const sanitizeProjectsData = (projects) => {
  if (!Array.isArray(projects)) return [];
  return projects.map(p => {
    let rawBullets = Array.isArray(p.bullets) ? p.bullets.filter(b => typeof b === 'string') : [];
    if (rawBullets.length === 0 && p.description) {
      if (typeof p.description === 'string') {
        rawBullets = p.description
          .split(/\n+|•|\r+/)
          .map(s => s.trim())
          .filter(Boolean);
      } else if (Array.isArray(p.description)) {
        rawBullets = p.description.filter(Boolean);
      }
    }

    const merged = [];
    for (let i = 0; i < rawBullets.length; i++) {
      const item = (rawBullets[i] || '').trim();
      if (!item) continue;
      // If item starts with lowercase and previous item exists, merge it back (e.g. "gener" + "ation.")
      if (merged.length > 0 && /^[a-z]/.test(item)) {
        const prev = merged[merged.length - 1];
        if (prev.endsWith('-')) {
          merged[merged.length - 1] = prev.slice(0, -1) + item;
        } else if (prev.endsWith('gener') && item.startsWith('ation')) {
          merged[merged.length - 1] = prev + item;
        } else {
          merged[merged.length - 1] = prev + ' ' + item;
        }
      } else {
        merged.push(item);
      }
    }

    const bullets = merged.length > 0 ? merged : [''];
    return {
      ...p,
      bullets,
    };
  });
};

export default function ResumeBuilderPage() {
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get('id') || searchParams.get('resumeId');
  const selectedTemplateParam = searchParams.get('template') || 'modern';
  
  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplateObj, setSelectedTemplateObj] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(selectedTemplateParam);
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isAutoFit, setIsAutoFit] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mobileStudioView, setMobileStudioView] = useState('editor'); // 'editor' | 'preview'
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Custom design states (colors, fonts, sizes)
  const [selectedPalette, setSelectedPalette] = useState('Azure Tech');
  const [customDesign, setCustomDesign] = useState({
    fontFamily: "'Inter', sans-serif",
    headingFontFamily: "'Inter', sans-serif",
    fontSize: '10pt',
    primaryColor: '#2563eb',
    accentColor: '#3b82f6',
    headingColor: '#0f172a',
    backgroundColor: '#ffffff',
    sidebarBackgroundColor: '#f8fafc',
  });
  const [lockedModal, setLockedModal] = useState({ open: false, title: '', type: 'feature' });
  const fileInputRef = useRef(null);

  // Template Search, Filter & Gallery Modal (supports 100+ templates effortlessly)
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState('All');
  const [showAllTemplatesModal, setShowAllTemplatesModal] = useState(false);

  // Resume persistence & export states
  const [resumeTitle, setResumeTitle] = useState('My Professional Resume');
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaveDownloading, setIsSaveDownloading] = useState(false);
  const [showDownloadChoiceModal, setShowDownloadChoiceModal] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const isProUser = Boolean(isAuthenticated && (user?.plan_code === 'PRO' || user?.plan_code === 'PREMIUM'));

  // Module order, custom section visibility & page breaks
  const [sectionOrder, setSectionOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('extractor_resume_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.sectionOrder)) return parsed.sectionOrder;
      }
    } catch (e) {}
    return ['summary', 'experience', 'projects', 'skills', 'education'];
  });
  const [pageBreaks, setPageBreaks] = useState(() => {
    try {
      const saved = localStorage.getItem('extractor_resume_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pageBreaks) return parsed.pageBreaks;
      }
    } catch (e) {}
    return {};
  });
  const [hiddenSections, setHiddenSections] = useState(() => {
    try {
      const saved = localStorage.getItem('extractor_resume_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hiddenSections) return parsed.hiddenSections;
      }
    } catch (e) {}
    return {};
  });
  const [autoBreakSpacers, setAutoBreakSpacers] = useState({});

  // Load published templates with React Query (fetches up to 150 templates for rich gallery)
  const {
    data: apiTemplates = [],
    isLoading: loadingTemplates,
    isError: templatesError,
  } = useQuery({
    queryKey: ['published-templates'],
    queryFn: async () => {
      const res = await getPublishedTemplates({ limit: 150 });
      return res.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Sync initial selected template from backend apiTemplates
  useEffect(() => {
    if (apiTemplates.length > 0 && !selectedTemplateObj) {
      const matched = apiTemplates.find(
        (t) => t.id === selectedTemplateParam || t.code === selectedTemplateParam
      ) || apiTemplates[0];
      if (matched) {
        setSelectedTemplate(matched.code || matched.id);
        setSelectedTemplateObj(matched);
        if (matched.design_config?.primaryColor) {
          setAccentColor(matched.design_config.primaryColor);
        }
      }
    }
  }, [apiTemplates, selectedTemplateParam, selectedTemplateObj]);

  // Resume State (photo defaults to empty - no dummy photo if user didn't upload)
  const [resumeData, setResumeData] = useState({
    fullName: 'Alex Rivera',
    jobTitle: 'Senior Full-Stack Engineer',
    email: 'alex.rivera@dev.io',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: '',
    github: '',
    linkedin: 'linkedin.com/in/alexrivera',
    photo: '',
    photo_url: '',
    summary: 'High-impact Full-Stack Engineer with 6+ years building scalable cloud architectures, real-time distributed microservices, and high-conversion React web applications. Proven track record reducing API latency by 45% with Groq & Redis caching.',
    experiences: [
      {
        id: 1,
        company: 'CloudScale Technologies',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: '',
        current: true,
        period: 'Jan 2022 - Present',
        bullets: [
          'Architected and deployed high-throughput ingestion pipelines handling 50M+ daily events using Node.js, Kafka, and PostgreSQL.',
          'Spearheaded frontend performance optimizations with Vite and Next.js, cutting Core Web Vitals LCP by 60%.',
          'Mentored a cross-functional team of 6 engineers across Agile sprints and CI/CD best practices.'
        ]
      },
      {
        id: 2,
        company: 'Nexus AI Solutions',
        position: 'Full-Stack Developer',
        location: 'Austin, TX',
        startDate: '2019-03',
        endDate: '2022-01',
        current: false,
        period: 'Mar 2019 - Jan 2022',
        bullets: [
          'Developed micro-frontend architecture for enterprise dashboard used by over 120,000 monthly active users.',
          'Integrated LLM automated document extraction pipelines resulting in $180k annual operational cost reduction.'
        ]
      }
    ],
    projects: [
      {
        id: 1,
        name: 'AI Document Extractor & Talent Cloud',
        role: 'Full-Stack Lead',
        link: 'https://github.com/example/talent-extractor',
        bullets: [
          'Architected end-to-end document extraction pipeline utilizing LLM multimodal models.',
          'Built automated ATS compliance scoring system boosting candidate match accuracy to 99.8%.',
          'Delivered sub-second real-time resume preview generation using React and canvas rendering.'
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: 'B.S. in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2015-08',
        endDate: '2019-05',
        current: false,
        year: '2015 - 2019',
        gpa: '3.85 / 4.0'
      }
    ],
    skills: ['TypeScript', 'React.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS ECS', 'GraphQL', 'Tailwind CSS', 'Redis', 'CI/CD']
  });

  // Dynamically resolve template configurations & user styling overrides
  const activeTemplate = useMemo(() => {
    const tpl =
      selectedTemplateObj ||
      apiTemplates.find(
        (t) => t.id === selectedTemplate || t.code === selectedTemplate
      );

    if (tpl) {
      return {
        ...tpl,
        design_config: {
          ...tpl.design_config,
          ...customDesign,
          primaryColor: accentColor || customDesign.primaryColor || tpl.design_config?.primaryColor || '#2563eb',
          accentColor: customDesign.accentColor || accentColor || tpl.design_config?.accentColor || '#3b82f6',
          fontFamily: customDesign.fontFamily || tpl.design_config?.fontFamily || "'Inter', sans-serif",
          headingFontFamily: customDesign.headingFontFamily || customDesign.fontFamily || tpl.design_config?.headingFontFamily || "'Inter', sans-serif",
          fontSize: customDesign.fontSize || tpl.design_config?.fontSize || '10pt',
        },
      };
    }

    return null;
  }, [selectedTemplateObj, selectedTemplate, apiTemplates, accentColor, customDesign]);

  // Check if current active template supports photos (as defined by admin template configuration)
  const templateSupportsPhoto = activeTemplate?.design_config?.showPhoto !== false;

  // Normalize form state for ResumeRenderer (including candidate headshot)
  const normalizedResumeData = useMemo(() => {
    const candidatePhoto = resumeData.photo || resumeData.photo_url || '';
    return {
      name: resumeData.fullName,
      title: resumeData.jobTitle,
      email: resumeData.email,
      phone: resumeData.phone,
      location: resumeData.location,
      website: resumeData.website || '',
      linkedin: resumeData.linkedin || '',
      github: resumeData.github || '',
      photo: candidatePhoto,
      photo_url: candidatePhoto,
      summary: resumeData.summary,
      experience: (resumeData.experiences || []).map((exp) => ({
        id: exp.id,
        title: exp.position,
        company: exp.company,
        location: exp.location,
        period: exp.period,
        description: exp.bullets,
      })),
      projects: (resumeData.projects || []).map((proj) => {
        let rawBullets = Array.isArray(proj.bullets) && proj.bullets.length > 0
          ? proj.bullets.filter(Boolean)
          : typeof proj.description === 'string' && proj.description.trim()
          ? proj.description.split(/\n+|•|\r+/).map(s => s.trim()).filter(Boolean)
          : [];

        const mergedBullets = [];
        for (let i = 0; i < rawBullets.length; i++) {
          const item = (rawBullets[i] || '').trim();
          if (!item) continue;
          if (mergedBullets.length > 0 && /^[a-z]/.test(item)) {
            const prev = mergedBullets[mergedBullets.length - 1];
            if (prev.endsWith('-')) {
              mergedBullets[mergedBullets.length - 1] = prev.slice(0, -1) + item;
            } else if (prev.endsWith('gener') && item.startsWith('ation')) {
              mergedBullets[mergedBullets.length - 1] = prev + item;
            } else {
              mergedBullets[mergedBullets.length - 1] = prev + ' ' + item;
            }
          } else {
            mergedBullets.push(item);
          }
        }

        return {
          id: proj.id,
          name: proj.name || proj.title || '',
          title: proj.name || proj.title || '',
          role: proj.role || '',
          link: proj.link || '',
          bullets: mergedBullets,
          description: proj.description || mergedBullets.join(' • '),
        };
      }),
      education: (resumeData.education || []).map((edu) => ({
        id: edu.id,
        degree: edu.degree,
        institution: edu.school,
        location: edu.location,
        period: edu.year,
        grade: edu.gpa,
      })),
      skills: resumeData.skills || [],
      sectionOrder,
      pageBreaks,
      hiddenSections,
    };
  }, [resumeData, sectionOrder, pageBreaks, hiddenSections]);

  // A4 Standard Dimensions & Deterministic Multi-Page Height Observer
  const a4Width = activeTemplate?.layout_config?.pageSize === 'Letter' ? 816 : 794;
  const a4Height = activeTemplate?.layout_config?.pageSize === 'Letter' ? 1056 : 1123;
  const measureContainerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(1123);

  useEffect(() => {
    const container = measureContainerRef.current;
    if (!container) return;
    const a4H = a4Height;

    const runCalculation = () => {
      if (!container) return;
      const newSpacers = {};
      let cumulativeShift = 0;
      const containerRect = container.getBoundingClientRect();

      // Query all page break targets in DOM order from the unspaced mirror
      const targets = container.querySelectorAll('[data-section-type], [data-card-item="true"]');

      // Top and bottom printable page margins (ensures clean 14.5mm white borders on every page)
      const marginSetting = customDesign?.pageMargin || activeTemplate?.design_config?.pageMargin || 'normal';
      const PAGE_TOP_MARGIN = marginSetting === 'compact' ? 44 : marginSetting === 'spacious' ? 68 : 54;
      const PAGE_BOTTOM_MARGIN = marginSetting === 'compact' ? 44 : marginSetting === 'spacious' ? 68 : 54;

      targets.forEach((el) => {
        const secType = el.getAttribute('data-section-type');
        const cardKey = el.getAttribute('data-item-key');
        const rect = el.getBoundingClientRect();
        const naturalTop = rect.top - containerRect.top;
        const naturalHeight = rect.height;

        // 1. Section-level page breaks & orphan heading prevention
        if (secType) {
          const currentPositionedTop = naturalTop + cumulativeShift;
          const pIdx = Math.floor(currentPositionedTop / a4H);
          const pageBottomLimit = (pIdx + 1) * a4H - PAGE_BOTTOM_MARGIN;
          const nextPagePrintableTop = (pIdx + 1) * a4H + PAGE_TOP_MARGIN;
          const spaceRemainingBeforeLimit = pageBottomLimit - currentPositionedTop;

          // Explicit manual section page break
          if (pageBreaks && pageBreaks[secType]) {
            const needed = Math.round(nextPagePrintableTop - currentPositionedTop);
            if (needed > 0) {
              newSpacers[secType] = needed;
              cumulativeShift += needed;
            }
            return;
          }

          // Automatic orphan heading prevention & page bottom margin enforcement:
          // If a section starts with less than ~85px remaining before the bottom margin,
          // it cannot fit the header plus meaningful content on this page.
          // Shift the entire section to start at the top margin of the next page!
          if (spaceRemainingBeforeLimit < 85) {
            const needed = Math.round(nextPagePrintableTop - currentPositionedTop);
            if (needed > 0) {
              newSpacers[secType] = needed;
              cumulativeShift += needed;
            }
          }
          return;
        }

        // 2. Prevent cards (projects/experiences/education) from overflowing into bottom margin
        if (cardKey) {
          const currentPositionedTop = naturalTop + cumulativeShift;
          const currentPositionedBottom = currentPositionedTop + naturalHeight;
          const pIdx = Math.floor(currentPositionedTop / a4H);
          const pageBottomLimit = (pIdx + 1) * a4H - PAGE_BOTTOM_MARGIN;
          const nextPagePrintableTop = (pIdx + 1) * a4H + PAGE_TOP_MARGIN;

          // If the card crosses into or past the page bottom margin limit (and is not an oversized card > 85% of sheet):
          if (
            ((currentPositionedTop < pageBottomLimit && currentPositionedBottom > pageBottomLimit) ||
             (currentPositionedTop >= pageBottomLimit)) &&
            naturalHeight < a4H * 0.85
          ) {
            // Check if this card is the FIRST item in its parent section
            const parentSection = el.closest('[data-section-type]');
            const parentSecType = parentSection ? parentSection.getAttribute('data-section-type') : null;
            const isFirstCardInSection = parentSection && parentSection.querySelector('[data-card-item="true"]') === el;

            // If it is the first card, pushing only this card would leave the section heading
            // orphaned alone at the bottom of the previous page!
            // Instead, shift the entire parent section to start at the top margin of the next page.
            if (isFirstCardInSection && parentSecType && !newSpacers[parentSecType]) {
              const parentRect = parentSection.getBoundingClientRect();
              const parentNaturalTop = parentRect.top - containerRect.top;
              const parentPositionedTop = parentNaturalTop + cumulativeShift;
              const parentPIdx = Math.floor(parentPositionedTop / a4H);
              const parentNextPrintableTop = (parentPIdx + 1) * a4H + PAGE_TOP_MARGIN;
              const needed = Math.round(parentNextPrintableTop - parentPositionedTop);
              if (needed > 0) {
                newSpacers[parentSecType] = needed;
                cumulativeShift += needed;
              }
            } else {
              // Subsequent cards shift individually to the top margin of the next page
              const needed = Math.round(nextPagePrintableTop - currentPositionedTop);
              if (needed > 0) {
                newSpacers[cardKey] = needed;
                cumulativeShift += needed;
              }
            }
          }
        }
      });

      setAutoBreakSpacers((prev) => {
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(newSpacers);
        if (prevKeys.length !== newKeys.length) return newSpacers;
        for (const k of newKeys) {
          if (prev[k] !== newSpacers[k]) return newSpacers;
        }
        return prev;
      });

      const totalH = container.scrollHeight + cumulativeShift;
      if (totalH > 0) {
        setContentHeight(totalH);
      }
    };

    runCalculation();
    const ro = new ResizeObserver(runCalculation);
    ro.observe(container);
    return () => ro.disconnect();
  }, [activeTemplate, normalizedResumeData, customDesign, sectionOrder, pageBreaks, a4Height]);

  const totalPages = Math.max(1, Math.ceil(contentHeight / a4Height));

  // Dynamic Fit-To-Screen Zoom Calculation
  const previewCanvasRef = useRef(null);

  const calculateFitZoom = useCallback(() => {
    const el = previewCanvasRef.current || document.getElementById('printableResumeContainer');
    if (!el) return 0.55;
    const isMobile = window.innerWidth < 1024;
    const paddingX = isMobile ? 16 : 40;
    const paddingY = isMobile ? 16 : 40;
    const availableHeight = el.clientHeight - paddingY;
    const availableWidth = el.clientWidth - paddingX;
    if (availableHeight <= 0 || availableWidth <= 0) return 0.55;

    // On mobile (< 1024px), width fitting is crucial so text isn't cut off horizontally
    if (isMobile) {
      const widthScale = +(availableWidth / a4Width).toFixed(2);
      return Math.min(1.0, Math.max(0.32, widthScale));
    }

    const heightScale = +(availableHeight / a4Height).toFixed(2);
    const widthScale = +(availableWidth / a4Width).toFixed(2);
    const fitScale = Math.min(heightScale, widthScale, 0.95);
    return Math.max(0.35, fitScale);
  }, [a4Height, a4Width]);

  const handleFitZoom = useCallback(() => {
    setIsAutoFit(true);
    const fitVal = calculateFitZoom();
    setZoomLevel(fitVal);
  }, [calculateFitZoom]);

  const handleSetManualZoom = (val) => {
    setIsAutoFit(false);
    setZoomLevel(val);
  };

  const handleSwitchToMobilePreview = useCallback(() => {
    setMobileStudioView('preview');
    setTimeout(() => {
      const fitVal = calculateFitZoom();
      setZoomLevel(fitVal);
      setIsAutoFit(true);
    }, 60);
  }, [calculateFitZoom]);

  // If initial load is on mobile, scale to fit mobile screen width
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const timer = setTimeout(() => {
        const fitVal = calculateFitZoom();
        setZoomLevel(fitVal);
        setIsAutoFit(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [calculateFitZoom]);

  useEffect(() => {
    if (!isAutoFit) return;
    const applyFit = () => {
      const fitVal = calculateFitZoom();
      setZoomLevel(fitVal);
    };
    window.addEventListener('resize', applyFit);
    return () => {
      window.removeEventListener('resize', applyFit);
    };
  }, [isAutoFit, calculateFitZoom]);

  // Dynamic Template Filtering & Categorization for 100+ templates
  const dynamicTemplateCategories = useMemo(() => {
    const rawCategories = Array.from(new Set(apiTemplates.map((t) => t.category).filter(Boolean)));
    return ['All', '1 Column (ATS)', '2 Columns', ...rawCategories];
  }, [apiTemplates]);

  const filteredTemplates = useMemo(() => {
    return apiTemplates.filter((tpl) => {
      const q = templateSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (tpl.name && tpl.name.toLowerCase().includes(q)) ||
        (tpl.category && tpl.category.toLowerCase().includes(q)) ||
        (tpl.description && tpl.description.toLowerCase().includes(q));

      const columns = tpl.layout_config?.columns || 1;
      let matchesCat = true;
      if (templateCategoryFilter === '1 Column (ATS)') {
        matchesCat = columns === 1;
      } else if (templateCategoryFilter === '2 Columns') {
        matchesCat = columns === 2;
      } else if (templateCategoryFilter !== 'All') {
        matchesCat = (tpl.category || '').toLowerCase() === templateCategoryFilter.toLowerCase();
      }

      return matchesSearch && matchesCat;
    });
  }, [apiTemplates, templateSearch, templateCategoryFilter]);

  // Styling & Palette Handlers (matching Admin builder)
  const handleSelectPalette = (preset) => {
    if (preset.isPro && !isProUser) {
      setLockedModal({
        open: true,
        title: `${preset.name} Theme`,
        type: 'color',
      });
      return;
    }
    setSelectedPalette(preset.name);
    setAccentColor(preset.primary);
    setCustomDesign(prev => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      headingColor: preset.heading,
      backgroundColor: preset.bg,
      sidebarBackgroundColor: preset.sidebarBg,
    }));
  };

  const handleMonochrome = () => {
    setSelectedPalette('Monochrome');
    setAccentColor('#0f172a');
    setCustomDesign(prev => ({
      ...prev,
      primaryColor: '#0f172a',
      accentColor: '#334155',
      headingColor: '#0f172a',
      backgroundColor: '#ffffff',
      sidebarBackgroundColor: '#f8fafc',
    }));
    toast.success('Switched to 100% Monochrome ATS Grayscale');
  };

  const handleSelectFontFamily = (f) => {
    if (f.isPro && !isProUser) {
      setLockedModal({
        open: true,
        title: f.label,
        type: 'font',
      });
      return;
    }
    setCustomDesign(prev => ({
      ...prev,
      fontFamily: f.value,
      headingFontFamily: f.value,
    }));
  };

  const handleSelectFontSize = (sizeId) => {
    setCustomDesign(prev => ({
      ...prev,
      fontSize: sizeId,
    }));
  };

  const currentSizeIndex = FONT_SIZE_OPTIONS.findIndex(
    (fs) => fs.id === (customDesign.fontSize || '10pt')
  );

  const handleDecreaseFontSize = () => {
    const defaultIdx = FONT_SIZE_OPTIONS.findIndex((fs) => fs.id === '10pt');
    const currentIdx = currentSizeIndex === -1 ? (defaultIdx >= 0 ? defaultIdx : 6) : currentSizeIndex;
    const nextIdx = Math.max(0, currentIdx - 1);
    handleSelectFontSize(FONT_SIZE_OPTIONS[nextIdx].id);
  };

  const handleIncreaseFontSize = () => {
    const defaultIdx = FONT_SIZE_OPTIONS.findIndex((fs) => fs.id === '10pt');
    const currentIdx = currentSizeIndex === -1 ? (defaultIdx >= 0 ? defaultIdx : 6) : currentSizeIndex;
    const nextIdx = Math.min(FONT_SIZE_OPTIONS.length - 1, currentIdx + 1);
    handleSelectFontSize(FONT_SIZE_OPTIONS[nextIdx].id);
  };

  // Photo Upload & Removal Handlers (clean & simple)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image size should be under 4MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setResumeData(prev => ({
        ...prev,
        photo: base64Url,
        photo_url: base64Url,
      }));
      toast.success('Photo uploaded to resume!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setResumeData(prev => ({
      ...prev,
      photo: '',
      photo_url: '',
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast('Profile photo removed', { icon: '🗑️' });
  };

  const handlePersonalChange = (field, val) => {
    setResumeData(prev => ({ ...prev, [field]: val }));
  };

  const handleAddExperience = () => {
    const currentYearMonth = new Date().toISOString().slice(0, 7);
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: currentYearMonth,
      endDate: '',
      current: true,
      period: buildPeriodString(currentYearMonth, '', true),
      bullets: ['Led development of core features and improved system performance.']
    };
    setResumeData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const handleUpdateExperience = (id, field, val) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: val } : e)
    }));
  };

  const handleUpdateExperienceDate = (expId, key, val) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id !== expId) return e;

        const parsed = parsePeriodToDates(e.period);
        let startDate = e.startDate !== undefined ? e.startDate : parsed.startDate;
        let endDate = e.endDate !== undefined ? e.endDate : parsed.endDate;
        let current = e.current !== undefined ? e.current : parsed.current;

        if (key === 'startDate') startDate = val;
        if (key === 'endDate') endDate = val;
        if (key === 'current') {
          current = Boolean(val);
          if (current) {
            endDate = ''; // No end date when current job is ticked
          }
        }

        const period = buildPeriodString(startDate, endDate, current);

        return {
          ...e,
          startDate,
          endDate,
          current,
          period,
        };
      })
    }));
  };

  const handleAddBullet = (expId) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id === expId) {
          return { ...e, bullets: [...e.bullets, 'Achieved measurable results utilizing modern best practices.'] };
        }
        return e;
      })
    }));
  };

  const handleUpdateBullet = (expId, bulletIdx, val) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id === expId) {
          const newBullets = [...e.bullets];
          newBullets[bulletIdx] = val;
          return { ...e, bullets: newBullets };
        }
        return e;
      })
    }));
  };

  const handleDeleteBullet = (expId, bulletIdx) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => {
        if (e.id === expId) {
          return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIdx) };
        }
        return e;
      })
    }));
  };

  const handleDeleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      startDate: '2020-09',
      endDate: '2024-05',
      current: false,
      year: '2020 - 2024',
      gpa: ''
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleUpdateEducation = (id, field, val) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: val } : e)
    }));
  };

  const handleUpdateEducationDate = (eduId, key, val) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => {
        if (e.id !== eduId) return e;

        const parsed = parsePeriodToDates(e.year);
        let startDate = e.startDate !== undefined ? e.startDate : parsed.startDate;
        let endDate = e.endDate !== undefined ? e.endDate : parsed.endDate;
        let current = e.current !== undefined ? e.current : parsed.current;

        if (key === 'startDate') startDate = val;
        if (key === 'endDate') endDate = val;
        if (key === 'current') {
          current = Boolean(val);
          if (current) endDate = '';
        }

        const startYear = startDate ? startDate.split('-')[0] : '';
        const endYear = current ? 'Present' : (endDate ? endDate.split('-')[0] : '');
        const yearStr = current
          ? (startYear ? `${startYear} - Present` : 'Present')
          : (startYear && endYear ? `${startYear} - ${endYear}` : (startYear || endYear || ''));

        return {
          ...e,
          startDate,
          endDate,
          current,
          year: yearStr,
        };
      })
    }));
  };

  const handleDeleteEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const handleAddSkill = (skillText) => {
    if (!skillText.trim()) return;
    if (!resumeData.skills.includes(skillText.trim())) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, skillText.trim()] }));
    }
  };

  const handleDeleteSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAddProject = () => {
    const newProj = {
      id: Date.now(),
      name: '',
      role: '',
      link: '',
      bullets: [''],
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
  };

  const handleUpdateProject = (id, field, val) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  const handleDeleteProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
  };

  const handleAddProjectBullet = (projectId) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => {
        if (p.id !== projectId) return p;
        const currentBullets = Array.isArray(p.bullets) ? p.bullets : [''];
        return {
          ...p,
          bullets: [...currentBullets, '']
        };
      })
    }));
  };

  const handleUpdateProjectBullet = (projectId, bulletIdx, val) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => {
        if (p.id !== projectId) return p;
        const currentBullets = Array.isArray(p.bullets) ? [...p.bullets] : [''];
        currentBullets[bulletIdx] = val;
        return {
          ...p,
          bullets: currentBullets,
          description: currentBullets.join('\n• ')
        };
      })
    }));
  };

  const handleDeleteProjectBullet = (projectId, bulletIdx) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => {
        if (p.id !== projectId) return p;
        const currentBullets = (Array.isArray(p.bullets) ? p.bullets : [''])
          .filter((_, i) => i !== bulletIdx);
        return {
          ...p,
          bullets: currentBullets.length > 0 ? currentBullets : [''],
          description: currentBullets.join('\n• ')
        };
      })
    }));
  };

  const handleAiEnhanceSummary = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        summary: `Strategic and results-driven ${prev.jobTitle || 'Engineer'} with deep technical expertise in modern cloud architectures, scalable microservices, and intuitive frontends. Proven track record boosting system throughput by 45% and reducing infrastructure overhead.`
      }));
      setAiGenerating(false);
    }, 800);
  };

  // Section Reordering & Layout Handlers
  const handleMoveSectionUp = (sectionKey) => {
    setSectionOrder((prev) => {
      const idx = prev.indexOf(sectionKey);
      if (idx <= 0) return prev;
      const next = [...prev];
      const temp = next[idx - 1];
      next[idx - 1] = next[idx];
      next[idx] = temp;
      saveDraftToStorage(null, next);
      return next;
    });
  };

  const handleMoveSectionDown = (sectionKey) => {
    setSectionOrder((prev) => {
      const idx = prev.indexOf(sectionKey);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[idx + 1];
      next[idx + 1] = next[idx];
      next[idx] = temp;
      saveDraftToStorage(null, next);
      return next;
    });
  };

  const handleTogglePageBreak = (sectionKey) => {
    setPageBreaks((prev) => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      saveDraftToStorage(null, null, next);
      return next;
    });
  };

  const handleToggleSectionVisibility = (sectionKey) => {
    setHiddenSections((prev) => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      saveDraftToStorage(null, null, null, next);
      return next;
    });
  };

  const handleMoveProjectUp = (projectId) => {
    setResumeData((prev) => {
      const projs = [...(prev.projects || [])];
      const idx = projs.findIndex(p => p.id === projectId);
      if (idx <= 0) return prev;
      const temp = projs[idx - 1];
      projs[idx - 1] = projs[idx];
      projs[idx] = temp;
      const updated = { ...prev, projects: projs };
      saveDraftToStorage(updated);
      return updated;
    });
  };

  const handleMoveProjectDown = (projectId) => {
    setResumeData((prev) => {
      const projs = [...(prev.projects || [])];
      const idx = projs.findIndex(p => p.id === projectId);
      if (idx < 0 || idx >= projs.length - 1) return prev;
      const temp = projs[idx + 1];
      projs[idx + 1] = projs[idx];
      projs[idx] = temp;
      const updated = { ...prev, projects: projs };
      saveDraftToStorage(updated);
      return updated;
    });
  };

  const handleMoveExperienceUp = (expId) => {
    setResumeData((prev) => {
      const exps = [...(prev.experiences || [])];
      const idx = exps.findIndex(e => e.id === expId);
      if (idx <= 0) return prev;
      const temp = exps[idx - 1];
      exps[idx - 1] = exps[idx];
      exps[idx] = temp;
      const updated = { ...prev, experiences: exps };
      saveDraftToStorage(updated);
      return updated;
    });
  };

  const handleMoveExperienceDown = (expId) => {
    setResumeData((prev) => {
      const exps = [...(prev.experiences || [])];
      const idx = exps.findIndex(e => e.id === expId);
      if (idx < 0 || idx >= exps.length - 1) return prev;
      const temp = exps[idx + 1];
      exps[idx + 1] = exps[idx];
      exps[idx] = temp;
      const updated = { ...prev, experiences: exps };
      saveDraftToStorage(updated);
      return updated;
    });
  };

  // Load saved resume if resumeId is in query params
  useEffect(() => {
    if (!resumeIdParam) return;
    let isMounted = true;
    const fetchSavedResume = async () => {
      try {
        const res = await getResumeById(resumeIdParam);
        const data = res.data?.data;
        if (data && isMounted) {
          setSavedResumeId(data.id);
          if (data.title) setResumeTitle(data.title);
          if (data.content) {
            const loaded = { ...data.content };
            if (loaded.projects) {
              loaded.projects = sanitizeProjectsData(loaded.projects);
            }
            if (Array.isArray(loaded.sectionOrder)) {
              setSectionOrder(loaded.sectionOrder);
            }
            if (loaded.pageBreaks) {
              setPageBreaks(loaded.pageBreaks);
            }
            if (loaded.hiddenSections) {
              setHiddenSections(loaded.hiddenSections);
            }
            setResumeData(loaded);
            if (data.content.design_config) {
              setCustomDesign(prev => ({ ...prev, ...data.content.design_config }));
              if (data.content.design_config.primaryColor) {
                setAccentColor(data.content.design_config.primaryColor);
              }
            }
          }
          if (data.template_id) {
            setSelectedTemplate(data.template_id);
            if (data.template) {
              setSelectedTemplateObj(data.template);
              if (data.template.design_config?.primaryColor && !data.content?.design_config?.primaryColor) {
                setAccentColor(data.template.design_config.primaryColor);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load saved resume by ID', err);
        toast.error('Could not load requested resume');
      }
    };
    fetchSavedResume();
    return () => { isMounted = false; };
  }, [resumeIdParam]);

  // Restore draft from localStorage if available (only if not loading an explicit resume ID)
  useEffect(() => {
    if (resumeIdParam) return;
    try {
      const savedDraft = localStorage.getItem('extractor_resume_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.resumeData) {
          const loaded = { ...parsed.resumeData };
          if (loaded.projects) {
            loaded.projects = sanitizeProjectsData(loaded.projects);
          }
          setResumeData(loaded);
        }
        if (parsed.sectionOrder && Array.isArray(parsed.sectionOrder)) setSectionOrder(parsed.sectionOrder);
        if (parsed.pageBreaks) setPageBreaks(parsed.pageBreaks);
        if (parsed.hiddenSections) setHiddenSections(parsed.hiddenSections);
        if (parsed.resumeTitle) setResumeTitle(parsed.resumeTitle);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.customDesign) setCustomDesign(parsed.customDesign);
        if (parsed.selectedPalette) setSelectedPalette(parsed.selectedPalette);
        if (parsed.savedResumeId) setSavedResumeId(parsed.savedResumeId);
      }
    } catch (e) {
      console.warn('Failed to restore draft from localStorage', e);
    }
  }, [resumeIdParam]);

  const saveDraftToStorage = (overrideData = null, overrideOrder = null, overrideBreaks = null, overrideHidden = null) => {
    try {
      localStorage.setItem('extractor_resume_draft', JSON.stringify({
        resumeData: overrideData || resumeData,
        sectionOrder: overrideOrder || sectionOrder,
        pageBreaks: overrideBreaks || pageBreaks,
        hiddenSections: overrideHidden || hiddenSections,
        resumeTitle,
        selectedTemplate,
        accentColor,
        customDesign,
        selectedPalette,
        savedResumeId,
      }));
    } catch (e) {
      console.warn('Could not save draft to localStorage', e);
    }
  };

  const { openAuthModal } = useAuthModalStore();

  // Core save to backend API
  const executeSaveToBackend = async (dataToSave = resumeData, titleToSave = resumeTitle) => {
    setIsSaving(true);
    try {
      const payload = {
        title: titleToSave || `${dataToSave.fullName || 'My'} Resume`,
        template_id: activeTemplate?.id || selectedTemplate,
        content: {
          ...dataToSave,
          sectionOrder,
          pageBreaks,
          hiddenSections,
          photo: dataToSave.photo || dataToSave.photo_url || '',
          photo_url: dataToSave.photo_url || dataToSave.photo || '',
          design_config: customDesign,
        },
      };

      let res;
      if (savedResumeId) {
        res = await updateResume(savedResumeId, payload);
        toast.success('Resume updated successfully!');
      } else {
        res = await saveResume(payload);
        const newId = res.data?.data?.id;
        if (newId) setSavedResumeId(newId);
        toast.success('Resume saved to your account!');
      }
      saveDraftToStorage();
      return res.data?.data;
    } catch (err) {
      console.error('Failed to save resume', err);
      toast.error(err.response?.data?.message || 'Failed to save resume. Please try again.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save Resume Button Click
  const handleSaveClick = () => {
    saveDraftToStorage();
    if (!isAuthenticated) {
      toast('Please sign in to save this resume to your account.', { icon: '🔒' });
      openAuthModal('login', async () => {
        try {
          await executeSaveToBackend();
        } catch (e) {
          // Handled inside executeSaveToBackend
        }
      });
      return;
    }

    executeSaveToBackend();
  };

  // Handle Direct PDF Download from Backend (Puppeteer)
  const handleDirectDownload = async ({ fromSaveAndDownload = false } = {}) => {
    if (isDownloading || isSaveDownloading) return;
    if (fromSaveAndDownload) {
      setIsSaveDownloading(true);
    } else {
      setIsDownloading(true);
    }
    const toastId = toast.loading('Generating high-resolution A4 PDF via server...');
    try {
      const payload = {
        title: resumeTitle || `${resumeData.fullName || 'Alex_Rivera'}_Resume`,
        template_id: activeTemplate?.id || selectedTemplate,
        accentColor: accentColor,
        designConfig: customDesign,
        content: {
          ...resumeData,
          sectionOrder,
          pageBreaks,
          hiddenSections,
          photo: resumeData.photo || resumeData.photo_url || '',
          photo_url: resumeData.photo_url || resumeData.photo || '',
        },
        ...(savedResumeId ? { resumeId: savedResumeId } : {}),
      };

      const res = await downloadResumePdf(payload);

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const cleanFileName = `${(resumeTitle || resumeData.fullName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      link.setAttribute('download', cleanFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('PDF downloaded successfully!', { id: toastId });
      setShowDownloadChoiceModal(false);
    } catch (err) {
      console.error('Failed to download PDF', err);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    } finally {
      setIsDownloading(false);
      setIsSaveDownloading(false);
    }
  };

  // Handle Save & Download Combined
  const handleSaveAndDownload = async () => {
    if (isSaving || isSaveDownloading) return;
    saveDraftToStorage();

    if (!isAuthenticated) {
      toast('Please sign in to save your resume to your account.', { icon: '🔒' });
      openAuthModal('login', async () => {
        try {
          await executeSaveToBackend();
          await handleDirectDownload({ fromSaveAndDownload: true });
        } catch (e) {
          // Stop if save failed
        }
      });
      return;
    }

    try {
      await executeSaveToBackend();
      await handleDirectDownload({ fromSaveAndDownload: true });
    } catch (e) {
      // Stop if save failed
    }
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col min-h-0 bg-background overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Main Studio Dual-Pane Workspace */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 xl:gap-6 overflow-hidden">
          
          {/* Left Column: Form Controls & Document Management (Independent Scroll) */}
          <div className={cn(
            "lg:col-span-5 xl:col-span-5 h-full flex flex-col min-h-0 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden",
            mobileStudioView === 'preview' && "hidden lg:flex"
          )}>
            {/* Left Header Strip: Document Title, Version Status & Actions */}
            <div className="p-3 sm:p-3.5 border-b border-border/70 bg-card/70 backdrop-blur-md shrink-0 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder="My Professional Resume"
                    className="text-sm sm:text-base font-bold tracking-tight text-foreground bg-transparent border-b border-transparent hover:border-border/70 focus:border-primary focus:outline-none transition-all truncate flex-1"
                    title="Click to rename your resume document"
                  />
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/60 shrink-0 font-normal">
                  {savedResumeId ? 'Saved' : 'Auto-saved'}
                </Badge>
              </div>

              {/* Actions Row: Save & Download */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className="flex-1 h-8 rounded-xl text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : savedResumeId ? (
                    <BookmarkCheck className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Save className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span>{isSaving ? 'Saving...' : savedResumeId ? 'Update' : 'Save'}</span>
                </Button>

                <Button 
                  variant="gradient" 
                  size="sm"
                  onClick={() => setShowDownloadChoiceModal(true)}
                  disabled={isDownloading}
                  className="flex-1 h-8 rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  {isDownloading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
                </Button>

                {/* Mobile Preview Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchToMobilePreview}
                  className="lg:hidden h-8 px-2.5 rounded-xl text-xs font-semibold gap-1 border-primary/40 text-primary hover:bg-primary/10"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </Button>
              </div>
            </div>

            {/* Step Tabs Pinned Under Document Header (Responsive 2x3 on mobile, 1x6 on desktop) */}
            <div className="p-2 sm:p-2.5 border-b border-border/70 bg-card/60 backdrop-blur-md shrink-0">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/70 select-none">
                {[
                  { id: 'template', label: 'Template', icon: Palette },
                  { id: 'personal', label: 'Contact', icon: User },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'skills', label: 'Skills & Edu', icon: Wrench },
                { id: 'layout', label: 'Sections', icon: ArrowUpDown },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 min-w-0 ${
                      isActive
                        ? 'bg-card text-primary shadow-xs ring-1 ring-border font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                    }`}
                    title={tab.label}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin">

            {/* Tab 1: Template Selection (Engineered for 100+ Templates with Search & Filter) */}
            {activeTab === 'template' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <CardTitle className="text-base font-bold">Choose Resume Template</CardTitle>
                      <CardDescription>Select an ATS-engineered layout for your industry.</CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllTemplatesModal(true)}
                      className="rounded-xl text-xs flex items-center gap-1.5 h-8 border-border/80 hover:bg-muted font-semibold cursor-pointer"
                    >
                      <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                      <span>Browse All ({apiTemplates.length})</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-4">
                  {/* Template Search & Category Filter Pills */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Search templates (e.g. Modern, Minimal, Tech)..."
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        className="pl-9 h-8 text-xs rounded-xl"
                      />
                      {templateSearch && (
                        <button
                          type="button"
                          onClick={() => setTemplateSearch('')}
                          className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground text-xs"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
                      {dynamicTemplateCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setTemplateCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                            templateCategoryFilter === cat
                              ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                              : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compact Template Gallery (Scrollable container engineered for 100+ templates) */}
                  {loadingTemplates ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-muted-foreground">Loading published templates...</p>
                    </div>
                  ) : filteredTemplates.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                        <span>Showing {filteredTemplates.length} of {apiTemplates.length} templates</span>
                        {templateSearch && (
                          <button
                            type="button"
                            onClick={() => { setTemplateSearch(''); setTemplateCategoryFilter('All'); }}
                            className="text-primary hover:underline text-[10.5px]"
                          >
                            Reset filter
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                        {filteredTemplates.map((tpl) => {
                          const isSelected =
                            selectedTemplate === (tpl.code || tpl.id) ||
                            selectedTemplate === tpl.id ||
                            selectedTemplateObj?.id === tpl.id;
                          const primaryColor =
                            tpl.design_config?.primaryColor || tpl.accent || '#3B82F6';
                          const columns = tpl.layout_config?.columns || 1;

                          return (
                            <div
                              key={tpl.id}
                              onClick={() => {
                                setSelectedTemplate(tpl.code || tpl.id);
                                setSelectedTemplateObj(tpl);
                                if (primaryColor) {
                                  setAccentColor(primaryColor);
                                }
                                // Sync customDesign with new template's design_config
                                const dc = tpl.design_config || {};
                                setCustomDesign(prev => ({
                                  ...prev,
                                  primaryColor: dc.primaryColor || primaryColor || prev.primaryColor,
                                  accentColor: dc.accentColor || primaryColor || prev.accentColor,
                                  headingColor: dc.headingColor || prev.headingColor,
                                  backgroundColor: dc.backgroundColor || '#ffffff',
                                  sidebarBackgroundColor: dc.sidebarBackgroundColor || '#f8fafc',
                                  fontFamily: dc.fontFamily || "'Inter', sans-serif",
                                  headingFontFamily: dc.headingFontFamily || dc.fontFamily || "'Inter', sans-serif",
                                  fontSize: dc.fontSize || '10pt',
                                }));
                                // Sync palette name if it matches a preset
                                const matchedPalette = COLOR_PRESETS.find(p => p.primary === (dc.primaryColor || primaryColor));
                                if (matchedPalette) setSelectedPalette(matchedPalette.name);
                              }}
                              className={`group relative p-3 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-primary ring-2 ring-primary/20 bg-primary/10 shadow-xs'
                                  : 'border-border/80 bg-card/60 hover:border-primary/50 hover:bg-card'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1.5 mb-1">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                      {tpl.name}
                                    </span>
                                    {isSelected && (
                                      <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-border/60">
                                      {tpl.category || 'General'}
                                    </Badge>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                      {columns === 2 ? (
                                        <>
                                          <Columns className="h-2.5 w-2.5 text-purple-400" />
                                          <span>2 Cols</span>
                                        </>
                                      ) : (
                                        <>
                                          <Square className="h-2.5 w-2.5 text-blue-400" />
                                          <span>1 Col</span>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <span
                                  className="h-3.5 w-3.5 rounded-full shrink-0 border border-background shadow-xs mt-0.5"
                                  style={{ backgroundColor: primaryColor }}
                                  title={`Theme: ${primaryColor}`}
                                />
                              </div>

                              <p className="text-[10.5px] text-muted-foreground line-clamp-1 leading-snug">
                                {tpl.description || 'Clean, recruiter-approved ATS layout.'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 space-y-2">
                      <p className="text-xs font-semibold text-foreground">No templates match "{templateSearch}"</p>
                      <button
                        type="button"
                        onClick={() => { setTemplateSearch(''); setTemplateCategoryFilter('All'); }}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Show all templates
                      </button>
                    </div>
                  )}

                  {/* Color Palette Themes matching Admin Builder with Pro Locks */}
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs font-bold text-foreground">Color Palette Themes</Label>
                        <p className="text-[11px] text-muted-foreground">Recruiter-vetted palettes matching Admin templates</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleMonochrome}
                        className="text-[10px] px-2 py-1 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground font-mono transition-colors"
                        title="Switch to 100% Monochrome ATS Grayscale"
                      >
                        Monochrome
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {COLOR_PRESETS.map((preset) => {
                        const isSelected = selectedPalette === preset.name || (accentColor === preset.primary && customDesign.sidebarBackgroundColor === preset.sidebarBg);
                        const isLocked = preset.isPro && !isProUser;

                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectPalette(preset)}
                            className={`group relative flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                                : 'border-border/80 bg-card/60 hover:border-primary/40 hover:bg-card'
                            }`}
                          >
                            <div className="flex -space-x-1 shrink-0">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-background shadow-xs"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-background shadow-xs"
                                style={{ backgroundColor: preset.accent }}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-background shadow-xs"
                                style={{ backgroundColor: preset.sidebarBg }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-semibold text-foreground truncate block">
                                {preset.name}
                              </span>
                            </div>

                            {isLocked ? (
                              <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                                <Lock className="w-2.5 h-2.5" />
                                <span>PRO</span>
                              </span>
                            ) : isSelected ? (
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography & Font Family with Pro Locks */}
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs font-bold text-foreground">Font Family & Typography</Label>
                        <p className="text-[11px] text-muted-foreground">Select professional fonts tailored for tech, executive, or creative roles</p>
                      </div>
                      <Type className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {FONT_OPTIONS.map((f) => {
                        const isSelected = (customDesign.fontFamily || "'Inter', sans-serif") === f.value;
                        const isLocked = f.isPro && !isProUser;

                        return (
                          <button
                            key={f.label}
                            type="button"
                            onClick={() => handleSelectFontFamily(f)}
                            style={{ fontFamily: f.value }}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                                : 'border-border/80 bg-card/60 hover:border-primary/40 hover:bg-card'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <span className="text-xs font-semibold text-foreground block truncate">
                                {f.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground opacity-85 block font-normal">
                                Clean, ATS-optimized text
                              </span>
                            </div>

                            {isLocked ? (
                              <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                <Lock className="w-2.5 h-2.5" />
                                <span>PRO</span>
                              </span>
                            ) : isSelected ? (
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Base Font Scale */}
                  <div className="space-y-2.5 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs font-bold text-foreground">Base Font Scale</Label>
                        <p className="text-[11px] text-muted-foreground">
                          Density: <span className="font-semibold text-primary">{customDesign.fontSize || '10pt'}</span> {FONT_SIZE_OPTIONS.find(fs => fs.id === (customDesign.fontSize || '10pt'))?.desc ? `· ${FONT_SIZE_OPTIONS.find(fs => fs.id === (customDesign.fontSize || '10pt'))?.desc}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/80">
                        <button
                          type="button"
                          onClick={handleDecreaseFontSize}
                          disabled={currentSizeIndex <= 0}
                          className="h-6 w-6 rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                          title="Decrease font scale"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-mono font-semibold px-2 min-w-[42px] text-center">
                          {customDesign.fontSize || '10pt'}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncreaseFontSize}
                          disabled={currentSizeIndex >= FONT_SIZE_OPTIONS.length - 1}
                          className="h-6 w-6 rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                          title="Increase font scale"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
                      {FONT_SIZE_OPTIONS.map((fs) => {
                        const isSelected = (customDesign.fontSize || '10pt') === fs.id;
                        return (
                          <button
                            key={fs.id}
                            type="button"
                            onClick={() => handleSelectFontSize(fs.id)}
                            className={`text-xs px-2.5 py-1 rounded-xl border transition-all shrink-0 ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                                : 'bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            {fs.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Accent Color picker */}
                  <div className="space-y-2 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-foreground">Custom Color Fine-Tuning</Label>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">{accentColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-muted/40 border border-border/80 rounded-xl p-1 pr-2.5">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => {
                            setAccentColor(e.target.value);
                            setCustomDesign(prev => ({
                              ...prev,
                              primaryColor: e.target.value,
                              accentColor: e.target.value,
                            }));
                          }}
                          className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-xs text-foreground uppercase">
                          {accentColor}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['#3B82F6', '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#E11D48', '#0F172A'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setAccentColor(color);
                              setCustomDesign(prev => ({
                                ...prev,
                                primaryColor: color,
                                accentColor: color,
                              }));
                            }}
                            className={`h-6 w-6 rounded-full transition-transform ${
                              accentColor === color ? 'scale-125 ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Personal Contact Info */}
            {activeTab === 'personal' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-base font-bold">Personal & Contact Information</CardTitle>
                  <CardDescription>Enter your primary contact info so recruiters can reach you easily.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-4">
                  {/* Profile Photo Card: Only shown if current template has photo enabled by admin */}
                  {templateSupportsPhoto && (
                    <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-12 h-12 overflow-hidden border border-border/80 bg-card shadow-xs flex items-center justify-center shrink-0 ${
                            activeTemplate?.design_config?.photoShape === 'square'
                              ? 'rounded-none'
                              : activeTemplate?.design_config?.photoShape === 'rounded'
                              ? 'rounded-xl'
                              : 'rounded-full'
                          }`}
                        >
                          {resumeData.photo ? (
                            <img 
                              src={resumeData.photo} 
                              alt="Profile" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-foreground">Profile Photo</h4>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {resumeData.photo ? 'Photo added to resume' : 'Optional headshot for this template'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          accept="image/png, image/jpeg, image/webp" 
                          className="hidden" 
                          onChange={handlePhotoUpload} 
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-border/80 hover:bg-card"
                        >
                          <UploadCloud className="h-3.5 w-3.5 text-primary" />
                          <span>{resumeData.photo ? 'Change Photo' : 'Upload Photo'}</span>
                        </Button>

                        {resumeData.photo && (
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            onClick={handleRemovePhoto}
                            className="h-8 text-xs text-destructive hover:bg-destructive/10 rounded-xl px-2.5"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Full Name</Label>
                      <Input 
                        value={resumeData.fullName}
                        onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                        placeholder="e.g. Alex Rivera" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Target Job Title</Label>
                      <Input 
                        value={resumeData.jobTitle}
                        onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                        placeholder="e.g. Senior Full-Stack Engineer" 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Email Address</Label>
                      <Input 
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        placeholder="alex@example.com" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Phone Number</Label>
                      <Input 
                        value={resumeData.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000" 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Location (City, State)</Label>
                      <Input 
                        value={resumeData.location}
                        onChange={(e) => handlePersonalChange('location', e.target.value)}
                        placeholder="e.g. San Francisco, CA or Kannur, Kerala" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span>LinkedIn Profile</span>
                      </Label>
                      <Input 
                        value={resumeData.linkedin}
                        onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/username" 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <GithubIcon className="w-3.5 h-3.5 text-foreground" />
                        <span>GitHub Profile</span>
                      </Label>
                      <Input 
                        value={resumeData.github || ''}
                        onChange={(e) => handlePersonalChange('github', e.target.value)}
                        placeholder="github.com/username" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                        <span>Portfolio / Website</span>
                      </Label>
                      <Input 
                        value={resumeData.website || ''}
                        onChange={(e) => handlePersonalChange('website', e.target.value)}
                        placeholder="myportfolio.dev or https://..." 
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Professional Summary</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleAiEnhanceSummary}
                        disabled={aiGenerating}
                        className="h-7 text-xs text-primary hover:bg-primary/10 gap-1.5"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>{aiGenerating ? 'Enhancing...' : 'AI Rewrite'}</span>
                      </Button>
                    </div>
                    <textarea 
                      value={resumeData.summary}
                      onChange={(e) => handlePersonalChange('summary', e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Write a concise overview of your key accomplishments..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Work Experience */}
            {activeTab === 'experience' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Work Experience</CardTitle>
                    <CardDescription>Highlight your roles, quantifiable metrics, and impact.</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddExperience}
                    className="h-8 rounded-xl text-xs gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Role
                  </Button>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-6">
                  {resumeData.experiences.map((exp, idx) => {
                    const parsedDates = parsePeriodToDates(exp.period);
                    const isCurrent = exp.current !== undefined ? exp.current : parsedDates.current;
                    const startDate = exp.startDate !== undefined ? exp.startDate : parsedDates.startDate;
                    const endDate = exp.endDate !== undefined ? exp.endDate : parsedDates.endDate;

                    return (
                      <div key={exp.id} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-xs font-bold text-foreground">Position #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              type="button"
                              onClick={() => handleMoveExperienceUp(exp.id)}
                              disabled={idx === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors p-1 cursor-pointer"
                              title="Move position up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleMoveExperienceDown(exp.id)}
                              disabled={idx === resumeData.experiences.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors p-1 cursor-pointer"
                              title="Move position down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            {resumeData.experiences.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => handleDeleteExperience(exp.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-1 cursor-pointer"
                                title="Remove Position"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold">Job Title</Label>
                            <Input 
                              value={exp.position} 
                              onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                              placeholder="e.g. Senior Software Engineer"
                              className="h-8 text-xs rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold">Company Name</Label>
                            <Input 
                              value={exp.company} 
                              onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                              placeholder="e.g. Acme Corp"
                              className="h-8 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold">Location</Label>
                          <Input 
                            value={exp.location} 
                            onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                            placeholder="e.g. San Francisco, CA or Remote"
                            className="h-8 text-xs rounded-lg"
                          />
                        </div>

                        {/* Dates of Employment with Date Picker & Current Job Tick */}
                        <div className="p-3 rounded-xl border border-border/60 bg-background/50 space-y-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-primary" />
                              Dates / Period
                            </span>
                            
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-foreground bg-primary/10 hover:bg-primary/15 border border-primary/20 px-2.5 py-1 rounded-lg transition-colors">
                              <input
                                type="checkbox"
                                checked={isCurrent}
                                onChange={(e) => handleUpdateExperienceDate(exp.id, 'current', e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                              />
                              <span className="font-medium text-[11px]">I currently work here (Current Job)</span>
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-[11px] font-semibold text-muted-foreground">Start Date</Label>
                              <MonthYearPicker
                                id={`start-date-${exp.id}`}
                                value={startDate || ''}
                                onChange={(val) => handleUpdateExperienceDate(exp.id, 'startDate', val)}
                                placeholder="Select Start Date"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[11px] font-semibold text-muted-foreground">End Date</Label>
                              {isCurrent ? (
                                <div className="h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 flex items-center gap-2 text-xs text-emerald-400 font-medium select-none">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Present (No End Date)</span>
                                </div>
                              ) : (
                                <MonthYearPicker
                                  id={`end-date-${exp.id}`}
                                  value={endDate || ''}
                                  onChange={(val) => handleUpdateExperienceDate(exp.id, 'endDate', val)}
                                  placeholder="Select End Date"
                                />
                              )}
                            </div>
                          </div>

                          <div className="text-[10.5px] text-muted-foreground flex items-center justify-between pt-0.5 border-t border-border/40">
                            <span>Resume display format:</span>
                            <span className="font-semibold text-foreground px-2 py-0.5 bg-muted/60 rounded border border-border/60">
                              {exp.period || (isCurrent ? 'Present' : 'Not set')}
                            </span>
                          </div>
                        </div>

                      {/* Bullet points */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] font-semibold">Accomplishments & Bullets</Label>
                          <button 
                            type="button" 
                            onClick={() => handleAddBullet(exp.id)}
                            className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Plus className="h-3 w-3" /> Add Bullet
                          </button>
                        </div>
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-primary font-bold mt-1.5 text-xs">•</span>
                            <textarea 
                              value={bullet}
                              onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                              rows={2}
                              className="flex-1 rounded-lg border border-input bg-background p-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            />
                            {exp.bullets.length > 1 && (
                              <button 
                                onClick={() => handleDeleteBullet(exp.id, bIdx)}
                                className="text-muted-foreground hover:text-destructive p-1 mt-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                </CardContent>
              </Card>
            )}

            {/* Tab: Featured Projects */}
            {activeTab === 'projects' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Featured Projects</CardTitle>
                    <CardDescription>Showcase your notable applications, open-source work, or academic projects.</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddProject}
                    className="h-8 rounded-xl text-xs gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </Button>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-5">
                  {(resumeData.projects || []).length === 0 ? (
                    <div className="py-10 px-4 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <FolderGit2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">No projects added yet</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Adding projects boosts your interview callback rate by up to 35%.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="gradient"
                        onClick={handleAddProject}
                        className="h-8 text-xs font-semibold rounded-xl gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Your First Project</span>
                      </Button>
                    </div>
                  ) : (
                    (resumeData.projects || []).map((proj, idx) => (
                      <div key={proj.id || idx} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-xs font-bold text-foreground">Project #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              type="button"
                              onClick={() => handleMoveProjectUp(proj.id)}
                              disabled={idx === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors p-1 cursor-pointer"
                              title="Move project up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleMoveProjectDown(proj.id)}
                              disabled={idx === (resumeData.projects || []).length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors p-1 cursor-pointer"
                              title="Move project down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteProject(proj.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-1 cursor-pointer"
                              title="Remove Project"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold">Project Title / Name</Label>
                            <Input 
                              value={proj.name || ''} 
                              onChange={(e) => handleUpdateProject(proj.id, 'name', e.target.value)}
                              placeholder="e.g. AI Talent Extractor"
                              className="h-8 text-xs rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold">Role or Technologies</Label>
                            <Input 
                              value={proj.role || ''} 
                              onChange={(e) => handleUpdateProject(proj.id, 'role', e.target.value)}
                              placeholder="e.g. Lead Developer · React, Node.js"
                              className="h-8 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold flex items-center gap-1.5">
                            <Globe className="h-3 w-3 text-primary" />
                            <span>Project URL or GitHub Link</span>
                          </Label>
                          <Input 
                            value={proj.link || ''} 
                            onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                            placeholder="e.g. https://github.com/username/project or demo URL"
                            className="h-8 text-xs rounded-lg font-mono text-[11px]"
                          />
                        </div>

                        {/* Project Accomplishments & Bullet Points */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-[11px] font-semibold">Accomplishments & Key Points</Label>
                              <p className="text-[10.5px] text-muted-foreground">Each point renders as an ATS-optimized bullet on your resume</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => handleAddProjectBullet(proj.id)}
                              className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <Plus className="h-3 w-3" /> Add Point
                            </button>
                          </div>
                          {(Array.isArray(proj.bullets) && proj.bullets.length > 0 ? proj.bullets : ['']).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2">
                              <span className="text-primary font-bold mt-1.5 text-xs">•</span>
                              <textarea 
                                value={bullet}
                                onChange={(e) => handleUpdateProjectBullet(proj.id, bIdx, e.target.value)}
                                placeholder="Describe a key feature, technology used, or measurable outcome..."
                                rows={2}
                                className="flex-1 rounded-lg border border-input bg-background p-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                              />
                              {(proj.bullets || []).length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteProjectBullet(proj.id, bIdx)}
                                  className="text-muted-foreground hover:text-destructive p-1 mt-1 transition-colors cursor-pointer"
                                  title="Remove point"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tab 3: Skills & Education */}
            {activeTab === 'skills' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Skills */}
                <Card className="border-border/80 shadow-sm">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-base font-bold">Skills & Proficiencies</CardTitle>
                    <CardDescription>Add keywords that ATS scanners look for in your role.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        id="newSkillInput"
                        placeholder="Type a skill and press Enter (e.g. GraphQL, AWS)..." 
                        className="rounded-xl text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          const el = document.getElementById('newSkillInput');
                          if (el) {
                            handleAddSkill(el.value);
                            el.value = '';
                          }
                        }}
                        className="rounded-xl text-xs"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {resumeData.skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="px-2.5 py-1 text-xs font-semibold gap-1.5 group cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => handleDeleteSkill(skill)}
                          title="Click to delete skill"
                        >
                          <span>{skill}</span>
                          <span className="text-[10px] text-muted-foreground group-hover:text-destructive">×</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="border-border/80 shadow-sm">
                  <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">Education & Credentials</CardTitle>
                      <CardDescription>Degrees, universities, dates of study, and CGPA/grades.</CardDescription>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddEducation}
                      className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Degree
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 pt-2 space-y-5">
                    {resumeData.education.map((edu, idx) => {
                      const parsedDates = parsePeriodToDates(edu.year);
                      const eduCurrent = edu.current !== undefined ? edu.current : parsedDates.current;
                      const eduStartDate = edu.startDate !== undefined ? edu.startDate : parsedDates.startDate;
                      const eduEndDate = edu.endDate !== undefined ? edu.endDate : parsedDates.endDate;

                      return (
                        <div key={edu.id} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group">
                          <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-xs font-bold text-foreground">Education #{idx + 1}</span>
                            {resumeData.education.length > 1 && (
                              <button 
                                onClick={() => handleDeleteEducation(edu.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                                title="Remove Education"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-[11px] font-semibold">Degree / Major</Label>
                              <Input 
                                value={edu.degree} 
                                onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                                placeholder="e.g. B.S. in Computer Science"
                                className="h-8 text-xs rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] font-semibold">University / Institute</Label>
                              <Input 
                                value={edu.school} 
                                onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)}
                                placeholder="e.g. UC Berkeley"
                                className="h-8 text-xs rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-[11px] font-semibold">Location</Label>
                              <Input 
                                value={edu.location || ''} 
                                onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
                                placeholder="e.g. Berkeley, CA"
                                className="h-8 text-xs rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] font-semibold">CGPA / GPA / Grade</Label>
                              <Input 
                                value={edu.gpa || ''} 
                                onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                                placeholder="e.g. 3.85 / 4.0 or 8.9 CGPA"
                                className="h-8 text-xs rounded-lg"
                              />
                            </div>
                          </div>

                          {/* Dates of Study with MonthYearPicker & Enrolled Checkbox */}
                          <div className="p-3 rounded-xl border border-border/60 bg-background/50 space-y-2.5">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                Dates of Study / Graduation
                              </span>
                              
                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-foreground bg-primary/10 hover:bg-primary/15 border border-primary/20 px-2.5 py-1 rounded-lg transition-colors">
                                <input
                                  type="checkbox"
                                  checked={eduCurrent}
                                  onChange={(e) => handleUpdateEducationDate(edu.id, 'current', e.target.checked)}
                                  className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                                />
                                <span className="font-medium text-[11px]">Currently Enrolled / Studying</span>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-[11px] font-semibold text-muted-foreground">Start Date</Label>
                                <MonthYearPicker
                                  id={`edu-start-date-${edu.id}`}
                                  value={eduStartDate || ''}
                                  onChange={(val) => handleUpdateEducationDate(edu.id, 'startDate', val)}
                                  placeholder="Select Start Date"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-[11px] font-semibold text-muted-foreground">End Date / Graduation</Label>
                                {eduCurrent ? (
                                  <div className="h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 flex items-center gap-2 text-xs text-emerald-400 font-medium select-none">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Present (Expected - Ongoing)</span>
                                  </div>
                                ) : (
                                  <MonthYearPicker
                                    id={`edu-end-date-${edu.id}`}
                                    value={eduEndDate || ''}
                                    onChange={(val) => handleUpdateEducationDate(edu.id, 'endDate', val)}
                                    placeholder="Select Graduation Date"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="text-[10.5px] text-muted-foreground flex items-center justify-between pt-0.5 border-t border-border/40">
                              <span>Resume display format:</span>
                              <span className="font-semibold text-foreground px-2 py-0.5 bg-muted/60 rounded border border-border/60">
                                {edu.year || (eduCurrent ? 'Present' : 'Not set')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab 5: Sections & Layout Order Manager */}
            {activeTab === 'layout' && (
              <Card className="border-border/80 shadow-sm animate-in fade-in duration-200">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                        <span>Resume Sections & Module Order</span>
                      </CardTitle>
                      <CardDescription>
                        Reorder sections up and down to prioritize key content or adjust page flow.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const defaultOrder = ['summary', 'experience', 'projects', 'skills', 'education'];
                        setSectionOrder(defaultOrder);
                        setPageBreaks({});
                        setHiddenSections({});
                        saveDraftToStorage(null, defaultOrder, {}, {});
                        toast.success('Section order reset to default layout');
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground h-8 cursor-pointer"
                    >
                      Reset Layout
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-4">
                  <div className="text-[11.5px] p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">Pro Tip for Section Layout:</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Reorder sections to prioritize your strongest credentials and adjust document flow. Use <strong>Move Up (▲)</strong> and <strong>Move Down (▼)</strong> to change order, or toggle visibility with the eye icon.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sectionOrder.map((secKey, idx) => {
                      const meta = {
                        summary: { label: 'Professional Summary', icon: FileText, desc: 'Overview of your background, experience, and key value' },
                        experience: { label: 'Work Experience', icon: Briefcase, desc: `${resumeData.experiences?.length || 0} position(s) with achievements & impact` },
                        projects: { label: 'Featured Projects', icon: FolderGit2, desc: `${resumeData.projects?.length || 0} notable application(s) or technical projects` },
                        skills: { label: 'Skills & Proficiencies', icon: Wrench, desc: `${resumeData.skills?.length || 0} technical proficiencies & core competencies` },
                        education: { label: 'Education & Academics', icon: Type, desc: `${resumeData.education?.length || 0} degree(s) & university qualifications` },
                      }[secKey] || { label: secKey, icon: FileText, desc: 'Resume section' };

                      const IconComponent = meta.icon;
                      const isHidden = Boolean(hiddenSections[secKey]);

                      return (
                        <div
                          key={secKey}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                            isHidden
                              ? 'opacity-50 border-dashed border-border/60 bg-muted/20'
                              : 'border-border/80 bg-card shadow-xs hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center text-xs font-bold font-mono text-muted-foreground shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-foreground">{meta.label}</span>
                                {isHidden && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{meta.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={() => handleMoveSectionUp(secKey)}
                              disabled={idx === 0}
                              className="h-8 w-8 rounded-xl border border-border/80 hover:bg-muted disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-foreground transition-colors cursor-pointer"
                              title="Move section up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={() => handleMoveSectionDown(secKey)}
                              disabled={idx === sectionOrder.length - 1}
                              className="h-8 w-8 rounded-xl border border-border/80 hover:bg-muted disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-foreground transition-colors cursor-pointer"
                              title="Move section down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>

                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleSectionVisibility(secKey)}
                              className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                                isHidden
                                  ? 'border-border/60 text-muted-foreground hover:text-foreground'
                                  : 'border-border/80 text-foreground hover:bg-muted'
                              }`}
                              title={isHidden ? "Show section on resume" : "Hide section from resume"}
                            >
                              {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        {/* Right Column: Live Printable Resume Preview (Expansive Canvas in Rounded Card, Independent Scroll) */}
        <div className={cn(
          "lg:col-span-7 xl:col-span-7 h-full flex flex-col min-h-0 rounded-2xl border border-border/80 bg-slate-950/70 dark:bg-slate-950 shadow-xl overflow-hidden relative",
          mobileStudioView === 'editor' && "hidden lg:flex"
        )}>
          {/* Canvas Sub-Header */}
          <div className="h-11 sm:h-12 shrink-0 border-b border-border/60 px-2.5 sm:px-4 flex items-center justify-between gap-1.5 text-xs text-muted-foreground z-10 bg-card/40 backdrop-blur-md">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Mobile Back to Edit Button */}
              <button
                type="button"
                onClick={() => setMobileStudioView('editor')}
                className="lg:hidden h-7.5 px-2 rounded-lg border border-border/70 text-foreground bg-muted/60 hover:bg-muted font-semibold text-xs flex items-center gap-1 shrink-0"
                title="Back to Editor"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>

              <div className="flex items-center gap-1.5 min-w-0">
                <Eye className="h-3.5 w-3.5 text-primary shrink-0 hidden sm:inline" />
                <span className="font-bold text-foreground truncate hidden sm:inline">Live ATS Preview</span>
                <span className="font-bold text-foreground text-xs truncate sm:hidden">Preview</span>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] shrink-0 font-mono whitespace-nowrap px-1.5 py-0.5 ${
                    totalPages === 1 
                      ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' 
                      : 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
                  }`}
                >
                  {totalPages}p
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Mobile Quick Zoom Pill (Fit & 100% toggle) */}
              <div className="flex sm:hidden items-center gap-1 bg-muted/60 px-1 py-0.5 rounded-lg border border-border/70 text-[11px]">
                <button
                  type="button"
                  onClick={handleFitZoom}
                  className={`px-2 py-0.5 rounded font-semibold text-[10px] transition-all ${
                    isAutoFit
                      ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Fit to phone width"
                >
                  Fit
                </button>
                <button
                  type="button"
                  onClick={() => handleSetManualZoom(1.0)}
                  className={`px-2 py-0.5 rounded font-semibold text-[10px] transition-all ${
                    !isAutoFit && Math.abs(zoomLevel - 1.0) < 0.04
                      ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="100% full scale"
                >
                  100%
                </button>
              </div>

              {/* Desktop Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded-lg border border-border/70 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoFit(false);
                    setZoomLevel((z) => Math.max(0.35, +(z - 0.05).toFixed(2)));
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3 w-3" />
                </button>

                {[
                  { label: '75%', val: 0.75 },
                  { label: '90%', val: 0.90 },
                  { label: '100%', val: 1.0 },
                ].map((zp) => (
                  <button
                    key={zp.label}
                    type="button"
                    onClick={() => handleSetManualZoom(zp.val)}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      !isAutoFit && Math.abs(zoomLevel - zp.val) < 0.04
                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {zp.label}
                  </button>
                ))}

                {/* Auto-Fit Page Button */}
                <button
                  type="button"
                  onClick={handleFitZoom}
                  className={`px-1.5 py-0.5 rounded transition-all font-semibold ${
                    isAutoFit
                      ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Fit entire A4 page to screen height"
                >
                  Fit
                </button>

                <span className="text-[10px] text-muted-foreground px-1 font-mono hidden sm:inline-block">
                  {Math.round(zoomLevel * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsAutoFit(false);
                    setZoomLevel((z) => Math.min(1.25, +(z + 0.05).toFixed(2)));
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3 w-3" />
                </button>
              </div>

              {/* Fullscreen Preview */}
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="p-1.5 rounded-lg border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
                title="Fullscreen Preview"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>

              <span className="text-[11px] text-muted-foreground hidden xl:inline ml-1">
                Template: <strong className="text-foreground font-semibold">{activeTemplate?.name || selectedTemplate}</strong>
              </span>
            </div>
          </div>

              {/* Document Viewport Canvas (Independent Smooth Scroll) */}
              <div 
                ref={previewCanvasRef}
                id="printableResumeContainer"
                className="flex-1 overflow-auto p-2.5 sm:p-4 lg:p-5 flex justify-center items-start relative select-none scrollbar-thin"
              >
                {/* Offscreen Clean Measurement Mirror — 100% Unspaced, Static & Deterministic to eliminate shaking */}
                <div
                  ref={measureContainerRef}
                  style={{
                    position: 'absolute',
                    left: '-99999px',
                    top: 0,
                    width: `${a4Width}px`,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    zIndex: -999,
                  }}
                  aria-hidden="true"
                >
                  <ResumeRenderer
                    template={activeTemplate}
                    data={normalizedResumeData}
                    scale={1}
                    spacers={{}}
                  />
                </div>

                {activeTemplate ? (
                  <div
                    style={{
                      width: `${a4Width * zoomLevel}px`,
                    }}
                    className="relative shrink-0 flex flex-col items-center gap-4 sm:gap-6 transition-all duration-150 py-1"
                  >
                    {Array.from({ length: totalPages }).map((_, pageIdx) => (
                      <div
                        key={pageIdx}
                        style={{
                          width: `${a4Width * zoomLevel}px`,
                          height: `${a4Height * zoomLevel}px`,
                          backgroundColor: activeTemplate?.design_config?.backgroundColor || '#ffffff',
                        }}
                        className="relative overflow-hidden shadow-2xl rounded-none border border-slate-300/80 dark:border-slate-800 transition-all duration-150"
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: `-${pageIdx * a4Height * zoomLevel}px`,
                            left: 0,
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: 'top left',
                            width: `${a4Width}px`,
                          }}
                        >
                          <div>
                            <ResumeRenderer
                              template={activeTemplate}
                              data={normalizedResumeData}
                              scale={1}
                              spacers={autoBreakSpacers}
                              minHeight={`${totalPages * a4Height}px`}
                              className="shadow-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-[650px] flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-card/60 rounded-2xl border border-dashed border-border/80 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-muted/80 text-muted-foreground">
                      <Palette className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">No Published Template Available</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        {templatesError 
                          ? 'Failed to connect to template service. Please check your connection or reload the page.' 
                          : 'There are currently no published templates available to preview.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
        </div>

      </div>
    </div>

        {/* Fullscreen Document Preview Modal with True Multi-Page Support */}
        {isFullScreen && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col animate-in fade-in duration-150">
            <div className="h-14 border-b border-border/80 px-6 flex items-center justify-between text-foreground bg-card">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{activeTemplate?.name || 'Resume'} — Live A4 Preview</span>
                <Badge variant="outline" className="text-xs font-mono text-primary">
                  {totalPages} {totalPages === 1 ? 'Page' : 'Pages'} (A4)
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  variant="gradient"
                  onClick={handleDirectDownload}
                  disabled={isDownloading}
                  className="h-8 text-xs gap-1.5 shadow-xs"
                >
                  {isDownloading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Close Fullscreen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start bg-slate-950/60">
              <div
                style={{ width: `${a4Width * 0.9}px` }}
                className="flex flex-col items-center gap-8 transition-all duration-150 py-4"
              >
                {Array.from({ length: totalPages }).map((_, pageIdx) => (
                  <div
                    key={pageIdx}
                    style={{
                      width: `${a4Width * 0.9}px`,
                      height: `${a4Height * 0.9}px`,
                      backgroundColor: activeTemplate?.design_config?.backgroundColor || '#ffffff',
                    }}
                    className="relative overflow-hidden shadow-2xl rounded-none border border-slate-300 dark:border-slate-800 transition-all duration-150"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: `-${pageIdx * a4Height * 0.9}px`,
                        left: 0,
                        transform: 'scale(0.9)',
                        transformOrigin: 'top left',
                        width: `${a4Width}px`,
                      }}
                    >
                      <ResumeRenderer
                        template={activeTemplate}
                        data={normalizedResumeData}
                        scale={1}
                        spacers={autoBreakSpacers}
                        minHeight={`${totalPages * a4Height}px`}
                        className="shadow-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen / Dialog: Explore All 100+ Templates */}
        <Dialog open={showAllTemplatesModal} onOpenChange={setShowAllTemplatesModal}>
          <DialogContent className="max-w-5xl max-h-[88vh] flex flex-col p-6 rounded-3xl bg-card border-border shadow-2xl">
            <DialogHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <span>Browse All Resume Templates ({apiTemplates.length})</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Filter by layout, industry, or search to switch your resume design instantly without losing data.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Filter & Search inside Modal */}
            <div className="py-3 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search 100+ templates (e.g. Minimalist, Executive, Tech, Single-Column)..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
                {dynamicTemplateCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      templateCategoryFilter === cat
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid inside Modal */}
            <div className="flex-1 overflow-y-auto max-h-[55vh] pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {filteredTemplates.map((tpl) => {
                  const isSelected = selectedTemplate === (tpl.code || tpl.id) || selectedTemplate === tpl.id;
                  const primaryColor = tpl.design_config?.primaryColor || tpl.accent || '#3B82F6';
                  const columns = tpl.layout_config?.columns || 1;

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl.code || tpl.id);
                        setSelectedTemplateObj(tpl);
                        if (primaryColor) setAccentColor(primaryColor);
                        // Sync customDesign with new template's design_config
                        const dc = tpl.design_config || {};
                        setCustomDesign(prev => ({
                          ...prev,
                          primaryColor: dc.primaryColor || primaryColor || prev.primaryColor,
                          accentColor: dc.accentColor || primaryColor || prev.accentColor,
                          headingColor: dc.headingColor || prev.headingColor,
                          backgroundColor: dc.backgroundColor || '#ffffff',
                          sidebarBackgroundColor: dc.sidebarBackgroundColor || '#f8fafc',
                          fontFamily: dc.fontFamily || "'Inter', sans-serif",
                          headingFontFamily: dc.headingFontFamily || dc.fontFamily || "'Inter', sans-serif",
                          fontSize: dc.fontSize || '10pt',
                        }));
                        const matchedPalette = COLOR_PRESETS.find(p => p.primary === (dc.primaryColor || primaryColor));
                        if (matchedPalette) setSelectedPalette(matchedPalette.name);
                        setShowAllTemplatesModal(false);
                        toast.success(`Switched to "${tpl.name}" template`);
                      }}
                      className={`group relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/10 shadow-md'
                          : 'border-border/80 bg-background/60 hover:border-primary/50 hover:bg-background'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors block">
                              {tpl.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground mt-1">
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/70">
                                {tpl.category || 'General'}
                              </Badge>
                              <span>•</span>
                              <span>{columns === 2 ? '2 Columns' : '1 Column (ATS)'}</span>
                            </div>
                          </div>
                          <span
                            className="h-4 w-4 rounded-full border border-background shadow-xs shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          />
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {tpl.description || 'Clean, recruiter-approved ATS layout optimized for resume parsing.'}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-primary">
                          {isSelected ? '✓ Currently Active' : 'Click to Apply'}
                        </span>
                        <Button size="sm" variant={isSelected ? "default" : "outline"} className="h-7 text-xs rounded-lg pointer-events-none">
                          {isSelected ? 'Selected' : 'Use'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Download Options Dialog */}
        <Dialog open={showDownloadChoiceModal} onOpenChange={setShowDownloadChoiceModal}>
          <DialogContent className="sm:max-w-md bg-card border-border/80">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <ArrowDownToLine className="h-5 w-5 text-primary" />
                Export & Download Options
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Generate a recruiter-ready A4 PDF formatted specifically for automated ATS screeners.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-3 py-3">
              {/* Option A: Direct Download */}
              <div 
                onClick={!(isDownloading || isSaveDownloading || isSaving) ? () => handleDirectDownload() : undefined}
                className={`group relative flex flex-col p-4 rounded-2xl border border-border/80 bg-muted/40 transition-all ${
                  isDownloading || isSaveDownloading || isSaving
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-primary/5 hover:border-primary/40 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Just Download PDF</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Direct high-speed download. No account or save required.
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={isDownloading || isSaveDownloading || isSaving}
                    className="h-8 text-xs font-semibold gap-1.5 pointer-events-none"
                  >
                    {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Download'}
                  </Button>
                </div>
              </div>

              {/* Option B: Save & Download */}
              <div 
                onClick={!(isDownloading || isSaveDownloading || isSaving) ? handleSaveAndDownload : undefined}
                className={`group relative flex flex-col p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-all ${
                  isDownloading || isSaveDownloading || isSaving
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-indigo-500/60 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                      <FolderCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">Save & Download</h4>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary border-primary/20">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAuthenticated 
                          ? 'Saves this resume to your dashboard and delivers your PDF.'
                          : 'Sign in to save this resume against your account & download.'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="gradient" 
                    disabled={isSaving || isSaveDownloading || isDownloading}
                    className="h-8 text-xs font-semibold gap-1.5 pointer-events-none"
                  >
                    {isSaving || isSaveDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      'Save & Download'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-start items-center pt-2 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground">
                All PDFs rendered in native vector A4 standard.
              </span>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Locked Pro Styling Modal */}
        <Dialog open={lockedModal.open} onOpenChange={(open) => setLockedModal(prev => ({ ...prev, open }))}>
          <DialogContent className="sm:max-w-md bg-card border-border/80">
            <DialogHeader>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center mb-2 text-amber-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span>Unlock Pro Styling</span>
                <Badge variant="secondary" className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold">PRO</Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                <span className="font-semibold text-foreground">{lockedModal.title}</span> is an exclusive style reserved for Pro and Premium members. Upgrade to get full unlimited access to all designer fonts, executive color schemes, and AI enhancements.
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-2 my-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>All 7 Designer Font Families (Outfit, Merriweather, etc.)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Executive Dark Themes & Luxury Palettes</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Unlimited Unbranded ATS PDF Exports</span>
              </div>
            </div>

            <DialogFooter className="sm:justify-between items-center gap-2 pt-2 border-t border-border/60">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLockedModal(prev => ({ ...prev, open: false }))} 
                className="text-xs"
              >
                Continue with Free
              </Button>
              <Link to="/pricing">
                <Button 
                  variant="gradient" 
                  size="sm" 
                  className="text-xs font-bold gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>View Pricing & Upgrade</span>
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
  );
}
