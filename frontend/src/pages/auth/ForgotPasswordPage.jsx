import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';

const schema = yup.object({ email: yup.string().email('Invalid email').required('Email is required') });

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: forgot, isPending, isSuccess } = useForgotPassword();

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email and we'll send a reset link."
    >
      {isSuccess ? (
        <div className="auth-success-alert">
          <i className="bi bi-check-circle-fill"></i>
          Check your inbox for the reset link!
        </div>
      ) : (
        <form onSubmit={handleSubmit((d) => forgot(d))}>
          <div className="auth-field">
            <div className="auth-field-header">
              <label className="auth-label">Email</label>
            </div>
            <div className="auth-input-wrap">
              <input 
                type="email" 
                className={`auth-input ${errors.email ? 'is-invalid' : ''}`} 
                placeholder="name@company.com" 
                {...register('email')} 
              />
              <i className="bi bi-envelope auth-input-icon"></i>
            </div>
            {errors.email && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle"></i>
                {errors.email.message}
              </div>
            )}
          </div>
          <button type="submit" className="auth-submit-btn" disabled={isPending}>
            {isPending ? (
              <><span className="spinner-border spinner-border-sm"></span>Sending...</>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      )}
      <p className="auth-bottom-link">
        <Link to="/login"><i className="bi bi-arrow-left" style={{ marginRight: '6px' }}></i>Back to Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
