import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  LogIn
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profile_pic || null);
  const [isSaving, setIsSaving] = useState(false);
  const { data: profileData, isLoading: isLoadingProfile } = useProfile({
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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
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
              Please sign in to view and manage your account details and resumes.
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
    <div className="min-h-[85vh] max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-bold mb-2">
            <User className="h-3.5 w-3.5" />
            <span>User Account</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your personal credentials, contact info, and security preferences.
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <Button asChild variant="outline" className="h-10 text-xs font-semibold gap-2 border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-xl">
            <a href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'} target="_blank" rel="noreferrer">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Console</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar & Quick Actions */}
        <div className="md:col-span-4 space-y-6">
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
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 uppercase">
                    {user?.role || 'Candidate'}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={
                      user?.plan_code === 'PRO' || user?.plan_code === 'PREMIUM'
                        ? "text-[10px] font-bold px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 uppercase"
                        : "text-[10px] font-bold px-2.5 py-0.5 bg-muted text-muted-foreground border-border uppercase"
                    }
                  >
                    {user?.plan_code || 'FREE'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border/60 space-y-2">
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

        {/* Right Column: Profile Edit Form */}
        <div className="md:col-span-8">
          <Card className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl p-6 sm:p-7">
            <CardHeader className="p-0 pb-5">
              <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
              <CardDescription className="text-xs">
                Update your display name and contact phone number.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              
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
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
        </div>

      </div>

    </div>
  );
}
