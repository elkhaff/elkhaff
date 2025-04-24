"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Server, Database, Braces, Webhook, Globe, Lock } from "lucide-react"

export function ApiPageTransition() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Slightly longer for better effect

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: "easeInOut" },
          }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                style={{
                  width: Math.random() * 20 + 5,
                  height: Math.random() * 20 + 5,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            exit={{
              scale: 1.2,
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            className="text-center relative z-10"
          >
            {/* Rotating hexagon */}
            <motion.div
              className="w-32 h-32 mx-auto relative mb-6"
              animate={{ rotateZ: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <motion.path
                  d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>

              {/* Orbiting icons */}
              <motion.div
                className="absolute top-0 left-0 right-0 bottom-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <motion.div className="absolute" style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <Code size={24} className="text-white" />
                </motion.div>
                <motion.div className="absolute" style={{ top: "25%", right: "0%", transform: "translate(50%, -50%)" }}>
                  <Server size={24} className="text-white" />
                </motion.div>
                <motion.div
                  className="absolute"
                  style={{ bottom: "25%", right: "0%", transform: "translate(50%, 50%)" }}
                >
                  <Database size={24} className="text-white" />
                </motion.div>
                <motion.div
                  className="absolute"
                  style={{ bottom: "0%", left: "50%", transform: "translate(-50%, 50%)" }}
                >
                  <Webhook size={24} className="text-white" />
                </motion.div>
                <motion.div
                  className="absolute"
                  style={{ bottom: "25%", left: "0%", transform: "translate(-50%, 50%)" }}
                >
                  <Globe size={24} className="text-white" />
                </motion.div>
                <motion.div className="absolute" style={{ top: "25%", left: "0%", transform: "translate(-50%, -50%)" }}>
                  <Lock size={24} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Center icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Braces size={40} className="text-white" />
              </motion.div>
            </motion.div>

            {/* Text with typing effect */}
            <motion.div
              className="relative h-10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h1
                className="text-2xl font-bold text-white absolute w-full"
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.7,
                  duration: 0.7,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                TikTok API Documentation
              </motion.h1>
            </motion.div>

            {/* Code snippet */}
            <motion.div
              className="mt-6 bg-black/30 backdrop-blur-md rounded-lg p-3 max-w-xs mx-auto overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <pre className="text-xs text-left font-mono text-blue-200">
                <code>
                  <span className="text-green-300">GET</span> /api/download?url=
                  <span className="text-yellow-300">&#123;tiktok_url&#125;</span>
                </code>
              </pre>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="mt-6 flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    y: ["0%", "-100%", "0%"],
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
