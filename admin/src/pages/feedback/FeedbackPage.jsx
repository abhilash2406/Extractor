import { useState, useEffect } from 'react';
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
  X,
  Star,
  AlertTriangle,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Modal from '@/components/ui/Modal';
import moment from 'moment';
import {
  FEEDBACK_STATUS,
  useFeedbacks,
  useUpdateFeedback,
  useDeleteFeedback,
} from '@/hooks/api/useFeedback';

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
  [FEEDBACK_STATUS.NEW]: 'New',
  [FEEDBACK_STATUS.IN_REVIEW]: 'In Review',
  [FEEDBACK_STATUS.RESOLVED]: 'Resolved',
  [FEEDBACK_STATUS.CLOSED]: 'Closed',
};

const STATUS_OPTIONS = [
  { value: FEEDBACK_STATUS.NEW, label: 'New', textClass: '', checkClass: 'text-blue-500' },
  { value: FEEDBACK_STATUS.IN_REVIEW, label: 'In Review', textClass: 'text-amber-500', checkClass: 'text-amber-500' },
  { value: FEEDBACK_STATUS.RESOLVED, label: 'Resolved', textClass: 'text-emerald-500', checkClass: 'text-emerald-500' },
  { value: FEEDBACK_STATUS.CLOSED, label: 'Closed', textClass: 'text-muted-foreground', checkClass: '' },
];

