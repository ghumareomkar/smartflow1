import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import KPICard from '../components/KPICard';
import SmartInsights from '../components/SmartInsights';
import BottleneckHeatmap from '../components/BottleneckHeatmap';
import GlassCard from '../components/GlassCard';

const COLORS = ['#6366f1', '#34d399', '#8b5cf6', '#f87171', '#fbbf24'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-xs">
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{label || payload[0].name}</p>
        <p style={{ color: 'var(--accent)' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { tasks, workers, machines } = useApp();
  const { theme } = useTheme();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const delayed = tasks.filter(t => t.status === 'delayed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;

  const avgEfficiency = Math.round(workers.reduce((sum, w) => sum + w.efficiency, 0) / workers.length);

  const statusData = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending },
    { name: 'Delayed', value: delayed },
  ];

  const workerEfficiencyData = workers.map(w => ({
    name: w.name.split(' ')[0],
    efficiency: w.efficiency,
    tasks: w.tasksCompleted,
  }));

  const timelineData = [
    { hour: '6AM', tasks: 2, efficiency: 78 },
    { hour: '8AM', tasks: 5, efficiency: 85 },
    { hour: '10AM', tasks: 8, efficiency: 92 },
    { hour: '12PM', tasks: 6, efficiency: 88 },
    { hour: '2PM', tasks: 9, efficiency: 94 },
    { hour: '4PM', tasks: 7, efficiency: 90 },
    { hour: '6PM', tasks: 4, efficiency: 82 },
  ];

  const tickColor = theme === 'dark' ? '#6b6b78' : '#a1a1aa';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  useEffect(() => {
    if (typeof AOS !== 'undefined') AOS.refresh();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Real-time shopfloor overview · Last updated: just now</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <KPICard label="Total Tasks" value={total} type="total" trend={12} />
        <KPICard label="Completed" value={completed} type="completed" trend={8} />
        <KPICard label="Pending" value={pending} type="pending" trend={-3} />
        <KPICard label="Delayed" value={delayed} type="delayed" trend={-15} />
      </motion.div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Task Distribution - 2 cols */}
        <GlassCard className="col-span-2 row-span-2" data-aos="fade-up">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>📊 Task Distribution</h3>
          <div className="flex items-center justify-center h-[calc(100%-2rem)]">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span style={{ color: 'var(--text-tertiary)' }}>{item.name}</span>
                  <span className="font-semibold ml-auto" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* AI Insights - 2 cols */}
        <div className="col-span-2" data-aos="fade-up" data-aos-delay="100">
          <SmartInsights />
        </div>

        {/* Machine Status - 2 cols */}
        <GlassCard className="col-span-2" data-aos="fade-up" data-aos-delay="150">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>🏭 Machine Status</h3>
          <div className="grid grid-cols-3 gap-2">
            {machines.map(m => (
              <div key={m.id} className="rounded-lg p-2.5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{m.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium`} style={{
                    background: m.status === 'running' ? 'var(--success-surface)' : m.status === 'idle' ? 'var(--warning-surface)' : 'var(--danger-surface)',
                    color: m.status === 'running' ? 'var(--success)' : m.status === 'idle' ? 'var(--warning)' : 'var(--danger)',
                  }}>{m.status}</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.utilization}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: m.utilization > 80 ? 'var(--danger)' : m.utilization > 50 ? 'var(--accent)' : 'var(--success)' }}
                  />
                </div>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{m.utilization}% utilization</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Worker Efficiency - 2 cols */}
        <GlassCard className="col-span-2 row-span-2" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>⚡ Worker Efficiency</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={workerEfficiencyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="efficiency" radius={[6, 6, 0, 0]}>
                {workerEfficiencyData.map((entry, index) => (
                  <Cell key={index} fill={entry.efficiency > 90 ? '#34d399' : entry.efficiency > 80 ? '#6366f1' : '#fbbf24'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Bottleneck Heatmap - 2 cols */}
        <div className="col-span-2 row-span-2" data-aos="fade-up" data-aos-delay="250">
          <BottleneckHeatmap />
        </div>

        {/* Timeline - 4 cols */}
        <GlassCard className="col-span-4" data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>📈 Today&apos;s Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tasks" stroke="#6366f1" fill="url(#areaGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Quick Stats - 2 cols */}
        <GlassCard className="col-span-2" data-aos="fade-up" data-aos-delay="350">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📋 Quick Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Avg Efficiency</span>
              <span className="font-bold font-display" style={{ color: 'var(--success)' }}>{avgEfficiency}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Active Workers</span>
              <span className="font-bold font-display" style={{ color: 'var(--accent)' }}>{workers.filter(w => w.availability === 'busy').length}/{workers.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Machines Running</span>
              <span className="font-bold font-display" style={{ color: 'var(--accent-light)' }}>{machines.filter(m => m.status === 'running').length}/{machines.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Completion Rate</span>
              <span className="font-bold font-display" style={{ color: 'var(--success)' }}>{Math.round(completed / total * 100)}%</span>
            </div>
          </div>
        </GlassCard>

        {/* Alerts - 2 cols */}
        <GlassCard className="col-span-2" glow="neon-glow-danger" data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>🔔 Active Alerts</h3>
          <div className="space-y-2">
            {tasks.filter(t => t.status === 'delayed').map(t => (
              <motion.div
                key={t.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 text-xs p-2 rounded-lg"
                style={{ background: 'var(--danger-surface)', border: '1px solid rgba(248,113,113,0.2)' }}
              >
                <span style={{ color: 'var(--danger)' }}>⚠️</span>
                <span className="flex-1" style={{ color: 'var(--text-secondary)' }}>{t.name}</span>
                <span className="font-medium" style={{ color: 'var(--danger)' }}>DELAYED</span>
              </motion.div>
            ))}
            {tasks.filter(t => t.status === 'in-progress' && t.progress < 30).map(t => (
              <motion.div
                key={t.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 text-xs p-2 rounded-lg"
                style={{ background: 'var(--warning-surface)', border: '1px solid rgba(251,191,36,0.2)' }}
              >
                <span style={{ color: 'var(--warning)' }}>⏳</span>
                <span className="flex-1" style={{ color: 'var(--text-secondary)' }}>{t.name}</span>
                <span className="font-medium" style={{ color: 'var(--warning)' }}>AT RISK</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
