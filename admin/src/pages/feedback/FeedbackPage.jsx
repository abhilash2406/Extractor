import { useState, useMemo } from 'react';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Eye, 
  Trash2, 
  Reply, 
  Save, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  RotateCcw,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Modal from '@/components/ui/Modal';
import moment from 'moment';
import toast from 'react-hot-toast';

const initialFeedbacks = [
  {
    id: 'fb-001',
    name: 'Rahul Sharma',
    email: 'rahul.s@techconsult.in',
    category: 'feature_request',
    subject: 'Add Docx / Word export for resume templates',
    message: 'Love the ATS analyzer! It would be extremely helpful if we could export resumes in Microsoft Word (.docx) format in addition to PDF so we can edit offline.',
    rating: 5,
    status: 'NEW',
    admin_notes: 'Discussed with design team, planning for v2.2 release.',
    created_at: '2026-10-09T08:15:00.000Z',
  },
  {
    id: 'fb-002',
    name: 'Jessica Vance',
    email: 'jess.vance@stanford.edu',
    category: 'bug',
    subject: 'AI Mock interview audio glitch on Safari',
    message: 'When using the AI mock interview coach on macOS Safari, the microphone permission asks twice and audio evaluation is delayed by 3 seconds.',
    rating: 3,
    status: 'IN_REVIEW',
    admin_notes: 'Investigating Web Audio API polyfill on Safari.',
    created_at: '2026-10-08T14:30:00.000Z',
  },
  {
    id: 'fb-003',
    name: 'Ananya Roy',
    email: 'ananya.roy@growth.io',
    category: 'pricing',
    subject: 'Student discount or team subscription plans',
    message: 'We are a cohort of 25 university students applying for summer internships. Is there an educational discount available for the Pro tier?',
    rating: 5,
    status: 'RESOLVED',
    admin_notes: 'Sent 30% educational promo code to user.',
    created_at: '2026-10-07T11:45:00.000Z',
  },
  {
    id: 'fb-004',
    name: 'Michael Chang',
    email: 'm.chang@apexcareers.com',
    category: 'general',
    subject: 'Awesome ATS scanner precision!',
    message: 'Your Groq-powered AI parser matched my resume against a Senior DevOps Job Description in under a second and caught 4 missing keywords. Landed the interview yesterday!',
    rating: 5,
    status: 'RESOLVED',
    admin_notes: 'Added testimonial quote to marketing assets.',
    created_at: '2026-10-06T16:20:00.000Z',
  },
  {
    id: 'fb-005',
    name: 'Karthik Raja',
    email: 'karthik.raja@fintech.co',
    category: 'support',
    subject: 'Need help updating billing GST details',
    message: 'Hi team, where can I input my company GSTIN number on the invoice generated for the Pro monthly subscription?',
    rating: 4,
    status: 'NEW',
    admin_notes: '',
    created_at: '2026-10-05T09:10:00.000Z',
  }
];

const categoryLabels = {
  ALL: 'All Categories',
  bug: 'Bug Report',
  feature_request: 'Feature Request',
  pricing: 'Pricing & Sales',
  support: 'Support Query',
  general: 'General',
};

