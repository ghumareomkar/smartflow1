import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

export default function Resources() {
  const { workers, machines, tasks, dispatch } = useApp();
  const [showAddMachine, setShowAddMachine] = useState(false);
  const [transferModal, setTransferModal] = useState(null);
  const [machineForm, setMachineForm] = useState({ name: '', type: 'CNC', status: 'idle', utilization: 0, uptime: 99, temperature: 30 });
  const [transferTo, setTransferTo] = useState('');

  const handleAddMachine = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_MACHINE',
      payload: {
        ...machineForm,
        utilization: Number(machineForm.utilization),
        uptime: Number(machineForm.uptime),
        temperature: Number(machineForm.temperature),
        assignedWorker: null,
      },
    });
    setMachineForm({ name: '', type: 'CNC', status: 'idle', utilization: 0, uptime: 99, temperature: 30 });
    setShowAddMachine(false);
  };

  const handleTransfer = (workerId) => {
    if (!transferTo) return;
    // Reassign all tasks from this worker to the target worker
    const workerTasks = tasks.filter(t => t.assignedTo === workerId && t.status !== 'completed');
    workerTasks.forEach(t => {
      dispatch({ type: 'UPDATE_TASK', payload: { id: t.id, assignedTo: Number(transferTo) } });
    });
    setTransferModal(null);
    setTransferTo('');
  };

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Resources</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage worker transfers and factory machines</p>
      </motion.div>

      {/* ========== TRANSFER WORKERS ========== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            🔄 Transfer Workers
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
                      background: w.availability === 'available' ? 'var(--success-surface)' : 'var(--accent-surface)',
                      border: `1px solid ${w.availability === 'available' ? 'rgba(52,211,153,0.3)' : 'rgba(99,102,241,0.3)'}`,
                      color: w.availability === 'available' ? 'var(--success)' : 'var(--accent)',
                    }}>
                      {w.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{w.name}</h3>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {w.skills.join(', ')} · {w.shift} shift
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Active Tasks: <strong style={{ color: 'var(--text-primary)' }}>{assignedTasks.length}</strong></span>
                    <span style={{
                      color: w.availability === 'available' ? 'var(--success)' : 'var(--accent)',
                    }}>{w.availability}</span>
                  </div>

                  {assignedTasks.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {assignedTasks.slice(0, 2).map(t => (
                        <div key={t.id} className="text-[10px] px-2 py-1 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)' }}>
                          {t.name} — {t.progress}%
                        </div>
                      ))}
                      {assignedTasks.length > 2 && (
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>+{assignedTasks.length - 2} more</p>
                      )}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setTransferModal(w); setTransferTo(''); }}
                    disabled={assignedTasks.length === 0}
                    className="w-full py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                    style={{
                      background: 'var(--accent-surface)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(99,102,241,0.2)',
                    }}
                  >
                    {assignedTasks.length > 0 ? '🔄 Transfer Tasks' : 'No tasks to transfer'}
                  </motion.button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ========== MACHINES ========== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            🏭 Machines
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMachine(true)}
            className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold"
          >
            + Add Machine
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((m, i) => {
            const assignedWorker = m.assignedWorker ? workers.find(w => w.id === m.assignedWorker) : null;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                      background: m.status === 'running' ? 'var(--success-surface)' : m.status === 'idle' ? 'var(--warning-surface)' : 'var(--danger-surface)',
                      color: m.status === 'running' ? 'var(--success)' : m.status === 'idle' ? 'var(--warning)' : 'var(--danger)',
                    }}>{m.status}</span>
                  </div>

                  <div className="relative w-full h-3 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-tertiary)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.utilization}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{
                        background: m.utilization > 80 ? 'linear-gradient(to right, var(--warning), var(--danger))' :
                          m.utilization > 50 ? 'linear-gradient(to right, var(--accent), var(--success))' :
                          'linear-gradient(to right, var(--success), var(--teal))'
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <div>
                      <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Utilization</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.utilization}%</span>
                    </div>
                    <div>
                      <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Uptime</span>
                      <span className="font-semibold" style={{ color: 'var(--success)' }}>{m.uptime}%</span>
                    </div>
                    <div>
                      <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Temp</span>
                      <span className="font-semibold" style={{ color: m.temperature > 50 ? 'var(--danger)' : 'var(--text-primary)' }}>{m.temperature}°C</span>
                    </div>
                    <div>
                      <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Operator</span>
                      <span style={{ color: 'var(--text-primary)' }}>{assignedWorker ? assignedWorker.name.split(' ')[0] : '—'}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ========== TRANSFER MODAL ========== */}
      <AnimatePresence>
        {transferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setTransferModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-strong p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Transfer Tasks</h2>
              <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>
                Move all active tasks from <strong style={{ color: 'var(--accent)' }}>{transferModal.name}</strong> to another worker
              </p>

              <div className="mb-4">
                <label className="text-xs block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Transfer to</label>
                <select
                  value={transferTo}
                  onChange={e => setTransferTo(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                >
                  <option value="">Select a worker...</option>
                  {workers.filter(w => w.id !== transferModal.id).map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.skills.join(', ')}) — {w.availability}</option>
                  ))}
                </select>
              </div>

              {/* Tasks being transferred */}
              <div className="mb-5 space-y-1">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tasks to transfer:</p>
                {tasks.filter(t => t.assignedTo === transferModal.id && t.status !== 'completed').map(t => (
                  <div key={t.id} className="text-xs p-2 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{t.progress}%</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTransfer(transferModal.id)}
                  disabled={!transferTo}
                  className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex-1 disabled:opacity-40"
                >
                  Confirm Transfer
                </motion.button>
                <button onClick={() => setTransferModal(null)} className="glass px-6 py-2.5 rounded-xl text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== ADD MACHINE MODAL ========== */}
      <AnimatePresence>
        {showAddMachine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddMachine(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-strong p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-display font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Add New Machine</h2>
              <form onSubmit={handleAddMachine} className="space-y-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Machine Name</label>
                  <input
                    type="text"
                    required
                    value={machineForm.name}
                    onChange={e => setMachineForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    placeholder="e.g. Robotic Arm X3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Type</label>
                    <select
                      value={machineForm.type}
                      onChange={e => setMachineForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      {['CNC', 'Welding', 'Laser', 'Paint', 'Assembly', 'Quality', 'Electrical'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Status</label>
                    <select
                      value={machineForm.status}
                      onChange={e => setMachineForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      {['running', 'idle', 'maintenance'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Utilization %</label>
                    <input type="number" min="0" max="100" value={machineForm.utilization}
                      onChange={e => setMachineForm(f => ({ ...f, utilization: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Uptime %</label>
                    <input type="number" min="0" max="100" value={machineForm.uptime}
                      onChange={e => setMachineForm(f => ({ ...f, uptime: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>Temp °C</label>
                    <input type="number" min="0" max="100" value={machineForm.temperature}
                      onChange={e => setMachineForm(f => ({ ...f, temperature: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex-1">
                    Add Machine
                  </button>
                  <button type="button" onClick={() => setShowAddMachine(false)} className="glass px-6 py-2.5 rounded-xl text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
