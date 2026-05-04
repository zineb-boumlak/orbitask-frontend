// components/kanban/TaskCard.jsx
import { useState } from 'react';

const COLOR_OPTIONS = ['#ffffff','#fef9c3','#dbeafe','#dcfce7','#fce7f3','#ede9fe','#ffedd5','#f1f5f9'];

const PRIORITY_CONFIG = {
  low:    { label: 'Faible',  bg: '#f0fdf4', text: '#166534', dot: '#10b981' },
  medium: { label: 'Moyenne', bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
  high:   { label: 'Haute',   bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  urgent: { label: 'Urgent',  bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
};

export default function TaskCard({ task, accent, onEdit, onDelete, onMoveLeft, onMoveRight, onColorChange }) {
  const [showColors, setShowColors] = useState(false);

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  const isNearDeadline = task.deadline && !isOverdue &&
    new Date(task.deadline) - new Date() < 2 * 24 * 60 * 60 * 1000; // 48h
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const commentCount = task.comments?.length || 0;
  const assignees = task.assignees || [];
  const labels = task.labels || [];

  return (
    <div
      style={{
        backgroundColor: task.color || '#ffffff',
        borderLeft: `3px solid ${isOverdue ? '#ef4444' : accent}`,
        borderRadius: '12px', padding: '12px 12px 10px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: `1px solid rgba(0,0,0,0.06)`,
        borderLeftWidth: '3px', borderLeftColor: isOverdue ? '#ef4444' : accent,
        cursor: 'default', position: 'relative',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Labels */}
      {labels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '6px' }}>
          {labels.map((l, i) => (
            <span key={i} style={{
              fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
              background: l.color + '22', color: l.color, border: `1px solid ${l.color}44`,
            }}>
              {l.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4, marginBottom: '6px' }}>
        {task.title}
      </p>

      {/* Priority */}
      <div style={{ marginBottom: '6px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '10px', fontWeight: 500,
          background: priority.bg, color: priority.text,
          padding: '2px 7px', borderRadius: '20px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: priority.dot, display: 'inline-block' }} />
          {priority.label}
        </span>
      </div>

      {/* Deadline */}
      {task.deadline && (
        <p style={{
          fontSize: '11px',
          color: isOverdue ? '#ef4444' : isNearDeadline ? '#f97316' : '#9ca3af',
          fontWeight: isOverdue || isNearDeadline ? 600 : 400,
          marginBottom: '8px',
        }}>
          {isOverdue ? '⚠ Délai dépassé · ' : isNearDeadline ? '⏰ Bientôt · ' : '📅 '}
          {new Date(task.deadline).toLocaleDateString('fr-FR')}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Comments */}
          <span style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '3px' }}>
            💬 {commentCount}
          </span>

          {/* Assignees avatars */}
          {assignees.length > 0 && (
            <div style={{ display: 'flex', marginLeft: '4px' }}>
              {assignees.slice(0, 3).map((a, i) => (
                <div key={a._id || i} title={a.name || a.email} style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: `hsl(${(a.name || '').charCodeAt(0) * 15 % 360}, 60%, 55%)`,
                  color: '#fff', fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid #fff',
                  marginLeft: i > 0 ? '-5px' : '0',
                  zIndex: 3 - i,
                }}>
                  {(a.name || a.email || '?')[0].toUpperCase()}
                </div>
              ))}
              {assignees.length > 3 && (
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#e5e7eb', color: '#6b7280',
                  fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid #fff', marginLeft: '-5px',
                }}>+{assignees.length - 3}</div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {onMoveLeft && <ActionBtn onClick={onMoveLeft} title="Reculer">←</ActionBtn>}
          {onMoveRight && <ActionBtn onClick={onMoveRight} title="Avancer">→</ActionBtn>}

          <div style={{ position: 'relative' }}>
            <ActionBtn onClick={() => setShowColors(!showColors)} title="Couleur">🎨</ActionBtn>
            {showColors && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowColors(false)} />
                <div style={{
                  position: 'absolute', bottom: '28px', right: 0,
                  background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: '12px', padding: '8px',
                  display: 'flex', gap: '4px', flexWrap: 'wrap',
                  width: '120px', zIndex: 20,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}>
                  {COLOR_OPTIONS.map(c => (
                    <button key={c} onClick={() => { onColorChange(c); setShowColors(false); }}
                      style={{
                        width: '20px', height: '20px', background: c,
                        border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', cursor: 'pointer',
                      }} />
                  ))}
                </div>
              </>
            )}
          </div>

          <ActionBtn onClick={onEdit} title="Modifier">✏</ActionBtn>
          <ActionBtn onClick={onDelete} title="Supprimer" danger>✕</ActionBtn>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, title, children, danger = false }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: '24px', height: '24px', border: 'none', borderRadius: '7px',
      background: 'rgba(0,0,0,0.05)',
      color: danger ? '#ef4444' : '#6b7280',
      fontSize: '11px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'background 0.1s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.12)' : 'rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
    >
      {children}
    </button>
  );
}