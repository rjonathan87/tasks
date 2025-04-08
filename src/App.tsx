import TaskForm from "./interfaces/components/TaskForm";
import TaskList from "./interfaces/components/TaskList";
import { TaskProvider } from "./interfaces/task-context";

function App() {
  return (
    <TaskProvider>
      <nav className="fixed top-0 left-0 w-full z-10 bg-blue-500 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Aplicación de Tareas</h1>
      </nav>

      <div className="container mx-auto mt-8 pt-32 p-4 bg-white shadow-md rounded-md">
        <div className="fixed top-[56px] left-0 w-full z-10 bg-white mb-6 p-4 border-b border-gray-300">
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
