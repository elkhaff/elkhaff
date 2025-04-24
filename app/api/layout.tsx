import type React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { ApiPageTransition } from "@/components/api-page-transition"
import { Suspense } from "react"

export default function ApiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimatedGradientBackground />
      <ThemeToggle />
      <ApiPageTransition />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-white text-xl">
            Loading API documentation...
          </div>
        }
      >
        {children}
      </Suspense>
    </>
  )
}
