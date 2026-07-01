import { NavLink, Outlet } from 'react-router-dom';
import UserMenu from './UserMenu';

const navItems = [
  { to: '/jobs', label: 'Browse Jobs', icon: 'bi-briefcase', end: false },
  { to: '/applications', label: 'Applied Jobs', icon: 'bi-clipboard-check', end: true },
  { to: '/tests', label: 'Tests', icon: 'bi-journal-check', end: false },
];

const CandidateLayout = () => {

  return (
    <div className="w-100" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Stylish Sidebar */}
      <aside className="d-flex flex-column border-end bg-white flex-shrink-0" style={{ width: '250px', minWidth: '250px', minHeight: '100vh', zIndex: 10 }}>
        <div className="px-4 py-4 mb-2 d-flex align-items-center gap-2">
          <div className="bg-primary rounded text-white d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          <span className="fs-5 fw-bold tracking-tight" style={{color: '#0f172a'}}>Extractor</span>
        </div>
        
        <nav className="nav flex-column px-3 gap-1 flex-grow-1 mt-2">
          <div className="text-muted small fw-bold text-uppercase mb-2 px-2" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Explore</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link px-3 py-2 d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} fs-6`}></i>
              <span className="fw-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-top mt-auto">
          <UserMenu roleLabel="Candidate" />
        </div>
      </aside>

      {/* Main area */}
      <div className="d-flex flex-column flex-grow-1 bg-light" style={{ overflow: 'hidden' }}>
        <main className="flex-grow-1 overflow-auto p-5">
          <div className="container-fluid max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
