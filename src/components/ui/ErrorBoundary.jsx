import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f1a',
          padding: '24px',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚡</div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Une erreur est survenue
          </h1>
          <p style={{ fontSize: '14px', color: '#6b6b8a', marginBottom: '8px', lineHeight: 1.6 }}>
            {this.state.error?.message || 'Erreur inattendue'}
          </p>
          <p style={{ fontSize: '13px', color: '#4a4a6a', marginBottom: '32px' }}>
            Rechargez la page ou retournez à l'accueil.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#7c3aed', color: '#fff',
                border: 'none', borderRadius: '12px',
                padding: '10px 20px', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Recharger
            </button>
            <button
              onClick={() => { window.location.href = '/home'; }}
              style={{
                background: 'transparent', color: '#a78bfa',
                border: '1px solid rgba(167,139,250,0.3)', borderRadius: '12px',
                padding: '10px 20px', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
}