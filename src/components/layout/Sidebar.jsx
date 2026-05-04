// components/layout/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosInstance';
import {
  IconHome, IconTask, IconChevronRight, IconChevronDown,
  IconLogout, IconChevronLeft, IconGrid,
} from '../ui/Icons';

const NAV_LINKS = [
  { Icon: IconHome, label: 'Accueil',    to: '/home' },
  { Icon: IconTask, label: 'Mes Tâches', to: '/my-tasks' },
];

export default function Sidebar({ workspaces: propWorkspaces }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState(propWorkspaces || []);
  const [collapsed, setCollapsed] = useState(false);
  const [wsExpanded, setWsExpanded] = useState(true);

  useEffect(() => {
    if (!propWorkspaces) {
      api.get('/api/workspaces').then(r => setWorkspaces(r.data.data || [])).catch(() => {});
    } else {
      setWorkspaces(propWorkspaces);
    }
  }, [propWorkspaces]);

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase();
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');
  const W = collapsed ? '60px' : '240px';

  return (
    <aside style={{
      width: W, minWidth: W, height: '100vh',
      background: '#0d0d1c',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0,
      transition: 'width 0.22s ease, min-width 0.22s ease',
      overflow: 'hidden', zIndex: 30, flexShrink: 0,
    }}>
      {/* Logo + collapse */}
      <div style={{
        height: '56px', display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0 12px' : '0 12px 0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
      }}>
        {!collapsed && (
          <Link to="/home" style={{ color: '#a78bfa', fontWeight: 800, fontSize: '17px', textDecoration: 'none', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconGrid size={18} color="#7c3aed" />
            Orbitask
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '8px', width: '28px', height: '28px',
          cursor: 'pointer', color: '#5a5a80',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
        </button>
      </div>

      {/* User info */}
      <div style={{
        padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0, justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          color: '#fff', fontWeight: 700, fontSize: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{initial}</div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e2f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Utilisateur'}
            </p>
            <p style={{ fontSize: '11px', color: '#3d3d5a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
        {NAV_LINKS.map(({ Icon, label, to }) => (
          <SidebarLink key={to} Icon={Icon} label={label} to={to} active={isActive(to)} collapsed={collapsed} />
        ))}

        {!collapsed && (
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setWsExpanded(!wsExpanded)} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '4px 10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#3d3d5a', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <span>Espaces de travail</span>
              {wsExpanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
            </button>

            {wsExpanded && (
              <div style={{ marginTop: '4px' }}>
                {workspaces.slice(0, 8).map(ws => {
                  const active = isActive(`/workspace/${ws._id}`);
                  return (
                    <Link key={ws._id} to={`/workspace/${ws._id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', margin: '1px 0', borderRadius: '10px',
                      textDecoration: 'none',
                      background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: active ? '#a78bfa' : '#7070a0',
                      fontSize: '13px', fontWeight: active ? 600 : 400,
                      transition: 'background 0.15s, color 0.15s',
                    }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '7px', flexShrink: 0,
                        background: active ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(124,58,237,0.15)',
                        color: active ? '#fff' : '#7c3aed',
                        fontWeight: 700, fontSize: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {ws.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ws.name}</span>
                    </Link>
                  );
                })}
                {workspaces.length === 0 && <p style={{ fontSize: '12px', color: '#3d3d5a', padding: '8px 10px' }}>Aucun espace</p>}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px 6px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: '10px', padding: '9px 10px',
          background: 'none', border: 'none', borderRadius: '10px',
          color: '#5a3030', fontSize: '13px', cursor: 'pointer',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'background 0.15s, color 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#5a3030'; }}
        >
          <IconLogout size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ Icon, label, to, active, collapsed }) {
  return (
    <Link to={to} title={collapsed ? label : undefined} style={{
      display: 'flex', alignItems: 'center',
      gap: '10px', padding: '9px 10px', margin: '1px 0',
      borderRadius: '10px', textDecoration: 'none',
      justifyContent: collapsed ? 'center' : 'flex-start',
      background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
      color: active ? '#a78bfa' : '#7070a0',
      fontWeight: active ? 600 : 400, fontSize: '13px',
      transition: 'background 0.15s, color 0.15s',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#c8c8e0'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7070a0'; } }}
    >
      <Icon size={17} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}