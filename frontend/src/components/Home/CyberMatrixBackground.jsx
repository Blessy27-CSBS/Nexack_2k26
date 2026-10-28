import React, { useEffect, useRef } from 'react';

/**
 * CyberMatrixBackground:
 * Ultra-lightweight canvas creating an authentic cybernetic hackathon vibe:
 * subtle falling digital code rain, floating tech symbols, and glowing particle nodes.
 */
const CyberMatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Tech tokens that drift in the hackathon cosmos
    const tokens = [
      '01', '10', '</>', '{...}', '=>', 'git push', 'AI', 'Web3',
      'const HACK', 'while(true)', 'solve()', '24H', 'async/await',
      '0x2K26', 'NEXORA', 'deploy', 'ping 0ms', 'docker'
    ];

    const particleCount = Math.min(38, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      text: tokens[Math.floor(Math.random() * tokens.length)],
      speed: 0.35 + Math.random() * 0.45,
      size: 10 + Math.random() * 3,
      alpha: 0.12 + Math.random() * 0.22,
      color: Math.random() > 0.4 ? '#10b981' : '#f59e0b',
      charChangeTimer: Math.random() * 100
    }));

    // Grid lines nodes
    const nodes = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1.5 + Math.random() * 1.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw interconnected cyber nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 130)})`;
            ctx.stroke();
          }
        }
      }

      // 2. Draw floating code snippet particles
      ctx.font = "11px 'JetBrains Mono', monospace";
      for (const p of particles) {
        p.y += p.speed;
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
          p.text = tokens[Math.floor(Math.random() * tokens.length)];
        }

        p.charChangeTimer += 1;
        if (p.charChangeTimer > 180) {
          p.text = tokens[Math.floor(Math.random() * tokens.length)];
          p.charChangeTimer = 0;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};

export default CyberMatrixBackground;
