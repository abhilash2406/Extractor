import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuthModalStore } from '@/store/authModalStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerificationForm from './OtpVerificationForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

export default function AuthModal() {
  const { isOpen, mode, setMode, closeAuthModal, email } = useAuthModalStore();

  const getModalTitle = () => {
    switch (mode) {
      case 'otp':
        return 'Verify Email';
      case 'forgot-password':
        return 'Reset Password';
      case 'reset-password':
        return 'Set New Password';
      default:
        return 'Extractor';
    }
  };

  const getModalSubtitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to access your resumes & applications';
      case 'register':
        return 'Create a free account to save & download resumes';
      case 'otp':
        return `Enter the 6-digit code sent to ${email || 'your email'}`;
      case 'forgot-password':
        return 'Enter your email to receive a 6-digit recovery code';
      case 'reset-password':
        return `Enter the 6-digit code sent to ${email || 'your email'}`;
      default:
        return 'Welcome to Extractor';
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
                {getModalTitle()}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {getModalSubtitle()}
              </DialogDescription>
            </div>
          </div>

          {/* Mode Switcher Tabs (only shown on login/register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border/60 mt-5">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Form Body View */}
        <div className="p-6 sm:p-7 pt-4">
          {mode === 'otp' && <OtpVerificationForm />}
          {mode === 'login' && <LoginForm />}
          {mode === 'register' && <RegisterForm />}
          {mode === 'forgot-password' && <ForgotPasswordForm />}
          {mode === 'reset-password' && <ResetPasswordForm />}
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
