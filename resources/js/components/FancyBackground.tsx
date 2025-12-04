import React, { useEffect, useRef } from 'react'

type FancyBackgroundProps = {
  className?: string
  particles?: number // fallback: auto based on screen size
  connectDistance?: number // px
  speed?: number // base speed multiplier
}

type Particle = { x: number; y: number; vx: number; vy: number; size: number }

export default function FancyBackground({
  className,
  particles,
  connectDistance = 110,
  speed = 0.6,
}: FancyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particleRef = useRef<Particle[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const count =
      particles ?? Math.min(160, Math.max(60, Math.floor((window.innerWidth * window.innerHeight) / 18000)))

    const initParticles = () => {
      particleRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 1.2 + 0.6,
      }))
    }
    initParticles()

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => (mouseRef.current = null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', () => {
      resize()
      initParticles()
    })

    const bg = (ctx: CanvasRenderingContext2D) => {
      const g = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight)
      g.addColorStop(0, 'rgba(11, 19, 43, 0.05)') // #0B132B
      g.addColorStop(1, 'rgba(91, 192, 190, 0.05)') // #5BC0BE
      ctx.fillStyle = g
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      bg(ctx)

      const parts = particleRef.current
      // Update + draw
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x <= 0 || p.x >= window.innerWidth) p.vx *= -1
        if (p.y <= 0 || p.y >= window.innerHeight) p.vy *= -1

        // Mouse repulsion
        if (mouseRef.current) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist2 = dx * dx + dy * dy
          const radius = 120
          if (dist2 < radius * radius) {
            const dist = Math.max(8, Math.sqrt(dist2))
            p.vx += (dx / dist) * 0.05
            p.vy += (dy / dist) * 0.05
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(11, 19, 43, 0.35)'
        ctx.fill()
      }

      // Connections
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i]
          const b = parts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < connectDistance) {
            const alpha = (1 - d / connectDistance) * 0.5
            ctx.strokeStyle = `rgba(58, 80, 107, ${alpha})` // #3A506B
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [particles, connectDistance, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
