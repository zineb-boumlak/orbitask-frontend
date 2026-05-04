import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '!',
  info:    'i',
};

const STYLES = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#10b981' },
  error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
  warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
  info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', dot: '#3b82f6' },
};

function ToastItem({ toast, onClose }) {
  const s = STYLES[toast.type] || STYLES.info;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: '280px',
        maxWidth: '400px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        animation: 'slideInRight 0.25s ease both',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: s.dot, borderRadius: '12px 0 0 12px' }} />

      {/* Icon */}
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: s.dot, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 700, flexShrink: 0, marginLeft: '4px',
      }}>
        {ICONS[toast.type]}
      </div>

      {/* Message */}
      <span style={{ fontSize: '13px', color: s.text, flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </span>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: s.text, opacity: 0.4, fontSize: '14px', padding: '0',
          flexShrink: 0, lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info:    (msg, dur) => addToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem
              toast={t}
              onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}