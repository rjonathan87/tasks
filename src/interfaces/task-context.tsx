import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Task } from "../domain/task";
import { TaskService } from "../application/task-service";
import { SupabaseTaskRepository } from "../infrastructure/task-repository";
import { supabase } from "../infrastructure/supabase-client"; // Import supabase

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  addTask: (title: string, description?: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  resetTasks: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  editTask: (task: Task) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const taskService = useMemo(
    () => new TaskService(new SupabaseTaskRepository()),
    []
  );

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error al obtener las tareas:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, [taskService]);

  // Effect for initial data fetching
  useEffect(() => {
    fetchTasks(); // fetchTasks handles its own isLoading state
  }, [fetchTasks]);

  // Effect for handling real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        async (payload: any) => {
          console.log("Change received!", payload);
          const tasks = await taskService.getTasks();
          setTasks(tasks);
        }
      );

    channel.subscribe();

    // Return cleanup function to unsubscribe
    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskService]);

  const addTask = useCallback(
    async (title: string, description?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await taskService.addTask(title, description);
        await fetchTasks();
      } catch (err) {
        console.error("Error al agregar la tarea:", err);
        setError(err instanceof Error ? err.message : "Failed to add task");
      } finally {
        setIsLoading(false);
      }
    },
    [taskService, fetchTasks]
  );

  const completeTask = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await taskService.completeTask(id);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, is_completed: true } : task
          )
        );
      } catch (err) {
        console.error("Error al completar la tarea:", err);
        setError(
          err instanceof Error ? err.message : "Error al completar la tarea"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [taskService]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await taskService.deleteTask(id);

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (err) {
        console.error("Error al eliminar la tarea:", err);
        setError(
          err instanceof Error ? err.message : "Error al eliminar la tarea"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [taskService]
  );

  const resetTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await taskService.resetTasks();
      setTasks([]);
    } catch (err) {
      console.error("Error al resetear las tareas:", err);
      setError(
        err instanceof Error ? err.message : "Error al resetear las tareas"
      );
    } finally {
      setIsLoading(false);
    }
  }, [taskService]);

  const editTask = useCallback(
    async (task: Task) => {
      setIsLoading(true);
      setError(null);
      try {
        await taskService.editTask(task);
        await fetchTasks();
      } catch (err: unknown) {
        console.error("Error al editar la tarea:", err);
        setError(err instanceof Error ? err.message : "Failed to edit task");
      } finally {
        setIsLoading(false);
      }
    },
    [taskService, fetchTasks]
  );

  const contextValue = useMemo(
    () => ({
      tasks,
      isLoading,
      error,
      addTask,
      completeTask,
      deleteTask,
      resetTasks,
      fetchTasks,
      editTask,
    }),
    [
      tasks,
      isLoading,
      error,
      addTask,
      completeTask,
      deleteTask,
      resetTasks,
      fetchTasks,
      editTask,
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
