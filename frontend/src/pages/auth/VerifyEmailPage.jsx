import { useEffect } from 'react';
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
      subtitle={token ? "Verifying your email address..." : ""}
    >
      <div className="py-4 text-center space-y-4">
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
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            <h3 className="font-heading text-lg font-bold">Email Verified Successfully!</h3>
            <p className="text-xs text-emerald-700/80">You can now proceed to log in to your account.</p>
            <Button asChild className="rounded-xl mt-2">
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
            <Button asChild variant="outline" className="rounded-xl mt-2">
              <Link to="/login">Back to Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
