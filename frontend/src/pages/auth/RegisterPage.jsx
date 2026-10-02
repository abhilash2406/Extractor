import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: doRegister, isPending } = useRegister();

  const onSubmit = ({ name, email, password }) => doRegister({ name, email, password });

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: 'bi-person', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', icon: 'bi-envelope', placeholder: 'name@company.com' },
    { name: 'password', label: 'Password', type: 'password', icon: 'bi-lock', placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: 'bi-lock-fill', placeholder: '••••••••' },
  ];

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join Extractor to streamline your hiring process."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ name: fieldName, label, type, icon, placeholder }) => (
          <div className="auth-field" key={fieldName}>
            <div className="auth-field-header">
              <label className="auth-label">{label}</label>
            </div>
            <div className="auth-input-wrap">
              <input 
                type={type} 
                className={`auth-input ${errors[fieldName] ? 'is-invalid' : ''}`} 
                placeholder={placeholder}
                {...register(fieldName)} 
              />
              <i className={`bi ${icon} auth-input-icon`}></i>
            </div>
            {errors[fieldName] && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle"></i>
                {errors[fieldName].message}
              </div>
            )}
          </div>
        ))}
        
        <button type="submit" className="auth-submit-btn" disabled={isPending}>
          {isPending ? (
            <><span className="spinner-border spinner-border-sm"></span>Registering...</>
          ) : (
            'Create account'
          )}
        </button>
      </form>
      
      <p className="auth-bottom-link">
        Already have an account?<Link to="/login">Sign In</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
