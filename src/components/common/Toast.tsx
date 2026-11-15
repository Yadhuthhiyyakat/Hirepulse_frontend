import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ title?: string; message: string; type?: 'success' | 'error' | 'info' }>;
      const newToast: ToastMessage = {
        id: Math.random().toString(36).substring(2, 9),
        title: customEvent.detail.title,
        message: customEvent.detail.message,
        type: customEvent.detail.type || 'info',
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    };

    window.addEventListener('app:toast', handleToastEvent);
    return () => window.removeEventListener('app:toast', handleToastEvent);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white rounded-xl shadow-xl border border-slate-200 transition-all transform translate-y-0"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />}

          <div className="flex-1">
            {toast.title && <p className="text-sm font-semibold text-slate-800">{toast.title}</p>}
            <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
  window.dispatchEvent(
    new CustomEvent('app:toast', {
      detail: { message, type, title },
    })
  );
};

