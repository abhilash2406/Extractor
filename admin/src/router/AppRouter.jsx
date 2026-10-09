import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AdminRoute, GuestRoute } from './Guards';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Feature pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/user/UsersPage';
import SubscriptionsPage from '../pages/subscription/SubscriptionsPage';
import PlansPage from '../pages/plan/PlansPage';
import FeedbackPage from '../pages/feedback/FeedbackPage';
import TemplatesPage from '../pages/template/TemplatesPage';
import TransactionsPage from '../pages/transaction/TransactionsPage';
import AIUsagePage from '../pages/ai-usage/AIUsagePage';
import SettingsPage from '../pages/settings/SettingsPage';

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
          { path: '/admin/subscriptions', element: <SubscriptionsPage /> },
          { path: '/admin/plans', element: <PlansPage /> },
          { path: '/admin/feedback', element: <FeedbackPage /> },
          { path: '/admin/templates', element: <TemplatesPage /> },
          { path: '/admin/transactions', element: <TransactionsPage /> },
          { path: '/admin/ai-usage', element: <AIUsagePage /> },
          { path: '/admin/settings', element: <SettingsPage /> },
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
