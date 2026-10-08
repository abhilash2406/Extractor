import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginForm() {
  const { setMode, closeAuthModal, onSuccess } = useAuthModalStore();
  const { login: setAuthUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
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
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
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
              errors.email ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <button
            type="button"
            onClick={() => setMode('forgot-password')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.password ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}
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
  );
}
