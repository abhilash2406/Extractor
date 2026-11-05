import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
  FolderOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  LayoutDashboard,
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
  EyeOff,
  History,
  RotateCcw,
  Copy,
  Clock,
  Info,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
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
import { 
  saveResume, 
  updateResume, 
  downloadResumePdf, 
  getResumeById,
  getLatestResume,
  getResumeUsage,
  getResumeVersions,
  restoreResumeVersion,
  getMyResumes
} from '@/api/resumes.api';
import moment from 'moment';
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

import { 
  FONT_OPTIONS, 
  FONT_CATEGORIES, 
  FEATURED_FONTS, 
  loadGoogleFont 
} from '@/constants/fonts';
export { FONT_OPTIONS };

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

export const DEFAULT_RESUME_DATA = {
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
};

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Font Gallery Modal, Search & Filter States (supports 50+ typography styles)
  const [showFontModal, setShowFontModal] = useState(false);
  const [isFontBrowserExpanded, setIsFontBrowserExpanded] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const [fontCategoryFilter, setFontCategoryFilter] = useState('All');

  // Resume persistence & export states
  const [resumeTitle, setResumeTitle] = useState('My Professional Resume');
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaveDownloading, setIsSaveDownloading] = useState(false);
  const [showDownloadChoiceModal, setShowDownloadChoiceModal] = useState(false);

  // Download Modal Animated Progress & Phase States (in-modal progress bar, no toaster)
  const [downloadPhase, setDownloadPhase] = useState('idle'); // 'idle' | 'generating' | 'success' | 'error'
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatusText, setDownloadStatusText] = useState('Preparing resume PDF...');
  const [downloadErrorMsg, setDownloadErrorMsg] = useState('');
  const progressTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const { user, isAuthenticated } = useAuthStore();
  const isProUser = Boolean(isAuthenticated && (user?.plan_code === 'PRO' || user?.plan_code === 'PREMIUM'));

  // Resume Usage & Free Tier Limit (Max 3 resumes on Free plan)
  const [resumeUsage, setResumeUsage] = useState({ count: 0, limit: 3, isPro: false, planCode: 'FREE', canCreate: true });
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false);

  // All user resumes to detect duplicates and enforce unique names
  const [userResumes, setUserResumes] = useState([]);

  // Save as New Resume Modal
  const [showSaveAsNewModal, setShowSaveAsNewModal] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [isSavingAsNew, setIsSavingAsNew] = useState(false);

  // Version History Modal
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringVersionId, setRestoringVersionId] = useState(null);

  // Module order, custom section visibility & page breaks
  const [sectionOrder, setSectionOrder] = useState([
    'summary', 'experience', 'projects', 'skills', 'education'
  ]);
  const [pageBreaks, setPageBreaks] = useState({});
  const [hiddenSections, setHiddenSections] = useState({});
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
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);

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
  // Users can view and apply ANY color or font to their resume in real-time (preview mode).
  // If a paid Pro styling is selected, proceeding (download/save) is gated for non-Pro users.
  const handleSelectPalette = (preset) => {
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
    loadGoogleFont(f.value);
    setCustomDesign(prev => ({
      ...prev,
      fontFamily: f.value,
      headingFontFamily: f.value,
    }));
  };

  const activeFont = useMemo(() => {
    return FONT_OPTIONS.find(f => f.value === customDesign.fontFamily) || FONT_OPTIONS[0];
  }, [customDesign.fontFamily]);

  const filteredFonts = useMemo(() => {
    const q = fontSearch.trim().toLowerCase();
    return FONT_OPTIONS.filter((f) => {
      const matchesSearch = !q || 
        f.name.toLowerCase().includes(q) || 
        f.label.toLowerCase().includes(q) || 
        f.category.toLowerCase().includes(q) || 
        f.subLabel.toLowerCase().includes(q);
      const matchesCategory = 
        fontCategoryFilter === 'All' ? true :
        fontCategoryFilter === 'Free' ? !f.isPro :
        f.category.toLowerCase() === fontCategoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [fontSearch, fontCategoryFilter]);

  // Dynamically prefetch visible Google Fonts when browsing modal or inline sidebar explorer
  useEffect(() => {
    if (showFontModal || isFontBrowserExpanded) {
      filteredFonts.slice(0, 30).forEach((f) => loadGoogleFont(f.value));
    }
  }, [showFontModal, isFontBrowserExpanded, filteredFonts]);

  // Determine if active design uses paid / Pro features
  const activePreset = useMemo(() => {
    return COLOR_PRESETS.find(p => p.name === selectedPalette || (p.primary === accentColor && p.sidebarBg === customDesign.sidebarBackgroundColor));
  }, [selectedPalette, accentColor, customDesign.sidebarBackgroundColor]);

  const activeProPalette = activePreset?.isPro ? activePreset : null;
  const activeProFont = activeFont?.isPro ? activeFont : null;
  const isUsingProStyling = Boolean(!isProUser && (activeProPalette || activeProFont));

  const proStylingTitle = useMemo(() => {
    return [
      activeProPalette?.name && `${activeProPalette.name} Theme`,
      activeProFont?.label && `${activeProFont.label} Font`
    ].filter(Boolean).join(' and ');
  }, [activeProPalette, activeProFont]);

  // Revert back to default free theme and font
  const handleRevertFreeStyling = useCallback(() => {
    const defaultPalette = COLOR_PRESETS[0]; // Azure Tech
    const defaultFont = FONT_OPTIONS[0]; // Inter
    setSelectedPalette(defaultPalette.name);
    setAccentColor(defaultPalette.primary);
    setCustomDesign(prev => ({
      ...prev,
      primaryColor: defaultPalette.primary,
      accentColor: defaultPalette.accent,
      headingColor: defaultPalette.heading,
      backgroundColor: defaultPalette.bg,
      sidebarBackgroundColor: defaultPalette.sidebarBg,
      fontFamily: defaultFont.value,
      headingFontFamily: defaultFont.value,
    }));
    toast.success('Reverted to free standard styling');
  }, []);

  // Gate proceeding (Download PDF or Save) when using paid Pro styling on free tier
  const checkProStylingGate = useCallback((actionType = 'download') => {
    if (isUsingProStyling) {
      setLockedModal({
        open: true,
        title: proStylingTitle || 'Pro Styling',
        type: actionType,
      });
      return true; // blocked
    }
    return false; // allowed
  }, [isUsingProStyling, proStylingTitle]);

  const handleSelectFontSize = (sizeId) => {
    setCustomDesign(prev => ({
      ...prev,
      fontSize: sizeId,
    }));
  };

  const currentSizeIndex = FONT_SIZE_OPTIONS.findIndex(
    (fs) => fs.id === (customDesign.fontSize || '10pt')
  );
  const safeSizeIndex = currentSizeIndex === -1 ? 6 : currentSizeIndex;
  const currentSize = FONT_SIZE_OPTIONS[safeSizeIndex] || FONT_SIZE_OPTIONS[6];

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

  // Helper to apply loaded resume data cleanly into component state
  const applyResumeToState = useCallback((data) => {
    if (!data) return;
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
        setCustomDesign((prev) => ({ ...prev, ...data.content.design_config }));
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
  }, []);

  // Refresh resume usage info (count, free limit max 3, isPro)
  const refreshResumeUsage = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getResumeUsage();
      if (res.data?.data) {
        setResumeUsage(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load resume usage statistics', err);
    }
  }, [isAuthenticated]);

  // Fetch all user resumes to detect and prevent duplicate titles
  const refreshUserResumes = useCallback(async () => {
    if (!isAuthenticated) {
      setUserResumes([]);
      return;
    }
    try {
      const res = await getMyResumes({ limit: 50 });
      const list = res.data?.data || [];
      setUserResumes(list);
    } catch (err) {
      console.warn('Could not load user resumes for duplicate validation', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshResumeUsage();
      refreshUserResumes();
    } else {
      setUserResumes([]);
    }
  }, [isAuthenticated, refreshResumeUsage, refreshUserResumes]);

  // Helper to suggest unique resume titles (e.g. "My Professional Resume (Copy)")
  const getNextAvailableTitle = useCallback((baseTitle, list = []) => {
    const raw = (baseTitle || 'My Professional Resume').trim();
    const cleanBase = raw.replace(/\s*\(Copy(\s+\d+)?\)$/i, '').trim() || 'My Professional Resume';
    const isTaken = (name) => list.some((r) => r.title?.trim().toLowerCase() === name.trim().toLowerCase());

    let candidate = `${cleanBase} (Copy)`;
    if (!isTaken(candidate)) return candidate;
    let counter = 2;
    while (isTaken(`${cleanBase} (Copy ${counter})`)) {
      counter++;
    }
    return `${cleanBase} (Copy ${counter})`;
  }, []);

  // Title duplicate validations
  const isDuplicateSaveAsNewTitle = useMemo(() => {
    const trimmed = newResumeTitle.trim().toLowerCase();
    if (!trimmed) return false;
    return userResumes.some((r) => r.title?.trim().toLowerCase() === trimmed);
  }, [newResumeTitle, userResumes]);

  const isHeaderTitleDuplicate = useMemo(() => {
    if (!isAuthenticated) return false;
    const trimmed = (resumeTitle || '').trim().toLowerCase();
    if (!trimmed) return false;
    return userResumes.some(
      (r) => (!savedResumeId || r.id !== savedResumeId) && r.title?.trim().toLowerCase() === trimmed
    );
  }, [isAuthenticated, resumeTitle, userResumes, savedResumeId]);

  // Load versions history for the current saved resume
  const loadVersionHistory = useCallback(async (resumeId) => {
    if (!resumeId || !isAuthenticated) return;
    setLoadingVersions(true);
    try {
      const res = await getResumeVersions(resumeId);
      setVersionList(res.data?.data || []);
    } catch (err) {
      console.warn('Could not load version history', err);
    } finally {
      setLoadingVersions(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (savedResumeId && isAuthenticated) {
      loadVersionHistory(savedResumeId);
    }
  }, [savedResumeId, isAuthenticated, loadVersionHistory]);

  // Load Resume on page enter:
  // 1. If explicit resumeId in URL, load it.
  // 2. If NO ID in URL and user is logged in, show their latest (last edited) resume so they can edit or save as new.
  // 3. For users without a saved resume or guests, restore draft from localStorage or show default.
  useEffect(() => {
    let isMounted = true;

    const initResume = async () => {
      // Case 1: Specific resume ID requested in URL
      if (resumeIdParam) {
        try {
          const res = await getResumeById(resumeIdParam);
          const data = res.data?.data;
          if (data && isMounted) {
            applyResumeToState(data);
          }
        } catch (err) {
          console.error('Failed to load saved resume by ID', err);
          toast.error('Could not load requested resume');
        }
        return;
      }

      // Case 2: User is authenticated and opened resume builder without an ID:
      // Show their latest (last edited one) so they can edit it or save as new.
      if (isAuthenticated) {
        try {
          const res = await getLatestResume();
          const latest = res.data?.data;
          if (latest && isMounted) {
            applyResumeToState(latest);
            setSearchParams({ id: latest.id }, { replace: true });
            return;
          }
        } catch (err) {
          console.warn('Could not fetch latest resume, falling back to local draft', err);
        }
      }

      // Case 3: Users without a saved resume or guests:
      // Always show standard clean sample resume and purge any old localStorage drafts
      try {
        localStorage.removeItem('extractor_resume_draft');
      } catch (e) {}

      if (!resumeIdParam) {
        setSavedResumeId(null);
        setResumeTitle('My Professional Resume');
        setResumeData(DEFAULT_RESUME_DATA);
        setSectionOrder(['summary', 'experience', 'projects', 'skills', 'education']);
        setPageBreaks({});
        setHiddenSections({});
      }
    };

    initResume();
    return () => { isMounted = false; };
  }, [resumeIdParam, isAuthenticated, applyResumeToState, setSearchParams]);

  // No-op helper: drafts are not persisted to localStorage for unauthenticated sessions
  const saveDraftToStorage = () => {};

  const { openAuthModal } = useAuthModalStore();

  // Core save to backend API
  const executeSaveToBackend = async (dataToSave = resumeData, titleToSave = resumeTitle) => {
    if (checkProStylingGate('save')) return null;
    setIsSaving(true);
    try {
      const trimmedTitle = (titleToSave || '').trim() || `${dataToSave.fullName || 'My'} Resume`;

      // Prevent saving with a duplicate title across user's other resumes
      if (isAuthenticated) {
        const hasDuplicate = userResumes.some(
          (r) => (!savedResumeId || r.id !== savedResumeId) && r.title?.trim().toLowerCase() === trimmedTitle.toLowerCase()
        );
        if (hasDuplicate) {
          toast.error(`You already have a resume named "${trimmedTitle}". Please choose a different name.`);
          setIsSaving(false);
          return null;
        }
      }

      const payload = {
        title: trimmedTitle,
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
        toast.success('Resume updated & version saved!');
        loadVersionHistory(savedResumeId);
        refreshUserResumes();
      } else {
        // Enforce max 3 resumes on free plan
        if (!resumeUsage.isPro && resumeUsage.count >= resumeUsage.limit) {
          setShowLimitExceededModal(true);
          return null;
        }
        res = await saveResume(payload);
        const newResume = res.data?.data;
        const newId = newResume?.id;
        if (newId) {
          setSavedResumeId(newId);
          setSearchParams({ id: newId }, { replace: true });
          loadVersionHistory(newId);
        }
        toast.success('Resume saved to your account!');
        refreshResumeUsage();
        refreshUserResumes();
      }
      saveDraftToStorage();
      return res.data?.data;
    } catch (err) {
      console.error('Failed to save resume', err);
      if (err.response?.status === 403 && (err.response?.data?.name === 'LimitReached' || err.response?.data?.message?.includes('limit'))) {
        setShowLimitExceededModal(true);
      } else {
        toast.error(err.response?.data?.message || 'Failed to save resume. Please try again.');
      }
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save Resume Button Click
  const handleSaveClick = () => {
    if (checkProStylingGate('save')) return;
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

  // Handle Save As New Resume
  const handleOpenSaveAsNew = () => {
    if (checkProStylingGate('save')) return;
    if (!isAuthenticated) {
      toast('Please sign in to save a new resume to your account.', { icon: '🔒' });
      openAuthModal('login');
      return;
    }
    if (!resumeUsage.isPro && resumeUsage.count >= resumeUsage.limit) {
      setShowLimitExceededModal(true);
      return;
    }
    const suggestedTitle = getNextAvailableTitle(resumeTitle, userResumes);
    setNewResumeTitle(suggestedTitle);
    setShowSaveAsNewModal(true);
  };

  const handleConfirmSaveAsNew = async () => {
    const trimmedTitle = newResumeTitle.trim();
    if (!trimmedTitle) {
      toast.error('Please enter a title for the new resume');
      return;
    }

    // Check for duplicate title
    const hasDuplicate = userResumes.some(
      (r) => r.title?.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (hasDuplicate) {
      toast.error(`A resume named "${trimmedTitle}" already exists. Please choose a different name.`);
      return;
    }

    setIsSavingAsNew(true);
    try {
      const payload = {
        title: trimmedTitle,
        template_id: activeTemplate?.id || selectedTemplate,
        content: {
          ...resumeData,
          sectionOrder,
          pageBreaks,
          hiddenSections,
          photo: resumeData.photo || resumeData.photo_url || '',
          photo_url: resumeData.photo_url || resumeData.photo || '',
          design_config: customDesign,
        },
      };

      const res = await saveResume(payload);
      const newResume = res.data?.data;
      if (newResume) {
        setSavedResumeId(newResume.id);
        setResumeTitle(newResume.title);
        setSearchParams({ id: newResume.id }, { replace: true });
        toast.success(`Saved as new resume: "${newResume.title}"!`);
        setShowSaveAsNewModal(false);
        refreshResumeUsage();
        refreshUserResumes();
        loadVersionHistory(newResume.id);
      }
    } catch (err) {
      console.error('Failed to save as new resume', err);
      if (err.response?.status === 403 && (err.response?.data?.name === 'LimitReached' || err.response?.data?.message?.includes('limit'))) {
        setShowSaveAsNewModal(false);
        setShowLimitExceededModal(true);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create new resume.');
      }
    } finally {
      setIsSavingAsNew(false);
    }
  };

  // Handle Version History Modal Open
  const handleOpenVersionHistory = () => {
    if (!savedResumeId) {
      toast('Save your resume first to view and manage its version history.', { icon: 'ℹ️' });
      return;
    }
    setShowVersionHistoryModal(true);
    loadVersionHistory(savedResumeId);
  };

  // Handle Restore Specific Version Snapshot
  const handleRestoreVersion = async (version) => {
    if (!savedResumeId || !version) return;
    setRestoringVersionId(version.id);
    try {
      const res = await restoreResumeVersion(savedResumeId, version.id);
      const restored = res.data?.data?.resume || res.data?.data;
      if (restored) {
        applyResumeToState(restored);
        toast.success(`Restored Version ${version.version_number} successfully!`, {
          icon: '🔄',
        });
        loadVersionHistory(savedResumeId);
        refreshUserResumes();
        setShowVersionHistoryModal(false);
      }
    } catch (err) {
      console.error('Failed to restore version', err);
      toast.error(err.response?.data?.message || 'Failed to restore this version');
    } finally {
      setRestoringVersionId(null);
    }
  };

  // Handle switching to a different saved resume
  const handleSwitchResume = (targetResume) => {
    if (!targetResume) return;
    if (targetResume.id === savedResumeId) {
      toast('You are already editing this resume.', { icon: 'ℹ️' });
      return;
    }
    setSearchParams({ id: targetResume.id });
    toast.success(`Switched to "${targetResume.title || 'Resume'}"`);
  };

  // Handle starting a fresh new resume
  const handleCreateNewResume = () => {
    if (!resumeUsage.isPro && resumeUsage.count >= resumeUsage.limit) {
      setShowLimitExceededModal(true);
      return;
    }
    setSavedResumeId(null);
    setSearchParams({}, { replace: true });
    setResumeTitle(getNextAvailableTitle('My Professional Resume', userResumes));
    setResumeData(DEFAULT_RESUME_DATA);
    setSectionOrder(['summary', 'experience', 'projects', 'skills', 'education']);
    setPageBreaks({});
    setHiddenSections({});
    setVersionList([]);
    toast.success('Started a fresh new resume!');
  };

  // Progress bar management for in-modal downloading (replaces annoying toast popups)
  const startDownloadProgress = (initialText = 'Connecting to PDF rendering engine...') => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setShowDownloadChoiceModal(true);
    setDownloadPhase('generating');
    setDownloadProgress(14);
    setDownloadStatusText(initialText);
    setDownloadErrorMsg('');

    let current = 14;
    progressTimerRef.current = setInterval(() => {
      current += Math.max(1, Math.floor((92 - current) * 0.16));
      if (current >= 92) {
        current = 92;
        setDownloadStatusText('Finalizing vector ATS document...');
      } else if (current > 65) {
        setDownloadStatusText('Rendering ATS-compliant A4 pages...');
      } else if (current > 35) {
        setDownloadStatusText('Compiling custom design, fonts & layout...');
      } else {
        setDownloadStatusText(initialText);
      }
      setDownloadProgress(current);
    }, 180);
  };

  const finishDownloadProgress = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setDownloadProgress(100);
    setDownloadStatusText('PDF generated successfully!');
    setDownloadPhase('success');

    // Auto-close modal after brief completion animation
    setTimeout(() => {
      setShowDownloadChoiceModal(false);
      setTimeout(() => {
        setDownloadPhase('idle');
        setDownloadProgress(0);
        setDownloadStatusText('');
      }, 350);
    }, 1300);
  };

  const failDownloadProgress = (errMsg) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setDownloadPhase('error');
    setDownloadErrorMsg(errMsg || 'Failed to generate PDF. Please try again.');
  };

  // Handle Direct PDF Download from Backend (Puppeteer)
  const handleDirectDownload = async ({ fromSaveAndDownload = false } = {}) => {
    if (checkProStylingGate('download')) return;
    if (isDownloading || isSaveDownloading) return;
    if (fromSaveAndDownload) {
      setIsSaveDownloading(true);
    } else {
      setIsDownloading(true);
    }
    startDownloadProgress('Preparing high-resolution ATS PDF...');
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

      finishDownloadProgress();
    } catch (err) {
      console.error('Failed to download PDF', err);
      failDownloadProgress(err.response?.data?.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
      setIsSaveDownloading(false);
    }
  };

  // Handle Save & Download Combined
  const handleSaveAndDownload = async () => {
    if (checkProStylingGate('download')) return;
    if (isSaving || isSaveDownloading) return;
    saveDraftToStorage();

    if (!isAuthenticated) {
      toast('Please sign in to save your resume to your account.', { icon: '🔒' });
      openAuthModal('login', async () => {
        try {
          await executeSaveToBackend();
          await handleDirectDownload({ fromSaveAndDownload: true });
        } catch (e) {
          failDownloadProgress('Save failed. Could not proceed with download.');
        }
      });
      return;
    }

    try {
      startDownloadProgress('Saving changes and preparing PDF...');
      await executeSaveToBackend();
      await handleDirectDownload({ fromSaveAndDownload: true });
    } catch (e) {
      failDownloadProgress(e.response?.data?.message || e.message || 'Failed to save and generate PDF.');
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
                  <div className="flex flex-col flex-1 min-w-0">
                    <input
                      type="text"
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      placeholder="My Professional Resume"
                      className={cn(
                        "text-sm sm:text-base font-bold tracking-tight bg-transparent border-b transition-all truncate flex-1",
                        isHeaderTitleDuplicate
                          ? "text-rose-500 border-rose-500/70 focus:border-rose-500 focus:outline-none"
                          : "text-foreground border-transparent hover:border-border/70 focus:border-primary focus:outline-none"
                      )}
                      title={isHeaderTitleDuplicate ? `A resume named "${resumeTitle.trim()}" already exists` : "Click to rename your resume document"}
                    />
                    {isHeaderTitleDuplicate && (
                      <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-0.5 font-medium">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>A resume named &ldquo;{resumeTitle.trim()}&rdquo; already exists</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isAuthenticated && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer shadow-xs",
                            resumeUsage.isPro 
                              ? "border-amber-500/30 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 font-bold" 
                              : resumeUsage.count >= resumeUsage.limit
                              ? "border-rose-500/40 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 font-bold"
                              : "border-border/80 text-foreground bg-muted/40 hover:bg-muted"
                          )}
                          title="Click to switch between your saved resumes"
                        >
                          <FolderOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>
                            {resumeUsage.isPro ? 'Switch Resume' : `Switch (${resumeUsage.count}/${resumeUsage.limit})`}
                          </span>
                          <ChevronDown className="h-3 w-3 opacity-70 shrink-0" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl bg-card border-border/80 shadow-2xl">
                        <div className="px-2.5 py-2 border-b border-border/60 flex items-center justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-foreground">Switch Resume</h5>
                            <p className="text-[10px] text-muted-foreground">Select a saved resume to edit</p>
                          </div>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                            {userResumes.length}/{resumeUsage.limit}
                          </Badge>
                        </div>

                        <div className="py-1 max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                          {userResumes.length === 0 ? (
                            <div className="p-4 text-center text-xs text-muted-foreground">
                              No saved resumes found.
                            </div>
                          ) : (
                            userResumes.map((r, idx) => {
                              const isCurrent = r.id === savedResumeId;
                              return (
                                <DropdownMenuItem
                                  key={r.id}
                                  onClick={() => handleSwitchResume(r)}
                                  className={cn(
                                    "p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2.5 transition-colors",
                                    isCurrent ? "bg-primary/10 border border-primary/20 text-primary font-bold" : "hover:bg-muted/60"
                                  )}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60">
                                        #{idx + 1}
                                      </span>
                                      <p className={cn("text-xs truncate", isCurrent ? "font-bold text-primary" : "font-medium text-foreground")}>
                                        {r.title || 'Untitled Resume'}
                                      </p>
                                      {isCurrent && (
                                        <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0 font-bold ml-auto shrink-0">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5 pl-6">
                                      <span>{r.template?.name || 'Standard'}</span>
                                      <span>•</span>
                                      <span>{moment(r.updated_at).calendar(null, {
                                        sameDay: '[Today at] LT',
                                        lastDay: '[Yesterday at] LT',
                                        sameElse: 'MMM D, YYYY'
                                      })}</span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              );
                            })
                          )}
                        </div>

                        <DropdownMenuSeparator className="my-1 border-border/60" />

                        <div className="pt-1 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={handleCreateNewResume}
                            disabled={!resumeUsage.isPro && resumeUsage.count >= resumeUsage.limit}
                            className={cn(
                              "text-[11px] px-2.5 py-1 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer",
                              (!resumeUsage.isPro && resumeUsage.count >= resumeUsage.limit) && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Plus className="h-3 w-3" />
                            <span>New Resume</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('/dashboard/my-resumes')}
                            className="text-[11px] px-2.5 py-1 text-muted-foreground hover:bg-muted rounded-lg flex items-center gap-1 font-medium transition-colors ml-auto cursor-pointer"
                          >
                            <LayoutDashboard className="h-3 w-3" />
                            <span>All Resumes</span>
                          </button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/60 shrink-0 font-normal">
                    {savedResumeId ? 'Saved' : 'Auto-saved'}
                  </Badge>
                </div>
              </div>

              {/* Actions Row: Save & Download */}
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveClick}
                  disabled={isSaving || isHeaderTitleDuplicate}
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

                {savedResumeId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleOpenSaveAsNew}
                    disabled={isSaving || isSavingAsNew}
                    className="h-8 px-2.5 rounded-xl text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
                    title="Save current content as a new resume record"
                  >
                    <Copy className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="hidden sm:inline">Save as New</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                )}

                {savedResumeId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleOpenVersionHistory}
                    className="h-8 px-2.5 rounded-xl text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
                    title="View snapshot versions and restore history"
                  >
                    <History className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">History</span>
                    {versionList.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                        v{versionList[0]?.version_number || 1}
                      </span>
                    )}
                  </Button>
                )}

                <Button 
                  variant="gradient" 
                  size="sm"
                  onClick={() => {
                    if (checkProStylingGate('download')) return;
                    setShowDownloadChoiceModal(true);
                  }}
                  disabled={isDownloading}
                  className="flex-1 h-8 rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  {isDownloading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>{isDownloading ? 'Exporting...' : 'Download PDF'}</span>
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
                            className={`group relative flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                                : 'border-border/80 bg-card/60 hover:border-primary/40 hover:bg-card'
                            }`}
                            title={isLocked ? `${preset.name} (Pro theme · Click to preview on resume)` : preset.name}
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
                              <Lock className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground/70")} />
                            ) : isSelected ? (
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography & Font Family with 50+ Fonts */}
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-bold text-foreground">Font Family & Typography</Label>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-md font-mono">
                            {FONT_OPTIONS.length}+ Fonts
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Recruiter-tested fonts for tech, executive & creative roles</p>
                      </div>
                      <Button
                        type="button"
                        variant={isFontBrowserExpanded ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsFontBrowserExpanded(prev => !prev)}
                        className={cn(
                          "h-7 text-[11px] font-semibold gap-1.5 px-2.5 rounded-lg shadow-xs cursor-pointer transition-all",
                          isFontBrowserExpanded
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                        )}
                        title={isFontBrowserExpanded ? "Collapse font list" : "Browse all 54 fonts with live resume preview"}
                      >
                        <Type className="h-3.5 w-3.5" />
                        <span>{isFontBrowserExpanded ? "Collapse" : "Browse All (54)"}</span>
                        {isFontBrowserExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>

                    {isFontBrowserExpanded ? (
                      /* INLINE FONT BROWSER (Live side-by-side auditioning, zero screen-blocking modal) */
                      <div className="rounded-2xl border-2 border-primary/30 bg-card/90 shadow-lg p-3 space-y-2.5 animate-in fade-in-50 duration-200">
                        {/* Status bar */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                          <div className="flex items-center gap-2 min-w-0">
                            <span 
                              className="w-6 h-6 rounded-md bg-primary/15 text-primary border border-primary/25 flex items-center justify-center font-bold text-xs shrink-0"
                              style={{ fontFamily: activeFont?.value }}
                            >
                              Aa
                            </span>
                            <span className="text-xs font-bold text-foreground truncate" style={{ fontFamily: activeFont?.value }}>
                              {activeFont?.name || 'Inter'}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 shrink-0 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              <Eye className="h-2.5 w-2.5" />
                              <span>Live on Resume</span>
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsFontBrowserExpanded(false)}
                            className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
                          >
                            Done
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                          <Input
                            type="text"
                            value={fontSearch}
                            onChange={(e) => setFontSearch(e.target.value)}
                            placeholder="Search 50+ fonts (e.g. Garamond, Outfit, Mono)..."
                            className="pl-8 pr-8 h-8 text-xs rounded-xl bg-background border-border/80 focus:border-primary shadow-xs"
                          />
                          {fontSearch && (
                            <button
                              type="button"
                              onClick={() => setFontSearch('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                          {FONT_CATEGORIES.map((cat) => {
                            const isSelected = fontCategoryFilter === cat;
                            const count = 
                              cat === 'All' ? FONT_OPTIONS.length :
                              cat === 'Free' ? FONT_OPTIONS.filter(f => !f.isPro).length :
                              FONT_OPTIONS.filter(f => f.category.toLowerCase() === cat.toLowerCase()).length;

                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setFontCategoryFilter(cat)}
                                className={cn(
                                  "px-2 py-0.5 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shadow-xs shrink-0",
                                  isSelected
                                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                    : "bg-background border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                )}
                              >
                                <span>{cat}</span>
                                <span className={cn(
                                  "text-[9px] px-1 py-0 rounded font-mono",
                                  isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Downward Vertical List of All 54 Fonts */}
                        <div className="overflow-y-auto max-h-72 scrollbar-thin space-y-1 pr-0.5">
                          {filteredFonts.length === 0 ? (
                            <div className="py-6 text-center space-y-1 border border-dashed border-border/80 rounded-xl bg-muted/10">
                              <Type className="h-5 w-5 mx-auto text-muted-foreground/40 mb-1" />
                              <p className="text-xs font-semibold text-foreground">No fonts match &ldquo;{fontSearch}&rdquo;</p>
                              <button
                                type="button"
                                onClick={() => { setFontSearch(''); setFontCategoryFilter('All'); }}
                                className="text-[11px] text-primary font-semibold hover:underline"
                              >
                                Show all {FONT_OPTIONS.length} fonts
                              </button>
                            </div>
                          ) : (
                            filteredFonts.map((font) => {
                              const isSelected = (customDesign.fontFamily || "'Inter', sans-serif") === font.value;

                              return (
                                <button
                                  key={font.id}
                                  type="button"
                                  onClick={() => {
                                    handleSelectFontFamily(font);
                                    loadGoogleFont(font.value);
                                  }}
                                  className={cn(
                                    "w-full px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 border group",
                                    isSelected
                                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                                      : "border-transparent bg-transparent hover:bg-muted/60 hover:border-border/60"
                                  )}
                                >
                                  <div className="min-w-0 flex-1 flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 border",
                                        isSelected
                                          ? "bg-primary/20 text-primary border-primary/30"
                                          : "bg-muted/70 text-muted-foreground border-border/50 group-hover:bg-card"
                                      )}
                                      style={{ fontFamily: font.value }}
                                    >
                                      Aa
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={cn(
                                            "text-xs truncate",
                                            isSelected ? "font-bold text-primary" : "font-semibold text-foreground"
                                          )}
                                          style={{ fontFamily: font.value }}
                                        >
                                          {font.name}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground/70 font-sans px-1 py-0 rounded bg-muted/60 shrink-0">
                                          {font.category}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground font-sans truncate">
                                        {font.subLabel}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="shrink-0 flex items-center gap-1">
                                    {font.isPro && (
                                      <Badge variant="outline" className="text-[8px] px-1 py-0 font-sans border-amber-500/30 text-amber-500 bg-amber-500/10 font-bold gap-0.5 shrink-0">
                                        <Lock className="h-2 w-2" />
                                        <span>PRO</span>
                                      </Badge>
                                    )}
                                    {isSelected && (
                                      <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />
                                    )}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* Inline Footer */}
                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {filteredFonts.length} of {FONT_OPTIONS.length} fonts shown
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsFontBrowserExpanded(false)}
                            className="h-6 px-3 text-[10px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xs cursor-pointer"
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* COMPACT VIEW (Active Font Card + 6 Quick Picks) */
                      <>
                        {/* Active Selected Font Card (Click to expand 50+ fonts inline) */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setIsFontBrowserExpanded(true)}
                          onKeyDown={(e) => e.key === 'Enter' && setIsFontBrowserExpanded(true)}
                          className="p-3 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:border-primary transition-all cursor-pointer shadow-xs group"
                          title="Click to expand the 50+ Font Family Picker"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div 
                                className="h-10 w-10 rounded-xl bg-card border border-border/80 flex items-center justify-center font-bold text-lg text-primary shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                                style={{ fontFamily: activeFont?.value || "'Inter', sans-serif" }}
                              >
                                Aa
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 
                                    className="text-xs sm:text-sm font-bold text-foreground truncate"
                                    style={{ fontFamily: activeFont?.value || "'Inter', sans-serif" }}
                                  >
                                    {activeFont?.name || 'Inter'}
                                  </h4>
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium shrink-0">
                                    {activeFont?.category || 'Sans-Serif'}
                                  </Badge>
                                  {activeFont?.isPro && !isProUser && (
                                    <Lock className="h-3 w-3 text-amber-500 shrink-0" title="Pro Font (Click to preview on resume)" />
                                  )}
                                </div>
                                <p 
                                  className="text-[11px] text-muted-foreground truncate mt-0.5"
                                  style={{ fontFamily: activeFont?.value || "'Inter', sans-serif" }}
                                >
                                  {activeFont?.sample || 'Alex Rivera — Lead Software Architect'}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                              <span className="hidden sm:inline">Change Font</span>
                              <ChevronDown className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Quick Pick Popular Fonts (Top Recruiter Favorites) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Popular Quick Picks
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsFontBrowserExpanded(true)}
                              className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                            >
                              View all 54 →
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {FEATURED_FONTS.map((fontName) => {
                              const fontObj = FONT_OPTIONS.find(f => f.name === fontName);
                              if (!fontObj) return null;
                              const isSelected = (customDesign.fontFamily || "'Inter', sans-serif") === fontObj.value;
                              const isLocked = fontObj.isPro && !isProUser;

                              return (
                                <button
                                  key={fontObj.name}
                                  type="button"
                                  onClick={() => handleSelectFontFamily(fontObj)}
                                  style={{ fontFamily: fontObj.value }}
                                  className={cn(
                                    "p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 text-xs shadow-xs",
                                    isSelected 
                                      ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary" 
                                      : "border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 text-foreground"
                                  )}
                                  title={fontObj.subLabel}
                                >
                                  <span className="truncate">{fontObj.name}</span>
                                  {isLocked ? (
                                    <Lock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                                  ) : isSelected ? (
                                    <Check className="h-3 w-3 text-primary shrink-0" />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Base Font Scale — Tactile Range Slider & Presets */}
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-bold text-foreground">Base Font Scale</Label>
                          {currentSize?.id === '10pt' && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                              ★ ATS Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Density: <span className="font-semibold text-primary">{currentSize?.label || '10pt'}</span> {currentSize?.desc ? `· ${currentSize.desc}` : ''}
                        </p>
                      </div>

                      {/* Stepper with Micro-Adjustment */}
                      <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/80">
                        <button
                          type="button"
                          onClick={handleDecreaseFontSize}
                          disabled={safeSizeIndex <= 0}
                          className="h-6 w-6 rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          title="Decrease font scale (0.5pt)"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-mono font-bold px-2 min-w-[42px] text-center text-foreground">
                          {currentSize?.label || '10pt'}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncreaseFontSize}
                          disabled={safeSizeIndex >= FONT_SIZE_OPTIONS.length - 1}
                          className="h-6 w-6 rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          title="Increase font scale (0.5pt)"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Smooth Range Slider Track */}
                    <div className="space-y-1.5 px-0.5">
                      <div className="relative flex items-center pt-1">
                        <input
                          type="range"
                          min={0}
                          max={FONT_SIZE_OPTIONS.length - 1}
                          step={1}
                          value={safeSizeIndex}
                          onChange={(e) => handleSelectFontSize(FONT_SIZE_OPTIONS[Number(e.target.value)].id)}
                          className="custom-range-slider"
                          style={{
                            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(safeSizeIndex / (FONT_SIZE_OPTIONS.length - 1)) * 100}%, hsl(var(--muted)) ${(safeSizeIndex / (FONT_SIZE_OPTIONS.length - 1)) * 100}%, hsl(var(--muted)) 100%)`
                          }}
                          aria-label="Font scale range slider"
                        />
                      </div>

                      {/* Landmark labels under slider */}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 font-medium px-0.5">
                        <button
                          type="button"
                          onClick={() => handleSelectFontSize('7pt')}
                          className="hover:text-foreground transition-colors cursor-pointer"
                        >
                          7pt (Compact)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectFontSize('10pt')}
                          className={cn(
                            "transition-colors cursor-pointer font-semibold",
                            safeSizeIndex === 6 ? "text-primary font-bold underline underline-offset-2" : "hover:text-foreground"
                          )}
                        >
                          10pt (Standard ATS)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectFontSize('13pt')}
                          className="hover:text-foreground transition-colors cursor-pointer"
                        >
                          13pt (Spacious)
                        </button>
                      </div>
                    </div>

                    {/* 4 Curated Quick Density Presets */}
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {[
                        { id: '8.5pt', label: 'Compact', pt: '8.5pt' },
                        { id: '10pt', label: 'Standard', pt: '10pt' },
                        { id: '11pt', label: 'Comfort', pt: '11pt' },
                        { id: '12pt', label: 'Spacious', pt: '12pt' },
                      ].map((preset) => {
                        const isSelected = (customDesign.fontSize || '10pt') === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectFontSize(preset.id)}
                            className={cn(
                              "py-1.5 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-xs",
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary font-bold ring-1 ring-primary"
                                : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            )}
                          >
                            <span className="text-[11px] font-semibold leading-tight">{preset.label}</span>
                            <span className={cn("text-[9px] font-mono leading-none opacity-80", isSelected ? "text-white/90" : "text-muted-foreground")}>
                              {preset.pt}
                            </span>
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
          "lg:col-span-7 xl:col-span-7 h-full flex flex-col min-h-0 rounded-2xl border border-border/80 bg-slate-100/90 dark:bg-slate-950 shadow-xl overflow-hidden relative",
          mobileStudioView === 'editor' && "hidden lg:flex"
        )}>
          {/* Canvas Sub-Header */}
          <div className="h-11 sm:h-12 shrink-0 border-b border-border/70 px-2.5 sm:px-4 flex items-center justify-between gap-1.5 text-xs text-foreground z-10 bg-card/95 dark:bg-card/60 backdrop-blur-md shadow-2xs">
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
                  className={`text-[10px] shrink-0 font-mono font-bold whitespace-nowrap px-1.5 py-0.5 ${
                    totalPages === 1 
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
                      : 'text-indigo-600 dark:text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
                  }`}
                >
                  {totalPages}p
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Mobile Quick Zoom Pill (Fit & 100% toggle) */}
              <div className="flex sm:hidden items-center gap-1 bg-muted/70 px-1 py-0.5 rounded-lg border border-border/80 text-[11px]">
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
              <div className="hidden sm:flex items-center gap-1 bg-muted/60 dark:bg-muted/40 px-1.5 py-0.5 rounded-lg border border-border/80 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoFit(false);
                    setZoomLevel((z) => Math.max(0.35, +(z - 0.05).toFixed(2)));
                  }}
                  className="p-1 rounded text-foreground/70 hover:text-foreground hover:bg-card/80 transition-colors"
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
                        : 'text-foreground/70 hover:text-foreground hover:bg-card/80 font-medium'
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
                      : 'text-foreground/70 hover:text-foreground hover:bg-card/80 font-medium'
                  }`}
                  title="Fit entire A4 page to screen height"
                >
                  Fit
                </button>

                <span className="text-[10px] text-foreground/80 px-1 font-mono font-medium hidden sm:inline-block">
                  {Math.round(zoomLevel * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsAutoFit(false);
                    setZoomLevel((z) => Math.min(1.25, +(z + 0.05).toFixed(2)));
                  }}
                  className="p-1 rounded text-foreground/70 hover:text-foreground hover:bg-card/80 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3 w-3" />
                </button>
              </div>

              {/* Fullscreen Preview */}
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="p-1.5 rounded-lg border border-border/80 text-foreground/70 hover:text-foreground hover:bg-muted bg-card/60 transition-colors shrink-0"
                title="Fullscreen Preview"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>

              <span className="text-[11px] text-muted-foreground hidden xl:inline ml-1">
                Template: <strong className="text-foreground font-semibold">{activeTemplate?.name || selectedTemplate}</strong>
              </span>
            </div>
          </div>

          {/* Pro Style Preview Notice Banner */}
          {isUsingProStyling && (
            <div className="px-3 sm:px-4 py-2 border-b border-amber-500/25 bg-amber-500/10 backdrop-blur-md flex items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2 text-amber-500 font-medium min-w-0">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  Previewing Pro Style ({proStylingTitle}). Upgrade to Pro to export or save.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRevertFreeStyling}
                  className="text-[11px] underline font-semibold text-amber-500 hover:text-amber-400 cursor-pointer"
                >
                  Revert to Free
                </button>
                <Link to="/pricing">
                  <Button size="sm" variant="gradient" className="h-6 text-[10px] px-2.5 rounded-lg font-bold gap-1 shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>Upgrade</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

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
            <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start bg-slate-100/90 dark:bg-slate-950">
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

        {/* Small Modal: Typography & Font Family Picker */}
        <Dialog open={showFontModal} onOpenChange={setShowFontModal}>
          <DialogContent className="sm:max-w-md max-h-[82vh] flex flex-col p-0 overflow-hidden bg-card border-border/80 rounded-3xl shadow-2xl">
            <DialogHeader className="p-4 pb-3 border-b border-border/70">
              <div className="flex items-center justify-between pr-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Type className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-base font-bold text-foreground">
                        Typography
                      </DialogTitle>
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-1.5 py-0 font-mono">
                        {FONT_OPTIONS.length} Fonts
                      </Badge>
                    </div>
                    <DialogDescription className="text-[11px] text-muted-foreground">
                      Click any font to preview instantly on your resume
                    </DialogDescription>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Filter & Search inside Font Modal */}
            <div className="p-3 border-b border-border/60 bg-muted/20 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  placeholder="Search fonts (e.g. Garamond, Roboto, Mono)..."
                  className="pl-8 pr-8 h-9 text-xs rounded-xl bg-card border-border/80 focus:border-primary shadow-xs"
                />
                {fontSearch && (
                  <button
                    type="button"
                    onClick={() => setFontSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {FONT_CATEGORIES.map((cat) => {
                  const isSelected = fontCategoryFilter === cat;
                  const count = 
                    cat === 'All' ? FONT_OPTIONS.length :
                    cat === 'Free' ? FONT_OPTIONS.filter(f => !f.isPro).length :
                    FONT_OPTIONS.filter(f => f.category.toLowerCase() === cat.toLowerCase()).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFontCategoryFilter(cat)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <span>{cat}</span>
                      <span className={cn(
                        "text-[9px] px-1 py-0 rounded font-mono",
                        isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Downward Vertical Font List */}
            <div className="p-2 sm:p-2.5 overflow-y-auto max-h-[50vh] scrollbar-thin">
              {filteredFonts.length === 0 ? (
                <div className="py-8 text-center space-y-1.5 border border-dashed border-border/80 rounded-xl bg-muted/10">
                  <Type className="h-6 w-6 mx-auto text-muted-foreground/40 mb-1" />
                  <p className="text-xs font-semibold text-foreground">No fonts match &ldquo;{fontSearch}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => { setFontSearch(''); setFontCategoryFilter('All'); }}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Show all {FONT_OPTIONS.length} fonts
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  {filteredFonts.map((font) => {
                    const isSelected = (customDesign.fontFamily || "'Inter', sans-serif") === font.value;

                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => {
                          handleSelectFontFamily(font);
                          loadGoogleFont(font.value);
                        }}
                        className={cn(
                          "w-full px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 border group",
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-transparent bg-transparent hover:bg-muted/60 hover:border-border/60"
                        )}
                      >
                        <div className="min-w-0 flex-1 flex items-center gap-2.5">
                          <span
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border",
                              isSelected
                                ? "bg-primary/20 text-primary border-primary/30"
                                : "bg-muted/70 text-muted-foreground border-border/50 group-hover:bg-card"
                            )}
                            style={{ fontFamily: font.value }}
                          >
                            Aa
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "text-xs sm:text-sm truncate",
                                  isSelected ? "font-bold text-primary" : "font-semibold text-foreground"
                                )}
                                style={{ fontFamily: font.value }}
                              >
                                {font.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 font-sans px-1.5 py-0.2 rounded bg-muted/60 shrink-0">
                                {font.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground font-sans truncate mt-0.5">
                              {font.subLabel}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {font.isPro && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-sans border-amber-500/30 text-amber-500 bg-amber-500/10 font-bold gap-0.5 shrink-0">
                              <Lock className="h-2.5 w-2.5" />
                              <span>PRO</span>
                            </Badge>
                          )}
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary shrink-0 ml-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <DialogFooter className="p-3 border-t border-border/70 flex items-center justify-between sm:justify-between bg-card">
              <div className="flex items-center gap-1.5 text-xs truncate mr-2">
                <span className="text-muted-foreground text-[11px]">Selected:</span>
                <span className="text-foreground font-semibold text-xs truncate" style={{ fontFamily: activeFont?.value }}>
                  {activeFont?.name || 'Inter'}
                </span>
                <span className="text-[10px] text-primary flex items-center gap-1 font-medium ml-1">
                  <Eye className="h-3 w-3" />
                  <span>Preview updated</span>
                </span>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => setShowFontModal(false)}
                className="h-8 rounded-xl px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer shrink-0"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Download Options Dialog with In-Modal Progress Bar */}
        <Dialog 
          open={showDownloadChoiceModal} 
          onOpenChange={(open) => {
            if (downloadPhase === 'generating') return; // Prevent accidental exit while generating
            setShowDownloadChoiceModal(open);
            if (!open) {
              setDownloadPhase('idle');
              setDownloadProgress(0);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg bg-card border-border/80 overflow-hidden">
            {downloadPhase !== 'idle' ? (
              /* Downloading State with Animated Fill Progress Bar (No Toaster!) */
              <div className="py-6 px-1 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Visual Icon Badge */}
                <div className="relative">
                  {downloadPhase === 'generating' && (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                        <FileDown className="h-9 w-9 animate-bounce duration-1000" />
                      </div>
                    </div>
                  )}
                  {downloadPhase === 'success' && (
                    <div className="relative flex items-center justify-center animate-in zoom-in-75 duration-300">
                      <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-200" />
                      </div>
                    </div>
                  )}
                  {downloadPhase === 'error' && (
                    <div className="relative flex items-center justify-center animate-in zoom-in-75 duration-300">
                      <div className="absolute inset-0 rounded-3xl bg-destructive/20 blur-xl" />
                      <div className="relative w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive shadow-lg shadow-destructive/10">
                        <AlertCircle className="h-10 w-10" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Heading and Dynamic Text */}
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-lg font-bold text-foreground">
                    {downloadPhase === 'generating' && 'Generating Your Resume PDF'}
                    {downloadPhase === 'success' && 'Download Complete!'}
                    {downloadPhase === 'error' && 'Export Failed'}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {downloadPhase === 'generating' && downloadStatusText}
                    {downloadPhase === 'success' && 'Your recruiter-ready vector A4 PDF has been generated and saved to your device.'}
                    {downloadPhase === 'error' && downloadErrorMsg}
                  </p>
                </div>

                {/* Progress Bar with Percentage */}
                {(downloadPhase === 'generating' || downloadPhase === 'success') && (
                  <div className="w-full space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium px-1">
                      <span>{downloadProgress === 100 ? 'Completed' : 'Rendering PDF...'}</span>
                      <span className="font-mono font-bold text-foreground">{downloadProgress}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted/60 border border-border/70 overflow-hidden p-0.5">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300 ease-out shadow-xs",
                          downloadPhase === 'success'
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"
                        )}
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-muted-foreground pt-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>ATS 100% Vector Layout · High-Resolution Print Ready</span>
                    </div>
                  </div>
                )}

                {/* Error Action Buttons */}
                {downloadPhase === 'error' && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDownloadPhase('idle')}
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => handleDirectDownload()}
                      className="rounded-xl text-xs font-bold gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Try Again</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Initial Selection State: Enhanced File Styles */
              <>
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
                    className={`group relative flex flex-col p-4 rounded-2xl border border-border/80 bg-muted/30 transition-all ${
                      isDownloading || isSaveDownloading || isSaving
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-primary/5 hover:border-primary/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                          <FileDown className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground whitespace-nowrap">Just Download PDF</h4>
                            <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">PDF</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Direct high-speed download. No account or save required.
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10.5px] text-muted-foreground">
                            <span>Standard A4</span>
                            <span>•</span>
                            <span>Vector ATS Layout</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={isDownloading || isSaveDownloading || isSaving}
                        className="h-8 px-3.5 text-xs font-semibold gap-1.5 pointer-events-none shrink-0"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Option B: Save & Download */}
                  <div 
                    onClick={!(isDownloading || isSaveDownloading || isSaving) ? handleSaveAndDownload : undefined}
                    className={`group relative flex flex-col p-4 rounded-2xl border border-indigo-500/35 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent transition-all ${
                      isDownloading || isSaveDownloading || isSaving
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                          <FolderCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-foreground whitespace-nowrap">Save & Download</h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 whitespace-nowrap">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {isAuthenticated 
                              ? 'Saves this resume to your dashboard and delivers your PDF.'
                              : 'Sign in to save this resume against your account & download.'}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10.5px] text-muted-foreground">
                            <span className="text-indigo-400 font-medium">Cloud Saved</span>
                            <span>•</span>
                            <span>Versioned Snapshot</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="gradient" 
                        disabled={isSaving || isSaveDownloading || isDownloading}
                        className="h-8 px-3.5 text-xs font-semibold gap-1.5 pointer-events-none shrink-0 shadow-md shadow-indigo-500/20"
                      >
                        {isSaving || isSaveDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </>
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
              </>
            )}
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
                Your resume currently uses <span className="font-semibold text-foreground">{lockedModal.title}</span>, which is a Pro styling feature. Upgrade to Pro to {lockedModal.type === 'save' ? 'save this design' : 'download high-resolution ATS PDFs'}, or revert to standard free styling to proceed for free.
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
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleRevertFreeStyling();
                  setLockedModal(prev => ({ ...prev, open: false }));
                }} 
                className="text-xs font-medium"
              >
                Revert to Free Styling
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLockedModal(prev => ({ ...prev, open: false }))} 
                  className="text-xs"
                >
                  Keep Previewing
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
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resume Version History Modal */}
        <Dialog open={showVersionHistoryModal} onOpenChange={setShowVersionHistoryModal}>
          <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-border/80">
            <DialogHeader className="p-5 pb-3 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    Resume Version History
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Revision checkpoints for &ldquo;{resumeTitle}&rdquo; (Max 3 versions saved)
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-5 overflow-y-auto space-y-3.5 max-h-[58vh] scrollbar-thin">
              {/* Current Active Resume Card */}
              <div className="p-4 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-transparent space-y-2 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">
                        {resumeTitle || 'Current Resume'}
                      </h4>
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold shadow-xs">
                        Current
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>Current version · Updated today</span>
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                    v{versionList[0]?.version_number || 1}
                  </span>
                </div>

                <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-2 flex-wrap border-t border-border/60">
                  <span>Template: <strong className="text-foreground">{selectedTemplateObj?.name || 'Standard'}</strong></span>
                  <span>•</span>
                  <span><strong>{resumeData.experiences?.length || 0}</strong> Experiences</span>
                  <span>•</span>
                  <span><strong>{resumeData.skills?.length || 0}</strong> Skills</span>
                </div>
              </div>

              {/* Version History List Header */}
              <div className="pt-2 flex items-center justify-between">
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Archived Snapshots ({Math.max(0, versionList.length - 1)})
                </h5>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Max 3 versions saved (v1 – v3)
                </span>
              </div>

              {loadingVersions ? (
                <div className="py-10 text-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Loading versions...</p>
                </div>
              ) : versionList.length <= 1 ? (
                <div className="py-8 text-center border border-dashed border-border/80 rounded-2xl space-y-1 bg-muted/20">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-semibold text-foreground">No previous snapshots yet</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto px-4">
                    Every time you update this resume with new content, a snapshot is automatically archived so you can undo changes anytime.
                  </p>
                </div>
              ) : (
                versionList.slice(1).map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/40 transition-all flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-foreground">
                          Version {ver.version_number}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          · {moment(ver.created_at).calendar(null, {
                            sameDay: '[Updated today]',
                            lastDay: '[Updated yesterday]',
                            lastWeek: '[Saved last week]',
                            sameElse: 'MMM D, YYYY'
                          })}
                        </span>
                        {ver.title && ver.title !== resumeTitle && (
                          <Badge variant="outline" className="text-[10px] truncate max-w-[140px] border-border/70">
                            {ver.title}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Saved {moment(ver.created_at).format('MMM D, YYYY · h:mm A')}
                        {ver.template?.name ? ` · ${ver.template.name}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreVersion(ver)}
                        disabled={restoringVersionId === ver.id}
                        className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary cursor-pointer shadow-2xs"
                      >
                        {restoringVersionId === ver.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        <span>Restore</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <DialogFooter className="p-4 border-t border-border/70 bg-muted/20 sm:justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowVersionHistoryModal(false)} className="rounded-xl text-xs">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Save as New Resume Modal */}
        <Dialog open={showSaveAsNewModal} onOpenChange={setShowSaveAsNewModal}>
          <DialogContent className="sm:max-w-md bg-card border-border/80">
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Copy className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    Save as New Resume
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Create an independent resume copy tailored for a specific job application.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {!resumeUsage.isPro && (
                <div className={cn(
                  "p-3 rounded-xl border text-xs flex items-start gap-2.5",
                  resumeUsage.count >= resumeUsage.limit
                    ? "border-rose-500/30 bg-rose-500/10 text-foreground"
                    : "border-primary/20 bg-primary/5 text-muted-foreground"
                )}>
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      Free Plan: {resumeUsage.count} of {resumeUsage.limit} resumes used
                    </p>
                    {resumeUsage.count >= resumeUsage.limit ? (
                      <p className="text-[11px] text-rose-500 font-medium">
                        You have reached the maximum limit of 3 resumes on the Free plan. Upgrade to Pro for unlimited resumes or update your existing resume.
                      </p>
                    ) : (
                      <p className="text-[11px]">
                        Free accounts can save up to {resumeUsage.limit} separate resumes simultaneously.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="new-resume-title-input" className="text-xs font-semibold text-foreground">
                  New Resume Document Title
                </Label>
                <Input
                  id="new-resume-title-input"
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  placeholder="e.g. Node.js Developer Resume"
                  className={cn(
                    "h-9 text-xs rounded-xl",
                    isDuplicateSaveAsNewTitle && "border-destructive focus-visible:ring-destructive text-destructive"
                  )}
                  autoFocus
                />
                {isDuplicateSaveAsNewTitle && (
                  <p className="text-[11px] text-destructive flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>A resume named &ldquo;{newResumeTitle.trim()}&rdquo; already exists. Please choose a different name.</span>
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/70">
              <Button variant="ghost" size="sm" onClick={() => setShowSaveAsNewModal(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              {resumeUsage.count >= resumeUsage.limit && !resumeUsage.isPro ? (
                <Link to="/pricing">
                  <Button size="sm" variant="gradient" className="rounded-xl text-xs font-bold gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Upgrade to Pro</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  variant="gradient"
                  onClick={handleConfirmSaveAsNew}
                  disabled={isSavingAsNew || !newResumeTitle.trim() || isDuplicateSaveAsNewTitle}
                  className="rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSavingAsNew ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>Create & Save</span>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Free Tier Resume Limit Exceeded Modal (Max 3 resumes) */}
        <Dialog open={showLimitExceededModal} onOpenChange={setShowLimitExceededModal}>
          <DialogContent className="sm:max-w-md bg-card border-border/80">
            <DialogHeader>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2 text-rose-500">
                <Lock className="h-6 w-6" />
              </div>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <span>Free Plan Limit Reached (3 Resumes)</span>
                <Badge variant="outline" className="text-rose-500 border-rose-500/30 text-[10px] font-bold">
                  3 / 3 Used
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                The Free plan allows you to maintain up to <strong>3 separate resumes</strong> in your account. You have reached this limit.
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-2 my-2">
              <p className="text-foreground font-medium">What can you do?</p>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>You can continue editing and updating your current resume with unlimited version history snapshots.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Upgrade to Pro for unlimited resumes, premium templates, executive themes, and AI enhancements.</span>
              </div>
            </div>

            <DialogFooter className="sm:justify-between items-center gap-2 pt-2 border-t border-border/60">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLimitExceededModal(false)} 
                className="text-xs rounded-xl"
              >
                Keep Current
              </Button>
              <Link to="/pricing">
                <Button 
                  variant="gradient" 
                  size="sm" 
                  className="text-xs font-bold gap-1.5 shadow-md shadow-indigo-500/20 rounded-xl"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Upgrade to Pro</span>
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
  );
}
