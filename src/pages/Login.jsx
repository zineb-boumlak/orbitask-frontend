import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0a2e 60%, #0f0f1a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 16px 40px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#a78bfa', letterSpacing: '-1px', marginBottom: '6px' }}>
              Orbitask
            </h1>
          </Link>
          <p style={{ fontSize: '14px', color: '#6b6b8a' }}>
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1e1e2e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '24px' }}>
            Connexion
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 14px',
              fontSize: '13px', color: '#fca5a5', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9090b8', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required autoFocus
                placeholder="vous@exemple.com"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', color: '#fff', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9090b8', marginBottom: '6px' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', color: '#fff', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontSize: '14px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity 0.2s',
                marginTop: '4px',
              }}
            >
              {loading && (
                <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }} />
              )}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b6b8a', marginTop: '24px' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}