import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import { queryClient } from './utils/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster 
        position="bottom-right" 
        gutter={8}
        containerStyle={{
          bottom: 24,
          right: 24,
          zIndex: 99999,
        }}
        toastOptions={{ 
          duration: 3000,
          style: {
            background: 'rgba(15, 23, 42, 0.94)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '9px 14px',
            fontSize: '12.5px',
            fontWeight: '500',
            lineHeight: '1.4',
            letterSpacing: '-0.01em',
            boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          success: {
            duration: 2600,
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
            style: {
              border: '1px solid rgba(16, 185, 129, 0.25)',
              background: 'rgba(15, 23, 42, 0.95)',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#0f172a',
            },
            style: {
              border: '1px solid rgba(244, 63, 94, 0.3)',
              background: 'rgba(15, 23, 42, 0.95)',
            },
          },
          loading: {
            iconTheme: {
              primary: '#6366f1',
              secondary: 'rgba(99, 102, 241, 0.2)',
            },
          },
        }} 
      />
    </QueryClientProvider>
  );
}
