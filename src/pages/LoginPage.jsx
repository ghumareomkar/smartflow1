import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const result = login(id, password);
    if (result.success) {
      await new Promise(r => setTimeout(r, 400));
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Theme toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 right-6 z-50 w-10 h-10 rounded-xl flex items-center justify-center glass"
      >
        <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.span>
      </motion.button>

      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] -top-40 -left-40 opacity-30" style={{ background: 'var(--accent)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] -bottom-40 -right-40 opacity-20" style={{ background: 'var(--teal)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'var(--gradient-primary)' }}
          >
            SF
          </motion.div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">SmartFlow</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>AI-Powered Factory Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <div className="glass-strong p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sign in as Supervisor / Admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID Field */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                User ID
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">👤</span>
                <input
                  type="text"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  required
                  placeholder="Enter your ID"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none transition-all"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs p-3 rounded-lg"
                  style={{ background: 'var(--danger-surface)', color: 'var(--danger)', border: '1px solid rgba(248,113,113,0.2)' }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="gradient-btn w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >⚙️</motion.span>
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </motion.button>
          </form>

          {/* Hint */}
          <div className="mt-5 p-3 rounded-lg text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Demo credentials — ID: <span style={{ color: 'var(--accent)' }} className="font-mono font-bold">semicolon</span> · Password: <span style={{ color: 'var(--accent)' }} className="font-mono font-bold">1212</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] mt-6" style={{ color: 'var(--text-muted)' }}>
          © 2026 SmartFlow — Secure Factory Access
        </p>
      </motion.div>
    </div>
  );
}
