import TaskForm from "./interfaces/components/TaskForm";
import TaskList from "./interfaces/components/TaskList";
import { TaskProvider } from "./interfaces/task-context";

function App() {
  return (
    <TaskProvider>
      <div>
        <h1>Task Management App</h1>
        <TaskForm />
        <TaskList />
      </div>
    </TaskProvider>
  );
}

export default App;
