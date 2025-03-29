import TaskForm from "./interfaces/components/TaskForm";
import TaskList from "./interfaces/components/TaskList";
import { TaskProvider } from "./interfaces/task-context";

function App() {
  return (
    <TaskProvider>
      <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Aplicación de Tareas</h1>
      </nav>

      <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
        <div className="mb-6 p-4 border-b border-gray-300">
          <TaskForm />
        </div>
        <div className="p-4">
          <TaskList />
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;