export default function FeedbackPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [viewFeedback, setViewFeedback] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    limit: itemsPerPage,
    search: debouncedSearch.trim() || undefined,
    category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
  };

  const { data: response, isLoading, isFetching } = useFeedbacks(queryParams);
  const { mutate: updateFeedback, isPending: isUpdating } = useUpdateFeedback();
  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedback();

  const feedbacks = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };
  const stats = response?.stats || { total: 0, new: 0, inReview: 0, resolved: 0, closed: 0 };

  const hasActiveFilters = Boolean(
    search ||
    selectedCategory !== 'ALL' ||
    selectedStatus !== 'ALL'
  );

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setPage(1);
  };

  const handleStatusChange = (fbId, newStatus) => {
    updateFeedback(
      { id: fbId, status: newStatus },
      {
        onSuccess: (updated) => {
          if (viewFeedback && viewFeedback.id === fbId) {
            setViewFeedback((prev) => (prev ? { ...prev, status: updated?.status || newStatus } : null));
          }
        },
      }
    );
  };

  const handleSaveNotes = () => {
    if (!viewFeedback) return;
    updateFeedback(
      { id: viewFeedback.id, admin_notes: adminNotes },
      {
        onSuccess: (updated) => {
          setViewFeedback((prev) =>
            prev ? { ...prev, admin_notes: updated?.admin_notes ?? adminNotes } : null
          );
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteFeedback(deleteTarget.id, {
      onSuccess: () => {
        if (viewFeedback?.id === deleteTarget.id) {
          setViewFeedback(null);
        }
        setDeleteTarget(null);
      },
    });
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
      case FEEDBACK_STATUS.NEW:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> New
          </span>
        );
      case FEEDBACK_STATUS.IN_REVIEW:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> In Review
          </span>
        );
      case FEEDBACK_STATUS.RESOLVED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Resolved
          </span>
        );
      case FEEDBACK_STATUS.CLOSED:
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Closed
          </span>
        );
    }
  };

  const getInitials = (name, email) => {
    const str = (name || email || 'U').trim();
    const parts = str.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return str.slice(0, 2).toUpperCase();
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
            <span className="font-bold text-foreground">{stats.total}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold shadow-xs">
            <span>New: </span>
            <span>{stats.new}</span>
          </div>
        </div>
      </div>

      {/* Filter & Table Card */}
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
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setDebouncedSearch('');
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown Pills */}
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
                        onClick={() => {
                          setSelectedCategory(item.code);
                          setPage(1);
                        }}
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
                      { code: FEEDBACK_STATUS.NEW, label: 'New', dot: 'bg-blue-500' },
                      { code: FEEDBACK_STATUS.IN_REVIEW, label: 'In Review', dot: 'bg-amber-500' },
                      { code: FEEDBACK_STATUS.RESOLVED, label: 'Resolved', dot: 'bg-emerald-500' },
                      { code: FEEDBACK_STATUS.CLOSED, label: 'Closed', dot: 'bg-slate-400' },
                    ].map((item) => (
                      <DropdownMenuItem
                        key={item.code}
                        onClick={() => {
                          setSelectedStatus(item.code);
                          setPage(1);
                        }}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        <p className="text-xs font-medium">Loading feedback inquiries...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : feedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <MessageSquare className="h-8 w-8 opacity-40 text-muted-foreground" />
                        <p className="text-sm font-semibold">No feedback entries found</p>
                        <p className="text-xs text-muted-foreground">
                          {hasActiveFilters
                            ? 'Try adjusting your filters or search keywords.'
                            : 'User feedback submitted from the platform will appear here.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  feedbacks.map((fb) => (
                    <TableRow
                      key={fb.id}
                      className={`border-border/60 hover:bg-muted/40 transition-colors ${isFetching ? 'opacity-80' : ''}`}
                    >
                      {/* Sender */}
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-2 ring-primary/10 shrink-0">
                            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs">
                              {getInitials(fb.name, fb.email)}
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
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-foreground truncate">{fb.subject}</span>
                            {fb.rating ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500 shrink-0">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {fb.rating}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{fb.message}</div>
                        </div>
                      </TableCell>

                      {/* Status Dropdown (ENUM) */}
                      <TableCell className="py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              disabled={isUpdating}
                              className="cursor-pointer outline-none group disabled:opacity-60"
                              title="Change feedback status"
                            >
                              {getStatusBadge(fb.status)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-36 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                            {STATUS_OPTIONS.map((opt) => (
                              <DropdownMenuItem
                                key={opt.value}
                                onClick={() => handleStatusChange(fb.id, opt.value)}
                                className={`text-xs font-semibold flex items-center justify-between cursor-pointer ${opt.textClass}`}
                              >
                                <span>{opt.label}</span>
                                {fb.status === opt.value && <Check className={`h-3.5 w-3.5 ${opt.checkClass}`} />}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-3.5 hidden md:table-cell text-xs text-muted-foreground whitespace-nowrap">
                        {moment(fb.created_at || fb.createdAt).format('MMM DD, YYYY')}
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
                            onClick={() => setDeleteTarget(fb)}
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
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                Page <span className="font-bold text-foreground">{meta.page}</span> of{' '}
                <span className="font-bold text-foreground">{meta.totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-xl gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
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
                    {getInitials(viewFeedback.name, viewFeedback.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{viewFeedback.name}</h3>
                  <a
                    href={`mailto:${viewFeedback.email}`}
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="h-3 w-3" /> {viewFeedback.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {getCategoryBadge(viewFeedback.category)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={isUpdating}
                      className="cursor-pointer outline-none disabled:opacity-60"
                      title="Update status"
                    >
                      {getStatusBadge(viewFeedback.status)}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                    {STATUS_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => handleStatusChange(viewFeedback.id, opt.value)}
                        className={`text-xs font-semibold flex items-center justify-between cursor-pointer ${opt.textClass}`}
                      >
                        <span>{opt.label}</span>
                        {viewFeedback.status === opt.value && <Check className={`h-3.5 w-3.5 ${opt.checkClass}`} />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Subject, Rating and Full Message */}
            <div className="p-4 rounded-2xl border border-border/80 space-y-2 bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-heading text-sm font-bold text-foreground">{viewFeedback.subject}</h4>
                <div className="flex items-center gap-3">
                  {viewFeedback.rating ? (
                    <div className="flex items-center gap-0.5" title={`Rated ${viewFeedback.rating}/5`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= viewFeedback.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{' '}
                    {moment(viewFeedback.created_at || viewFeedback.createdAt).format('MMM DD, YYYY [at] hh:mm A')}
                  </span>
                </div>
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
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${viewFeedback.email}?subject=Re: ${encodeURIComponent(viewFeedback.subject)}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors"
                >
                  <Reply className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(viewFeedback)}
                  className="rounded-xl text-xs text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setViewFeedback(null)} className="rounded-xl text-xs">
                  Close
                </Button>
                <Button
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  className="rounded-xl text-xs gap-1.5"
                >
                  {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>Save Notes</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}>
        <DialogContent className="max-w-md p-6 bg-card border-border shadow-2xl rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-foreground">
                Delete Feedback
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to permanently delete the feedback{' '}
                <span className="font-semibold text-foreground">"{deleteTarget?.subject}"</span> from{' '}
                <span className="font-semibold text-foreground">{deleteTarget?.name}</span>?
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="text-xs h-9 px-4 gap-1.5 font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Feedback</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
