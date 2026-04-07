import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = '', ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`glass p-5 ${glow} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
