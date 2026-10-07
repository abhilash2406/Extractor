import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AdminRoute, GuestRoute } from './Guards';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Admin pages
import DashboardPage from '../pages/admin/DashboardPage';
import UsersPage from '../pages/admin/UsersPage';
import TemplatesPage from '../pages/admin/TemplatesPage';
import TransactionsPage from '../pages/admin/TransactionsPage';
import SubscriptionsPage from '../pages/admin/SubscriptionsPage';
import AIUsagePage from '../pages/admin/AIUsagePage';
import SettingsPage from '../pages/admin/SettingsPage';
import JobsPage from '../pages/admin/JobsPage';
import SkillsPage from '../pages/admin/SkillsPage';
import QuestionsPage from '../pages/admin/QuestionsPage';
import ApplicationsPage from '../pages/admin/ApplicationsPage';

// Layout
import AdminLayout from '../components/layout/AdminLayout';

const router = createBrowserRouter([
  // Guest-only auth routes
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  { path: '/reset-password', element: <ResetPasswordPage /> },

  // Admin routes
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <DashboardPage /> },
          { path: '/admin/users', element: <UsersPage /> },
          { path: '/admin/templates', element: <TemplatesPage /> },
          { path: '/admin/transactions', element: <TransactionsPage /> },
          { path: '/admin/subscriptions', element: <SubscriptionsPage /> },
          { path: '/admin/ai-usage', element: <AIUsagePage /> },
          { path: '/admin/settings', element: <SettingsPage /> },
          { path: '/admin/jobs', element: <JobsPage /> },
          { path: '/admin/skills', element: <SkillsPage /> },
          { path: '/admin/questions', element: <QuestionsPage /> },
          { path: '/admin/applications', element: <ApplicationsPage /> },
        ],
      },
    ],
  },

  // Default redirect
  { path: '/', element: <Navigate to="/admin" replace /> },
  { path: '*', element: <Navigate to="/admin" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
