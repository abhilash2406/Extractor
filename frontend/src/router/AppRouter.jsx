import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { GuestRoute } from './Guards';

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
      { path: '/pricing', element: <PricingPage /> },
      { path: '/dashboard', element: <Navigate to="/" replace /> },
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

  // Fallback redirect to Landing Page
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
