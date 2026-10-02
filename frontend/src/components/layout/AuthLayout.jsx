import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-wrapper">
      {/* Left Panel: Animated Visual/Branding */}
      <div className="auth-left-panel">
        {/* Animated background elements */}
        <div className="auth-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
          <div className="shape shape-7"></div>
          <div className="shape shape-8"></div>
        </div>

        {/* Grid overlay */}
        <div className="auth-grid-overlay"></div>

        {/* Gradient orbs */}
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>

        {/* Branding card */}
        <div className="auth-brand-card">
          <div className="auth-brand-icon">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          <h1 className="auth-brand-title">Extractor</h1>
          <p className="auth-brand-subtitle">
            Intelligent Talent Acquisition Platform
          </p>
          <div className="auth-brand-divider"></div>
          <p className="auth-brand-description">
            Streamline your hiring process with our intelligent ATS. 
            Identify top talent faster and smarter.
          </p>
          <div className="auth-brand-stats">
            <div className="auth-stat">
              <span className="auth-stat-number">10x</span>
              <span className="auth-stat-label">Faster Hiring</span>
            </div>
            <div className="auth-stat-divider"></div>
            <div className="auth-stat">
              <span className="auth-stat-number">95%</span>
              <span className="auth-stat-label">Accuracy</span>
            </div>
            <div className="auth-stat-divider"></div>
            <div className="auth-stat">
              <span className="auth-stat-number">500+</span>
              <span className="auth-stat-label">Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          {/* Mobile Branding */}
          <div className="auth-mobile-brand">
            <div className="auth-mobile-icon">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>
            <span className="auth-mobile-name">Extractor</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">{title}</h2>
            {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
