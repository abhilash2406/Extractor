import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-[95vw]',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideHeader = false, dialogStyle = {} }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div 
        className={cn(
          "relative z-10 w-full rounded-2xl bg-card border border-border/80 text-card-foreground shadow-2xl transition-all duration-200 animate-in fade-in-0 zoom-in-95 my-auto max-h-[90vh] flex flex-col overflow-hidden",
          sizeClasses[size] || sizeClasses.md
        )}
        style={dialogStyle}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        )}

        <div className={cn("overflow-y-auto p-6 flex-grow", hideHeader && "p-0")}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
