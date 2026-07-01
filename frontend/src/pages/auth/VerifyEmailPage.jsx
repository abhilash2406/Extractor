import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../../hooks/useAuth';

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { mutate: verify, isPending, isError, isSuccess } = useVerifyEmail();

  useEffect(() => {
    if (token) verify({ token });
  }, [token]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="text-center" style={{ maxWidth: '400px' }}>
        <h3 className="mb-4 fw-bold tracking-tight text-dark">Extractor.</h3>
        {!token && <p className="text-danger small fw-medium">No verification token found in the URL.</p>}
        {isPending && <><div className="spinner-border text-dark spinner-border-sm mb-3" /><p className="text-muted small">Verifying your email…</p></>}
        {isSuccess && <p className="text-success small fw-medium">✅ Email verified! Redirecting to login…</p>}
        {isError && <p className="text-danger small fw-medium">❌ Verification failed. The link may have expired.</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
