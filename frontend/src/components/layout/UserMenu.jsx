import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../api/users.api';
import { changePassword } from '../../api/auth.api';
import toast from 'react-hot-toast';
import { 
  User, 
  KeyRound, 
  LogOut, 
  ChevronUp, 
  ChevronDown, 
  Camera, 
  Shield, 
  Phone, 
  Mail, 
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const UserMenu = ({ roleLabel = 'User', isMobile = false, isCollapsed = false }) => {
  const { user, logout, setUser } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then(res => res.data.data),
    enabled: isProfileOpen,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || profile.username || '',
        phone: profile.phone || '',
        email: profile.email || ''
      });
      setPhotoPreview(profile.photoUrl || null);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUser({ ...user, name: res.data.data.name });
      setIsProfileOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    if (photoFile) {
      data.append('photo', photoFile);
    }
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutOpen(false);
    navigate('/login');
  };

  const initials = (user?.name || user?.username || 'User').charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <button 
              title={user?.name || user?.username || 'Admin User'}
              className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl border border-border/70 bg-card shadow-xs transition-all hover:bg-accent hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <button className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card p-2 text-left shadow-xs transition-all hover:bg-accent hover:border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground leading-tight">
                    {user?.name || user?.username || 'Admin User'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground/60 p-1">
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className="w-56" 
          align={isCollapsed ? "end" : "end"} 
          side={isCollapsed ? "right" : "top"} 
          sideOffset={isCollapsed ? 12 : 8}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">{user?.name || user?.username || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email || 'admin@extractor.com'}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="gap-2 py-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsPasswordOpen(true)} className="gap-2 py-2">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme} className="gap-2 py-2">
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-600" />
                <span>Dark Theme</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsLogoutOpen(true)} 
            className="gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
            <DialogDescription>
              Update your account details and contact information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4 py-2">
            <div className="flex flex-col items-center gap-2">
              <div className="relative group cursor-pointer">
                <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                  {photoPreview && <AvatarImage src={photoPreview} alt="Avatar" />}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
              <span className="text-xs text-muted-foreground">Click photo to update</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
              <Input value={formData.email} disabled className="bg-muted/50 cursor-not-allowed" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+1 (555) 000-0000" 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Ensure your account is using a strong and unique password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Password</label>
              <Input 
                type="password"
                value={passwordData.oldPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} 
                required 
                minLength={6}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
              <Input 
                type="password"
                value={passwordData.newPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                required 
                minLength={6}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
              <Input 
                type="password"
                value={passwordData.confirmPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                required 
                minLength={6}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-center font-heading text-xl">Sign Out</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Yes, Sign Out
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setIsLogoutOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
