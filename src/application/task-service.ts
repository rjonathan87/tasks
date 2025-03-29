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

  completeTask(id: string): void {
    const task = this.taskRepository.get(id);
    if (task) {
      task.status = true;
      this.taskRepository.save(task);
    }
  }

  deleteTask(id: string): void {
    this.taskRepository.delete(id);
  }

  getTasks(): Task[] {
    return this.taskRepository.getAll();
  }
}
