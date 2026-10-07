import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useVerifyEmail } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { mutate: verify, isPending, isError, isSuccess } = useVerifyEmail();

  useEffect(() => {
    if (token) verify({ token });
  }, [token, verify]);

  return (
    <AuthLayout 
      title="Email Verification" 
      subtitle={token ? "Verifying your email address..." : "Verify your account to continue"}
      badgeText="Security Verification"
    >
      <div className="py-2 text-center space-y-4">
        {!token && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>No verification token found in the URL.</span>
          </div>
        )}

        {isPending && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <h3 className="font-heading text-lg font-bold text-foreground">Verifying your email...</h3>
            <p className="text-xs text-muted-foreground">This will only take a moment.</p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h3 className="font-heading text-lg font-bold text-foreground">Email Verified Successfully!</h3>
            <p className="text-xs text-muted-foreground">Your account is now fully active. Proceed to sign in.</p>
            <Button asChild className="w-full h-12 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 mt-2">
              <Link to="/login" className="gap-2">
                <span>Go to Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive space-y-3">
            <XCircle className="h-12 w-12 text-destructive" />
            <h3 className="font-heading text-lg font-bold">Verification Failed</h3>
            <p className="text-xs text-muted-foreground">The verification link may have expired or is invalid.</p>
            <Button asChild variant="outline" className="w-full h-11 rounded-xl text-xs font-semibold mt-2">
              <Link to="/login">Back to Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
