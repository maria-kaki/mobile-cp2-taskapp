import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { taskStorage } from '../services/taskStorage';
import { generateId } from '../utils/generateId';
import type { Task, TaskStatus, TaskPriority } from '../types/task';

interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  categoryIcon: string;
}

interface TaskContextData {
  tasks: Task[];
  isLoading: boolean;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: Partial<CreateTaskInput>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = async () => {
    setIsLoading(true);
    try {
      const loaded = await taskStorage.getAll();
      setTasks(loaded);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const createTask = async (input: CreateTaskInput) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    await taskStorage.add(task);
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = async (id: string, input: Partial<CreateTaskInput>) => {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;
    const updated: Task = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await taskStorage.update(updated);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    await taskStorage.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, createTask, updateTask, deleteTask, getTaskById, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within TaskProvider');
  return context;
}
