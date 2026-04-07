import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-xs">
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p style={{ color: 'var(--accent)' }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SimulationPanel() {
  const { workers, dispatch, simulationActive, simulationResults } = useApp();
  const { theme } = useTheme();
  const [removedWorkerId, setRemovedWorkerId] = useState('');
  const [workloadIncrease, setWorkloadIncrease] = useState(0);
  const [animating, setAnimating] = useState(false);

  const tickColor = theme === 'dark' ? '#6b6b78' : '#a1a1aa';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  const handleRunSimulation = async () => {
    setAnimating(true);
    await new Promise(r => setTimeout(r, 1500));
    dispatch({
      type: 'RUN_SIMULATION',
      payload: {
        removedWorkerId: removedWorkerId ? Number(removedWorkerId) : null,
        workloadIncrease,
      },
    });
    setAnimating(false);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_SIMULATION' });
    setRemovedWorkerId('');
    setWorkloadIncrease(0);
  };

  const comparisonData = simulationResults ? [
    { name: 'Before', efficiency: simulationResults.originalEfficiency, fill: '#34d399' },
    { name: 'After', efficiency: simulationResults.newEfficiency, fill: '#f87171' },
  ] : [];

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>What-If Simulation</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Test scenarios and predict their impact on factory performance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <GlassCard className="sticky top-24">
            <h2 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              ⚙️ Simulation Controls
            </h2>

            <div className="space-y-5">
              {/* Remove Worker */}
              <div>
                <label className="text-xs block mb-2" style={{ color: 'var(--text-tertiary)' }}>Remove a Worker</label>
                <select
                  value={removedWorkerId}
                  onChange={e => setRemovedWorkerId(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                >
                  <option value="">No worker removed</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.skills.join(', ')})</option>
                  ))}
                </select>
              </div>

              {/* Workload Increase */}
              <div>
                <label className="text-xs block mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Workload Increase: <span className="font-bold" style={{ color: 'var(--accent)' }}>{workloadIncrease}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={workloadIncrease}
                  onChange={e => setWorkloadIncrease(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{
                    background: 'var(--bg-elevated)',
                    '--webkit-slider-thumb-bg': 'var(--accent)',
                  }}
                />
                <style>{`
                  input[type="range"]::-webkit-slider-thumb {
                    background: var(--accent) !important;
                    box-shadow: 0 0 8px rgba(99,102,241,0.3);
                  }
                `}</style>
                <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRunSimulation}
                  disabled={animating}
                  className="gradient-btn px-5 py-3 rounded-xl text-sm font-semibold flex-1 disabled:opacity-50"
                >
                  {animating ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>🔄</motion.span>
                      Running...
                    </span>
                  ) : '🚀 Run Simulation'}
                </motion.button>
                {simulationActive && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="glass px-4 py-3 rounded-xl text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    ↩ Reset
                  </motion.button>
                )}
              </div>
            </div>

            {/* Scenario Description */}
            <div className="mt-5 p-3 rounded-lg text-xs" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Scenario:</p>
              <p>
                {removedWorkerId
                  ? `Remove ${workers.find(w => w.id === Number(removedWorkerId))?.name}`
                  : 'No worker removed'}
                {workloadIncrease > 0 ? ` + ${workloadIncrease}% increased workload` : ''}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {animating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-96"
              >
                <motion.div
                  className="w-24 h-24 rounded-full border-4"
                  style={{ borderColor: 'var(--bg-tertiary)', borderTopColor: 'var(--accent)', borderRightColor: 'var(--accent-light)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-6 text-sm"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Analyzing factory performance...
                </motion.p>
              </motion.div>
            )}

            {!animating && !simulationResults && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-96 text-center"
              >
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Simulation Running</h3>
                <p className="text-sm max-w-md" style={{ color: 'var(--text-tertiary)' }}>
                  Configure scenario parameters on the left and click "Run Simulation" to see the predicted impact on your factory.
                </p>
              </motion.div>
            )}

            {!animating && simulationResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Impact Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Efficiency Drop', value: simulationResults.efficiencyDrop, suffix: '%', color: 'var(--danger)', icon: '📉' },
                    { label: 'Delay Increase', value: simulationResults.delayIncrease, suffix: 'hrs', color: 'var(--warning)', icon: '⏱' },
                    { label: 'Active Workers', value: simulationResults.activeWorkers, suffix: '', color: 'var(--accent)', icon: '👥' },
                    { label: 'Bottleneck Risk', value: simulationResults.bottleneckRisk, suffix: '', color: simulationResults.bottleneckRisk === 'Critical' ? 'var(--danger)' : simulationResults.bottleneckRisk === 'High' ? 'var(--warning)' : 'var(--success)', icon: '🎯' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GlassCard>
                        <div className="text-center">
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-2xl font-display font-bold" style={{ color: item.color }}>
                            {typeof item.value === 'number' ? <AnimatedCounter value={item.value} /> : item.value}
                            {item.suffix}
                          </div>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>

                {/* Before vs After Chart */}
                <GlassCard>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📊 Efficiency Comparison</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={comparisonData} barSize={60}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} />
                      <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="efficiency" radius={[8, 8, 0, 0]}>
                        {comparisonData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>

                {/* Detailed Breakdown */}
                <GlassCard>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📋 Detailed Impact Analysis</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Removed Worker', value: simulationResults.removedWorker, color: 'var(--text-primary)' },
                      { label: 'Workload Increase', value: `+${simulationResults.workloadIncrease}%`, color: 'var(--accent)' },
                      { label: 'Original Efficiency', value: `${simulationResults.originalEfficiency}%`, color: 'var(--success)' },
                      { label: 'New Efficiency', value: `${simulationResults.newEfficiency}%`, color: 'var(--danger)' },
                      { label: 'Estimated Delay', value: `${simulationResults.originalDelay}hrs → ${simulationResults.newDelay}hrs`, color: 'var(--warning)' },
                      { label: 'Overloaded Workers', value: `${simulationResults.overloadedWorkers} workers`, color: simulationResults.overloadedWorkers > 2 ? 'var(--danger)' : 'var(--warning)' },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{row.label}</span>
                        <span className="text-sm font-semibold" style={{ color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* AI Recommendation */}
                <GlassCard glow="neon-glow-purple">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--gradient-primary)' }}>🧠</div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Recommendation</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {simulationResults.bottleneckRisk === 'Critical'
                      ? `⚠️ Critical scenario detected. Removing ${simulationResults.removedWorker} causes a ${simulationResults.efficiencyDrop}% efficiency drop. Consider cross-training workers in ${workers.find(w => w.id === Number(removedWorkerId))?.skills.join(' and ')} skills to build redundancy.`
                      : simulationResults.bottleneckRisk === 'High'
                      ? `⚡ High impact scenario. The ${simulationResults.workloadIncrease}% workload increase strains capacity. Recommend adding one part-time worker or redistributing tasks across shifts.`
                      : `✅ Low impact scenario. The factory can handle this change with minimal disruption. Current workforce has sufficient capacity and skill coverage.`
                    }
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
