"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function AnimatedGradientBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if device is likely to have performance issues
    const checkPerformance = () => {
      // Simple heuristic - mobile devices or older browsers are more likely to struggle
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isOlderBrowser = !window.requestAnimationFrame || !window.cancelAnimationFrame

      // If the device has a low memory or is a mobile device, use the low performance mode
      setIsLowPerfDevice(isMobile || isOlderBrowser)
    }

    checkPerformance()
  }, [])

  if (!mounted) return null

  // For low performance devices, use a simple gradient background
  if (isLowPerfDevice) {
    return (
      <div
        className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-colors duration-1000 ease-in-out
          ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-blue-950 via-blue-900 to-black"
              : "bg-gradient-to-br from-blue-400 via-blue-300 to-white"
          }`}
      />
    )
  }

  // For normal devices, use a more enhanced but still optimized background
  return (
    <>
      {/* Main gradient background - static but theme-aware */}
      <div
        className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-colors duration-1000 ease-in-out
          ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-br from-blue-950 via-blue-900 to-black"
              : "bg-gradient-to-br from-blue-400 via-blue-300 to-white"
          }`}
      />

      {/* Subtle blur overlay - much lighter than before */}
      <div className="fixed top-0 left-0 w-full h-full -z-9 pointer-events-none backdrop-blur-[20px] opacity-30"></div>

      {/* Animated floating orbs - reduced number and simplified */}
      <div className="fixed top-0 left-0 w-full h-full -z-8 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => {
          const isDark = resolvedTheme === "dark"
          const size = Math.random() * 200 + 100

          return (
            <motion.div
              key={i}
              className="absolute rounded-full transition-colors duration-1000"
              style={{
                width: size,
                height: size,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: isDark
                  ? `radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(30, 64, 175, 0) 70%)`
                  : `radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, rgba(59, 130, 246, 0) 70%)`,
                border: isDark ? `1px solid rgba(59, 130, 246, 0.03)` : `1px solid rgba(147, 197, 253, 0.03)`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: Math.random() * 20 + 30,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>
    </>
  )
}
