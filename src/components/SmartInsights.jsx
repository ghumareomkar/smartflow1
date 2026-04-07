import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const insights = [
  { text: "Reassign Task #7 from Alex to Lisa to improve CNC line efficiency by 15%", type: "optimization" },
  { text: "Worker Marcus Chen is overloaded — redistribute Quality tasks to Elena Volkov", type: "warning" },
  { text: "Laser Cutter Pro running at 92% utilization — schedule maintenance within 48hrs", type: "maintenance" },
  { text: "Predicted 2.3hr delay on Electrical Testing. Consider adding afternoon shift support", type: "prediction" },
  { text: "Paint Booth X1 maintenance complete. 3 pending paint tasks can resume now", type: "opportunity" },
  { text: "Morning shift efficiency at 94% — 6% above weekly average. Team performance trending up", type: "positive" },
  { text: "Bottleneck detected: CNC workstation has 3 queued tasks. Recommend parallel processing", type: "bottleneck" },
];

const typeColors = {
  optimization: 'var(--success)',
  warning: 'var(--warning)',
  maintenance: 'var(--accent)',
  prediction: 'var(--accent-light)',
  opportunity: 'var(--success)',
  positive: 'var(--success)',
  bottleneck: 'var(--danger)',
};

const typeIcons = {
  optimization: '🧠',
  warning: '⚠️',
  maintenance: '🔧',
  prediction: '🔮',
  opportunity: '✨',
  positive: '📈',
  bottleneck: '🚨',
};

export default function SmartInsights() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const typeText = useCallback((text) => {
    setDisplayText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = typeText(insights[currentIdx].text);
    const timer = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % insights.length);
    }, insights[currentIdx].text.length * 30 + 4000);
    return () => { cleanup(); clearTimeout(timer); };
  }, [currentIdx, typeText]);

  const insight = insights[currentIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-5 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--gradient-primary)' }}>
          🧠
        </div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Insights</h3>
        <div className="flex-1" />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs"
          style={{ color: 'var(--accent)' }}
        >
          ● LIVE
        </motion.div>
      </div>

      <div className="min-h-[60px] flex items-start gap-2">
        <span className="text-lg">{typeIcons[insight.type]}</span>
        <p className="text-sm leading-relaxed" style={{ color: typeColors[insight.type] }}>
          {displayText}
          {isTyping && <span className="typewriter-cursor" />}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mt-3 justify-center">
        {insights.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === currentIdx ? '16px' : '6px',
              background: i === currentIdx ? 'var(--accent)' : 'var(--bg-tertiary)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
