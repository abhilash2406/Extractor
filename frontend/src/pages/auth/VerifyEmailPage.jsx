import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';

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
      subtitle={token ? "Please wait while we verify your email address..." : ""}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {!token && (
          <div className="auth-error" style={{ 
            padding: '14px 18px', 
            background: '#fef2f2', 
            borderRadius: '12px', 
            border: '1px solid #fecaca',
            justifyContent: 'center',
            fontSize: '0.88rem'
          }}>
            <i className="bi bi-x-circle-fill" style={{ fontSize: '1.1rem' }}></i>
            No verification token found in the URL.
          </div>
        )}
        {isPending && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#6366f1' }} role="status"></div>
            <h5 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#0f172a', margin: 0 }}>Verifying your email...</h5>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>This will only take a moment.</p>
          </div>
        )}
        {isSuccess && (
          <div className="auth-success-alert" style={{ flexDirection: 'column', textAlign: 'center', padding: '32px' }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem' }}></i>
            <span style={{ fontSize: '1.1rem', marginTop: '8px' }}>Email verified successfully!</span>
            <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '0.88rem', marginTop: '4px' }}>Redirecting you to login...</span>
          </div>
        )}
        {isError && (
          <div className="auth-error" style={{ 
            flexDirection: 'column', 
            textAlign: 'center', 
            padding: '32px', 
            background: '#fef2f2', 
            borderRadius: '16px', 
            border: '1px solid #fecaca',
            justifyContent: 'center'
          }}>
            <i className="bi bi-x-circle-fill" style={{ fontSize: '3rem' }}></i>
            <span style={{ fontSize: '1.1rem', marginTop: '8px' }}>Verification failed</span>
            <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.88rem', marginTop: '4px' }}>The link may be invalid or has expired.</span>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
