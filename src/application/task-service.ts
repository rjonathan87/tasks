import { Task, createTask } from "../domain/task";
import { TaskRepository } from "../infrastructure/task-repository";
import { supabase } from "../infrastructure/supabase-client";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async addTask(title: string, description?: string): Promise<Task> {
    const newTask = createTask(title, description);
    await this.taskRepository.save(newTask);

    return newTask;
  }

  async completeTask(id: string): Promise<void> {
    try {
      const task = await this.taskRepository.get(id);
      if (task) {
        const updatedTask = { ...task, is_completed: true };
        await this.taskRepository.save(updatedTask);
      } else {
        console.warn(`Tarea con id ${id} no encontrada para completar.`);
      }
    } catch (error) {
      console.error("Error al completar la tarea:", error);

      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);

      throw error;
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.getAll();
    } catch (error) {
      console.error("Error al obtener las tareas:", error);

      throw error;
    }
  }

  async resetTasks(): Promise<void> {
    try {
      await this.taskRepository.clearAll();
    } catch (error) {
      console.error("Error al resetear las tareas:", error);

      throw error;
    }
  }

  subscribeToTasks(callback: (tasks: Task[]) => void) {
    supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        async (payload) => {
          console.log("Change received!", payload);
          const tasks = await this.getTasks();
          callback(tasks);
        }
      )
      .subscribe();
  }

  async editTask(task: Task): Promise<void> {
    try {
      await this.taskRepository.save(task);
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      throw error;
    }
  }
}
