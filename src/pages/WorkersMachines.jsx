import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

const skillOptions = ['CNC', 'Welding', 'Quality', 'Laser', 'Painting', 'Electrical', 'Assembly'];
const shiftOptions = ['morning', 'afternoon', 'night'];
const avatarOptions = ['👷', '👩‍🔧', '👨‍🏭', '👩‍💼', '🧑‍🔬', '👨‍🔧', '🧑‍🏭', '👩‍🔬'];

export default function WorkersMachines() {
  const { workers, machines, tasks, dispatch } = useApp();
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workerForm, setWorkerForm] = useState({
    name: '', skills: ['CNC'], shift: 'morning', avatar: '👷',
    efficiency: 85, availability: 'available', points: 0, tasksCompleted: 0,
  });

  const sortedWorkers = [...workers].sort((a, b) => b.points - a.points);

  const handleAddWorker = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_WORKER',
      payload: {
        ...workerForm,
        efficiency: Number(workerForm.efficiency),
        points: Number(workerForm.points),
        tasksCompleted: Number(workerForm.tasksCompleted),
      },
    });
    setWorkerForm({
      name: '', skills: ['CNC'], shift: 'morning', avatar: '👷',
      efficiency: 85, availability: 'available', points: 0, tasksCompleted: 0,
    });
    setShowAddWorker(false);
  };

  const toggleSkill = (skill) => {
    setWorkerForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill],
    }));
  };

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Workers</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Monitor and manage your workforce</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddWorker(true)}
          className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          + Add Worker
        </motion.button>
      </motion.div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-bl-full" style={{ background: 'var(--warning-surface)' }} />
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2 relative z-10" style={{ color: 'var(--text-primary)' }}>
            🏆 Worker Leaderboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {sortedWorkers.slice(0, 3).map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-xl p-5 text-center"
                style={{
                  background: i === 0 ? 'var(--warning-surface)' : 'var(--bg-surface)',
                  border: `1px solid ${i === 0 ? 'rgba(251,191,36,0.3)' : 'var(--border-subtle)'}`,
                }}
              >
                <div className={`text-3xl mb-2 ${i === 0 ? 'animate-float' : ''}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold" style={{
                  background: i === 0 ? 'var(--warning-surface)' : 'var(--bg-surface)',
                  border: `2px solid ${i === 0 ? 'var(--warning)' : 'var(--border-default)'}`,
                  color: i === 0 ? 'var(--warning)' : 'var(--text-secondary)',
                }}>
                  {w.avatar}
                </div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{w.name}</h3>
                <p className="text-2xl font-display font-bold gradient-text mt-1">{w.points}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>points</p>
                <div className="flex justify-center gap-3 mt-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  <span>{w.tasksCompleted} tasks</span>
                  <span>{w.efficiency}% eff.</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Remaining workers */}
          <div className="mt-4 space-y-2">
            {sortedWorkers.slice(3).map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-sm font-display font-bold w-6 text-center" style={{ color: 'var(--text-muted)' }}>#{i + 4}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {w.avatar}
                </div>
                <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{w.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{w.tasksCompleted} tasks</span>
                <span className="text-sm font-display font-bold" style={{ color: 'var(--accent)' }}>{w.points} pts</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Workers Grid */}
      <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>👥 All Workers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workers.map((w, i) => {
          const assignedTasks = tasks.filter(t => t.assignedTo === w.id && t.status !== 'completed');
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{
                    background: w.availability === 'available' ? 'var(--success-surface)' : 'var(--bg-tertiary)',
                    border: `1px solid ${w.availability === 'available' ? 'rgba(52,211,153,0.3)' : 'var(--border-subtle)'}`,
                    color: w.availability === 'available' ? 'var(--success)' : 'var(--text-secondary)',
                  }}>
                    {w.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{w.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      background: w.availability === 'available' ? 'var(--success-surface)' : 'var(--accent-surface)',
                      color: w.availability === 'available' ? 'var(--success)' : 'var(--accent)',
                    }}>
                      {w.availability}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <div className="flex items-center justify-between">
                    <span>Skills</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {w.skills.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shift</span>
                    <span className="capitalize" style={{ color: 'var(--text-primary)' }}>{w.shift}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Efficiency</span>
                    <span className="font-semibold" style={{ color: w.efficiency > 90 ? 'var(--success)' : w.efficiency > 80 ? 'var(--accent)' : 'var(--warning)' }}>
                      {w.efficiency}%
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Active Tasks</span>
                      <span style={{ color: 'var(--text-primary)' }}>{assignedTasks.length}</span>
                    </div>
                    {assignedTasks.map(t => (
                      <div key={t.id} className="text-[10px] pl-2 mb-1" style={{ color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)' }}>
                        {t.name}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* ========== ADD WORKER MODAL ========== */}
      <AnimatePresence>
        {showAddWorker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddWorker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-strong p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-display font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Add New Worker</h2>
              <form onSubmit={handleAddWorker} className="space-y-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={workerForm.name}
                    onChange={e => setWorkerForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    placeholder="e.g. John Smith"
                  />
                </div>

                {/* Avatar picker */}
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Avatar</label>
                  <div className="flex gap-2 flex-wrap">
                    {avatarOptions.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setWorkerForm(f => ({ ...f, avatar: a }))}
                        className="w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all"
                        style={{
                          background: workerForm.avatar === a ? 'var(--accent-surface)' : 'var(--bg-surface)',
                          border: `2px solid ${workerForm.avatar === a ? 'var(--accent)' : 'var(--border-subtle)'}`,
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Skills (select at least one)</label>
                  <div className="flex gap-2 flex-wrap">
                    {skillOptions.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: workerForm.skills.includes(s) ? 'var(--accent-surface)' : 'var(--bg-surface)',
                          color: workerForm.skills.includes(s) ? 'var(--accent)' : 'var(--text-tertiary)',
                          border: `1px solid ${workerForm.skills.includes(s) ? 'rgba(99,102,241,0.3)' : 'var(--border-subtle)'}`,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Shift</label>
                    <select
                      value={workerForm.shift}
                      onChange={e => setWorkerForm(f => ({ ...f, shift: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      {shiftOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Efficiency %</label>
                    <input type="number" min="50" max="100" value={workerForm.efficiency}
                      onChange={e => setWorkerForm(f => ({ ...f, efficiency: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={workerForm.skills.length === 0} className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex-1 disabled:opacity-40">
                    Add Worker
                  </button>
                  <button type="button" onClick={() => setShowAddWorker(false)} className="glass px-6 py-2.5 rounded-xl text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
