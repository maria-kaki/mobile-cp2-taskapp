import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '../types/task';

const TASKS_KEY = '@taskapp:tasks';

export const taskStorage = {
  async getAll(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? (JSON.parse(data) as Task[]) : [];
    } catch {
      return [];
    }
  },

  async save(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  async add(task: Task): Promise<void> {
    const tasks = await this.getAll();
    tasks.push(task);
    await this.save(tasks);
  },

  async update(updatedTask: Task): Promise<void> {
    const tasks = await this.getAll();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      await this.save(tasks);
    }
  },

  async remove(taskId: string): Promise<void> {
    const tasks = await this.getAll();
    const filtered = tasks.filter((t) => t.id !== taskId);
    await this.save(filtered);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(TASKS_KEY);
  },
};
