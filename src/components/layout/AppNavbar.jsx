// components/layout/AppNavbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AppNavbar({ workspaceName, workspaceId, tableName, onInvite, notifications = [] }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      height: '56px', background: '#1a1a2a',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: '12px',
      position: 'sticky', top: 0, zIndex: 20,
    }}>

      {/* ── Breadcrumbs ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, fontSize: '14px' }}>
        <Link to="/home" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none', fontSize: '16px', flexShrink: 0 }}>
          Orbitask
        </Link>

        {workspaceName && (
          <>
            <span style={{ color: '#3d3d5a' }}>/</span>
            <Link to={workspaceId ? `/workspace/${workspaceId}` : '/home'}
              style={{ color: '#6b6b8a', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
              {workspaceName}
            </Link>
          </>
        )}

        {tableName && (
          <>
            <span style={{ color: '#3d3d5a' }}>/</span>
            <span style={{ color: '#e2e2f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              {tableName}
            </span>
          </>
        )}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* Invite button */}
        {onInvite && (
          <button onClick={onInvite} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '10px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#a78bfa', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}>
            <span>+</span> Inviter
          </button>
        )}

        {/* Notifications bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9090b8', fontSize: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
          >
            🔔
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#ef4444', border: '1.5px solid #1a1a2a',
              }} />
            )}
          </button>

          {showNotif && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotif(false)} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: '300px', background: '#2a2a3e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                zIndex: 50, overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e2f0' }}>Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#4a4a6a', padding: '20px 16px', textAlign: 'center' }}>
                    Aucune notification
                  </p>
                ) : (
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.map((n, i) => (
                      <div key={i} style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: n.read ? 'transparent' : 'rgba(124,58,237,0.06)',
                      }}>
                        <p style={{ fontSize: '12px', color: '#c8c8e0', lineHeight: 1.5 }}>{n.message}</p>
                        <p style={{ fontSize: '10px', color: '#4a4a6a', marginTop: '3px' }}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          color: '#fff', fontWeight: 700, fontSize: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {(user?.name || user?.email || 'U')[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}