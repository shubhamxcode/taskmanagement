import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, CheckSquare, AlertCircle, Loader2 } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import type { Task } from './components/TaskCard';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string, description: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        title,
        description,
        status: 'todo'
      });
      setTasks([response.data, ...tasks]);
    } catch (err) {
      setError('Failed to add task.');
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { status });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (err) {
      setError('Failed to update task status.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="flex items-center gap-3 mb-12">
        <div className="p-3 bg-indigo-600 rounded-2xl">
          <CheckSquare className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">TaskFlow</h1>
          <p className="text-slate-400">Manage your work with ease</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              New Task
            </h2>
            <TaskForm onAdd={addTask} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Layout size={20} className="text-indigo-400" />
              All Tasks
            </h2>
            <span className="text-sm text-slate-500 font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {tasks.length} total
            </span>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-8 flex items-center gap-3 text-rose-400">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onUpdateStatus={updateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <Layout size={48} className="mx-auto mb-4 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-400">No tasks found</h3>
              <p className="text-slate-500 text-sm">Add your first task to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
