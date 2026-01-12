import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Speed of star movement (traveling through space effect)
    const speed = 0.5;
    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 3000);
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width - centerX(),
          y: Math.random() * canvas.height - centerY(),
          z: Math.random() * canvas.width,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Create gradient background like deep space
      const gradient = ctx.createRadialGradient(
        centerX(), centerY(), 0,
        centerX(), centerY(), Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, '#0d1117');
      gradient.addColorStop(0.5, '#161b22');
      gradient.addColorStop(1, '#0d1117');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Move star towards viewer (z decreases)
        star.z -= speed;

        // Reset star if it passes the viewer
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - centerX();
          star.y = Math.random() * canvas.height - centerY();
          star.z = canvas.width;
        }

        // Project 3D position to 2D screen
        const k = 128 / star.z;
        const screenX = star.x * k + centerX();
        const screenY = star.y * k + centerY();

        // Check if star is on screen
        if (screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) {
          return;
        }

        // Calculate size based on distance (closer = bigger)
        const size = (1 - star.z / canvas.width) * 3 + star.size;

        // Update twinkle phase
        star.twinklePhase += star.twinkleSpeed;

        // Calculate current opacity based on twinkle and distance
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const distanceFade = 1 - star.z / canvas.width;
        const currentOpacity = star.opacity * twinkle * distanceFade;

        // Draw star trail (motion blur effect)
        const trailLength = Math.min(size * 2, 10) * (1 - star.z / canvas.width);
        if (trailLength > 0.5) {
          const trailGradient = ctx.createLinearGradient(
            screenX, screenY,
            screenX - (star.x * k * 0.1), screenY - (star.y * k * 0.1)
          );
          trailGradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.5})`);
          trailGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.beginPath();
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = size * 0.5;
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX - (star.x * k * 0.05), screenY - (star.y * k * 0.05));
          ctx.stroke();
        }

        // Draw star glow
        const glowSize = size * 4;
        const glowGradient = ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, glowSize
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.4})`);
        glowGradient.addColorStop(0.5, `rgba(200, 220, 255, ${currentOpacity * 0.1})`);
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw star core
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#0d1117' }}
    />
  );
}
