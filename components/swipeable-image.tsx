"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import Image from "next/image"

interface SwipeableImageProps {
  images: string[]
  onImageChange?: (index: number) => void
}

export function SwipeableImage({ images, onImageChange }: SwipeableImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false)

  useEffect(() => {
    if (onImageChange) {
      onImageChange(currentIndex)
    }

    // Check if device is likely to have performance issues
    const checkPerformance = () => {
      // Simple heuristic - mobile devices or older browsers are more likely to struggle
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isOlderBrowser = !window.requestAnimationFrame || !window.cancelAnimationFrame

      // If the device has a low memory or is a mobile device, use the low performance mode
      setIsLowPerfDevice(isMobile || isOlderBrowser)
    }

    checkPerformance()
  }, [currentIndex, onImageChange])

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50 // minimum distance required for swipe

    if (info.offset.x > threshold) {
      // Swiped right
      setDirection(-1)
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    } else if (info.offset.x < -threshold) {
      // Swiped left
      setDirection(1)
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  // Simplified variants for better performance
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  if (!images.length) return null

  return (
    <div className="relative aspect-[9/16] rounded-lg overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 }, // Reduced stiffness
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5} // Reduced elasticity
          onDragEnd={handleDragEnd}
          className="absolute inset-0 touch-manipulation cursor-grab active:cursor-grabbing"
        >
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-cover pointer-events-none"
            loading="lazy" // Add lazy loading
            sizes="(max-width: 768px) 100vw, 300px" // Add sizes for better performance
          />
        </motion.div>
      </AnimatePresence>

      {/* Indicator dots - simplified for performance */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
