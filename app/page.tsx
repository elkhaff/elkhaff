import TikTokDownloader from "@/components/tiktok-downloader"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { PageTransition } from "@/components/page-transition"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <AnimatedGradientBackground />
      <PageTransition />
      <ThemeToggle />
      <TikTokDownloader />
    </main>
  )
}
