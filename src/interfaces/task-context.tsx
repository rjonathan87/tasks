import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Task } from "../domain/task";
import { TaskService } from "../application/task-service";
import { LocalStorageTaskRepository } from "../infrastructure/task-repository";

interface TaskContextType {
  tasks: Task[];
  addTask: (description: string) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  resetTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskService = useMemo(
    () => new TaskService(new LocalStorageTaskRepository()),
    []
  );

  useEffect(() => {
    setTasks(taskService.getTasks());
  }, [taskService]);

  const addTask = useCallback(
    (description: string) => {
      const newTask = taskService.addTask(description);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [taskService]
  );

  const completeTask = useCallback(
    (id: string) => {
      taskService.completeTask(id);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: true } : task
        )
      );
    },
    [taskService]
  );

  const deleteTask = useCallback(
    (id: string) => {
      taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    },
    [taskService]
  );

  const resetTasks = useCallback(() => {
    if (window.confirm("Está seguro de resetear la lista?")) {
      taskService.resetTasks();
      setTasks([]);
    }
  }, [taskService]);

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, completeTask, deleteTask, resetTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};
