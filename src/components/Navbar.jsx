import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/tasks', label: 'Tasks', icon: '📋' },
  { path: '/workers', label: 'Workers', icon: '👥' },
  { path: '/resources', label: 'Resources', icon: '🔧' },
  { path: '/simulation', label: 'Simulation', icon: '🔬' },
  { path: '/reports', label: 'Reports', icon: '📈' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-sm"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </motion.span>
    </motion.button>
  );
}

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--gradient-primary)' }}>
          {user.avatar}
        </div>
        <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>{user.name.split(' ')[0]}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--text-muted)' }} />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl overflow-hidden z-50"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            {/* User info header */}
            <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
              <p className="text-[10px]" style={{ color: 'var(--accent)' }}>{user.email}</p>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => { navigate('/profile'); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.target.style.background = 'var(--bg-surface-hover)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                👤 View Profile
              </button>
              <button
                onClick={() => { navigate('/resources'); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.target.style.background = 'var(--bg-surface-hover)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                🔧 Resources
              </button>
            </div>

            <div className="p-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => { logout(); navigate('/login'); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                style={{ color: 'var(--danger)' }}
                onMouseEnter={e => e.target.style.background = 'var(--danger-surface)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                🚪 Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const isLanding = location.pathname === '/';
  const isLogin = location.pathname === '/login';

  if (isLanding || isLogin || !isAuthenticated) return null;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
              SF
            </div>
            <span className="font-display font-bold text-lg gradient-text group-hover:opacity-80 transition-opacity">
              SmartFlow
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    isActive ? '' : 'hover:opacity-80'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                })}
              >
                {({ isActive }) => (
                  <>
                    <span className="text-xs">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: 'var(--gradient-primary)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <div className="pulse-dot" style={{ background: 'var(--success)', color: 'var(--success)' }}></div>
              <span>Active</span>
            </div>
            <ProfileDropdown />
          </div>

          {/* Mobile: theme + profile + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <ProfileDropdown />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden glass-strong"
          style={{ borderRadius: 0, borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                  background: isActive ? 'var(--accent-surface)' : 'transparent',
                })}
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
