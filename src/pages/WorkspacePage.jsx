import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AppNavbar from '../components/layout/AppNavbar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { SkeletonTableCard, SkeletonMemberRow } from '../components/ui/Skeleton';
import { IconPlus, IconUsers, IconUserPlus, IconEdit, IconTrash, IconX, IconTable, IconArrowRight } from '../components/ui/Icons';

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [workspace, setWorkspace] = useState(null);
  const [tables, setTables] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  // Modals
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);
  const [tableName, setTableName] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, tableId: null });

  const fmt = (d) => { try { return d ? new Date(d).toLocaleDateString('fr-FR') : '—'; } catch { return '—'; } };

  // ── Fetch workspace ─────────────────────────────────────────────────────────
  const fetchWorkspace = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/workspaces/${workspaceId}`);
      if (!data.success) throw new Error(data.error);
      setWorkspace(data.data);
    } catch (err) {
      if (err.response?.status === 404) { toast.error('Workspace introuvable'); navigate('/home'); }
      else if (err.response?.status === 403) { toast.error('Accès non autorisé'); navigate('/home'); }
      else toast.error(err.response?.data?.error || err.message);
    }
  }, [workspaceId, navigate]);

  // ── Fetch tables ────────────────────────────────────────────────────────────
  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/workspaces/${workspaceId}/tables`);
      setTables(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur chargement tableaux');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  // ── Fetch members ───────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const { data } = await api.get(`/api/workspaces/${workspaceId}/members`);
      if (!data.success) throw new Error(data.error);
      setMembers(data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur chargement membres');
    } finally {
      setMembersLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchWorkspace();
    fetchTables();
  }, [fetchWorkspace, fetchTables]);

  // ── Create / update table ───────────────────────────────────────────────────
  const handleSaveTable = async () => {
    if (!tableName.trim()) return;
    setTableLoading(true);
    try {
      if (tableToEdit) {
        const { data } = await api.put(`/api/workspaces/${workspaceId}/tables/${tableToEdit}`, { name: tableName.trim() });
        setTables(prev => prev.map(t => t._id === tableToEdit ? data.data : t));
        toast.success('Tableau modifié !');
      } else {
        const { data } = await api.post(`/api/workspaces/${workspaceId}/tables`, { name: tableName.trim() });
        setTables(prev => [...prev, data.data]);
        toast.success('Tableau créé !');
      }
      setShowTableModal(false);
      setTableToEdit(null);
      setTableName('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setTableLoading(false);
    }
  };

  // ── Delete table ────────────────────────────────────────────────────────────
  const handleDeleteTable = async () => {
    const tableId = confirmDelete.tableId;
    setConfirmDelete({ open: false, tableId: null });
    try {
      await api.delete(`/api/workspaces/${workspaceId}/tables/${tableId}`);
      setTables(prev => prev.filter(t => t._id !== tableId));
      toast.success('Tableau supprimé');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur suppression');
    }
  };

  // ── Invite member ───────────────────────────────────────────────────────────
  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    try {
      await api.post(`/api/workspaces/${workspaceId}/invite`, { email: inviteEmail.trim() });
      toast.success('Membre invité !');
      setShowInviteModal(false);
      setInviteEmail('');
      if (showMembers) fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const isOwner = workspace?.owner?._id === user?.id || workspace?.owner?.id === user?.id;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <AppNavbar
        workspaceName={workspace?.name}
        workspaceId={workspaceId}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
              {workspace?.name || 'Chargement...'}
            </h1>
            {workspace?.description && (
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>{workspace.description}</p>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Btn onClick={() => { setTableToEdit(null); setTableName(''); setShowTableModal(true); }} primary>
              + Créer un tableau
            </Btn>
            <Btn onClick={() => { setShowMembers(!showMembers); if (!showMembers && members.length === 0) fetchMembers(); }}>
              {showMembers ? 'Masquer l\'équipe' : "L'équipe"}
            </Btn>
            {isOwner && (
              <Btn onClick={() => setShowInviteModal(true)} accent>
                + Inviter
              </Btn>
            )}
          </div>
        </div>

        {/* ── Members panel ── */}
        {showMembers && (
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '16px', padding: '20px', marginBottom: '24px',
            animation: 'slideInUp 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e' }}>
                Équipe ({members.length})
              </h3>
              {isOwner && (
                <button onClick={() => setShowInviteModal(true)}
                  style={{ fontSize: '13px', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><IconUserPlus size={14} /> Inviter un membre
                </button>
              )}
            </div>
            {membersLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1,2].map(i => <SkeletonMemberRow key={i} />)}
              </div>
            ) : members.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '16px' }}>Aucun membre</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {members.map((m, i) => {
                  const u = m.user || m;
                  const isAdmin = m.role === 'admin';
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', background: '#f9fafb', borderRadius: '12px',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: isAdmin ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : '#ede9fe',
                        color: isAdmin ? '#fff' : '#7c3aed',
                        fontWeight: 600, fontSize: '13px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name || 'Sans nom'}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                      </div>
                      <span style={{
                        fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px',
                        background: isAdmin ? '#ede9fe' : '#f3f4f6',
                        color: isAdmin ? '#7c3aed' : '#6b7280',
                      }}>
                        {isAdmin ? 'Admin' : 'Membre'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tables grid ── */}
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '16px', padding: '24px',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>
            Tableaux <span style={{ color: '#9ca3af', fontWeight: 400 }}>({tables.length})</span>
          </h2>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {[1,2,3].map(i => <SkeletonTableCard key={i} />)}
            </div>
          ) : tables.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              border: '2px dashed #e5e7eb', borderRadius: '12px',
            }}>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>Aucun tableau</p>
              <button
                onClick={() => { setTableToEdit(null); setTableName(''); setShowTableModal(true); }}
                style={{ fontSize: '13px', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                + Créer le premier tableau
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {tables.map(table => (
                <TableCard
                  key={table._id}
                  table={table}
                  fmt={fmt}
                  isOwner={isOwner}
                  onClick={() => navigate(`/table/${table._id}`)}
                  onEdit={(e) => {
                    e.stopPropagation();
                    setTableToEdit(table._id);
                    setTableName(table.name);
                    setShowTableModal(true);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setConfirmDelete({ open: true, tableId: table._id });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table Modal ── */}
      {showTableModal && (
        <Modal onClose={() => !tableLoading && setShowTableModal(false)}
          title={tableToEdit ? 'Modifier le tableau' : 'Créer un tableau'}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            Nom du tableau
          </label>
          <input
            type="text" value={tableName}
            onChange={e => setTableName(e.target.value)}
            placeholder="Ex: Roadmap Q1"
            maxLength={100} autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSaveTable()}
            style={{
              width: '100%', padding: '11px 14px',
              border: '1px solid #e5e7eb', borderRadius: '12px',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '20px',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Btn onClick={() => { setShowTableModal(false); setTableToEdit(null); setTableName(''); }} disabled={tableLoading}>
              Annuler
            </Btn>
            <Btn primary onClick={handleSaveTable} disabled={!tableName.trim() || tableLoading} loading={tableLoading}>
              {tableToEdit ? 'Enregistrer' : 'Créer'}
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── Invite Modal ── */}
      {showInviteModal && (
        <Modal onClose={() => !inviteLoading && setShowInviteModal(false)} title="Inviter un membre">
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            Adresse email
          </label>
          <input
            type="email" value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="utilisateur@exemple.com"
            disabled={inviteLoading} autoFocus
            onKeyDown={e => e.key === 'Enter' && handleInvite()}
            style={{
              width: '100%', padding: '11px 14px',
              border: '1px solid #e5e7eb', borderRadius: '12px',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '20px',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Btn onClick={() => setShowInviteModal(false)} disabled={inviteLoading}>Annuler</Btn>
            <Btn primary onClick={handleInvite} disabled={!inviteEmail.trim() || inviteLoading} loading={inviteLoading}>
              Inviter
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── Confirm delete ── */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer le tableau ?"
        message="Toutes les tâches associées seront supprimées. Cette action est irréversible."
        danger
        onConfirm={handleDeleteTable}
        onCancel={() => setConfirmDelete({ open: false, tableId: null })}
      />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TableCard({ table, fmt, isOwner, onClick, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#f9fafb', border: `1px solid ${hovered ? '#a78bfa' : '#e5e7eb'}`,
        borderRadius: '12px', padding: '16px', cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 16px rgba(124,58,237,0.1)' : 'none',
        transition: 'all 0.2s', position: 'relative',
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: hovered ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : '#ede9fe',
        color: hovered ? '#fff' : '#7c3aed',
        fontWeight: 700, fontSize: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px',
        transition: 'all 0.2s',
      }}>
        {table.name[0].toUpperCase()}
      </div>
      <h3 style={{
        fontSize: '13px', fontWeight: 600, color: '#1a1a2e',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px',
      }}>
        {table.name}
      </h3>
      <p style={{ fontSize: '11px', color: '#d1d5db' }}>
        Créé le {fmt(table.createdAt)}
      </p>

      {/* Action buttons */}
      {hovered && isOwner && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          display: 'flex', gap: '4px',
          animation: 'fadeIn 0.1s ease',
        }}>
          <button onClick={onEdit} style={{
            width: '26px', height: '26px', border: '1px solid #e5e7eb',
            borderRadius: '8px', background: '#fff', cursor: 'pointer',
            fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={12} color="#6b7280" /></button>
          <button onClick={onDelete} style={{
            width: '26px', height: '26px', border: '1px solid #fee2e2',
            borderRadius: '8px', background: '#fff', cursor: 'pointer',
            fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash size={12} color="#ef4444" /></button>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      animation: 'fadeIn 0.15s ease',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '20px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        width: '100%', maxWidth: '420px', padding: '28px',
        animation: 'scaleIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}><IconX size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Btn({ children, onClick, primary, accent, disabled, loading, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: '10px 16px',
        border: primary || accent ? 'none' : '1px solid #e5e7eb',
        borderRadius: '12px',
        background: primary ? (disabled ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)')
          : accent ? '#ede9fe' : '#fff',
        color: primary ? '#fff' : accent ? '#7c3aed' : '#374151',
        fontSize: '14px', fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        whiteSpace: 'nowrap',
      }}
      {...rest}
    >
      {loading && (
        <span style={{
          width: '14px', height: '14px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', display: 'inline-block',
        }} />
      )}
      {children}
    </button>
  );
}