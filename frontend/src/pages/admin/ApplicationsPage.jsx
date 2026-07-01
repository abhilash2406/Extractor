import { useState, useEffect } from 'react';
import { useApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { useUserResume } from '../../hooks/useUsers';
import Modal from '../../components/ui/Modal';
import moment from 'moment';

const ApplicationsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data: response, isLoading, isError } = useApplications({ page, limit: 10, search });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const { data: resumeData, refetch: fetchResume, isFetching: isFetchingResume } = useUserResume(selectedApplication?.candidate?.id);

  const applications = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1, totalItems: 0 };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openDetailsModal = (app) => {
    setSelectedApplication(app);
    setConfirmAction(null);
    setIsModalOpen(true);
    
    // Auto-update to reviewed if pending
    if (app.status === 'pending') {
      updateStatus(
        { id: app.id, status: 'reviewed', silent: true },
        {
          onSuccess: () => {
            setSelectedApplication(prev => ({ ...prev, status: 'reviewed' }));
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isModalOpen && selectedApplication && !confirmAction) {
      fetchResume();
    }
  }, [isModalOpen, selectedApplication, confirmAction, fetchResume]);

  const handleStatusUpdateClick = (status) => {
    setConfirmAction(status);
  };

  const executeStatusUpdate = () => {
    if (!selectedApplication || !confirmAction) return;
    
    updateStatus(
      { id: selectedApplication.id, status: confirmAction },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedApplication(null);
          setConfirmAction(null);
        }
      }
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded">Accepted</span>;
      case 'face_to_face_interview':
        return <span className="badge bg-purple-subtle text-purple border border-purple-subtle px-2 py-1 rounded" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', borderColor: '#e9d5ff' }}>Face to Face</span>;
      case 'aptitude_round':
        return <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 rounded">Aptitude Round</span>;
      case 'reviewed':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded">Reviewed</span>;
      case 'rejected':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded">Rejected</span>;
      case 'pending':
      default:
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 rounded">Pending</span>;
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold tracking-tight text-dark mb-1">Applications Management</h4>
          <p className="text-muted mb-0 small">Review and process candidate applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
        <div className="p-4 border-bottom bg-light d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="fw-semibold text-dark">Total Applications: {meta.totalItems}</div>
          <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted ms-3"></i>
            <input 
              type="text" 
              className="form-control ps-5 rounded-pill shadow-none border" 
              placeholder="Search candidate..." 
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <div className="mt-2 text-muted small">Loading applications...</div>
          </div>
        ) : isError ? (
          <div className="text-center py-5 text-danger">
            <i className="bi bi-exclamation-circle fs-1 mb-2"></i>
            <h6>Failed to load applications</h6>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 mb-2"></i>
            <h6>No applications found</h6>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4 text-secondary small text-uppercase fw-semibold">Candidate</th>
                  <th className="py-3 px-4 text-secondary small text-uppercase fw-semibold">Job Role</th>
                  <th className="py-3 px-4 text-secondary small text-uppercase fw-semibold">Applied Date</th>
                  <th className="py-3 px-4 text-secondary small text-uppercase fw-semibold">Status</th>
                  <th className="py-3 px-4 text-secondary small text-uppercase fw-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>
                          {app.candidate?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{app.candidate?.username}</div>
                          <div className="text-muted small">{app.candidate?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-dark fw-medium">{app.job_role?.title}</td>
                    <td className="py-3 px-4 text-muted small">{moment(app.applied_at).format('MMM DD, YYYY')}</td>
                    <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3 px-4 text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium"
                        onClick={() => openDetailsModal(app)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <span className="small text-muted fw-medium">Page {meta.page} of {meta.totalPages}</span>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-white border rounded px-3" 
                disabled={meta.page <= 1} 
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button 
                className="btn btn-sm btn-white border rounded px-3" 
                disabled={meta.page >= meta.totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setConfirmAction(null); }} title={confirmAction ? "Confirm Action" : "Application Details"} size="lg">
        {confirmAction ? (
          <div className="text-center py-5">
            <i className={`bi ${confirmAction === 'rejected' ? 'bi-exclamation-triangle text-danger' : 'bi-check-circle text-success'} display-1 mb-3 d-block`}></i>
            <h4 className="fw-bold mb-3 text-dark">
              Are you sure you want to {confirmAction === 'rejected' ? 'reject this candidate' : confirmAction === 'aptitude_round' ? 'proceed this candidate to the aptitude round' : 'proceed this candidate to face to face interview'}?
            </h4>
            <p className="text-muted mb-4">
              {confirmAction === 'rejected' 
                ? 'This will immediately notify the candidate that they have not been selected.' 
                : confirmAction === 'aptitude_round'
                ? 'This will automatically generate a 10-question assessment test and email the candidate.'
                : 'This will notify the candidate for a face to face interview.'}
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-light border px-4 py-2 rounded-pill fw-medium" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button 
                className={`btn ${confirmAction === 'rejected' ? 'btn-danger' : 'btn-success'} px-5 py-2 rounded-pill fw-bold shadow-sm`}
                onClick={executeStatusUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...</>
                ) : (
                  'Yes, Confirm'
                )}
              </button>
            </div>
          </div>
        ) : selectedApplication && (
          <div className="p-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 bg-light p-3 rounded border">
              <div>
                <h5 className="fw-bold text-dark mb-1">{selectedApplication.candidate?.username}</h5>
                <div className="text-muted small mb-2">{selectedApplication.candidate?.email} {selectedApplication.candidate?.phone && `| ${selectedApplication.candidate.phone}`}</div>
                <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded">
                  Applied for: {selectedApplication.job_role?.title}
                </div>
              </div>
              <div className="text-md-end mt-3 mt-md-0">
                <div className="text-muted small mb-1">Status</div>
                {getStatusBadge(selectedApplication.status)}
                <div className="text-muted small mt-2">Applied on {moment(selectedApplication.applied_at).format('MMM DD, YYYY')}</div>
              </div>
            </div>

            {/* Test Score Section */}
            {selectedApplication.test?.is_completed && (
              <div className="mb-4 bg-white border border-primary-subtle rounded p-3 d-flex align-items-center justify-content-between shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                    <i className="bi bi-file-earmark-bar-graph fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Assessment Test Score</h6>
                    <p className="text-muted small mb-0">Completed</p>
                  </div>
                </div>
                <div className="text-end">
                  <div className={`fw-bold fs-4 ${selectedApplication.test.score >= 70 ? 'text-success' : 'text-warning'}`}>
                    {Number(selectedApplication.test.score).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}

            <h6 className="fw-bold text-dark mb-3">Resume Preview</h6>
            {isFetchingResume ? (
              <div className="text-center py-5 bg-light rounded border mb-4">
                <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                <div className="text-muted small">Loading secure resume preview...</div>
              </div>
            ) : typeof resumeData === 'string' ? (
              <div className="border rounded bg-light overflow-hidden mb-4" style={{ height: '450px' }}>
                <object
                  data={resumeData}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <i className="bi bi-file-earmark-pdf fs-1 mb-2"></i>
                    <p className="mb-2">Browser preview unavailable</p>
                    <a href={resumeData} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary rounded-pill">
                      Download / View PDF
                    </a>
                  </div>
                </object>
              </div>
            ) : (
              <div className="text-center py-5 bg-light rounded border mb-4 text-muted">
                <i className="bi bi-file-earmark-x fs-1 mb-2"></i>
                <p className="small mb-0">No resume found for this candidate.</p>
              </div>
            )}

            <div className="d-flex justify-content-end gap-3 border-top pt-3 mt-4">
              <button 
                className="btn btn-outline-danger fw-medium px-4 rounded-pill" 
                onClick={() => handleStatusUpdateClick('rejected')}
                disabled={isUpdating || selectedApplication.status === 'rejected'}
              >
                Reject Candidate
              </button>
              {selectedApplication.status === 'face_to_face_interview' ? (
                <button 
                  className="btn btn-success fw-medium px-4 rounded-pill shadow-sm" 
                  onClick={() => handleStatusUpdateClick('accepted')}
                  disabled={isUpdating || selectedApplication.status === 'accepted'}
                >
                  Accept Candidate
                </button>
              ) : selectedApplication.status === 'aptitude_round' ? (
                <button 
                  className="btn btn-success fw-medium px-4 rounded-pill shadow-sm" 
                  onClick={() => handleStatusUpdateClick('face_to_face_interview')}
                  disabled={isUpdating || !selectedApplication.test?.is_completed}
                >
                  Proceed to Face to Face
                </button>
              ) : (
                <button 
                  className="btn btn-success fw-medium px-4 rounded-pill shadow-sm" 
                  onClick={() => handleStatusUpdateClick('aptitude_round')}
                  disabled={isUpdating || selectedApplication.status === 'accepted' || selectedApplication.status === 'rejected' || selectedApplication.status === 'aptitude_round'}
                >
                  Proceed to Aptitude Round
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsPage;
