import { useEffect, useRef } from 'react';

const Hero3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Check theme
    const isDark = document.documentElement.classList.contains('dark');

    // Wave animation
    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();

        const amplitude = 40 + layer * 10;
        const frequency = 0.01 - layer * 0.002;
        const yOffset = canvas.height / 2 + layer * 40;

        // Different opacity for dark/light mode
        const baseOpacity = isDark ? 0.4 : 0.6;
        const opacity = baseOpacity - layer * 0.1;

        // Emerald & Amber colors for both modes
        const color = layer % 2 === 0 ? '16, 185, 129' : '251, 146, 60';

        for (let x = 0; x < canvas.width; x++) {
          const y = yOffset + Math.sin(x * frequency + time) * amplitude;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

  ctx.strokeStyle = `rgba(${color}, ${opacity})`;
        ctx.lineWidth = isDark ? 2 : 3;
        ctx.stroke();

        // Fill below wave
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
  ctx.fillStyle = `rgba(${color}, ${opacity * 0.15})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default Hero3DBackground;