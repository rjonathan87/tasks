import React from "react";
import { useTasks } from "../task-context";

const TaskList: React.FC = () => {
  const { tasks, completeTask, deleteTask } = useTasks();

  const handleComplete = (id: string) => {
    completeTask(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <span>{task.description}</span>
          <span>Created At: {task.createdAt.toLocaleString()}</span>
          <span>Status: {task.status ? "Completed" : "Pending"}</span>
          <button
            onClick={() => handleComplete(task.id)}
            disabled={task.status}
          >
            {task.status ? "Completed" : "Complete"}
          </button>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
