import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AppNavbar from '../components/layout/AppNavbar';
import { IconZap, IconUsers, IconBarChart, IconArrowRight, IconSearch, IconX, IconPlus } from '../components/ui/Icons';
import { SkeletonWorkspaceCard } from '../components/ui/Skeleton';

export default function Home() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { loadWorkspaces(); }, []);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/workspaces');
      const list = data.data || data;
      setWorkspaces(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur chargement des espaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post('/api/workspaces', form);
      const created = data.data || data;
      setWorkspaces(prev => [created, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '' });
      toast.success('Espace créé !');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur création');
    } finally {
      setCreating(false);
    }
  };

  const fmt = (d) => {
    try { return d ? new Date(d).toLocaleDateString('fr-FR') : ''; } catch { return ''; }
  };

  const filtered = workspaces.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <AppNavbar />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>

        {/* ── Hero ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1e2e 0%, #2d1b69 100%)',
          borderRadius: '20px', padding: '32px',
          marginBottom: '32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(124,58,237,0.15)', pointerEvents: 'none',
          }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            Bienvenue, {user?.name || user?.email}
          </h1>
          <p style={{ fontSize: '14px', color: '#9090b8', marginBottom: '24px' }}>
            {workspaces.length} espace{workspaces.length !== 1 ? 's' : ''} de travail
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontWeight: 600, fontSize: '14px',
                padding: '10px 20px', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              }}
            >
              + Créer un espace
            </button>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#c8c8e0', fontWeight: 500, fontSize: '14px',
                padding: '10px 20px', cursor: 'pointer',
              }}
            >
              {showAll ? 'Voir moins' : 'Voir tout'}
            </button>
          </div>
        </div>

        {/* ── Search ── */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un espace..."
            style={{
              width: '100%', maxWidth: '360px', padding: '10px 16px',
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '12px', fontSize: '14px', color: '#374151',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* ── Workspaces grid ── */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e' }}>
              {showAll ? 'Tous vos espaces' : 'Espaces récents'}
              <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: 400, color: '#9ca3af' }}>({filtered.length})</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {[1,2,3].map(i => <SkeletonWorkspaceCard key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 24px',
              background: '#fff', borderRadius: '16px',
              border: '2px dashed #e5e7eb',
            }}>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
                {search ? 'Aucun résultat' : 'Aucun espace de travail'}
              </p>
              {!search && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: '#7c3aed', color: '#fff', border: 'none',
                    borderRadius: '12px', padding: '10px 20px',
                    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Créer votre premier espace
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {displayed.map((ws) => (
                <WorkspaceCard key={ws._id} ws={ws} fmt={fmt} onClick={() => navigate(`/workspace/${ws._id}`)} />
              ))}
            </div>
          )}
        </section>

        {/* ── Features ── */}
        <section>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>
            Pourquoi Orbitask ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { Icon: IconZap, title: 'Gestion intuitive', desc: 'Créez et organisez vos tableaux Kanban en quelques clics.' },
              { Icon: IconUsers, title: 'Collaboration', desc: 'Invitez votre équipe et gérez les accès par workspace.' },
              { Icon: IconBarChart, title: 'Suivi clair', desc: 'Visualisez avancement, deadlines et priorités en un coup d\'œil.' },
            ].map(f => (
              <div key={f.title} style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '16px', padding: '20px',
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><f.Icon size={20} color="#7c3aed" /></div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Create Workspace Modal ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          animation: 'fadeIn 0.15s ease',
        }}
          onClick={e => { if (e.target === e.currentTarget && !creating) setShowModal(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            width: '100%', maxWidth: '440px', padding: '28px',
            animation: 'scaleIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a2e' }}>Créer un espace</h3>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={16} color='#9ca3af' />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Nom <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Projet Marketing"
                  maxLength={100} autoFocus
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1px solid #e5e7eb', borderRadius: '12px',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez l'objectif..."
                  maxLength={500}
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1px solid #e5e7eb', borderRadius: '12px',
                    fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)} disabled={creating}
                style={{
                  flex: 1, padding: '11px',
                  border: '1px solid #e5e7eb', borderRadius: '12px',
                  background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreate} disabled={!form.name.trim() || creating}
                style={{
                  flex: 1, padding: '11px',
                  background: !form.name.trim() || creating ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  border: 'none', borderRadius: '12px',
                  color: '#fff', fontSize: '14px', fontWeight: 600,
                  cursor: !form.name.trim() || creating ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {creating && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                {creating ? 'Création...' : "Créer l'espace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkspaceCard({ ws, fmt, onClick }) {
  const [hovered, setHovered] = useState(false);
  const initial = ws.name[0].toUpperCase();
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#a78bfa' : '#e5e7eb'}`,
        borderRadius: '16px', padding: '20px',
        cursor: 'pointer',
        boxShadow: hovered ? '0 8px 24px rgba(124,58,237,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: hovered ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : '#ede9fe',
        color: hovered ? '#fff' : '#7c3aed',
        fontWeight: 700, fontSize: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '12px', transition: 'all 0.2s',
      }}>
        {initial}
      </div>
      <h3 style={{
        fontSize: '14px', fontWeight: 600, color: '#1a1a2e',
        marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {ws.name}
      </h3>
      <p style={{
        fontSize: '12px', color: '#9ca3af', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        marginBottom: '12px',
      }}>
        {ws.description || 'Aucune description'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#d1d5db' }}>
          {ws.updatedAt ? `Modifié ${fmt(ws.updatedAt)}` : fmt(ws.createdAt)}
        </span>
        <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 500, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          Ouvrir
        </span>
      </div>
    </div>
  );
}