import { Task, createTask } from "../domain/task";
import { TaskRepository } from "../infrastructure/task-repository";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  addTask(description: string): Task {
    const newTask = createTask(description);
    this.taskRepository.save(newTask);
    return newTask;
  }

  completeTask(id: string): Promise<void> {
    try {
      const task = this.taskRepository.get(id);
      if (task) {
        task.status = true;
        this.taskRepository.save(task);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error completing task:", error);
      return Promise.resolve();
    }
  }

  deleteTask(id: string): Promise<void> {
    try {
      this.taskRepository.delete(id);
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting task:", error);
      return Promise.resolve();
    }
  }

  getTasks(): Task[] {
    return this.taskRepository.getAll();
  }

  resetTasks(): void {
    this.taskRepository.clearAll();
  }
}
