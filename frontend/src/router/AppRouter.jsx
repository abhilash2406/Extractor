import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './Guards';

// Public Layout & Pages
import PublicLayout from '../components/layout/PublicLayout';
import LandingPage from '../pages/LandingPage';
import ResumeBuilderPage from '../pages/public/ResumeBuilderPage';
import ResumeAnalyzerPage from '../pages/public/ResumeAnalyzerPage';
import AtsCheckerPage from '../pages/public/AtsCheckerPage';
import TemplatesPage from '../pages/public/TemplatesPage';
import CoverLetterPage from '../pages/public/CoverLetterPage';
import InterviewPrepPage from '../pages/public/InterviewPrepPage';
import PricingPage from '../pages/public/PricingPage';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Candidate pages
import CandidateDashboardPage from '../pages/candidate/CandidateDashboardPage';
import JobListPage from '../pages/candidate/JobListPage';
import JobDetailPage from '../pages/candidate/JobDetailPage';
import CandidateApplicationsPage from '../pages/candidate/CandidateApplicationsPage';
import CandidateTestsPage from '../pages/candidate/CandidateTestsPage';
import TestTakingPage from '../pages/candidate/TestTakingPage';

// Layout
import CandidateLayout from '../components/layout/CandidateLayout';

const router = createBrowserRouter([
  // Public Marketing & Tool Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/builder', element: <ResumeBuilderPage /> },
      { path: '/analyze', element: <ResumeAnalyzerPage /> },
      { path: '/ats-checker', element: <AtsCheckerPage /> },
      { path: '/templates', element: <TemplatesPage /> },
      { path: '/cover-letter', element: <CoverLetterPage /> },
      { path: '/interview-prep', element: <InterviewPrepPage /> },
    ],
  },

  // Guest-only routes
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  
  // Public verification routes
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },

  // Protected Candidate / User routes (Login Required)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CandidateLayout />,
        children: [
          { path: '/dashboard', element: <CandidateDashboardPage /> },
          { path: '/pricing', element: <PricingPage /> },
          { path: '/jobs', element: <JobListPage /> },
          { path: '/jobs/:id', element: <JobDetailPage /> },
          { path: '/applications', element: <CandidateApplicationsPage /> },
          { path: '/tests', element: <CandidateTestsPage /> },
          { path: '/tests/:id', element: <TestTakingPage /> },
        ],
      },
    ],
  },

  // Fallback redirect to Landing Page
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
