// pages/TablePage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useTaskManager } from '../hooks/useTaskManager';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import AppNavbar from '../components/layout/AppNavbar';
import KanbanBoard from '../components/kanban/KanbanBoard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { SkeletonKanban } from '../components/ui/Skeleton';

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Faible',  color: '#10b981' },
  { value: 'medium', label: 'Moyenne', color: '#3b82f6' },
  { value: 'high',   label: 'Haute',   color: '#f97316' },
  { value: 'urgent', label: 'Urgent',  color: '#ef4444' },
];

const LABEL_COLORS = ['#7c3aed','#3b82f6','#10b981','#f97316','#ef4444','#ec4899','#f59e0b','#6366f1'];

const STATUS_LABELS = { todo: 'À faire', doing: 'En cours', done: 'Terminé' };

export default function TablePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const {
    tasks, loading, actionLoading,
    fetchTasks, addTask, moveTask,
    updateTask, updateTaskColor, updateTaskPriority,
    deleteTask, addComment,
  } = useTaskManager(id);

  const [table, setTable]               = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [members, setMembers]           = useState([]);

  // ── New task form ────────────────────────────────────────────────────────────
  const [newTitle, setNewTitle]       = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [newColor, setNewColor]       = useState('#ffffff');

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [search, setSearch]               = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterLabel, setFilterLabel]     = useState('');
  const [showFilters, setShowFilters]     = useState(false);

  // ── Task modal ───────────────────────────────────────────────────────────────
  const [modalTask, setModalTask]         = useState(null);
  const [editTitle, setEditTitle]         = useState('');
  const [editPriority, setEditPriority]   = useState('medium');
  const [editDeadline, setEditDeadline]   = useState('');
  const [editAssignees, setEditAssignees] = useState([]);
  const [editLabels, setEditLabels]       = useState([]);
  const [newLabelName, setNewLabelName]   = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#7c3aed');
  const [commentText, setCommentText]     = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [saving, setSaving]               = useState(false);

  // ── Delete confirm ───────────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState({ open: false, taskId: null });

  // ── Fetch table + tasks ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/tables/${id}`);
        if (!data.success) throw new Error(data.error);
        setTable(data.data);

        // Fetch workspace members for assignee picker
        if (data.data.workspace) {
          const workspaceId = data.data.workspace._id || data.data.workspace;
          const r = await api.get(`/api/workspaces/${workspaceId}/members`);
          if (r.data.success) setMembers(r.data.data.map(m => m.user));
        }
      } catch {
        toast.error('Table introuvable');
        navigate('/home');
      } finally {
        setTableLoading(false);
      }
    };
    load();
    fetchTasks();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Open modal ───────────────────────────────────────────────────────────────
  const openModal = (task) => {
    setModalTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority || 'medium');
    setEditDeadline(task.deadline ? task.deadline.slice(0, 10) : '');
    setEditAssignees((task.assignees || []).map(a => a._id || a));
    setEditLabels(task.labels || []);
    setCommentText('');
  };

  // ── Save modal ───────────────────────────────────────────────────────────────
  const handleSaveModal = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    const ok = await updateTask(modalTask._id, {
      title: editTitle.trim(),
      priority: editPriority,
      deadline: editDeadline || null,
      assignees: editAssignees,
      labels: editLabels,
    });
    setSaving(false);
    if (ok) {
      setModalTask(prev => ({
        ...prev,
        title: editTitle.trim(), priority: editPriority,
        deadline: editDeadline || null, assignees: editAssignees, labels: editLabels,
      }));
    }
  };

  // ── Add task ─────────────────────────────────────────────────────────────────
  const handleAddTask = async (e) => {
    e.preventDefault();
    const ok = await addTask({ title: newTitle, priority: newPriority, deadline: newDeadline || null, color: newColor });
    if (ok) { setNewTitle(''); setNewPriority('medium'); setNewDeadline(''); setNewColor('#ffffff'); }
  };

  // ── Comment ──────────────────────────────────────────────────────────────────
  const handleAddComment = async () => {
    if (!commentText.trim() || !modalTask) return;
    setCommentLoading(true);
    const ok = await addComment(modalTask._id, commentText);
    if (ok) {
      // Refresh modal task comments from tasks state
      setCommentText('');
    }
    setCommentLoading(false);
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    const taskId = confirmDelete.taskId;
    setConfirmDelete({ open: false, taskId: null });
    if (modalTask?._id === taskId) setModalTask(null);
    await deleteTask(taskId);
  };

  // ── Filtered tasks ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = tasks;
    if (search.trim()) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filterPriority) list = list.filter(t => t.priority === filterPriority);
    if (filterAssignee) list = list.filter(t => (t.assignees || []).some(a => (a._id || a) === filterAssignee));
    if (filterLabel) list = list.filter(t => (t.labels || []).some(l => l.name === filterLabel));
    return list;
  }, [tasks, search, filterPriority, filterAssignee, filterLabel]);

  const activeFilters = [filterPriority, filterAssignee, filterLabel].filter(Boolean).length;

  if (tableLoading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppNavbar />
      <div style={{ padding: '32px 24px' }}><SkeletonKanban /></div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppNavbar
        workspaceName={table?.workspace?.name}
        workspaceId={table?.workspace?._id || table?.workspace}
        tableName={table?.name}
      />

      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{table?.name}</h1>
          <p style={{ fontSize: '13px', color: '#6b6b8a' }}>{tasks.length} tâche{tasks.length !== 1 ? 's' : ''} au total</p>
        </div>

        {/* ── Add task form ── */}
        <div style={{
          background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px', padding: '16px', marginBottom: '20px',
        }}>
          <form onSubmit={handleAddTask}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 220px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b6b8a', marginBottom: '5px', fontWeight: 500 }}>Titre *</label>
                <input
                  type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ajouter une tâche..." required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div style={{ flex: '0 1 130px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b6b8a', marginBottom: '5px', fontWeight: 500 }}>Priorité</label>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={inputStyle}>
                  {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value} style={{ background: '#1e1e2e' }}>{p.label}</option>)}
                </select>
              </div>
              <div style={{ flex: '0 1 150px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b6b8a', marginBottom: '5px', fontWeight: 500 }}>Deadline</label>
                <input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} style={inputStyle} />
              </div>
              <button type="submit" disabled={!newTitle.trim() || actionLoading}
                style={{
                  padding: '10px 20px', borderRadius: '10px', border: 'none',
                  background: !newTitle.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  color: '#fff', fontWeight: 600, fontSize: '14px',
                  cursor: !newTitle.trim() ? 'not-allowed' : 'pointer',
                }}>
                + Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* ── Search + Filters ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher..."
            style={{ ...inputStyle, maxWidth: '240px', flex: '1 1 180px' }}
          />
          <button onClick={() => setShowFilters(!showFilters)} style={{
            padding: '9px 14px', borderRadius: '10px',
            border: `1px solid ${activeFilters > 0 ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
            background: activeFilters > 0 ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
            color: activeFilters > 0 ? '#a78bfa' : '#9090b8', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            ⚙ Filtres {activeFilters > 0 && <span style={{
              background: '#7c3aed', color: '#fff', borderRadius: '50%',
              width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{activeFilters}</span>}
          </button>
          {activeFilters > 0 && (
            <button onClick={() => { setFilterPriority(''); setFilterAssignee(''); setFilterLabel(''); }}
              style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}>
              Réinitialiser
            </button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={{
            background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '16px', marginBottom: '20px',
            display: 'flex', gap: '12px', flexWrap: 'wrap',
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#6b6b8a', marginBottom: '5px' }}>Priorité</label>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ ...inputStyle, minWidth: '130px' }}>
                <option value="" style={{ background: '#1e1e2e' }}>Toutes</option>
                {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value} style={{ background: '#1e1e2e' }}>{p.label}</option>)}
              </select>
            </div>
            {members.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b6b8a', marginBottom: '5px' }}>Assigné à</label>
                <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
                  <option value="" style={{ background: '#1e1e2e' }}>Tous</option>
                  {members.map(m => <option key={m._id} value={m._id} style={{ background: '#1e1e2e' }}>{m.name || m.email}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ── Kanban board ── */}
        {loading ? <SkeletonKanban /> : (
          <KanbanBoard
            tasks={filtered}
            onMoveTask={moveTask}
            onEdit={openModal}
            onDelete={(taskId) => setConfirmDelete({ open: true, taskId })}
            onColorChange={updateTaskColor}
          />
        )}
      </div>

      {/* ── Task detail modal ── */}
      {modalTask && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setModalTask(null); }}
        >
          <div style={{
            background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', width: '100%', maxWidth: '620px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}>
            {/* Modal header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={modalTask.status} />
              <button onClick={() => setModalTask(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b8a', fontSize: '20px' }}>✕</button>
            </div>

            {/* Modal body */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Title */}
              <div>
                <label style={labelStyle}>Titre</label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>

              {/* Priority + Deadline */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 120px' }}>
                  <label style={labelStyle}>Priorité</label>
                  <select value={editPriority} onChange={e => setEditPriority(e.target.value)} style={inputStyle}>
                    {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value} style={{ background: '#1e1e2e' }}>{p.label}</option>)}
                  </select>
                </div>
                <div style={{ flex: '1 1 140px' }}>
                  <label style={labelStyle}>Deadline</label>
                  <input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* Assignees */}
              {members.length > 0 && (
                <div>
                  <label style={labelStyle}>Assignés</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {members.map(m => {
                      const assigned = editAssignees.includes(m._id);
                      return (
                        <button key={m._id}
                          onClick={() => setEditAssignees(prev =>
                            assigned ? prev.filter(id => id !== m._id) : [...prev, m._id]
                          )}
                          style={{
                            padding: '5px 10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                            border: `1px solid ${assigned ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                            background: assigned ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                            color: assigned ? '#a78bfa' : '#9090b8',
                            display: 'flex', alignItems: 'center', gap: '5px',
                          }}>
                          <div style={{
                            width: '16px', height: '16px', borderRadius: '50%',
                            background: `hsl(${(m.name || '').charCodeAt(0) * 15 % 360}, 60%, 55%)`,
                            color: '#fff', fontSize: '8px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>{(m.name || m.email || '?')[0].toUpperCase()}</div>
                          {m.name || m.email}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Labels */}
              <div>
                <label style={labelStyle}>Étiquettes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                  {editLabels.map((l, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 8px', borderRadius: '20px',
                      background: l.color + '22', color: l.color, border: `1px solid ${l.color}44`,
                      fontSize: '11px', fontWeight: 600,
                    }}>
                      {l.name}
                      <button onClick={() => setEditLabels(prev => prev.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: l.color, fontSize: '11px', lineHeight: 1, padding: 0 }}>✕</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input value={newLabelName} onChange={e => setNewLabelName(e.target.value)}
                    placeholder="Nom du label" maxLength={20}
                    style={{ ...inputStyle, flex: '1 1 100px', padding: '7px 10px', fontSize: '12px' }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {LABEL_COLORS.map(c => (
                      <button key={c} onClick={() => setNewLabelColor(c)} style={{
                        width: '18px', height: '18px', borderRadius: '50%', background: c, border: `2px solid ${newLabelColor === c ? '#fff' : 'transparent'}`, cursor: 'pointer',
                      }} />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (!newLabelName.trim()) return;
                      setEditLabels(prev => [...prev, { name: newLabelName.trim(), color: newLabelColor }]);
                      setNewLabelName('');
                    }}
                    style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                    + Ajouter
                  </button>
                </div>
              </div>

              {/* Save button */}
              <button onClick={handleSaveModal} disabled={saving || !editTitle.trim()} style={{
                padding: '11px', borderRadius: '12px', border: 'none',
                background: saving ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                color: '#fff', fontWeight: 600, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                {saving && <Spinner />}
                {saving ? 'Enregistrement...' : '💾 Enregistrer'}
              </button>

              {/* Activity log */}
              {(modalTask.activity || []).length > 0 && (
                <div>
                  <label style={labelStyle}>Activité</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                    {[...( modalTask.activity || [])].reverse().map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                          background: `hsl(${((a.userId?.name || '') + '').charCodeAt(0) * 15 % 360}, 60%, 55%)`,
                          color: '#fff', fontSize: '9px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {(a.userId?.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#c8c8e0', lineHeight: 1.4 }}>
                            <strong>{a.userId?.name || 'Utilisateur'}</strong>{' '}
                            {a.detail || a.action}
                          </p>
                          <p style={{ fontSize: '10px', color: '#4a4a6a' }}>
                            {new Date(a.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <label style={labelStyle}>Commentaires ({modalTask.comments?.length || 0})</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                  {(tasks.find(t => t._id === modalTask._id)?.comments || modalTask.comments || []).length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#4a4a6a', textAlign: 'center', padding: '12px',
                      background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      Aucun commentaire
                    </p>
                  ) : (
                    (tasks.find(t => t._id === modalTask._id)?.comments || modalTask.comments || []).map((c, i) => (
                      <div key={c._id || i} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px', padding: '10px 12px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#a78bfa' }}>
                            {c.userId?.name || c.userId?.email || 'Utilisateur'}
                          </span>
                          <span style={{ fontSize: '10px', color: '#4a4a6a' }}>
                            {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#c8c8e0', lineHeight: 1.5 }}>{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <textarea rows={2} value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  style={{ ...inputStyle, resize: 'none', marginBottom: '8px', fontSize: '13px' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button onClick={handleAddComment} disabled={!commentText.trim() || commentLoading}
                  style={{
                    width: '100%', padding: '9px', borderRadius: '10px', border: 'none',
                    background: !commentText.trim() ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    color: '#fff', fontWeight: 600, fontSize: '13px',
                    cursor: !commentText.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                  {commentLoading && <Spinner />}
                  💬 Ajouter le commentaire
                </button>
              </div>

              {/* Delete */}
              <button onClick={() => { setModalTask(null); setConfirmDelete({ open: true, taskId: modalTask._id }); }}
                style={{
                  padding: '9px', borderRadius: '10px',
                  border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
                  color: '#fca5a5', fontSize: '13px', cursor: 'pointer',
                }}>
                🗑 Supprimer la tâche
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer la tâche ?"
        message="Cette action est irréversible. La tâche et ses commentaires seront supprimés."
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, taskId: null })}
      />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#fff', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: '11px', color: '#6b6b8a', marginBottom: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
};

function StatusBadge({ status }) {
  const config = {
    todo:  { label: 'À faire',  bg: 'rgba(124,58,237,0.15)', text: '#a78bfa' },
    doing: { label: 'En cours', bg: 'rgba(217,119,6,0.15)',  text: '#fbbf24' },
    done:  { label: 'Terminé',  bg: 'rgba(5,150,105,0.15)',  text: '#34d399' },
  };
  const c = config[status] || config.todo;
  return <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: c.bg, color: c.text, fontWeight: 500 }}>{c.label}</span>;
}

function Spinner() {
  return <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />;
}