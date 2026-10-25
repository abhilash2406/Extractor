import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Camera, 
  Save, 
  KeyRound, 
  LogOut, 
  ExternalLink,
  Sparkles,
  LogIn,
  FileText,
  Plus,
  Download,
  Trash2,
  Pencil,
  Loader2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { useProfile } from '@/hooks/useUsers';
import { useQueryClient } from '@tanstack/react-query';
import * as usersApi from '@/api/users.api';
import * as authApi from '@/api/auth.api';
import { getMyResumes, deleteResume, downloadResumePdf } from '@/api/resumes.api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'resumes';
  const setActiveTab = (tab) => setSearchParams({ tab });

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profile_pic || null);
  const [isSaving, setIsSaving] = useState(false);

  // Resumes State
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [downloadingResumeId, setDownloadingResumeId] = useState(null);
  const [deletingResumeId, setDeletingResumeId] = useState(null);

  const { data: profileData } = useProfile({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (profileData) {
      if (profileData.status === 'BLOCKED') {
        logout();
        toast.error('Your account has been blocked. Please contact support.', { id: 'account-status-error' });
        navigate('/');
        return;
      }
      setFormData({
        name: profileData.name || profileData.username || '',
        phone: profileData.phone || '',
        email: profileData.email || '',
      });
      if (profileData.profile_pic) {
        setPhotoPreview(profileData.profile_pic);
      }
    }
  }, [profileData, logout, navigate]);

  // Fetch Saved Resumes for Authenticated User
  const fetchUserResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await getMyResumes({ limit: 50 });
      setResumes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load user resumes', err);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserResumes();
    }
  }, [isAuthenticated]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('phone', formData.phone);
      if (photoFile) {
        payload.append('photo', photoFile);
      }

      const response = await usersApi.updateProfile(payload);
      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to update profile');
      }

      const updatedUser = res?.data || res;
      setUser({
        ...user,
        name: formData.name,
        username: formData.name,
        phone: formData.phone,
        profile_pic: updatedUser.profile_pic || photoPreview,
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadResume = async (resume) => {
    if (downloadingResumeId) return;
    setDownloadingResumeId(resume.id);
    const toastId = toast.loading(`Generating PDF for "${resume.title}"...`);
    try {
      const res = await downloadResumePdf({
        resumeId: resume.id,
        title: resume.title,
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const cleanFileName = `${(resume.title || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      link.setAttribute('download', cleanFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Resume downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Failed to download resume PDF', err);
      toast.error('Failed to download PDF. Please try again.', { id: toastId });
    } finally {
      setDownloadingResumeId(null);
    }
  };

  const handleDeleteResume = async (resumeId, resumeTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${resumeTitle || 'this resume'}"?`)) {
      return;
    }
    setDeletingResumeId(resumeId);
    try {
      await deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      toast.success('Resume deleted successfully');
    } catch (err) {
      console.error('Failed to delete resume', err);
      toast.error('Failed to delete resume');
    } finally {
      setDeletingResumeId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const getUserInitials = () => {
    const name = formData.name || user?.name || user?.username || 'User';
    return name.slice(0, 2).toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl p-6 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Sign In Required</h2>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Please sign in to view and manage your account details and saved resumes.
            </p>
          </div>
          <Button 
            onClick={() => openAuthModal('login')} 
            className="w-full h-11 rounded-xl text-xs font-bold gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Continue</span>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal credentials, contact info, and saved resume versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <Button asChild variant="outline" className="h-10 text-xs font-semibold gap-2 border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-xl">
              <a href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'} target="_blank" rel="noreferrer">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Console</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </Button>
          )}

          <Button asChild variant="gradient" className="h-10 text-xs font-bold gap-2 rounded-xl shadow-md shadow-indigo-500/20">
            <Link to="/resume-builder">
              <Plus className="h-4 w-4" />
              <span>Create New Resume</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Column (Profile Summary) + Right Column (Tabs: Resumes / Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Avatar & Account Card */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-md">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt={formData.name} />
                  ) : null}
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-violet-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs">
                  <Camera className="h-6 w-6" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-foreground text-base">
                  {formData.name || 'Your Name'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formData.email || user?.email}
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={
                      user?.plan_code === 'PRO' || user?.plan_code === 'PREMIUM'
                        ? "text-[10px] font-bold px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 uppercase"
                        : "text-[10px] font-bold px-2.5 py-0.5 bg-muted text-muted-foreground border-border uppercase"
                    }
                  >
                    {user?.plan_code ? `${user.plan_code} PLAN` : 'FREE PLAN'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="mt-6 pt-5 border-t border-border/60 space-y-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('resumes')}
                className={`w-full h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'resumes'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4" />
                  <span>My Saved Resumes</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-2 py-0 h-5 font-bold ${
                    activeTab === 'resumes' ? 'border-primary-foreground/30 text-primary-foreground' : ''
                  }`}
                >
                  {resumes.length}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4" />
                  <span>Personal Information</span>
                </div>
              </button>
            </div>

            {/* Security & Sign Out Actions */}
            <div className="mt-4 pt-4 border-t border-border/60 space-y-2">
              <Button asChild variant="outline" className="w-full h-10 rounded-xl text-xs font-semibold justify-start gap-2.5">
                <Link to="/change-password">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span>Change Password</span>
                </Link>
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full h-10 rounded-xl text-xs font-semibold justify-start gap-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-8">
          
          {/* TAB 1: SAVED RESUMES */}
          {activeTab === 'resumes' && (
            <Card className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>My Saved Resumes</span>
                    <Badge variant="outline" className="text-xs font-mono ml-1">
                      {resumes.length}
                    </Badge>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any resume to edit in the interactive builder or download as ATS PDF.
                  </p>
                </div>

                <Button asChild size="sm" variant="outline" className="h-9 text-xs font-semibold gap-1.5 rounded-xl border-border/80">
                  <Link to="/resume-builder">
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Resume</span>
                  </Link>
                </Button>
              </div>

              {/* Resumes List */}
              {loadingResumes ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-xs font-semibold">Loading your resumes...</span>
                </div>
              ) : resumes.length === 0 ? (
                <div className="py-16 text-center space-y-4 max-w-md mx-auto">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">No saved resumes found</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      You haven't saved any resumes to your account yet. Build your first professional resume with recruiter-tested templates and AI enhancement.
                    </p>
                  </div>
                  <Button asChild variant="gradient" className="h-10 px-5 rounded-xl text-xs font-bold gap-2">
                    <Link to="/resume-builder">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Build Your First Resume</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumes.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-background/60 hover:bg-muted/40 hover:border-primary/40 transition-all duration-200 shadow-xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {item.title || 'Untitled Resume'}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-muted text-muted-foreground">
                                  {item.template?.name || 'Standard ATS'}
                                </Badge>
                                {item.template?.category && (
                                  <span className="text-[10px] text-muted-foreground">
                                    • {item.template.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Updated {new Date(item.updated_at || item.uploaded_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8 flex-1 text-xs font-semibold gap-1.5 rounded-lg border-border/80 hover:bg-primary/10 hover:text-primary"
                        >
                          <Link to={`/resume-builder?id=${item.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="gradient"
                          onClick={() => handleDownloadResume(item)}
                          disabled={downloadingResumeId === item.id}
                          className="h-8 flex-1 text-xs font-bold gap-1.5 rounded-lg shadow-xs"
                        >
                          {downloadingResumeId === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          <span>{downloadingResumeId === item.id ? 'Exporting...' : 'Download'}</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteResume(item.id, item.title)}
                          disabled={deletingResumeId === item.id}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                          title="Delete Resume"
                        >
                          {deletingResumeId === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* TAB 2: PERSONAL INFORMATION */}
          {activeTab === 'profile' && (
            <Card className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl p-6 sm:p-7">
              <CardHeader className="p-0 pb-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your display name and contact phone number.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      required
                      className="pl-10 h-11 bg-background/60 border-border/80 rounded-xl"
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 h-11 bg-background/60 border-border/80 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 px-6 rounded-xl text-xs font-bold gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
