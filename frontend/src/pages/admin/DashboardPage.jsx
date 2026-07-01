import { useDashboardStats } from '../../hooks/useDashboard';

const DashboardPage = () => {
  const { data: stats, isLoading, isError } = useDashboardStats();

  const metrics = [
    {
      title: 'Total Candidates',
      value: stats?.totalCandidates || 0,
      icon: 'bi-people',
      colorClass: 'text-primary',
      bgClass: 'bg-primary-subtle',
    },
    {
      title: 'Total Job Roles',
      value: stats?.totalJobRoles || 0,
      icon: 'bi-briefcase',
      colorClass: 'text-success',
      bgClass: 'bg-success-subtle',
    },
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      icon: 'bi-file-earmark-text',
      colorClass: 'text-warning',
      bgClass: 'bg-warning-subtle',
    },
    {
      title: 'Approved Candidates',
      value: stats?.approvedCandidates || 0,
      icon: 'bi-check-circle',
      colorClass: 'text-info',
      bgClass: 'bg-info-subtle',
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold tracking-tight text-dark mb-1">Dashboard Overview</h4>
        <p className="text-muted small">A quick glance at your platform's metrics.</p>
      </div>

      {isLoading ? (
        <div className="row g-4">
          {[...Array(4)].map((_, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="card border-0 rounded-4 shadow-soft placeholder-glow">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="placeholder col-3 rounded-circle me-3" style={{ height: '56px', width: '56px' }}></div>
                  <div className="w-100">
                    <span className="placeholder col-8 mb-2"></span>
                    <span className="placeholder col-5 placeholder-lg d-block"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="alert alert-danger shadow-soft border-0 rounded-4 text-center py-4">
          <i className="bi bi-exclamation-triangle fs-4 d-block mb-2"></i>
          Failed to load dashboard statistics.
        </div>
      ) : (
        <div className="row g-4">
          {metrics.map((metric, idx) => (
            <div className="col-md-6 col-lg-3" key={idx}>
              <div className="card border-0 rounded-4 shadow-soft h-100 transition-hover">
                <div className="card-body p-4 d-flex align-items-center">
                  <div 
                    className={`${metric.bgClass} ${metric.colorClass} rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0`}
                    style={{ width: '56px', height: '56px' }}
                  >
                    <i className={`bi ${metric.icon} fs-4`}></i>
                  </div>
                  <div>
                    <h6 className="text-muted fw-semibold mb-1 text-uppercase small tracking-wide" style={{ letterSpacing: '0.5px' }}>
                      {metric.title}
                    </h6>
                    <h3 className="fw-bold text-dark mb-0 tracking-tight">
                      {metric.value.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
