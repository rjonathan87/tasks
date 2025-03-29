import React, { useState } from "react";
import { useTasks } from "../task-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      addTask(description);
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="sm:flex items-center">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Agregar nueva"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
