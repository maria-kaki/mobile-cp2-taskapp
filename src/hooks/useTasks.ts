import { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import type { Task, TaskStatus } from '../types/task';

type FilterOption = 'todas' | TaskStatus;

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  filter: FilterOption;
  setFilter: (f: FilterOption) => void;
  createTask: ReturnType<typeof useTaskContext>['createTask'];
  updateTask: ReturnType<typeof useTaskContext>['updateTask'];
  deleteTask: ReturnType<typeof useTaskContext>['deleteTask'];
  getTaskById: ReturnType<typeof useTaskContext>['getTaskById'];
  refreshTasks: ReturnType<typeof useTaskContext>['refreshTasks'];
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
}

export function useTasks(): UseTasksReturn {
  const { tasks, isLoading, createTask, updateTask, deleteTask, getTaskById, refreshTasks } = useTaskContext();
  const [filter, setFilter] = useState<FilterOption>('todas');

  const filteredTasks = useMemo(() => {
    if (filter === 'todas') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'pendente').length;
  const inProgressCount = tasks.filter((t) => t.status === 'em_andamento').length;
  const completedCount = tasks.filter((t) => t.status === 'concluida').length;

  return {
    tasks,
    filteredTasks,
    isLoading,
    filter,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    refreshTasks,
    totalCount,
    pendingCount,
    inProgressCount,
    completedCount,
  };
}
