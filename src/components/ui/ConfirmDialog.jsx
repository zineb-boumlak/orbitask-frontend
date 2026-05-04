export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false, loading = false }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '400px',
          padding: '28px',
          animation: 'scaleIn 0.2s ease',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px', marginBottom: '16px',
          background: danger ? '#fef2f2' : '#f5f3ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
        }}>
          {danger ? '🗑️' : '❓'}
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e', marginBottom: '8px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: '11px',
              border: '1px solid #e5e7eb', borderRadius: '12px',
              background: '#fff', color: '#374151',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '11px',
              border: 'none', borderRadius: '12px',
              background: danger ? '#ef4444' : '#7c3aed',
              color: '#fff',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            {loading && (
              <span style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                display: 'inline-block',
              }} />
            )}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}