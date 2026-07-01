import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: doRegister, isPending } = useRegister();

  const onSubmit = ({ name, email, password }) => doRegister({ name, email, password });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-5 rounded-4 shadow-soft" style={{ width: '440px', border: '1px solid #f1f5f9' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="bg-primary rounded text-white d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
            <i className="bi bi-lightning-charge-fill fs-5"></i>
          </div>
          <h3 className="mb-0 fw-bold tracking-tight text-dark">Extractor.</h3>
        </div>
        <p className="text-muted mb-4 small">Create a new account.</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {[
            { name: 'name', label: 'Full Name', type: 'text', icon: 'bi-person' },
            { name: 'email', label: 'Email Address', type: 'email', icon: 'bi-envelope' },
            { name: 'password', label: 'Password', type: 'password', icon: 'bi-lock' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: 'bi-lock-fill' },
          ].map(({ name, label, type, icon }) => (
            <div className="mb-3" key={name}>
              <label className="form-label small fw-semibold text-dark">{label}</label>
              <div className="position-relative">
                <i className={`bi ${icon} position-absolute top-50 translate-middle-y text-muted ms-3`}></i>
                <input type={type} className={`form-control form-control-lg input-stylish ps-5 ${errors[name] ? 'is-invalid' : ''}`} style={{fontSize: '0.95rem'}} {...register(name)} />
              </div>
              {errors[name] && <div className="text-danger small mt-1">{errors[name].message}</div>}
            </div>
          ))}
          
          <button type="submit" className="btn btn-gradient w-100 py-2 mt-3 mb-4 fw-medium rounded-3" disabled={isPending}>
            {isPending ? 'Registering…' : 'Create account'}
          </button>
        </form>
        
        <p className="text-center text-muted small mb-0">
          Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
