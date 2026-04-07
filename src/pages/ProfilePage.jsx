import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const infoItems = [
    { label: 'Employee ID', value: user.employeeId, icon: '🪪' },
    { label: 'Role', value: user.role, icon: '👔' },
    { label: 'Email', value: user.email, icon: '📧' },
    { label: 'Phone', value: user.phone, icon: '📱' },
    { label: 'Department', value: user.department, icon: '🏢' },
    { label: 'Shift', value: user.shift, icon: '🕐' },
    { label: 'Factory Zone', value: user.factoryZone, icon: '📍' },
    { label: 'Team Size', value: `${user.teamSize} workers`, icon: '👥' },
    { label: 'Date Joined', value: user.joinDate, icon: '📅' },
  ];

  return (
    <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Admin Profile</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 rounded-t-2xl" style={{ background: 'var(--gradient-primary)' }} />
            <div className="relative z-10 pt-10">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold"
                style={{ background: 'var(--bg-elevated)', border: '3px solid var(--accent)', boxShadow: 'var(--shadow-md)' }}>
                {user.avatar}
              </div>
              <h2 className="text-lg font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>
              <p className="text-xs mb-3" style={{ color: 'var(--accent)' }}>{user.role}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px]"
                style={{ background: 'var(--success-surface)', color: 'var(--success)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
                Online
              </div>
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xl font-display font-bold" style={{ color: 'var(--accent)' }}>{user.teamSize}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Team Members</p>
                </div>
                <div>
                  <p className="text-xl font-display font-bold" style={{ color: 'var(--success)' }}>{user.certifications.length}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Certifications</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full mt-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--danger-surface)', color: 'var(--danger)', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              Sign Out
            </motion.button>
          </GlassCard>
        </motion.div>

        {/* Info + Certifications */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                📋 Personal Information
              </h3>
              <div className="space-y-3">
                {infoItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                  >
                    <span className="text-base">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                🏅 Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.certifications.map((cert, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'var(--accent-surface)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}
                  >
                    {cert}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                📊 Activity Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Tasks Reviewed', value: 142, color: 'var(--accent)' },
                  { label: 'Issues Resolved', value: 38, color: 'var(--success)' },
                  { label: 'Reports Filed', value: 24, color: 'var(--warning)' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-2xl font-display font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
