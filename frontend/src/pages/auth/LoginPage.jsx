import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: login, isPending } = useLogin();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-5 rounded-4 shadow-soft" style={{ width: '420px', border: '1px solid #f1f5f9' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="bg-primary rounded text-white d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
            <i className="bi bi-lightning-charge-fill fs-5"></i>
          </div>
          <h3 className="mb-0 fw-bold tracking-tight text-dark">Extractor.</h3>
        </div>
        <p className="text-muted mb-4 small">Welcome back. Please enter your details.</p>
        
        <form onSubmit={handleSubmit((data) => login(data))}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Email</label>
            <div className="position-relative">
              <i className="bi bi-envelope position-absolute top-50 translate-middle-y text-muted ms-3"></i>
              <input type="email" className={`form-control form-control-lg input-stylish ps-5 ${errors.email ? 'is-invalid' : ''}`} style={{fontSize: '0.95rem'}} placeholder="name@company.com" {...register('email')} />
            </div>
            {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
          </div>
          
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-semibold text-dark">Password</label>
              <Link to="/forgot-password" className="text-primary text-decoration-none small fw-medium">Forgot password?</Link>
            </div>
            <div className="position-relative">
              <i className="bi bi-lock position-absolute top-50 translate-middle-y text-muted ms-3"></i>
              <input type="password" className={`form-control form-control-lg input-stylish ps-5 ${errors.password ? 'is-invalid' : ''}`} style={{fontSize: '0.95rem'}} placeholder="••••••••" {...register('password')} />
            </div>
            {errors.password && <div className="text-danger small mt-1">{errors.password.message}</div>}
          </div>
          
          <button type="submit" className="btn btn-gradient w-100 py-2 mb-4 fw-medium rounded-3" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign in to account'}
          </button>
        </form>
        
        <p className="text-center text-muted small mb-0">
          Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
