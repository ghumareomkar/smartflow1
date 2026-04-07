import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ThreeScene from '../components/ThreeScene';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: '🧠', title: 'AI-Powered Scheduling', desc: 'Smart task assignment based on skills, availability, and priority optimization.' },
  { icon: '🔥', title: 'Bottleneck Detection', desc: 'Real-time identification of overloaded workers and idle resources.' },
  { icon: '🔮', title: 'Predictive Alerts', desc: 'Early warning system for potential delays before they impact production.' },
  { icon: '🎮', title: 'What-if Simulation', desc: 'Test scenarios and see impact on efficiency before making changes.' },
  { icon: '📊', title: 'Live Analytics', desc: 'Beautiful real-time dashboards with KPIs, charts, and heatmaps.' },
  { icon: '🏆', title: 'Gamification', desc: 'Worker leaderboards and points system to boost engagement.' },
];

function ThemeToggleLanding() {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-6 right-6 z-50 w-10 h-10 rounded-xl flex items-center justify-center glass"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </motion.span>
    </motion.button>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    }

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to('.hero-gradient-orb-1', { x: 100, y: -50, duration: 8, ease: 'sine.inOut' });
    tl.to('.hero-gradient-orb-2', { x: -80, y: 60, duration: 6, ease: 'sine.inOut' }, '<');

    return () => tl.kill();
  }, []);

  return (
    <div className="relative">
      <ThemeToggleLanding />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="hero-gradient-orb-1 absolute w-[600px] h-[600px] rounded-full blur-[120px] -top-40 -left-40" style={{ background: 'var(--accent-surface-strong)' }} />
        <div className="hero-gradient-orb-2 absolute w-[500px] h-[500px] rounded-full blur-[100px] -bottom-40 -right-40" style={{ background: 'var(--teal-surface)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'var(--accent-surface)' }} />

        {/* 3D Scene */}
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Content */}
        <motion.div style={{ y: textY }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 mb-6 text-xs font-medium" style={{ color: 'var(--accent)' }}>
              <span className="pulse-dot" style={{ background: 'var(--success)', color: 'var(--success)' }} />
              <span>AI-Powered Factory Intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-black mb-6 leading-tight"
          >
            <span style={{ color: 'var(--text-primary)' }}>Optimize Your</span>
            <br />
            <span className="gradient-text">Smart Factory</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Real-time workflow optimization, predictive analytics, and intelligent task assignment — 
            all in one stunning dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="gradient-btn px-8 py-4 rounded-xl text-lg font-semibold"
            >
              Enter Dashboard →
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass px-8 py-4 rounded-xl text-lg font-medium transition-all"
              style={{ color: 'var(--text-secondary)' }}
            >
              Explore Features
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center gap-8 sm:gap-16 mt-16"
          >
            {[
              { value: '99.2%', label: 'Uptime' },
              { value: '3.2x', label: 'Faster Allocation' },
              { value: '47%', label: 'Less Downtime' },
              { value: '24/7', label: 'Monitoring' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm flex flex-col items-center gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 14l-5-5h10l-5 5z" />
          </svg>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              Everything you need to transform your shopfloor into a smart, optimized factory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom left, var(--accent-surface), transparent)' }} />
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--accent-surface), var(--teal-surface))' }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Ready to Optimize?
              </h2>
              <p className="mb-8" style={{ color: 'var(--text-tertiary)' }}>
                Start managing your shopfloor with AI-powered intelligence.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="gradient-btn px-10 py-4 rounded-xl text-lg font-semibold"
              >
                Launch Dashboard 🚀
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
        <p>© 2026 SmartFlow — AI-Powered Factory Intelligence Platform</p>
      </footer>
    </div>
  );
}
