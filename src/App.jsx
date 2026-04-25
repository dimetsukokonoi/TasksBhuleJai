import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  BarChart2, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Settings, 
  Plus, 
  Check, 
  Clock,
  MoreHorizontal
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Projects', icon: Folder },
    { name: 'Team', icon: Users },
    { name: 'Analytics', icon: BarChart2 }
  ];

  const chartData = [40, 60, 100, 80, 50, 20];
  const chartLabels = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'];

  const todayTasks = [
    { title: 'Finalize Q3 Marketing Strategy', time: '11:30 AM', project: 'Marketing Team', priority: 'High', color: 'bg-red-50 text-red-600', checked: false },
    { title: 'Review Design System Updates', time: '2:00 PM', project: 'Design Squad', priority: 'Medium', color: 'bg-slate-100 text-slate-600', checked: false },
    { title: 'Morning Standup Meeting', time: '9:15 AM', project: 'General', checked: true }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 pb-2">
            <h1 className="font-semibold text-lg text-slate-900 tracking-tight">Workspaces</h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">Productivity Suite</p>
          </div>
          
          <div className="px-4 mt-6">
             <button className="w-full bg-black text-white hover:bg-slate-800 transition rounded-md py-2.5 text-sm font-medium flex items-center justify-center">
               <Plus className="w-4 h-4 mr-2" /> New Project
             </button>
          </div>

          <nav className="mt-8 space-y-1 px-3">
            {navItems.map(item => (
              <button 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.name ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 space-y-1 mb-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-2xl border-t border-l border-slate-200">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-100 shrink-0">
          <div className="w-1/3">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tasks, projects..." 
                  className="w-full bg-slate-50 border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
             </div>
          </div>
          
          <div className="font-bold text-lg tracking-tight">TasksBhuleJai</div>

          <div className="w-1/3 flex items-center justify-end space-x-4">
             <button className="text-slate-400 hover:text-slate-600 relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="text-slate-400 hover:text-slate-600">
               <Settings className="w-5 h-5" />
             </button>
             <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 ml-2">
                <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          {activeTab === 'Dashboard' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Good morning.</h2>
              <p className="text-slate-500 mt-1 mb-8">Here is your operational overview for today.</p>
              
              <div className="grid grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                   {/* Mock Daily Flow Chart */}
                   <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-800">Daily Flow</h3>
                        <BarChart2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="h-40 flex items-end justify-between space-x-2 gap-2 mt-4 px-2">
                        {chartData.map((h, i) => (
                           <div key={i} className="w-full flex flex-col items-center group">
                             <div className={`w-full rounded-t-sm transition-all duration-300 ${i === 2 ? 'bg-slate-900' : 'bg-slate-200 group-hover:bg-slate-300'}`} style={{ height: `${h}%` }}></div>
                             <span className="text-[10px] text-slate-400 font-medium mt-3">
                               {chartLabels[i]}
                             </span>
                           </div>
                        ))}
                      </div>
                   </div>

                   {/* Today's Tasks */}
                   <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-800">Today</h3>
                        <button className="text-sm text-slate-500 hover:text-slate-900">View All</button>
                      </div>
                      
                      <div className="space-y-3">
                         {todayTasks.map((task, i) => (
                           <div key={i} className="flex items-start justify-between group p-2 -mx-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="flex items-start space-x-3">
                                 <button className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border ${task.checked ? 'bg-slate-500 border-slate-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                    {task.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                 </button>
                                 <div>
                                   <p className={`text-sm font-medium ${task.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                                   {!task.checked ? (
                                     <p className="text-xs text-slate-400 mt-1">Due at {task.time} &bull; {task.project}</p>
                                   ) : (
                                     <p className="text-xs text-slate-400 mt-1">Completed at {task.time}</p>
                                   )}
                                 </div>
                              </div>
                              {task.priority && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${task.color}`}>
                                  {task.priority}
                                </span>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Right Column */}
                <div className="col-span-1 space-y-6">
                   {/* Focus Distribution */}
                   <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
                     <div className="w-full flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-800">Focus Distribution</h3>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                     </div>
                     <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                           <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                           <path className="text-slate-900" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-2xl font-bold text-slate-800 tracking-tight">68%</span>
                        </div>
                     </div>
                     <div className="w-full space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div><span className="text-slate-600">Deep Work</span></div>
                          <span className="font-medium text-slate-800">4h 20m</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-200 mr-2"></div><span className="text-slate-600">Meetings</span></div>
                          <span className="font-medium text-slate-800">1h 45m</span>
                        </div>
                     </div>
                   </div>

                   {/* Add New Task Form */}
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60 shadow-inner">
                      <h3 className="font-semibold text-slate-800 mb-4">Add New Task</h3>
                      <div className="space-y-3">
                         <input type="text" placeholder="What needs to be done?" className="w-full text-sm py-2 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                         <div className="flex space-x-2">
                            <select className="flex-1 text-sm py-2 px-2 rounded-md border border-slate-200 bg-white text-slate-600 focus:outline-none">
                              <option>Select Project</option>
                              <option>Marketing</option>
                              <option>Design</option>
                            </select>
                            <select className="w-24 text-sm py-2 px-2 rounded-md border border-slate-200 bg-white text-slate-600 focus:outline-none">
                              <option>Normal</option>
                              <option>High</option>
                            </select>
                         </div>
                         <button className="w-full bg-black text-white font-medium text-sm py-2.5 rounded-md flex items-center justify-center hover:bg-slate-800 transition">
                            <Plus className="w-4 h-4 mr-2" /> Create Task
                         </button>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          )}

          {activeTab !== 'Dashboard' && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <Folder className="w-12 h-12 mb-4 opacity-20" />
               <p className="text-lg font-medium">{activeTab} view selected.</p>
               <p className="text-sm">Implement other views based on the provided screenshots.</p>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
