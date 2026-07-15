import { useState, useEffect } from 'react';
import { useUsers, useUser, useUpdateUserStatus, useUserResume } from '../../hooks/useUsers';
import Modal from '../../components/ui/Modal';
import moment from 'moment';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [viewUser, setViewUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showResume, setShowResume] = useState(false);

  const { data: response, isLoading } = useUsers({ page, limit: 10, search });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();
  
  // Fetch detailed user data for the modal
  const { data: detailedUser, isLoading: isDetailedUserLoading } = useUser(viewUser?.id);
  
  // Use query for resume fetching, enabled only when showResume is true
  const { data: resumeUrl, isLoading: isResumeLoading, isError: isResumeError, refetch: fetchResume } = useUserResume(viewUser?.id);

  useEffect(() => {
    if (!viewUser) {
      setShowResume(false);
    }
  }, [viewUser]);

  useEffect(() => {
    if (showResume && viewUser) {
      fetchResume();
    }
  }, [showResume, viewUser, fetchResume]);

  const users = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1 };

  const handleStatusChange = (id, newStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      updateStatus({ id: deleteConfirmId, status: 'DELETED' }, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold tracking-tight text-dark mb-0">Users</h4>
      </div>

      <div className="bg-white rounded-4 shadow-soft border p-4 mb-4">
        <div className="mb-4" style={{ maxWidth: '300px' }}>
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted ms-3"></i>
            <input 
              type="text" 
              className="form-control input-stylish ps-5" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-5 text-muted">No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold text-muted small text-uppercase">User</th>
                  <th className="fw-semibold text-muted small text-uppercase">Role</th>
                  <th className="fw-semibold text-muted small text-uppercase">Joined</th>
                  <th className="fw-semibold text-muted small text-uppercase" style={{ width: '150px' }}>Status</th>
                  <th className="fw-semibold text-muted small text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="fw-medium text-dark">{user.username}</div>
                      <div className="text-muted small">{user.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger-subtle text-danger border-danger-subtle' : 'bg-primary-subtle text-primary border-primary-subtle'} border text-capitalize`}>
                        {user.role.toLowerCase()}
                      </span>
                    </td>
                    <td className="text-muted small">{moment(user.createdAt || user.created_at).format('MMM DD, YYYY')}</td>
                    <td>
                      <select 
                        className={`form-select form-select-sm fw-medium shadow-none ${user.status === 'ACTIVE' ? 'text-success bg-success-subtle border-success-subtle' : 'text-danger bg-danger-subtle border-danger-subtle'}`}
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        disabled={isUpdating}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="ACTIVE" className="bg-white text-dark">Active</option>
                        <option value="BLOCKED" className="bg-white text-dark">Blocked</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-light text-primary border-0 me-2" 
                        title="View Details"
                        onClick={() => setViewUser(user)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-light text-danger border-0" 
                        title="Delete User"
                        onClick={() => setDeleteConfirmId(user.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="small text-muted">Showing page {meta.page} of {meta.totalPages}</div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" disabled={meta.page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
              <button className="btn btn-sm btn-light border" disabled={meta.page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View User Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size={showResume ? "lg" : "md"}>
        {isDetailedUserLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <div className="mt-2 text-muted small">Loading user details...</div>
          </div>
        ) : detailedUser ? (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-person fs-1"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold">{detailedUser.username}</h5>
                <p className="text-muted mb-0">{detailedUser.email}</p>
              </div>
            </div>
            
            <div className="row g-3">
              <div className="col-6">
                <label className="small text-muted fw-semibold text-uppercase">Role</label>
                <div className="fw-medium text-capitalize">{detailedUser.role.toLowerCase()}</div>
              </div>
              <div className="col-6">
                <label className="small text-muted fw-semibold text-uppercase">Status</label>
                <div className="fw-medium text-capitalize">{detailedUser.status.toLowerCase()}</div>
              </div>
              <div className="col-6">
                <label className="small text-muted fw-semibold text-uppercase">Phone</label>
                <div className="fw-medium">{detailedUser.phone || '-'}</div>
              </div>
              <div className="col-6">
                <label className="small text-muted fw-semibold text-uppercase">Verified</label>
                <div className="fw-medium">{detailedUser.is_verified ? 'Yes' : 'No'}</div>
              </div>
              
              {/* Extra parsed details */}
              {(detailedUser.website || detailedUser.linkedin_url || detailedUser.github_url) && (
                <div className="col-12 mt-3">
                  <label className="small text-muted fw-semibold text-uppercase d-block mb-2">Social / Links</label>
                  <div className="d-flex flex-wrap gap-2">
                    {detailedUser.website && <a href={detailedUser.website} target="_blank" rel="noreferrer" className="badge bg-info-subtle text-info border border-info-subtle text-decoration-none px-2 py-1"><i className="bi bi-globe me-1"></i>Website</a>}
                    {detailedUser.linkedin_url && <a href={detailedUser.linkedin_url} target="_blank" rel="noreferrer" className="badge bg-primary-subtle text-primary border border-primary-subtle text-decoration-none px-2 py-1"><i className="bi bi-linkedin me-1"></i>LinkedIn</a>}
                    {detailedUser.github_url && <a href={detailedUser.github_url} target="_blank" rel="noreferrer" className="badge bg-dark-subtle text-dark border border-dark-subtle text-decoration-none px-2 py-1"><i className="bi bi-github me-1"></i>GitHub</a>}
                  </div>
                </div>
              )}

              <div className="col-12 mt-3">
                <label className="small text-muted fw-semibold text-uppercase">Joined Date</label>
                <div className="fw-medium">{moment(detailedUser.createdAt || detailedUser.created_at).format('MMMM DD, YYYY [at] hh:mm A')}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-top">
              <h6 className="fw-bold mb-3">Resume Document</h6>
              {!showResume ? (
                <button className="btn btn-primary" onClick={() => setShowResume(true)}>
                  <i className="bi bi-file-earmark-pdf me-2"></i>Load Resume
                </button>
              ) : isResumeLoading ? (
                <div className="d-flex align-items-center text-primary">
                  <div className="spinner-border spinner-border-sm me-2"></div>
                  Loading document...
                </div>
              ) : isResumeError || !resumeUrl ? (
                <div className="alert alert-danger mb-0 py-2 d-inline-block shadow-none border-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>No resume uploaded.
                </div>
              ) : (
                <div className="border rounded-3 overflow-hidden bg-light" style={{ height: '500px' }}>
                  <object data={resumeUrl?.url || resumeUrl} type="application/pdf" width="100%" height="100%">
                    <div className="p-4 text-center">
                      <p className="text-muted mb-2">Your browser cannot display PDFs directly.</p>
                      <a href={resumeUrl?.url || resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                        Download PDF
                      </a>
                    </div>
                  </object>
                </div>
              )}
            </div>
          </div>
        ) : null}
        <div className="d-flex justify-content-end mt-4 pt-3 border-top">
          <button type="button" className="btn btn-light border" onClick={() => setViewUser(null)}>Close</button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" size="sm">
        <p className="text-muted mb-4">Are you sure you want to delete this user? This will hide them from the platform. This action cannot be undone.</p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light border" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isUpdating}>
            {isUpdating ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
