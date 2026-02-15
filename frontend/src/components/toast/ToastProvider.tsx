"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import './toast.scss';

type ToastType = 'success' | 'error' | 'info';
type ToastItem = { id: string; type: ToastType; message: string };

type ToastContextValue = {
  showToast: (message: string, type?: ToastType, timeoutMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', timeoutMs = 4000) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    const item: ToastItem = { id, type, message };
    setToasts(t => [item, ...t]);
    if (timeoutMs > 0) setTimeout(() => remove(id), timeoutMs);
  }, [remove]);

  useEffect(() => {
    const onAdd = (e: Event) => {
      const ev = e as CustomEvent<{ title?: string }>;
      const title = ev?.detail?.title;
      const msg = title ? `Dodato u korpu: ${title}` : 'Dodato u korpu';
      showToast(msg, 'success', 3000);
    };

    const onGeneric = (e: Event) => {
      const ev = e as CustomEvent<{ message: string; type?: ToastType; timeoutMs?: number }>;
      if (!ev?.detail?.message) return;
      showToast(ev.detail.message, ev.detail.type ?? 'info', ev.detail.timeoutMs ?? 4000);
    };

    window.addEventListener('pv:add-to-cart', onAdd as EventListener);
    window.addEventListener('pv:toast', onGeneric as EventListener);
    return () => {
      window.removeEventListener('pv:add-to-cart', onAdd as EventListener);
      window.removeEventListener('pv:toast', onGeneric as EventListener);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pv-toast-root" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`pv-toast pv-toast-${t.type}`} role="status">
            <div className="pv-toast-message">{t.message}</div>
            <button className="pv-toast-close" onClick={() => remove(t.id)} aria-label="Zatvori">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
