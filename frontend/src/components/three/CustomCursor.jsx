import React, { useEffect, useState, useRef } from 'react';

/**
 * CustomCursor
 * Subtle futuristic cursor tracking on desktop devices.
 * Automatically disabled on touch screens and when prefers-reduced-motion is active.
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState('normal'); // 'normal' | 'pointer' | 'clicked'
  const [visible, setVisible] = useState(false);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const onMouseMove = (e) => {
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
      targetRef.current = { x: e.clientX, y: e.clientY };

      // Detect interactive targets
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('canvas')
      ) {
        setCursorState('pointer');
      } else {
        setCursorState('normal');
      }
    };

    const onMouseDown = () => setCursorState('clicked');
    const onMouseUp = () => setCursorState('normal');
    const onMouseLeave = () => setVisible(false);

    const animateTrailing = () => {
      // Smooth lerp trailing ring
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15;
      setTrailingPos({ x: currentRef.current.x, y: currentRef.current.y });

      animationFrameRef.current = requestAnimationFrame(animateTrailing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    animationFrameRef.current = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (!visible) return null;

  const isPointer = cursorState === 'pointer';
  const isClicked = cursorState === 'clicked';

  return (
    <>
      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
        }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isClicked
              ? 'w-2 h-2 bg-amber-400 scale-125'
              : isPointer
              ? 'w-2.5 h-2.5 bg-emerald-400 shadow-neon-emerald'
              : 'w-1.5 h-1.5 bg-white'
          }`}
        />
      </div>

      {/* Trailing Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%)`
        }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isClicked
              ? 'w-9 h-9 border-amber-400/80 bg-amber-400/10 scale-90'
              : isPointer
              ? 'w-10 h-10 border-emerald-400/60 bg-emerald-500/5 scale-110 shadow-neon-emerald'
              : 'w-6 h-6 border-zinc-500/40'
          }`}
        />
      </div>
    </>
  );
};

export default CustomCursor;
