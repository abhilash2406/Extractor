import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useAuth';

const schema = yup.object({
  newPassword: yup.string().min(6).required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required(),
});

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: reset, isPending } = useResetPassword();

  const onSubmit = ({ newPassword, confirmPassword }) => reset({ token, newPassword, confirmPassword });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div style={{ width: '420px' }}>
        <div className="p-4">
          <h3 className="mb-2 fw-bold tracking-tight text-dark">Extractor.</h3>
          <p className="text-muted small mb-4">Choose a new password.</p>
          {!token && <div className="alert alert-danger border-0 bg-danger text-white small fw-medium">Invalid reset link.</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            {[
              { name: 'newPassword', label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm Password' },
            ].map(({ name, label }) => (
              <div className="mb-3" key={name}>
                <label className="form-label small fw-medium text-dark">{label}</label>
                <input type="password" className={`form-control form-control-lg bg-light border-0 ${errors[name] ? 'is-invalid' : ''}`} style={{fontSize: '0.9rem'}} {...register(name)} />
                {errors[name] && <div className="invalid-feedback">{errors[name].message}</div>}
              </div>
            ))}
            <button type="submit" className="btn btn-dark w-100 py-2 mt-2 fw-medium" disabled={isPending || !token}>
              {isPending ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
