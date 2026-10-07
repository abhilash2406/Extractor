import { useState, useEffect } from 'react';
import { useUsers, useUser, useUpdateUserStatus, useUserResume } from '../../hooks/useUsers';
import Modal from '../../components/ui/Modal';
import moment from 'moment';
import { 
  Search, 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download, 
  Globe, 
  Link2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [viewUser, setViewUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showResume, setShowResume] = useState(false);

  const { data: response, isLoading } = useUsers({ page, limit: 10, search });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();
  
  // Fetch detailed user data for the modal
  const { data: detailedUser, isLoading: isDetailedUserLoading } = useUser(viewUser?.id);
  
  // Resume fetching query
  const { data: resumeUrl, isLoading: isResumeLoading, isError: isResumeError, refetch: fetchResume } = useUserResume(viewUser?.id);

  useEffect(() => {
    if (!viewUser) {
      setShowResume(false);
    }
  }, [viewUser]);

  useEffect(() => {
    if (showResume && viewUser) {
      fetchResume();
    }
  }, [showResume, viewUser, fetchResume]);

  const users = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1 };

  const handleStatusChange = (id, newStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      updateStatus({ id: deleteConfirmId, status: 'DELETED' }, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system users, access roles, and permissions.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{users.length}</span> users
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <p className="text-sm font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-foreground">No users found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search keywords to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="w-[140px]">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                              {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate">{user.username}</div>
                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                          className="capitalize text-[11px]"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {moment(user.createdAt || user.created_at).format('MMM DD, YYYY')}
                      </TableCell>
                      <TableCell>
                        <select
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                          }`}
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          disabled={isUpdating}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => setViewUser(user)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteConfirmId(user.id)}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
              <div className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{meta.page}</span> of <span className="font-semibold text-foreground">{meta.totalPages}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="xl">
        {isDetailedUserLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent mb-3" />
            <p className="text-sm font-medium">Retrieving user profile...</p>
          </div>
        ) : detailedUser ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/80">
                <Avatar className="h-20 w-20 ring-4 ring-primary/10 mb-3">
                  <AvatarFallback className="text-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold">
                    {(detailedUser.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-heading font-bold text-lg text-foreground">{detailedUser.username}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5" /> {detailedUser.email}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Badge variant={detailedUser.role === 'admin' ? 'destructive' : 'default'} className="capitalize">
                    {detailedUser.role}
                  </Badge>
                  <Badge variant={detailedUser.status === 'ACTIVE' ? 'success' : 'secondary'}>
                    {detailedUser.status}
                  </Badge>
                </div>
              </div>

              {/* Information List */}
              <div className="rounded-2xl border border-border/80 p-4 space-y-3 bg-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40">
                    <span className="text-muted-foreground block mb-0.5">Phone</span>
                    <span className="font-semibold text-foreground">{detailedUser.phone || 'Not Provided'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40">
                    <span className="text-muted-foreground block mb-0.5">Verified</span>
                    <span className={`font-semibold flex items-center gap-1 ${detailedUser.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {detailedUser.is_verified ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {detailedUser.is_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 text-xs">
                  <span className="text-muted-foreground block mb-0.5">Member Since</span>
                  <span className="font-semibold text-foreground">
                    {moment(detailedUser.createdAt || detailedUser.created_at).format('MMMM DD, YYYY [at] hh:mm A')}
                  </span>
                </div>

                {/* Social links if any */}
                {(detailedUser.website || detailedUser.linkedin_url || detailedUser.github_url) && (
                  <div className="pt-2 border-t border-border/60 flex flex-wrap gap-2">
                    {detailedUser.website && (
                      <a href={detailedUser.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors">
                        <Globe className="h-3.5 w-3.5" /> Website
                      </a>
                    )}
                    {detailedUser.linkedin_url && (
                      <a href={detailedUser.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors">
                        <Link2 className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                    )}
                    {detailedUser.github_url && (
                      <a href={detailedUser.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors">
                        <Link2 className="h-3.5 w-3.5" /> GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Resume Section */}
            <div className="lg:col-span-7 flex flex-col min-h-[380px]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Candidate Resume</h4>
              
              {!showResume ? (
                <div 
                  onClick={() => setShowResume(true)}
                  className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition-all duration-200 group text-center"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h5 className="font-heading font-semibold text-foreground text-sm">View Attached Resume</h5>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Click here to preview candidate's uploaded resume document.
                  </p>
                </div>
              ) : isResumeLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border bg-slate-50 dark:bg-slate-900">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
                  <p className="text-xs font-medium text-muted-foreground">Loading PDF Document...</p>
                </div>
              ) : isResumeError || !resumeUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2 opacity-80" />
                  <p className="text-xs font-semibold">No resume document available for this user.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col rounded-2xl border border-border/80 overflow-hidden bg-slate-950 shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border/60">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate">
                      <FileText className="h-4 w-4 text-primary" /> Candidate_Resume.pdf
                    </span>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <a href={resumeUrl?.url || resumeUrl} target="_blank" rel="noreferrer">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </Button>
                  </div>
                  <object data={resumeUrl?.url || resumeUrl} type="application/pdf" className="w-full h-[450px]">
                    <div className="p-8 text-center bg-card h-full flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground mb-3">Your browser doesn't support inline PDF preview.</p>
                      <Button asChild size="sm">
                        <a href={resumeUrl?.url || resumeUrl} target="_blank" rel="noreferrer">
                          Download Resume PDF
                        </a>
                      </Button>
                    </div>
                  </object>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this user? This action will disable their account access.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isUpdating}>
              {isUpdating ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
