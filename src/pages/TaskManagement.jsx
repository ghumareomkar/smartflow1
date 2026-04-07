import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

const priorities = ['high', 'medium', 'low'];
const skills = ['CNC', 'Welding', 'Quality', 'Laser', 'Painting', 'Electrical', 'Assembly'];

const statusColorMap = {
  'completed': { bg: 'var(--success-surface)', color: 'var(--success)', border: 'rgba(52,211,153,0.3)' },
  'in-progress': { bg: 'var(--accent-surface)', color: 'var(--accent)', border: 'rgba(99,102,241,0.3)' },
  'pending': { bg: 'var(--accent-surface)', color: 'var(--accent-light)', border: 'rgba(139,92,246,0.3)' },
  'delayed': { bg: 'var(--danger-surface)', color: 'var(--danger)', border: 'rgba(248,113,113,0.3)' },
};

const priorityColorMap = {
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--success)',
};

export default function TaskManagement() {
  const { tasks, workers, dispatch, getWorkerById } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [assigning, setAssigning] = useState(false);
  const [assignedIds, setAssignedIds] = useState([]);
  const [form, setForm] = useState({ name: '', priority: 'medium', deadline: '', skill: 'CNC', estimatedHours: 2 });

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TASK', payload: { ...form, estimatedHours: Number(form.estimatedHours) } });
    setForm({ name: '', priority: 'medium', deadline: '', skill: 'CNC', estimatedHours: 2 });
    setShowForm(false);
  };

  const handleAutoAssign = async () => {
    setAssigning(true);
    const pendingTasks = tasks.filter(t => t.status === 'pending' && !t.assignedTo);
    
    for (let i = 0; i < pendingTasks.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setAssignedIds(prev => [...prev, pendingTasks[i].id]);
    }
    
    await new Promise(r => setTimeout(r, 400));
    dispatch({ type: 'AUTO_ASSIGN' });
    
    setTimeout(() => {
      setAssigning(false);
      setAssignedIds([]);
    }, 1000);
  };

  const delayedTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const deadline = new Date(t.deadline);
    const now = new Date();
    const hoursLeft = (deadline - now) / (1000 * 60 * 60);
    return hoursLeft < 4 && t.progress < 80;
  });

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Task Management</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Create, assign, and track shopfloor tasks</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            + Add Task
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAutoAssign}
            disabled={assigning}
            className="glass px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ color: 'var(--accent)' }}
          >
            {assigning ? (
              <span className="flex items-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⚙️</motion.span>
                Assigning...
              </span>
            ) : '🧠 Auto Assign'}
          </motion.button>
        </div>
      </motion.div>

      {/* Delay Alerts */}
      {delayedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <GlassCard glow="neon-glow-danger" className="border-danger/30">
            <div className="flex items-center gap-2 mb-2">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>⚠️</motion.span>
              <span className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>Predictive Delay Alerts</span>
            </div>
            <div className="space-y-1">
              {delayedTasks.slice(0, 3).map(t => (
                <p key={t.id} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-medium" style={{ color: 'var(--danger)' }}>{t.name}</span> — Deadline approaching, only {t.progress}% complete. Delay expected.
                </p>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'in-progress', 'completed', 'delayed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filter === s ? 'var(--accent-surface)' : 'var(--glass-bg)',
              color: filter === s ? 'var(--accent)' : 'var(--text-tertiary)',
              border: filter === s ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--glass-border)',
            }}
          >
            {s === 'all' ? 'All' : s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Task Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const worker = task.assignedTo ? getWorkerById(task.assignedTo) : null;
            const isBeingAssigned = assignedIds.includes(task.id);
            const statusStyle = statusColorMap[task.status] || statusColorMap['pending'];

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: isBeingAssigned ? '0 0 20px rgba(99,102,241,0.3)' : '0 0 0px transparent',
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="glass p-5 relative overflow-hidden group"
              >
                {isBeingAssigned && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.15, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute inset-0"
                    style={{ background: 'var(--accent-surface)' }}
                  />
                )}

                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{task.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: priorityColorMap[task.priority] }}>
                        ● {task.priority}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{task.id}</span>
                </div>

                {/* Progress */}
                <div className="mb-3 relative z-10">
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Progress</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{task.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: task.progress === 100 ? 'var(--success)' :
                          task.progress > 60 ? 'var(--accent)' :
                          task.progress > 30 ? 'var(--warning)' : 'var(--danger)'
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-[10px] relative z-10" style={{ color: 'var(--text-tertiary)' }}>
                  <div className="flex items-center gap-1">
                    🛠 <span>{task.skill}</span>
                  </div>
                  {worker && (
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                        {worker.avatar}
                      </div>
                      <span>{worker.name.split(' ')[0]}</span>
                    </div>
                  )}
                  {!worker && <span className="italic" style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
                </div>

                {/* Deadline */}
                <div className="mt-2 text-[10px] relative z-10" style={{ color: 'var(--text-muted)' }}>
                  📅 {new Date(task.deadline).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-strong p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Add New Task</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Task Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    placeholder="Enter task name..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Required Skill</label>
                    <select
                      value={form.skill}
                      onChange={e => setForm(f => ({ ...f, skill: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      {skills.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Deadline</label>
                    <input
                      type="datetime-local"
                      required
                      value={form.deadline}
                      onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Est. Hours</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={form.estimatedHours}
                      onChange={e => setForm(f => ({ ...f, estimatedHours: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex-1">
                    Create Task
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="glass px-6 py-2.5 rounded-xl text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
