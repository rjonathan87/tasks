import { Task } from "../domain/task";
import { supabase } from "./supabase-client";

export interface TaskRepository {
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  get(id: string): Promise<Task | null>;
  getAll(): Promise<Task[]>;
  clearAll(): Promise<void>;
}

export class SupabaseTaskRepository implements TaskRepository {
  private readonly tableName = "tasks";

  async save(task: Task): Promise<void> {
    const { error } = await supabase.from(this.tableName).upsert({
      id: task.id,
      title: task.title,
      description: task.description,
      is_completed: task.is_completed,
      created_at: task.created_at,
    });

    if (error) {
      console.error("Error al guardar la tarea:", error);
      throw new Error(`Failed to save task: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .match({ id });

    if (error) {
      console.error("Error al eliminar la tarea:", error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async get(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error al obtener la tarea:", error);
      throw new Error(`Failed to get task: ${error.message}`);
    }

    return data
      ? {
          id: data.id,
          title: data.title,
          description: data.description,
          is_completed: data.is_completed,
          created_at: data.created_at,
        }
      : null;
  }

  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al obtener las tareas:", error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data
      ? data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          is_completed: task.is_completed,
          created_at: task.created_at,
        }))
      : [];
  }

  async clearAll(): Promise<void> {
    console.warn(
      "La operación clearAll puede ser ineficiente para tablas grandes."
    );
    const tasks = await this.getAll();
    const deletePromises = tasks.map((task) => this.delete(task.id));
    await Promise.all(deletePromises);
  }
}
