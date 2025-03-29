import React, { useState } from "react";
import { useTasks } from "../task-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faRedo } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";

const TaskList: React.FC = () => {
  const { tasks, completeTask, deleteTask, resetTasks } = useTasks();
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const randomTime = Math.random() * (4000 - 2000) + 2000;

  const handleReset = () => {
    resetTasks();
  };

  const handleComplete = (id: string) => {
    setLoadingButton(id);

    setTimeout(() => {
      completeTask(id);
      setLoadingButton(null);
    }, randomTime);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Está seguro de eliminar?")) {
      setLoadingButton(id);

      setTimeout(() => {
        deleteTask(id);
        setLoadingButton(null);
      }, randomTime);
    }
  };

  return (
    <ul className="list-none p-0">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleReset}
      >
        <FontAwesomeIcon icon={faRedo} /> Reiniciar lista
      </button>
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center py-2 border-b border-gray-200"
        >
          <span>{task.description}</span>
          <div style={{ display: "flex", gap: "10px" }}>
            {!task.status ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleComplete(task.id)}
                disabled={loadingButton === task.id}
              >
                {loadingButton === task.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faCheck} />
                )}
              </button>
            ) : (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(task.id)}
                disabled={loadingButton === task.id}
              >
                {loadingButton === task.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faTrash} />
                )}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
