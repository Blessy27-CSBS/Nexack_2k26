import { useState, useEffect, useRef } from 'react';

/**
 * useMouseParallax
 * Tracks mouse position and calculates lerped normalized coordinates (-1 to 1).
 */
export function useMouseParallax(damping = 0.08) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize from -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRef.current = { x: nx, y: ny };
    };

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * damping;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * damping;

      setCoords({
        x: currentRef.current.x,
        y: currentRef.current.y
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [damping]);

  return coords;
}

export default useMouseParallax;
