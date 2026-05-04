// hooks/useTaskManager.js
import { useState, useCallback, useRef } from 'react';
import api from '../api/axiosInstance';
import { useToast } from '../contexts/ToastContext';

export function useTaskManager(tableId) {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch all tasks ──────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    if (!tableId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/tables/${tableId}/tasks`);
      if (!data.success) throw new Error(data.error);
      setTasks(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur chargement des tâches');
    } finally {
      setLoading(false);
    }
  }, [tableId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add task ─────────────────────────────────────────────────────────────────
  const addTask = useCallback(async ({ title, status = 'todo', color = '#ffffff', deadline = null, priority = 'medium', assignees = [], labels = [] }) => {
    if (!title?.trim()) return false;
    setActionLoading(true);
    try {
      const { data } = await api.post(`/api/tables/${tableId}/tasks`, {
        title: title.trim(), status, color, deadline, priority, assignees, labels,
      });
      if (!data.success) throw new Error(data.error);
      setTasks(prev => [...prev, data.data]);
      toast.success('Tâche créée !');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur création de tâche');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [tableId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Generic optimistic update with rollback ──────────────────────────────────
  const optimisticUpdate = useCallback(async (taskId, patch, apiCall, errorMsg) => {
    const snapshot = tasks;
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...patch } : t));
    try {
      await apiCall();
    } catch {
      setTasks(snapshot); // rollback
      toast.error(errorMsg);
    }
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Move task (status change) ────────────────────────────────────────────────
  const moveTask = useCallback(async (taskId, newStatus, newPosition) => {
    await optimisticUpdate(
      taskId,
      { status: newStatus, position: newPosition },
      () => api.put(`/api/tables/${tableId}/tasks/${taskId}`, { status: newStatus, position: newPosition }),
      'Erreur lors du déplacement'
    );
  }, [tableId, optimisticUpdate]);

  // ── Update color ─────────────────────────────────────────────────────────────
  const updateTaskColor = useCallback(async (taskId, color) => {
    await optimisticUpdate(
      taskId, { color },
      () => api.put(`/api/tables/${tableId}/tasks/${taskId}`, { color }),
      'Erreur mise à jour couleur'
    );
  }, [tableId, optimisticUpdate]);

  // ── Update priority ──────────────────────────────────────────────────────────
  const updateTaskPriority = useCallback(async (taskId, priority) => {
    await optimisticUpdate(
      taskId, { priority },
      () => api.put(`/api/tables/${tableId}/tasks/${taskId}`, { priority }),
      'Erreur mise à jour priorité'
    );
  }, [tableId, optimisticUpdate]);

  // ── Update assignees ─────────────────────────────────────────────────────────
  const updateTaskAssignees = useCallback(async (taskId, assignees) => {
    await optimisticUpdate(
      taskId, { assignees },
      () => api.put(`/api/tables/${tableId}/tasks/${taskId}`, { assignees: assignees.map(a => a._id || a) }),
      'Erreur mise à jour assignés'
    );
  }, [tableId, optimisticUpdate]);

  // ── Update labels ────────────────────────────────────────────────────────────
  const updateTaskLabels = useCallback(async (taskId, labels) => {
    await optimisticUpdate(
      taskId, { labels },
      () => api.put(`/api/tables/${tableId}/tasks/${taskId}`, { labels }),
      'Erreur mise à jour labels'
    );
  }, [tableId, optimisticUpdate]);

  // ── Full task update (from edit modal) ───────────────────────────────────────
  const updateTask = useCallback(async (taskId, patch) => {
    const snapshot = tasks;
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...patch } : t));
    try {
      const { data } = await api.put(`/api/tables/${tableId}/tasks/${taskId}`, patch);
      if (!data.success) throw new Error(data.error);
      // Use server response for full consistency
      setTasks(prev => prev.map(t => t._id === taskId ? data.data : t));
      toast.success('Tâche mise à jour !');
      return true;
    } catch (err) {
      setTasks(snapshot);
      toast.error(err.response?.data?.error || 'Erreur mise à jour');
      return false;
    }
  }, [tableId, tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Delete task ──────────────────────────────────────────────────────────────
  const deleteTask = useCallback(async (taskId) => {
    const snapshot = tasks;
    setTasks(prev => prev.filter(t => t._id !== taskId));
    setActionLoading(true);
    try {
      await api.delete(`/api/tables/${tableId}/tasks/${taskId}`);
      toast.success('Tâche supprimée');
    } catch {
      setTasks(snapshot);
      toast.error('Erreur suppression de tâche');
    } finally {
      setActionLoading(false);
    }
  }, [tableId, tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add comment ──────────────────────────────────────────────────────────────
  const addComment = useCallback(async (taskId, text) => {
    if (!text?.trim()) return false;
    try {
      const { data } = await api.post(`/api/tables/${tableId}/tasks/${taskId}/comments`, { text: text.trim() });
      if (!data.success) throw new Error(data.error);
      setTasks(prev => prev.map(t =>
        t._id === taskId ? { ...t, comments: data.data } : t
      ));
      toast.success('Commentaire ajouté');
      return true;
    } catch {
      toast.error('Erreur ajout commentaire');
      return false;
    }
  }, [tableId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    tasks, loading, actionLoading,
    fetchTasks, addTask, moveTask,
    updateTask, updateTaskColor, updateTaskPriority,
    updateTaskAssignees, updateTaskLabels,
    deleteTask, addComment,
  };
}