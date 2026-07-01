import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../api/users.api';
import { changePassword } from '../../api/auth.api';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';

const UserMenu = ({ roleLabel = 'User' }) => {
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLogoutOpen(false);
    navigate('/login');
  };

  // Profile Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then(res => res.data.data),
    enabled: isProfileOpen, // Only fetch when profile modal is open
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        email: profile.email || ''
      });
      setPhotoPreview(profile.photoUrl || null);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUser({ ...user, name: res.data.data.name }); // Update auth store
      setIsProfileOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    if (photoFile) {
      data.append('photo', photoFile);
    }
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    changePasswordMutation.mutate(passwordData);
  };

  return (
    <>
      <div className="position-relative" ref={dropdownRef}>
        <div 
          className="d-flex align-items-center justify-content-between p-2 rounded shadow-sm border" 
          style={{ backgroundColor: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="d-flex align-items-center flex-grow-1 text-truncate px-2">
            <div className="text-truncate">
              <div className="small fw-bold text-dark">{user?.name}</div>
              <div className="text-muted" style={{fontSize: '0.75rem'}}>{roleLabel}</div>
            </div>
          </div>
          <button className="btn btn-sm btn-light border-0 ms-2">
            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
          </button>
        </div>

        {isOpen && (
          <div className="position-absolute bottom-100 start-0 w-100 mb-2 bg-white border border-light rounded-3 shadow p-2" style={{ zIndex: 1000 }}>
            <button className="sidebar-link d-flex align-items-center gap-3 w-100 bg-transparent border-0 px-3 py-2 mb-1" 
              onClick={() => { setIsOpen(false); setIsProfileOpen(true); }}>
              <i className="bi bi-person fs-6"></i> 
              <span className="fw-medium text-start text-nowrap">My Profile</span>
            </button>
            <button className="sidebar-link d-flex align-items-center gap-3 w-100 bg-transparent border-0 px-3 py-2 mb-1" 
              onClick={() => { setIsOpen(false); setIsPasswordOpen(true); }}>
              <i className="bi bi-shield-lock fs-6"></i> 
              <span className="fw-medium text-start text-nowrap">Change Password</span>
            </button>
            <div className="border-top my-1 mx-2"></div>
            <button className="d-flex align-items-center gap-3 w-100 bg-transparent border-0 px-3 py-2 rounded-3 text-danger mt-1" 
              style={{ transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => { setIsOpen(false); setIsLogoutOpen(true); }}>
              <i className="bi bi-box-arrow-right fs-6"></i> 
              <span className="fw-medium text-start">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      <Modal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} title="Confirm Logout" size="sm">
        <div className="text-center p-3">
          <i className="bi bi-box-arrow-right text-danger mb-3" style={{ fontSize: '3rem' }}></i>
          <h5 className="fw-bold mb-2">Ready to leave?</h5>
          <p className="text-muted small mb-4">Are you sure you want to sign out of your account?</p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-light px-4 rounded-pill fw-medium border" onClick={() => setIsLogoutOpen(false)}>Cancel</button>
            <button className="btn btn-danger px-4 rounded-pill fw-medium" onClick={handleLogout}>Yes, Logout</button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="My Profile" size="md">
        <form onSubmit={handleProfileSubmit}>
          <div className="d-flex flex-column align-items-center mb-4">
            <div 
              className="rounded-circle overflow-hidden bg-light d-flex align-items-center justify-content-center border position-relative"
              style={{ width: '90px', height: '90px' }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="bi bi-person fs-1 text-muted"></i>
              )}
              <label className="position-absolute bottom-0 start-0 w-100 text-center bg-dark bg-opacity-50 text-white" style={{ cursor: 'pointer', fontSize: '0.7rem', padding: '2px 0' }}>
                <i className="bi bi-camera"></i>
                <input type="file" accept="image/*" className="d-none" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium text-muted">Email Address</label>
            <input type="email" className="form-control bg-light border-0" value={formData.email} disabled />
          </div>
          
          <div className="mb-3">
            <label className="form-label small fw-medium">Full Name</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className="mb-4">
            <label className="form-label small fw-medium">Phone Number</label>
            <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          
          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button type="button" className="btn btn-light fw-medium rounded-pill px-4" onClick={() => setIsProfileOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} title="Change Password" size="md">
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">Current Password</label>
            <input type="password" className="form-control" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required minLength="6" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium">New Password</label>
            <input type="password" className="form-control" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength="6" />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-medium">Confirm New Password</label>
            <input type="password" className="form-control" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required minLength="6" />
          </div>
          
          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button type="button" className="btn btn-light fw-medium rounded-pill px-4" onClick={() => setIsPasswordOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-dark rounded-pill px-4" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserMenu;
