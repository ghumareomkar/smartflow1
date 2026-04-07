import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-xs">
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{label || payload[0]?.name}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const efficiencyTrend = [
  { day: 'Mon', efficiency: 82, tasks: 14 },
  { day: 'Tue', efficiency: 85, tasks: 16 },
  { day: 'Wed', efficiency: 88, tasks: 18 },
  { day: 'Thu', efficiency: 91, tasks: 15 },
  { day: 'Fri', efficiency: 94, tasks: 20 },
  { day: 'Sat', efficiency: 89, tasks: 12 },
  { day: 'Sun', efficiency: 87, tasks: 10 },
];

const completionTimeData = [
  { task: 'CNC', avg: 3.2, target: 3.0 },
  { task: 'Welding', avg: 4.1, target: 4.0 },
  { task: 'Quality', avg: 2.5, target: 2.0 },
  { task: 'Laser', avg: 2.8, target: 3.0 },
  { task: 'Painting', avg: 2.2, target: 2.5 },
  { task: 'Electrical', avg: 3.8, target: 3.5 },
  { task: 'Assembly', avg: 5.5, target: 5.0 },
];

const weeklyOutput = [
  { week: 'W1', output: 45, target: 50 },
  { week: 'W2', output: 52, target: 50 },
  { week: 'W3', output: 48, target: 50 },
  { week: 'W4', output: 58, target: 50 },
];

export default function Reports() {
  const { tasks, workers } = useApp();
  const { theme } = useTheme();

  const completed = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((completed / totalTasks) * 100);
  const avgEfficiency = Math.round(workers.reduce((s, w) => s + w.efficiency, 0) / workers.length);
  const avgCompletionTime = 3.4;
  const totalPoints = workers.reduce((s, w) => s + w.points, 0);

  const tickColor = theme === 'dark' ? '#6b6b78' : '#a1a1aa';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  const skillDistribution = [
    { name: 'CNC', value: tasks.filter(t => t.skill === 'CNC').length },
    { name: 'Welding', value: tasks.filter(t => t.skill === 'Welding').length },
    { name: 'Quality', value: tasks.filter(t => t.skill === 'Quality').length },
    { name: 'Laser', value: tasks.filter(t => t.skill === 'Laser').length },
    { name: 'Painting', value: tasks.filter(t => t.skill === 'Painting').length },
    { name: 'Electrical', value: tasks.filter(t => t.skill === 'Electrical').length },
    { name: 'Assembly', value: tasks.filter(t => t.skill === 'Assembly').length },
  ];

  const COLORS = ['#6366f1', '#34d399', '#8b5cf6', '#f87171', '#fbbf24', '#2dd4bf', '#818cf8'];

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Reports & Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Comprehensive performance insights and trends</p>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Completion Rate', value: completionRate, suffix: '%', color: 'var(--success)', icon: '✅' },
          { label: 'Avg Efficiency', value: avgEfficiency, suffix: '%', color: 'var(--accent)', icon: '⚡' },
          { label: 'Avg Completion', value: avgCompletionTime, suffix: 'hrs', color: 'var(--accent-light)', icon: '⏱' },
          { label: 'Total Points', value: totalPoints, suffix: '', color: 'var(--warning)', icon: '🏆' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  <p className="text-2xl font-display font-bold" style={{ color: stat.color }}>
                    {typeof stat.value === 'number' && stat.value % 1 === 0 ? (
                      <AnimatedCounter value={stat.value} />
                    ) : stat.value}
                    {stat.suffix}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Efficiency Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>📈 Efficiency Trend (This Week)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={efficiencyTrend}>
                <defs>
                  <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} domain={[70, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="efficiency" stroke="#34d399" fill="url(#effGradient)" strokeWidth={2} name="Efficiency %" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Completion Time by Task Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>⏱ Avg Completion Time by Skill</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={completionTimeData} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="task" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} unit="h" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]} name="Actual (hrs)">
                  {completionTimeData.map((entry, index) => (
                    <Cell key={index} fill={entry.avg > entry.target ? '#f87171' : '#34d399'} />
                  ))}
                </Bar>
                <Bar dataKey="target" radius={[4, 4, 0, 0]} fill={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} name="Target (hrs)" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Weekly Output */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>📦 Weekly Output vs Target</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyOutput}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="week" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="output" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Output" />
                <Line type="monotone" dataKey="target" stroke="#f87171" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Skill Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <GlassCard>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>🛠 Task Distribution by Skill</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {skillDistribution.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 w-[40%]">
                {skillDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="truncate" style={{ color: 'var(--text-tertiary)' }}>{item.name}</span>
                    <span className="font-semibold ml-auto" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Worker Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <GlassCard>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>👥 Worker Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs uppercase" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th className="pb-3 pr-4">Worker</th>
                  <th className="pb-3 pr-4">Skills</th>
                  <th className="pb-3 pr-4">Tasks Done</th>
                  <th className="pb-3 pr-4">Efficiency</th>
                  <th className="pb-3 pr-4">Points</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {workers.sort((a, b) => b.efficiency - a.efficiency).map((w, i) => (
                  <motion.tr
                    key={w.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                          {w.avatar}
                        </div>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{w.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1">
                        {w.skills.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)' }}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4" style={{ color: 'var(--text-secondary)' }}>{w.tasksCompleted}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${w.efficiency}%`,
                              background: w.efficiency > 90 ? 'var(--success)' : w.efficiency > 80 ? 'var(--accent)' : 'var(--warning)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: w.efficiency > 90 ? 'var(--success)' : w.efficiency > 80 ? 'var(--accent)' : 'var(--warning)' }}>
                          {w.efficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-display font-bold" style={{ color: 'var(--warning)' }}>{w.points}</td>
                    <td className="py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                        background: w.availability === 'available' ? 'var(--success-surface)' : 'var(--accent-surface)',
                        color: w.availability === 'available' ? 'var(--success)' : 'var(--accent)',
                      }}>
                        {w.availability}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
