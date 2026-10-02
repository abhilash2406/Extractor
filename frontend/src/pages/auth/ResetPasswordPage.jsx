import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';

const schema = yup.object({
  newPassword: yup.string().min(6).required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Confirm Password is required'),
});

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: reset, isPending } = useResetPassword();

  const onSubmit = ({ newPassword, confirmPassword }) => reset({ token, newPassword, confirmPassword });

  return (
    <AuthLayout 
      title="Choose a new password" 
      subtitle="Please enter your new password below."
    >
      {!token && (
        <div className="auth-error" style={{ 
          padding: '14px 18px', 
          background: '#fef2f2', 
          borderRadius: '12px', 
          border: '1px solid #fecaca',
          marginBottom: '20px',
          fontSize: '0.88rem'
        }}>
          <i className="bi bi-x-circle-fill" style={{ fontSize: '1.1rem' }}></i>
          Invalid or missing reset link.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {[
          { name: 'newPassword', label: 'New Password', icon: 'bi-lock' },
          { name: 'confirmPassword', label: 'Confirm Password', icon: 'bi-lock-fill' },
        ].map(({ name, label, icon }) => (
          <div className="auth-field" key={name}>
            <div className="auth-field-header">
              <label className="auth-label">{label}</label>
            </div>
            <div className="auth-input-wrap">
              <input 
                type="password" 
                className={`auth-input ${errors[name] ? 'is-invalid' : ''}`} 
                placeholder="••••••••"
                {...register(name)} 
              />
              <i className={`bi ${icon} auth-input-icon`}></i>
            </div>
            {errors[name] && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle"></i>
                {errors[name].message}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="auth-submit-btn" disabled={isPending || !token}>
          {isPending ? (
            <><span className="spinner-border spinner-border-sm"></span>Resetting...</>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
