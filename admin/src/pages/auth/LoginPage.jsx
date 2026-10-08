import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  const { mutate: login, isPending } = useLogin();

  return (
    <AuthLayout 
      title="Admin Portal Login" 
      subtitle="Enter your administrative credentials to access the Extractor Admin Console."
      badgeText="Restricted Admin Access"
    >
      <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
        
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
            <Input 
              type="email" 
              placeholder="admin@company.com" 
              autoComplete="email"
              className={`pl-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('email')} 
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
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
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••" 
              autoComplete="current-password"
              className={`pl-10 pr-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
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
          disabled={isPending}
          className="w-full h-12 rounded-xl text-sm font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 active:scale-[0.99] gap-2 mt-3"
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign in as Administrator</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
