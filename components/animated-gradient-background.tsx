"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function AnimatedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas dimensions
    const updateDimensions = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    // Create gradient points
    const points = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25,
      radius: Math.random() * 300 + 100,
      color:
        resolvedTheme === "dark"
          ? `rgba(${30 + Math.random() * 30}, ${50 + Math.random() * 50}, ${150 + Math.random() * 100}, 0.5)`
          : `rgba(${50 + Math.random() * 50}, ${100 + Math.random() * 100}, ${200 + Math.random() * 55}, 0.5)`,
    }))

    const animate = () => {
      // Clear canvas with a base color
      ctx.fillStyle = resolvedTheme === "dark" ? "rgba(10, 20, 50, 0.05)" : "rgba(100, 150, 255, 0.05)"
      ctx.fillRect(0, 0, width, height)

      // Draw each gradient point
      points.forEach((point) => {
        // Move point
        point.x += point.vx
        point.y += point.vy

        // Bounce off edges
        if (point.x < 0 || point.x > width) point.vx *= -1
        if (point.y < 0 || point.y > height) point.vy *= -1

        // Create radial gradient
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius)

        gradient.addColorStop(0, point.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [resolvedTheme])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-gradient-to-br from-blue-400/30 to-blue-600/30 dark:from-blue-600/30 dark:to-blue-800/30" />

      {/* Animated floating shapes */}
      <div className="fixed top-0 left-0 w-full h-full -z-5 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </>
  )
}
