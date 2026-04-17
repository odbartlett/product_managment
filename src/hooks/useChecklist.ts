import { useAppContext } from '../context/AppContext';
import type { ChecklistTask, MoveType, TaskCategory, TaskStatus } from '../types';

export function useChecklist(userId: string, moveType?: MoveType) {
  const { state, dispatch } = useAppContext();

  const tasks = state.tasks.filter(
    (t) => t.userId === userId && (moveType ? t.moveType === moveType : true)
  );
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byCategory = tasks.reduce<Record<TaskCategory, ChecklistTask[]>>(
    (acc, task) => {
      if (!acc[task.category]) acc[task.category] = [];
      acc[task.category].push(task);
      return acc;
    },
    {} as Record<TaskCategory, ChecklistTask[]>
  );

  const updateTask = (id: string, updates: Partial<ChecklistTask>) => {
    const extra: Partial<ChecklistTask> = {};
    if (updates.status === 'completed') {
      extra.completedAt = new Date().toISOString();
    } else if (updates.status === 'pending' || updates.status === 'in-progress') {
      extra.completedAt = null;
    }
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates: { ...updates, ...extra } } });
  };

  const toggleStatus = (task: ChecklistTask) => {
    const nextStatus: TaskStatus =
      task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: nextStatus });
  };

  const urgentTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.priority === 'urgent'
  );

  return { tasks, byCategory, total, completed, progress, updateTask, toggleStatus, urgentTasks };
}
