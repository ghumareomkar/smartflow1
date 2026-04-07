import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const iconMap = {
  total: '📦',
  completed: '✅',
  pending: '⏳',
  delayed: '🚨',
  workers: '👥',
  efficiency: '⚡',
  machines: '🏭',
  alerts: '🔔',
};

const colorMap = {
  total: 'var(--accent)',
  completed: 'var(--success)',
  pending: 'var(--accent-light)',
  delayed: 'var(--danger)',
  workers: 'var(--accent)',
  efficiency: 'var(--success)',
  machines: 'var(--accent-light)',
  alerts: 'var(--danger)',
};

const gradientMap = {
  total: 'var(--gradient-accent)',
  completed: 'linear-gradient(to right, var(--success), var(--teal))',
  pending: 'var(--gradient-primary)',
  delayed: 'var(--gradient-warm)',
};

export default function KPICard({ label, value, type = 'total', suffix = '', trend = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass p-5 relative overflow-hidden group"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-10" style={{ background: colorMap[type] }} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <div className="text-3xl font-bold font-display" style={{ color: colorMap[type] }}>
            <AnimatedCounter value={value} />{suffix}
          </div>
          {trend !== null && (
            <div className="text-xs mt-1 flex items-center gap-1" style={{ color: trend >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last shift
            </div>
          )}
        </div>
        <motion.div
          className="text-2xl"
          whileHover={{ rotate: 15, scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {iconMap[type]}
        </motion.div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: gradientMap[type] || 'var(--gradient-primary)' }} />
    </motion.div>
  );
}
