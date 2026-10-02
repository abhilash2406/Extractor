import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: login, isPending } = useLogin();

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Please enter your details to sign in to your account."
    >
      <form onSubmit={handleSubmit((data) => login(data))}>
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
        
        <div className="auth-field" style={{ marginBottom: '28px' }}>
          <div className="auth-field-header">
            <label className="auth-label">Password</label>
            <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
          </div>
          <div className="auth-input-wrap">
            <input 
              type="password" 
              className={`auth-input ${errors.password ? 'is-invalid' : ''}`} 
              placeholder="••••••••" 
              {...register('password')} 
            />
            <i className="bi bi-lock auth-input-icon"></i>
          </div>
          {errors.password && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle"></i>
              {errors.password.message}
            </div>
          )}
        </div>
        
        <button type="submit" className="auth-submit-btn" disabled={isPending}>
          {isPending ? (
            <><span className="spinner-border spinner-border-sm"></span>Signing in...</>
          ) : (
            'Sign in to account'
          )}
        </button>
      </form>
      
      <p className="auth-bottom-link">
        Don't have an account?<Link to="/register">Register here</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
