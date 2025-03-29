import React from "react";
import { useTasks } from "../task-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

const TaskList: React.FC = () => {
  const { tasks, completeTask, deleteTask } = useTasks();

  const handleComplete = (id: string) => {
    completeTask(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Está seguro de eliminar?")) {
      deleteTask(id);
    }
  };

  return (
    <ul className="list-none p-0">
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
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            ) : (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(task.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
