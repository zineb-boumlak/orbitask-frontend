// ── Base skeleton block ────────────────────────────────────────────────────────
function Sk({ w = '100%', h = '16px', r = '8px', dark = false, style = {} }) {
  return (
    <div
      className={dark ? 'skeleton-dark' : 'skeleton'}
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  );
}

// ── Workspace card skeleton ────────────────────────────────────────────────────
export function SkeletonWorkspaceCard() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '16px', padding: '20px',
    }}>
      <Sk w="40px" h="40px" r="12px" style={{ marginBottom: '12px' }} />
      <Sk w="70%" h="14px" style={{ marginBottom: '8px' }} />
      <Sk w="90%" h="12px" style={{ marginBottom: '4px' }} />
      <Sk w="50%" h="12px" />
    </div>
  );
}

// ── Table card skeleton ────────────────────────────────────────────────────────
export function SkeletonTableCard() {
  return (
    <div style={{
      background: '#f9fafb', border: '1px solid #e5e7eb',
      borderRadius: '12px', padding: '16px',
    }}>
      <Sk w="32px" h="32px" r="8px" style={{ marginBottom: '10px' }} />
      <Sk w="60%" h="13px" style={{ marginBottom: '6px' }} />
      <Sk w="40%" h="11px" />
    </div>
  );
}

// ── Task card skeleton ─────────────────────────────────────────────────────────
export function SkeletonTaskCard({ dark = false }) {
  return (
    <div style={{
      background: dark ? '#2a2a3e' : '#fff',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
      borderRadius: '12px', padding: '14px',
      marginBottom: '8px',
    }}>
      <Sk w="80%" h="13px" dark={dark} style={{ marginBottom: '8px' }} />
      <Sk w="40%" h="11px" dark={dark} style={{ marginBottom: '10px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Sk w="50px" h="20px" r="10px" dark={dark} />
        <div style={{ display: 'flex', gap: '4px' }}>
          <Sk w="22px" h="22px" r="6px" dark={dark} />
          <Sk w="22px" h="22px" r="6px" dark={dark} />
        </div>
      </div>
    </div>
  );
}

// ── Full kanban skeleton ───────────────────────────────────────────────────────
export function SkeletonKanban() {
  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
      {['todo', 'doing', 'done'].map((col, ci) => (
        <div key={col} style={{
          flexShrink: 0, width: '288px',
          background: ci === 0 ? '#f5f3ff' : ci === 1 ? '#fffbeb' : '#f0fdf4',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px',
            background: ci === 0 ? '#ede9fe' : ci === 1 ? '#fef3c7' : '#dcfce7',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Sk w="80px" h="14px" dark={false} />
            <Sk w="24px" h="20px" r="10px" />
          </div>
          <div style={{ padding: '12px' }}>
            {[1, 2].map(i => <SkeletonTaskCard key={i} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Member list skeleton ───────────────────────────────────────────────────────
export function SkeletonMemberRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 16px', background: '#f9fafb', borderRadius: '12px',
    }}>
      <Sk w="36px" h="36px" r="50%" />
      <div style={{ flex: 1 }}>
        <Sk w="120px" h="13px" style={{ marginBottom: '5px' }} />
        <Sk w="180px" h="11px" />
      </div>
      <Sk w="60px" h="22px" r="20px" />
    </div>
  );
}

export default Sk;