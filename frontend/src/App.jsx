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
        toastOptions={{ 
          duration: 3000,
          className: 'rounded-xl shadow-lg border border-border bg-card text-card-foreground text-sm font-medium',
        }} 
      />
    </QueryClientProvider>
  );
}
