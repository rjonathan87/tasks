import { Task } from "../domain/task";

export interface TaskRepository {
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  get(id: string): Task | undefined;
  getAll(): Task[];
  clearAll(): Promise<void>;
}

export class LocalStorageTaskRepository implements TaskRepository {
  private readonly localStorageKey = "tasks";

  save(task: Task): Promise<void> {
    return Promise.resolve().then(() => {
      const tasks = this.getAll();
      const existingIndex = tasks.findIndex((t) => t.id === task.id);
      if (existingIndex > -1) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    });
  }

  delete(id: string): Promise<void> {
    return Promise.resolve().then(() => {
      const tasks = this.getAll().filter((task) => task.id !== id);
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    });
  }

  get(id: string): Task | undefined {
    return this.getAll().find((task) => task.id === id);
  }

  getAll(): Task[] {
    const storedTasks = localStorage.getItem(this.localStorageKey);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  clearAll(): Promise<void> {
    return Promise.resolve().then(() => {
      localStorage.removeItem(this.localStorageKey);
    });
  }
}
