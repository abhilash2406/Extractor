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
        position="top-right" 
        gutter={10}
        containerStyle={{
          top: 24,
          right: 24,
        }}
        toastOptions={{ 
          duration: 3500,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '14px',
            padding: '12px 18px',
            fontSize: '13px',
            fontWeight: '600',
            lineHeight: '1.4',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
          loading: {
            iconTheme: {
              primary: '#6366F1',
              secondary: 'rgba(99, 102, 241, 0.2)',
            },
          },
        }} 
      />
    </QueryClientProvider>
  );
}
