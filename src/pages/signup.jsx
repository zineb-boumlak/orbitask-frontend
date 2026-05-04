import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Compte créé avec succès !');
      navigate('/home');
    } else {
      toast.error(result.error);
    }
  };

  const fields = [
    { key: 'name',     label: "Nom d'utilisateur", type: 'text',     placeholder: 'Votre nom' },
    { key: 'email',    label: 'Email',              type: 'email',    placeholder: 'vous@exemple.com' },
    { key: 'password', label: 'Mot de passe',       type: 'password', placeholder: '8 caractères minimum' },
  ];

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
            Créez votre espace de travail
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
            Inscription
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9090b8', marginBottom: '6px' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required
                  placeholder={placeholder}
                  autoFocus={key === 'name'}
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
            ))}

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
              {loading ? 'Création...' : "S'inscrire"}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b6b8a', marginTop: '24px' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}