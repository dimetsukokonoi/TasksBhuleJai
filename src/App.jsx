import React, { useState } from 'react';
import { Plus, Check, Trash2, Calendar } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finalize Q3 Marketing Strategy', project: 'Marketing Team', priority: 'High', date: '2023-11-20T11:30', completed: false },
    { id: 2, title: 'Review Design System Updates', project: 'Design Squad', priority: 'Medium', date: '2023-11-20T14:00', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Personal');
  const [newTaskPriority, setNewTaskPriority] = useState('Normal');
  const [newTaskDate, setNewTaskDate] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDate) return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      project: newTaskProject,
      priority: newTaskPriority,
      date: newTaskDate,
      completed: false
    };

    setTasks([...tasks, newTask].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col pt-6 pb-4 px-4">
        <h1 className="font-bold text-xl mb-1 text-slate-800 tracking-tight">Workspaces</h1>
        <p className="text-xs text-slate-500 mb-8 uppercase tracking-wider font-semibold">Productivity Suite</p>
        
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-slate-100 rounded-md text-slate-800 font-medium">
            <div className="w-5 h-5 grid grid-cols-2 gap-1 rounded bg-slate-200 p-0.5">
               <div className="bg-slate-400 rounded-sm"></div><div className="bg-slate-400 rounded-sm"></div>
               <div className="bg-slate-400 rounded-sm"></div><div className="bg-slate-400 rounded-sm"></div>
            </div>
            <span>Dashboard</span>
          </a>
        </nav>

        <button className="flex items-center justify-center w-full bg-black text-white rounded-md py-2.5 font-medium mb-12 hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center shrink-0 px-8">
            <div className="flex-1 text-center font-bold text-lg">TaskFlow</div>
        </header>

        {/* Dashboard Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
           <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Good morning.</h2>
           <p className="text-slate-500 mb-8">Here is your operational overview for today.</p>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Task List Section */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                 <h3 className="text-xl font-semibold mb-6 text-slate-800 flex justify-between items-center">
                    Upcoming Tasks
                 </h3>
                 <div className="space-y-4">
                    {tasks.map(task => (
                      <div key={task.id} className={`flex items-start p-4 rounded-lg border ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'} transition-all group`}>
                         <button 
                           onClick={() => toggleTask(task.id)}
                           className={`mt-1 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border ${task.completed ? 'bg-slate-400 border-slate-400' : 'border-slate-300 hover:border-slate-400'}`}
                         >
                            {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                         </button>
                         <div className="ml-4 flex-1">
                            <h4 className={`text-base font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 flex items-center">
                               Due at {formatDateTime(task.date)} &bull; {task.project}
                            </p>
                         </div>
                         <div className="flex items-center space-x-3">
                             <span className={`px-2.5 py-1 rounded text-xs font-medium ${task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                               {task.priority}
                             </span>
                             <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-slate-400">No tasks remaining. Great job!</div>
                    )}
                 </div>
              </div>

              {/* Add Task Form Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 self-start">
                 <h3 className="text-xl font-semibold mb-6 text-slate-800">Add New Task</h3>
                 <form onSubmit={addTask} className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Task description</label>
                       <input 
                         type="text" 
                         value={newTaskTitle}
                         onChange={(e) => setNewTaskTitle(e.target.value)}
                         placeholder="What needs to be done?" 
                         className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Due Date & Time</label>
                       <div className="relative">
                          <input 
                            type="datetime-local" 
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-600"
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                            <select 
                               value={newTaskProject}
                               onChange={(e) => setNewTaskProject(e.target.value)}
                               className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-700 bg-white"
                            >
                               <option>Personal</option>
                               <option>Marketing</option>
                               <option>Design</option>
                               <option>Engineering</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select 
                               value={newTaskPriority}
                               onChange={(e) => setNewTaskPriority(e.target.value)}
                               className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-700 bg-white"
                            >
                               <option>Normal</option>
                               <option>Medium</option>
                               <option>High</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-black text-white rounded-md py-2.5 font-medium mt-2 flex items-center justify-center hover:bg-slate-800 transition-colors">
                        <Plus className="w-4 h-4 mr-2" /> Create Task
                    </button>
                 </form>
              </div>

           </div>
        </main>
      </div>
    </div>
  );
}

export default App;
