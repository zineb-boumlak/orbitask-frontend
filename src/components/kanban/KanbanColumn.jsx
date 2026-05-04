import TaskCard from './TaskCard';

const COLUMN_STYLES = {
  todo:  { bg: '#f5f3ff', headerBg: '#ede9fe', headerText: '#5b21b6', accent: '#7c3aed', emptyText: 'Aucune tâche' },
  doing: { bg: '#fffbeb', headerBg: '#fef3c7', headerText: '#92400e', accent: '#d97706', emptyText: 'Aucune tâche' },
  done:  { bg: '#f0fdf4', headerBg: '#dcfce7', headerText: '#14532d', accent: '#059669', emptyText: 'Aucune tâche' },
};

const LABELS = { todo: 'À faire', doing: 'En cours', done: 'Terminé' };

export default function KanbanColumn({
  status, tasks, onEdit, onDelete, onMoveLeft, onMoveRight, onColorChange,
}) {
  const style = COLUMN_STYLES[status];

  return (
    <div
      style={{
        flexShrink: 0,
        width: '288px',
        borderRadius: '16px',
        background: style.bg,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: style.headerBg,
          borderRadius: '16px 16px 0 0',
          borderBottom: `2px solid ${style.accent}22`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: style.accent,
          }} />
          <span style={{
            fontSize: '13px', fontWeight: 600,
            color: style.headerText,
          }}>
            {LABELS[status]}
          </span>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 600,
          background: 'rgba(255,255,255,0.7)',
          color: style.headerText,
          padding: '2px 8px', borderRadius: '20px',
        }}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {tasks.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100px',
            border: '2px dashed rgba(0,0,0,0.08)',
            borderRadius: '10px',
            fontSize: '12px', color: '#9ca3af',
          }}>
            {style.emptyText}
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              accent={style.accent}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task._id)}
              onMoveLeft={onMoveLeft ? () => onMoveLeft(task._id) : null}
              onMoveRight={onMoveRight ? () => onMoveRight(task._id) : null}
              onColorChange={(color) => onColorChange(task._id, color)}
            />
          ))
        )}
      </div>
    </div>
  );
}