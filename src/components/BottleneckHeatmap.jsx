import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function BottleneckHeatmap() {
  const { getBottlenecks, tasks } = useApp();
  const bottlenecks = getBottlenecks();

  const getColor = (level) => {
    switch (level) {
      case 'critical': return {
        bg: 'var(--danger-surface)',
        border: 'rgba(248, 113, 113, 0.3)',
        text: 'var(--danger)',
        glow: '0 0 15px rgba(248,113,113,0.15)'
      };
      case 'warning': return {
        bg: 'var(--warning-surface)',
        border: 'rgba(251, 191, 36, 0.3)',
        text: 'var(--warning)',
        glow: '0 0 10px rgba(251,191,36,0.1)'
      };
      default: return {
        bg: 'var(--success-surface)',
        border: 'rgba(52, 211, 153, 0.3)',
        text: 'var(--success)',
        glow: '0 0 8px rgba(52,211,153,0.08)'
      };
    }
  };

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          🔥 Bottleneck Heatmap
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }}></span> Normal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--warning)' }}></span> Warning</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }}></span> Critical</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bottlenecks.map((worker, index) => {
          const colors = getColor(worker.level);
          return (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl p-3 text-center relative overflow-hidden"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.glow,
              }}
            >
              {worker.level === 'critical' && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ background: 'var(--danger)' }}
                />
              )}
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1.5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  {worker.avatar}
                </div>
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{worker.name.split(' ')[0]}</p>
                <p className="text-lg font-bold font-display" style={{ color: colors.text }}>{worker.load}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>tasks</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