const statusLabels = {
  ALL: 'All Statuses',
  NEW: 'New',
  IN_REVIEW: 'In Review',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewFeedback, setViewFeedback] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const hasActiveFilters = Boolean(
    search ||
    selectedCategory !== 'ALL' ||
    selectedStatus !== 'ALL'
  );

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setPage(1);
  };

  // Filter logic
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchesSearch = 
        fb.name.toLowerCase().includes(search.toLowerCase()) ||
        fb.email.toLowerCase().includes(search.toLowerCase()) ||
        fb.subject.toLowerCase().includes(search.toLowerCase()) ||
        fb.message.toLowerCase().includes(search.toLowerCase());

      const matchesCat = selectedCategory === 'ALL' || fb.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || fb.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [feedbacks, search, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage) || 1;
  const pagedFeedbacks = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredFeedbacks.slice(start, start + itemsPerPage);
  }, [filteredFeedbacks, page]);

  const handleStatusChange = (fbId, newStatus) => {
    setFeedbacks(prev => prev.map(f => f.id === fbId ? { ...f, status: newStatus } : f));
    toast.success(`Feedback marked as ${newStatus}`);
    if (viewFeedback && viewFeedback.id === fbId) {
      setViewFeedback(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = (fbId) => {
    setFeedbacks(prev => prev.filter(f => f.id !== fbId));
    toast.success('Feedback entry deleted');
    if (viewFeedback?.id === fbId) setViewFeedback(null);
  };

  const handleSaveNotes = () => {
    if (!viewFeedback) return;
    setFeedbacks(prev => prev.map(f => f.id === viewFeedback.id ? { ...f, admin_notes: adminNotes } : f));
    toast.success('Admin notes saved successfully');
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'bug':
        return <Badge variant="destructive" className="text-[10px] px-2 py-0.5 font-bold uppercase">Bug Report</Badge>;
      case 'feature_request':
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] px-2 py-0.5 font-bold uppercase">Feature Request</Badge>;
      case 'pricing':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-2 py-0.5 font-bold uppercase">Pricing & Sales</Badge>;
      case 'support':
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] px-2 py-0.5 font-bold uppercase">Support Query</Badge>;
      case 'general':
      default:
        return <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-bold uppercase">General</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> New
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> In Review
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Resolved
          </span>
        );
      case 'CLOSED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-bold mb-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Customer Communications</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            User Feedback & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            View user support messages, bug reports, feature suggestions, and ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 text-xs shadow-xs">
            <span className="text-muted-foreground">Total Inquiries: </span>
            <span className="font-bold text-foreground">{feedbacks.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold shadow-xs">
            <span>New: </span>
            <span>{feedbacks.filter(f => f.status === 'NEW').length}</span>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="rounded-3xl border-border/80 bg-card/90 backdrop-blur-xl shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback by user, subject, or keywords..."
                className="pl-10 pr-8 h-10 rounded-xl bg-background/60"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Modern Filter Dropdown Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Category:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${
                        selectedCategory !== 'ALL'
                          ? 'bg-primary/10 border-primary/40 text-primary shadow-xs'
                          : 'bg-background hover:bg-muted/60 border-border/80 text-foreground'
                      }`}
                    >
                      <span>{categoryLabels[selectedCategory] || 'All Categories'}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                    {[
                      { code: 'ALL', label: 'All Categories', dot: null },
                      { code: 'bug', label: 'Bug Report', dot: 'bg-rose-500' },
                      { code: 'feature_request', label: 'Feature Request', dot: 'bg-violet-500' },
                      { code: 'pricing', label: 'Pricing & Sales', dot: 'bg-amber-500' },
                      { code: 'support', label: 'Support Query', dot: 'bg-blue-500' },
                      { code: 'general', label: 'General', dot: 'bg-emerald-500' },
                    ].map((item) => (
                      <DropdownMenuItem
                        key={item.code}
                        onClick={() => { setSelectedCategory(item.code); setPage(1); }}
                        className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === item.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.dot ? <span className={`h-2 w-2 rounded-full ${item.dot}`} /> : <span className="h-2 w-2" />}
                          <span>{item.label}</span>
                        </div>
                        {selectedCategory === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${
                        selectedStatus !== 'ALL'
                          ? 'bg-primary/10 border-primary/40 text-primary shadow-xs'
                          : 'bg-background hover:bg-muted/60 border-border/80 text-foreground'
                      }`}
                    >
                      <span>{statusLabels[selectedStatus] || 'All Statuses'}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                    {[
                      { code: 'ALL', label: 'All Statuses', dot: null },
                      { code: 'NEW', label: 'New', dot: 'bg-blue-500' },
                      { code: 'IN_REVIEW', label: 'In Review', dot: 'bg-amber-500' },
                      { code: 'RESOLVED', label: 'Resolved', dot: 'bg-emerald-500' },
                      { code: 'CLOSED', label: 'Closed', dot: 'bg-slate-400' },
                    ].map((item) => (
                      <DropdownMenuItem
                        key={item.code}
                        onClick={() => { setSelectedStatus(item.code); setPage(1); }}
                        className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                          selectedStatus === item.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.dot ? <span className={`h-2 w-2 rounded-full ${item.dot}`} /> : <span className="h-2 w-2" />}
                          <span>{item.label}</span>
                        </div>
                        {selectedStatus === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-xl border border-dashed border-border hover:border-foreground/30 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </Button>
              )}

            </div>

          </div>
        </CardHeader>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground pl-6 whitespace-nowrap">Sender</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">Category</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">Subject & Message</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground hidden md:table-cell whitespace-nowrap">Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right pr-6 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <MessageSquare className="h-8 w-8 opacity-40 text-muted-foreground" />
                        <p className="text-sm font-semibold">No feedback entries found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your filters or search keywords.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedFeedbacks.map((fb) => (
                    <TableRow key={fb.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                      
                      {/* Sender */}
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs">
                              {fb.name?.slice(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs sm:text-sm text-foreground truncate">{fb.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{fb.email}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-3.5">
                        {getCategoryBadge(fb.category)}
                      </TableCell>

                      {/* Subject & Preview */}
                      <TableCell className="py-3.5 max-w-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-xs text-foreground truncate">{fb.subject}</div>
                          <div className="text-xs text-muted-foreground truncate">{fb.message}</div>
                        </div>
                      </TableCell>

                      {/* Status Dropdown */}
                      <TableCell className="py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="cursor-pointer outline-none group">
                              {getStatusBadge(fb.status)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-36 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                            <DropdownMenuItem onClick={() => handleStatusChange(fb.id, 'NEW')} className="text-xs font-semibold flex items-center justify-between">
                              <span>New</span>
                              {fb.status === 'NEW' && <Check className="h-3.5 w-3.5 text-blue-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(fb.id, 'IN_REVIEW')} className="text-xs font-semibold flex items-center justify-between text-amber-500">
                              <span>In Review</span>
                              {fb.status === 'IN_REVIEW' && <Check className="h-3.5 w-3.5 text-amber-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(fb.id, 'RESOLVED')} className="text-xs font-semibold flex items-center justify-between text-emerald-500">
                              <span>Resolved</span>
                              {fb.status === 'RESOLVED' && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(fb.id, 'CLOSED')} className="text-xs font-semibold flex items-center justify-between text-muted-foreground">
                              <span>Closed</span>
                              {fb.status === 'CLOSED' && <Check className="h-3.5 w-3.5" />}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-3.5 hidden md:table-cell text-xs text-muted-foreground">
                        {moment(fb.created_at).format('MMM DD, YYYY')}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3.5 text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setViewFeedback(fb);
                              setAdminNotes(fb.admin_notes || '');
                            }}
                            className="h-8 w-8 rounded-xl text-primary hover:bg-primary/10"
                            title="View Full Feedback"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(fb.id)}
                            className="h-8 w-8 rounded-xl text-destructive hover:bg-destructive/10"
                            title="Delete Feedback"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="h-8 rounded-xl gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="h-8 rounded-xl gap-1 text-xs"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Feedback Modal */}
      <Modal 
        isOpen={!!viewFeedback} 
        onClose={() => setViewFeedback(null)} 
        title="Feedback & Inquiries Detail" 
        size="lg"
      >
        {viewFeedback && (
          <div className="space-y-5">
            
            {/* Sender Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/70 gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs">
                    {viewFeedback.name?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{viewFeedback.name}</h3>
                  <a href={`mailto:${viewFeedback.email}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3" /> {viewFeedback.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {getCategoryBadge(viewFeedback.category)}
                {getStatusBadge(viewFeedback.status)}
              </div>
            </div>

            {/* Subject and Full Message */}
            <div className="p-4 rounded-2xl border border-border/80 space-y-2 bg-card">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm font-bold text-foreground">{viewFeedback.subject}</h4>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {moment(viewFeedback.created_at).format('MMM DD, YYYY [at] hh:mm A')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed pt-2 border-t border-border/60">
                {viewFeedback.message}
              </p>
            </div>

            {/* Admin Internal Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Internal Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal investigation notes, ticket references, or team follow-ups..."
                rows={3}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <a
                href={`mailto:${viewFeedback.email}?subject=Re: ${encodeURIComponent(viewFeedback.subject)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors"
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply via Email</span>
              </a>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setViewFeedback(null)} className="rounded-xl text-xs">
                  Close
                </Button>
                <Button onClick={handleSaveNotes} className="rounded-xl text-xs gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Notes</span>
                </Button>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
