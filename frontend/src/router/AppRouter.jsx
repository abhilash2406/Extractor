import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

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

  // Auth & Password Recovery Redirects to seamless Modal-based Flow
  { path: '/login', element: <Navigate to="/?auth=login" replace /> },
  { path: '/register', element: <Navigate to="/?auth=register" replace /> },
  { path: '/verify-email', element: <Navigate to="/?auth=otp" replace /> },
  { path: '/forgot-password', element: <Navigate to="/?auth=forgot-password" replace /> },
  { path: '/reset-password', element: <Navigate to="/?auth=reset-password" replace /> },

  // Fallback redirect to Landing Page
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
