import type { Metadata } from "next"
import ApiDocumentationClient from "./ApiDocumentationClient"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "TikTok Downloader API - Documentation",
  description: "API documentation for TikTok Downloader service",
}

export default function ApiDocumentation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center text-white text-xl">
          Loading API documentation...
        </div>
      }
    >
      <ApiDocumentationClient />
    </Suspense>
  )
}
