import React, { useState, useRef, useEffect } from "react";
import { useTasks } from "../task-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Task } from "../../domain/task";

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { addTask, editTask } = useTasks();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (task) {
        // Editing existing task
        const updatedTask: Task = {
          ...task,
          title: title.trim(),
          description: description.trim(),
        };
        await editTask(updatedTask);
      } else {
        // Adding new task
        await addTask(title.trim(), description.trim() || undefined);
      }
      setTitle("");
      setDescription("");
      onClose?.(); // Close the form after submitting
    } catch (err) {
      console.error("Error al agregar la tarea en el formulario:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea (requerido)"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
          ref={titleInputRef}
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
        />
      </div>

      <div className="text-right">
        {" "}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : task ? (
            <FontAwesomeIcon icon={faSave} />
          ) : (
            <FontAwesomeIcon icon={faPlus} />
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
