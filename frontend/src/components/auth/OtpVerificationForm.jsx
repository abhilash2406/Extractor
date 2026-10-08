import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

export default function OtpVerificationForm() {
  const { email, otp: initialOtp, setMode, closeAuthModal, onSuccess } = useAuthModalStore();
  const { login: setAuthUser } = useAuthStore();
  const [otpCode, setOtpCode] = useState(initialOtp || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialOtp) {
      setOtpCode(initialOtp);
    }
  }, [initialOtp]);

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otpCode.trim();
    if (!cleanOtp) {
      return toast.error('Please enter the 6-digit verification code');
    }
    if (cleanOtp.length !== 6) {
      return toast.error('Verification code must be 6 digits');
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.verifyEmail({ otp: cleanOtp });
      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Verification failed');
      }

      const user = res?.data?.user || res?.data;
      if (user) {
        setAuthUser(user);
      }

      toast.success('Email verified successfully! Welcome to Extractor.');

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(user);
      }

      closeAuthModal();
      setOtpCode('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid or expired OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onVerifyOtp} className="space-y-4">
      {/* Visual icon & recipient note */}
      <div className="text-center pb-1">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 mb-2.5">
          <KeyRound className="h-6 w-6" />
        </div>
        <p className="text-xs text-muted-foreground">
          We've sent a 6-digit code to{' '}
          <span className="font-bold text-foreground">{email || 'your email'}</span>
        </p>
      </div>

      {/* 6-Digit OTP input field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Enter 6-Digit Code
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            maxLength={6}
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="pl-10 h-12 text-center text-xl tracking-widest font-mono font-bold bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary"
            autoFocus
            required
          />
        </div>
      </div>

      {/* Verify Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !otpCode.trim()}
        className="w-full h-12 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-2"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Navigation footer buttons */}
      <div className="pt-2 text-center text-xs text-muted-foreground flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMode('register')}
          className="text-muted-foreground hover:text-foreground font-medium"
        >
          ← Edit Details
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className="font-bold text-primary hover:underline"
        >
          Sign in instead
        </button>
      </div>
    </form>
  );
}
