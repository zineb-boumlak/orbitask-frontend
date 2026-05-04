import KanbanColumn from './KanbanColumn';

const COLUMNS = ['todo', 'doing', 'done'];

export default function KanbanBoard({
  tasks,
  onMoveTask,
  onEdit,
  onDelete,
  onColorChange,
}) {
  const getMove = (status) => ({
    onMoveLeft:  status === 'doing' ? (id) => onMoveTask(id, 'todo', 0)
                : status === 'done'  ? (id) => onMoveTask(id, 'doing', 0)
                : null,
    onMoveRight: status === 'todo'  ? (id) => onMoveTask(id, 'doing', 0)
                : status === 'doing' ? (id) => onMoveTask(id, 'done', 0)
                : null,
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px',
        alignItems: 'flex-start',
      }}
    >
      {COLUMNS.map(status => {
        const { onMoveLeft, onMoveRight } = getMove(status);
        return (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            onColorChange={onColorChange}
          />
        );
      })}
    </div>
  );
}