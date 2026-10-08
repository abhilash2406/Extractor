import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

// Login Validation Schema
const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// Register Validation Schema
const registerSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function AuthModal() {
  const { isOpen, mode, setMode, closeAuthModal, onSuccess } = useAuthModalStore();
  const { login: setAuthUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Form
  const { 
    register: registerLogin, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors },
    reset: resetLoginForm 
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  // Register Form
  const { 
    register: registerSignUp, 
    handleSubmit: handleRegisterSubmit, 
    formState: { errors: registerErrors },
    reset: resetRegisterForm 
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });

  const onLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.login(data);
      const res = response.data;
      if (!res?.success) {
        throw new Error(res?.message || 'Login failed');
      }
      const user = res.data?.user || res.data;
      
      setAuthUser(user);
      toast.success('Welcome back to Extractor!');
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(user);
      }
      
      closeAuthModal();
      resetLoginForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegister = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'CANDIDATE'
      });
      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Registration failed');
      }
      
      toast.success('Account created! Please sign in to continue.');
      setMode('login');
      resetRegisterForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl rounded-3xl">
        
        {/* Top Header Banner with Ambient Glow */}
        <div className="relative p-6 sm:p-7 pb-4 bg-gradient-to-b from-primary/10 via-card/50 to-transparent border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <DialogTitle className="font-heading text-xl font-extrabold text-foreground">
                Extractor
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {mode === 'login' 
                  ? 'Sign in to access your resumes & applications' 
                  : 'Create a free account to save & download resumes'}
              </DialogDescription>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border/60 mt-5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 pt-4">
          
          {/* ========================================================= */}
          {/* 🔐 LOGIN FORM */}
          {/* ========================================================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    className={`pl-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                      loginErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    {...registerLogin('email')} 
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {loginErrors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                      loginErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    {...registerLogin('password')} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {loginErrors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary" 
                  />
                  <span className="text-xs text-muted-foreground font-medium">Remember for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Footer Switch */}
              <div className="pt-3 text-center text-xs text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-primary hover:underline"
                >
                  Create free account
                </button>
              </div>

            </form>
          ) : (
            /* ========================================================= */
            /* 📝 REGISTER FORM */
            /* ========================================================= */
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Alex Rivera" 
                    className={`pl-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                      registerErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    {...registerSignUp('name')} 
                  />
                </div>
                {registerErrors.name && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {registerErrors.name.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    className={`pl-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                      registerErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    {...registerSignUp('email')} 
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {registerErrors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                      registerErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    {...registerSignUp('password')} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerErrors.password && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {registerErrors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                      registerErrors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    {...registerSignUp('confirmPassword')} 
                  />
                </div>
                {registerErrors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {registerErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Create Free Account</span>
                  </>
                )}
              </Button>

              {/* Footer Switch */}
              <div className="pt-2 text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in here
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Security Footer Note */}
        <div className="p-3 bg-muted/40 border-t border-border/60 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>256-Bit SSL Encryption • Your data is always private</span>
        </div>

      </DialogContent>
    </Dialog>
  );
}
