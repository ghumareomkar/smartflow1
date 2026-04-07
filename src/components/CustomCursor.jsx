import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    const down = () => setClicked(true);
    const up = () => setClicked(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseenter', enter);
    window.addEventListener('mouseleave', leave);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseenter', enter);
      window.removeEventListener('mouseleave', leave);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [visible]);

  useEffect(() => {
    const handleHoverElements = () => {
      const hoverables = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .hoverable');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });
    };
    handleHoverElements();
    const observer = new MutationObserver(handleHoverElements);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Main dot */}
      <motion.div
        ref={ref}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: pos.x - (hovered ? 20 : 6),
          y: pos.y - (hovered ? 20 : 6),
          width: clicked ? 30 : hovered ? 40 : 12,
          height: clicked ? 30 : hovered ? 40 : 12,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
        style={{
          borderRadius: '50%',
          background: hovered ? 'rgba(0, 209, 255, 0.3)' : '#00D1FF',
          border: hovered ? '2px solid #00D1FF' : 'none',
        }}
      />
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: clicked ? 0.8 : 1,
          opacity: hovered ? 0 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(0, 209, 255, 0.4)',
        }}
      />
    </>
  );
}
