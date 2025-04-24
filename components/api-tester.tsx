"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons"
import { useSearchParams } from "next/navigation"

export default function ApiTester() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Update the domain state initialization
  const [domain, setDomain] = useState("kaff-api.vercel.app")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Try to detect the current domain
    if (typeof window !== "undefined") {
      setDomain(window.location.host)
    }

    // Check if there's a URL in the search params
    const urlParam = searchParams.get("url")
    if (urlParam) {
      setUrl(urlParam)
      handleSubmit(new Event("submit") as any)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a TikTok URL")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const encodedUrl = encodeURIComponent(url)
      const response = await fetch(`/api/download?url=${encodedUrl}`)

      const data = await response.json()

      // Format the JSON with indentation for better readability
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Paste TikTok URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 dark:bg-gray-800 dark:border-gray-700"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test API"
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="relative">
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
            <code>{result}</code>
          </pre>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute top-2 right-2 h-8 w-8 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
      onClick={handleCopy}
    >
      {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
      <span className="sr-only">Copy code</span>
    </Button>
  )
}
