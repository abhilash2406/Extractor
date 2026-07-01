import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuth';

const schema = yup.object({ email: yup.string().email().required('Email is required') });

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: forgot, isPending, isSuccess } = useForgotPassword();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div style={{ width: '400px' }}>
        <div className="p-4">
          <h3 className="mb-2 fw-bold tracking-tight text-dark">Extractor.</h3>
          <p className="text-muted small mb-4">Enter your email and we'll send a reset link.</p>
          {isSuccess ? (
            <div className="alert alert-success border-0 bg-success text-white small fw-medium">Check your inbox for the reset link!</div>
          ) : (
            <form onSubmit={handleSubmit((d) => forgot(d))}>
              <div className="mb-4">
                <label className="form-label small fw-medium text-dark">Email</label>
                <input type="email" className={`form-control form-control-lg bg-light border-0 ${errors.email ? 'is-invalid' : ''}`} style={{fontSize: '0.9rem'}} {...register('email')} />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <button type="submit" className="btn btn-dark w-100 py-2 mb-3 fw-medium" disabled={isPending}>
                {isPending ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}
          <p className="text-center text-muted small"><Link to="/login" className="text-dark fw-medium text-decoration-none">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
