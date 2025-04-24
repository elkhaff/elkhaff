"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Download, Loader2, Music, ImageIcon, MoreHorizontal } from "lucide-react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { downloadFile } from "@/utils/download-util"
import { SwipeableImage } from "./swipeable-image"
import Link from "next/link"

interface TikTokResult {
  status: number
  creator: string
  result: {
    tipe: "video" | "gambar"
    nama: string
    pengguna: string
    judul: string
    durasi: number
    putar: number
    suka: number
    komentar: number
    bagikan: number
    ukuran: {
      bytes: number
    }
    hd: {
      bytes: number
    }
    musik: string
    videoHD: string
    videoSD: string
    gambar: string[]
  }
}

export default function TikTokDownloader() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TikTokResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("hd")
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const [audioFileSize, setAudioFileSize] = useState<number>(0)
  const [imageFileSizes, setImageFileSizes] = useState<Record<number, number>>({})

  // 3D card effect values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  // Ref for the card element
  const cardRef = useRef<HTMLDivElement>(null)

  const getFileSize = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { method: "HEAD" })
      const contentLength = response.headers.get("content-length")
      return contentLength ? Number.parseInt(contentLength, 10) : 0
    } catch (error) {
      console.error("Error getting file size:", error)
      return 0
    }
  }

  useEffect(() => {
    setMounted(true)

    // Get audio file size when result is available
    if (result?.result?.musik) {
      getFileSize(result.result.musik).then((size) => {
        setAudioFileSize(size)
      })
    }

    // Get image file sizes
    if (result?.result?.tipe === "gambar" && result.result.gambar.length > 0) {
      const fetchImageSizes = async () => {
        const sizes: Record<number, number> = {}

        for (let i = 0; i < result.result.gambar.length; i++) {
          const size = await getFileSize(result.result.gambar[i])
          sizes[i] = size
        }

        setImageFileSizes(sizes)
      }

      fetchImageSizes()
    }
  }, [result])

  // Update when current image index changes
  useEffect(() => {
    if (result?.result?.tipe === "gambar" && result.result.gambar.length > 0 && !imageFileSizes[currentImageIndex]) {
      getFileSize(result.result.gambar[currentImageIndex]).then((size) => {
        setImageFileSizes((prev) => ({ ...prev, [currentImageIndex]: size }))
      })
    }
  }, [currentImageIndex, result, imageFileSizes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a TikTok URL")
      return
    }

    setLoading(true)
    setError(null)
    setIsCardExpanded(false)
    setImageFileSizes({})
    setAudioFileSize(0)

    try {
      const encodedUrl = encodeURIComponent(url)
      const response = await fetch(`/api/download?url=${encodedUrl}`)

      if (!response.ok) {
        throw new Error("Failed to download. Please check the URL and try again.")
      }

      const data = await response.json()

      // Scroll to card if needed
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        if (rect.bottom > window.innerHeight) {
          cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }

      // Animate card expansion
      setTimeout(() => {
        setResult(data)
        setCurrentImageIndex(0)
        setIsCardExpanded(true)
        // Clear the URL input after successful submission
        setUrl("")
      }, 300)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  // Generate timestamp for filenames
  const generateTimestamp = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")

    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }

  const handleDownload = async (url: string, quality: string) => {
    try {
      setDownloadLoading(quality)
      const timestamp = generateTimestamp()
      const filename = `tikdl.elkaff-${timestamp}-${quality}`
      await downloadFile(url, filename)
    } catch (error) {
      console.error("Download error:", error)
      setError("Failed to download. Please try again.")
    } finally {
      setDownloadLoading(null)
    }
  }

  // Find the handleAudioDownload function and update it:

  const handleAudioDownload = async (url: string) => {
    try {
      setDownloadLoading("audio")
      const timestamp = generateTimestamp()
      const filename = `tikdl.elkaff-${timestamp}-Mp3.mp3`
      await downloadFile(url, filename)
    } catch (error) {
      console.error("Download error:", error)
      setError("Failed to download audio. Please try again.")
    } finally {
      setDownloadLoading(null)
    }
  }

  // Find the handleImageDownload function and update it:

  const handleImageDownload = async (url: string, index: number) => {
    try {
      setDownloadLoading(`image-${index}`)
      const timestamp = generateTimestamp()
      const filename = `tikdl.elkaff-${timestamp}-IMAGE.jpg`
      await downloadFile(url, filename)
    } catch (error) {
      console.error("Download error:", error)
      setError("Failed to download image. Please try again.")
    } finally {
      setDownloadLoading(null)
    }
  }

  // Handle 3D card effect mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = (mouseX / width - 0.5) * 2
    const yPct = (mouseY / height - 0.5) * 2
    x.set(xPct * 50)
    y.set(yPct * 50)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (!mounted) return null

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto px-4 sm:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl transition-all duration-300 overflow-hidden transform-gpu">
          <CardHeader className="text-center">
            <div className="absolute top-4 left-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/api">API Docs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">TikTok Downloader</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Download TikTok videos and photos without watermark
              </CardDescription>
            </motion.div>
          </CardHeader>

          <motion.div style={{ transform: "translateZ(30px)" }}>
            <CardContent>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Paste TikTok URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Download"
                    )}
                  </Button>
                </div>
                {error && (
                  <motion.p
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.p>
                )}
              </motion.form>

              <AnimatePresence>
                {result && (
                  <motion.div
                    className="mt-6 overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: isCardExpanded ? "auto" : 0,
                      transition: {
                        opacity: { duration: 0.3 },
                        height: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                      },
                    }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 dark:text-white line-clamp-2">
                          {result.result.judul}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <p>Username: @{result.result.pengguna}</p>
                          <p>Likes: {formatNumber(result.result.suka)}</p>
                          <p>Comments: {formatNumber(result.result.komentar)}</p>
                          <p>Shares: {formatNumber(result.result.bagikan)}</p>
                          <p>Views: {formatNumber(result.result.putar)}</p>
                          {result.result.durasi > 0 && <p>Duration: {result.result.durasi}s</p>}
                        </div>
                      </div>

                      {result.result.tipe === "video" ? (
                        <motion.div
                          className="w-full md:w-64 rounded-lg overflow-hidden"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <video
                            src={result.result.videoSD}
                            controls
                            className="w-full h-auto"
                            poster="/placeholder.svg?height=360&width=200"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="w-full md:w-64 relative"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          {result.result.gambar.length > 0 && (
                            <SwipeableImage images={result.result.gambar} onImageChange={setCurrentImageIndex} />
                          )}
                        </motion.div>
                      )}
                    </div>

                    {result.result.tipe === "video" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <Tabs defaultValue="hd" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="hd" className="transition-all duration-300 relative overflow-hidden">
                              HD Quality
                              {activeTab === "hd" && (
                                <motion.div
                                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                                  layoutId="activeTabIndicator"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                            </TabsTrigger>
                            <TabsTrigger value="sd" className="transition-all duration-300 relative overflow-hidden">
                              SD Quality
                              {activeTab === "sd" && (
                                <motion.div
                                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                                  layoutId="activeTabIndicator"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                            </TabsTrigger>
                            <TabsTrigger value="audio" className="transition-all duration-300 relative overflow-hidden">
                              Audio Only
                              {activeTab === "audio" && (
                                <motion.div
                                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                                  layoutId="activeTabIndicator"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                            </TabsTrigger>
                          </TabsList>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <TabsContent value="hd" className="mt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 gap-3">
                                  <div>
                                    <p className="font-medium dark:text-white">HD Quality</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatBytes(result.result.hd.bytes)}
                                    </p>
                                  </div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                                      onClick={() => handleDownload(result.result.videoHD, "HD")}
                                      disabled={downloadLoading === "HD"}
                                    >
                                      {downloadLoading === "HD" ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Downloading...
                                        </>
                                      ) : (
                                        <>
                                          <Download className="mr-2 h-4 w-4" />
                                          Download HD
                                        </>
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>
                              </TabsContent>
                              <TabsContent value="sd" className="mt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 gap-3">
                                  <div>
                                    <p className="font-medium dark:text-white">SD Quality</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatBytes(result.result.ukuran.bytes)}
                                    </p>
                                  </div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                                      onClick={() => handleDownload(result.result.videoSD, "SD")}
                                      disabled={downloadLoading === "SD"}
                                    >
                                      {downloadLoading === "SD" ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Downloading...
                                        </>
                                      ) : (
                                        <>
                                          <Download className="mr-2 h-4 w-4" />
                                          Download SD
                                        </>
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>
                              </TabsContent>
                              <TabsContent value="audio" className="mt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 gap-3">
                                  <div>
                                    <p className="font-medium dark:text-white">Audio Only</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {audioFileSize > 0 ? formatBytes(audioFileSize) : "Calculating size..."}
                                    </p>
                                  </div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                                      onClick={() => handleAudioDownload(result.result.musik)}
                                      disabled={downloadLoading === "audio"}
                                    >
                                      {downloadLoading === "audio" ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Downloading...
                                        </>
                                      ) : (
                                        <>
                                          <Music className="mr-2 h-4 w-4" />
                                          Download Audio
                                        </>
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>
                              </TabsContent>
                            </motion.div>
                          </AnimatePresence>
                        </Tabs>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300">
                          <div className="mb-2">
                            <p className="font-medium dark:text-white mb-2">
                              Image {currentImageIndex + 1} of {result.result.gambar.length}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Image download button */}
                              <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg transition-all duration-300 gap-2">
                                <div>
                                  <p className="font-medium text-sm dark:text-white flex items-center">
                                    <ImageIcon className="h-4 w-4 mr-1" /> Image
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {imageFileSizes[currentImageIndex]
                                      ? formatBytes(imageFileSizes[currentImageIndex])
                                      : "Calculating size..."}
                                  </p>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                                    onClick={() =>
                                      handleImageDownload(result.result.gambar[currentImageIndex], currentImageIndex)
                                    }
                                    disabled={downloadLoading === `image-${currentImageIndex}`}
                                  >
                                    {downloadLoading === `image-${currentImageIndex}` ? (
                                      <>
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="mr-1 h-3 w-3" />
                                        Download
                                      </>
                                    )}
                                  </Button>
                                </motion.div>
                              </div>

                              {/* Audio download button - only show if music exists */}
                              {result.result.musik && (
                                <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg transition-all duration-300 gap-2">
                                  <div>
                                    <p className="font-medium text-sm dark:text-white flex items-center">
                                      <Music className="h-4 w-4 mr-1" /> Audio
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {audioFileSize > 0 ? formatBytes(audioFileSize) : "Calculating size..."}
                                    </p>
                                  </div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                                      onClick={() => handleAudioDownload(result.result.musik)}
                                      disabled={downloadLoading === "audio"}
                                    >
                                      {downloadLoading === "audio" ? (
                                        <>
                                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                          Downloading...
                                        </>
                                      ) : (
                                        <>
                                          <Music className="mr-1 h-3 w-3" />
                                          Download
                                        </>
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </motion.div>

          <motion.div style={{ transform: "translateZ(10px)" }}>
            <CardFooter className="flex justify-center border-t pt-4 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2023-2025 TikTok Downloader. by{" "}
                <Link
                  href="https://www.instagram.com/elk_aff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
                >
                  @elkaff
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
