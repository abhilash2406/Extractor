import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './Guards';

// Public Landing Page
import LandingPage from '../pages/LandingPage';

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
  // Public Landing Page
  { path: '/', element: <LandingPage /> },

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

  // Protected Candidate / User routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CandidateLayout />,
        children: [
          { path: '/dashboard', element: <CandidateDashboardPage /> },
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
