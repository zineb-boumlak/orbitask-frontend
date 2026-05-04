import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0a2e 60%, #0f0f1a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '96px', fontWeight: 800, color: '#7c3aed', lineHeight: 1, marginBottom: '16px' }}>
          404
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
          Page introuvable
        </h1>
        <p style={{ fontSize: '14px', color: '#6b6b8a', marginBottom: '32px' }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          color: '#fff', textDecoration: 'none',
          padding: '12px 28px', borderRadius: '12px',
          fontWeight: 600, fontSize: '14px',
        }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}