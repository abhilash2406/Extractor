import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthModalStore } from '@/store/authModalStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

const registerSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterForm() {
  const { setMode, setEmail } = useAuthModalStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onRegister = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        role: 'CANDIDATE',
      });
      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Registration failed');
      }

      setEmail(data.email);
      setMode('otp');
      
      if (res?.data?.isExistingUnverified) {
        toast.success('Unverified account found! A new 6-digit code was sent to your email.');
      } else {
        toast.success('Account created! Please enter the 6-digit OTP sent to your email.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onRegister)} className="space-y-3.5">
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
            autoComplete="name"
            className={`pl-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.name ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            {...register('name')}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.name.message}
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
            autoComplete="email"
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
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
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
            autoComplete="new-password"
            className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.confirmPassword.message}
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
  );
}
