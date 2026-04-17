import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../api/tasks';
import type { Task } from '../types';
import { 
  LogOut, Plus, Trash2, CheckCircle, 
  Calendar, Zap, Target, CheckCircle2, ArrowRight, ChevronDown
} from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const newTask = await tasksAPI.createTask({
        title: newTaskTitle, 
        description: "", 
        status: 'todo',
        priority: newPriority, 
        due_date: newDueDate ? new Date(newDueDate).toISOString() : undefined
      });
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewDueDate('');
    } catch (error) { console.error(error); }
  };

  const priorityLabels = {
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH'
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0f172a]">
      <div className="text-teal-400 font-black italic tracking-[0.5em] text-xl animate-pulse">SYSTEM LOADING_</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-teal-500/30">
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        
        <header className="glass-panel rounded-[2rem] p-6 mb-10 flex justify-between items-center border border-white/5 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="flex gap-2 rotate-3 scale-90">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
                  <Zap className="text-amber-400" size={20} strokeWidth={2.5}/>
              </div>
              <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20 shadow-lg shadow-teal-500/10">
                  <CheckCircle2 className="text-teal-400" size={20} strokeWidth={2.5}/>
              </div>
            </div>

            <div className="flex flex-col font-black italic leading-none tracking-tighter cursor-default">
              <div className="text-2xl md:text-3xl flex">
                <span className="text-white">TA</span>
                <span className="text-teal-400">SK</span>
              </div>
              <span className="text-[9px] font-bold not-italic tracking-[0.4em] uppercase text-slate-500 -mt-1">Manager_</span>
            </div>

            <div className="hidden md:block w-[1px] h-8 bg-slate-800/50 mx-2"></div>
            
            <div className="hidden lg:block">
              <h1 className="text-2xl font-black italic tracking-tighter text-slate-400 uppercase">Workspace</h1>
            </div>
          </div>

          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} 
            className="group flex items-center gap-3 px-5 py-2.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-2xl transition-all font-black italic text-xs uppercase tracking-widest"
          >
            <span className="hidden sm:inline">LOGOUT</span>
            <LogOut size={18} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 bg-slate-900/40 shadow-xl">
              <h2 className="text-xl font-black italic tracking-tighter text-teal-400 uppercase mb-8 flex items-center gap-3">
                <Plus size={22} strokeWidth={3} /> NEW FOCUS POINT
              </h2>
              
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">TASK DESCRIPTION</label>
                  <input 
                    type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="WHAT TO ACHIEVE?"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl px-6 py-4 outline-none focus:border-teal-500/50 text-white font-black italic transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">DUE DATE</label>
                    <input 
                      type="date" 
                      value={newDueDate} 
                      onChange={(e) => setNewDueDate(e.target.value)} 
                      className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-sm font-black italic outline-none text-slate-300 focus:border-teal-500/50 transition-all uppercase" 
                    />
                  </div>
                  
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">PRIORITY</label>
                    <div 
                      onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                      className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-sm font-black italic text-teal-400 flex justify-between items-center cursor-pointer hover:border-teal-500/30 transition-all"
                    >
                      {priorityLabels[newPriority]}
                      <ChevronDown size={16} className={`transition-transform ${isPriorityOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isPriorityOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                        {Object.entries(priorityLabels).map(([value, label]) => (
                          <div
                            key={value}
                            onClick={() => {
                              setNewPriority(value as any);
                              setIsPriorityOpen(false);
                            }}
                            className="px-4 py-3 text-xs font-black italic text-slate-400 hover:bg-teal-500 hover:text-slate-900 cursor-pointer transition-all uppercase"
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-black italic py-4 rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 tracking-tighter text-lg">
                  INTEGRATE TO SYSTEM <ArrowRight size={20} />
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel rounded-[2.5rem] p-6 border border-white/5 bg-slate-900/40">
                <Zap className="text-amber-400 mb-3" size={24} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">PENDING</p>
                <p className="text-5xl font-black italic text-white tracking-tighter leading-none">{tasks.filter(t => t.status !== 'done').length}</p>
              </div>
              <div className="glass-panel rounded-[2.5rem] p-6 bg-teal-500/5 border border-teal-500/10">
                <CheckCircle2 className="text-teal-400 mb-3" size={24} />
                <p className="text-teal-400/50 text-[10px] font-black uppercase tracking-[0.2em]">SUCCESS</p>
                <p className="text-5xl font-black italic text-teal-400 tracking-tighter leading-none">{tasks.filter(t => t.status === 'done').length}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-panel rounded-[2.5rem] p-8 border border-white/5 bg-slate-900/40 shadow-xl">
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-400 uppercase mb-10 flex items-center gap-4">
              <Target className="text-teal-400" size={26} /> ACTIVE TASK FLOW
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className={`p-6 rounded-[2rem] border transition-all duration-500 group relative ${
                  task.status === 'done' 
                  ? 'bg-slate-900/20 border-slate-800/50 opacity-50' 
                  : 'bg-slate-800/40 border-slate-700/50 hover:border-teal-500/40'
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[10px] font-black italic uppercase tracking-widest px-4 py-1.5 rounded-xl border ${
                      task.priority === 'high' 
                      ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' 
                      : 'text-teal-400 border-teal-500/20 bg-teal-500/5'
                    }`}>
                      {priorityLabels[task.priority as keyof typeof priorityLabels]}
                    </span>
                    <button 
                      onClick={async () => { await tasksAPI.deleteTask(task.id); fetchTasks(); }} 
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className={`text-xl font-black italic tracking-tighter mb-8 leading-none ${
                    task.status === 'done' ? 'line-through text-slate-600' : 'text-slate-100'
                  }`}>
                    {task.title.toUpperCase()}
                  </h3>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-slate-500 font-black italic text-[10px] tracking-widest uppercase">
                        <Calendar size={14} className="text-teal-500/50" />
                        <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('en-US') : 'NO LIMIT'}</span>
                     </div>
                     
                     <button 
                      onClick={async () => { 
                        const newStatus = task.status === 'done' ? 'todo' : 'done';
                        await tasksAPI.updateTask(task.id, { status: newStatus });
                        fetchTasks();
                      }}
                     >
                      {task.status === 'done' 
                        ? <CheckCircle className="text-teal-400 shadow-lg shadow-teal-500/20" size={36} /> 
                        : <div className="w-9 h-9 rounded-full border-4 border-slate-700 group-hover:border-teal-500/50 transition-all"></div>
                      }
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}