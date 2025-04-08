import React, { useState } from "react";
import { useTasks } from "../task-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faTrash,
  faRedo,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import TaskForm from "./TaskForm";
import { Task } from "../../domain/task";

const TaskList: React.FC = () => {
  const { tasks, completeTask, deleteTask, resetTasks, isLoading, error } =
    useTasks();

  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm("¿Está seguro de eliminar todas las tareas?")) {
      setIsResetting(true);
      try {
        await resetTasks();
      } catch (err) {
        console.error("Error al resetear en el componente:", err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleComplete = async (id: string) => {
    setLoadingButtonId(id);
    try {
      await completeTask(id);
    } catch (err) {
      console.error("Error al completar la tarea en el componente:", err);
    } finally {
      setLoadingButtonId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta tarea?")) {
      setLoadingButtonId(id);
      try {
        await deleteTask(id);
      } catch (err) {
        console.error("Error al eliminar la tarea en el componente:", err);
      } finally {
        setLoadingButtonId(null);
      }
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="text-center p-4">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" /> Cargando tareas...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  if (!isLoading && tasks.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No hay tareas pendientes.
      </div>
    );
  }

  return (
    <div className="mt-4">
      {" "}
      {tasks.length > 0 && (
        <div className="mb-4 text-right">
          {" "}
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            onClick={handleReset}
            disabled={isResetting || !!loadingButtonId}
          >
            {isResetting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Reiniciando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRedo} /> Reiniciar Lista
              </>
            )}
          </button>
        </div>
      )}
      <ul className="list-none p-0">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center py-3 px-2 border-b border-gray-300 ${
              task.is_completed ? "bg-gray-100 opacity-60" : ""
            }`}
          >
            <span
              className={`${
                task.is_completed ? "line-through text-gray-500" : ""
              }`}
            >
              {" "}
              {task.title}
              <p className="text-gray-500 text-xs">{task.description}</p>
            </span>

            <div className="flex gap-2">
              {" "}
              {!task.is_completed && (
                <>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded disabled:opacity-50"
                    onClick={() => setEditingTask(task)}
                    disabled={loadingButtonId === task.id || isResetting}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded disabled:opacity-50"
                    onClick={() => handleComplete(task.id)}
                    disabled={loadingButtonId === task.id || isResetting}
                  >
                    {loadingButtonId === task.id ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </button>
                </>
              )}
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded disabled:opacity-50"
                onClick={() => handleDelete(task.id)}
                disabled={loadingButtonId === task.id || isResetting}
              >
                {loadingButtonId === task.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faTrash} />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editingTask && (
        <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />
      )}
    </div>
  );
};

export default TaskList;
