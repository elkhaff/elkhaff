"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import ApiTester from "@/components/api-tester"
import { useToast } from "@/components/ui/use-toast"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ApiDocumentationClient() {
  const { toast } = useToast()
  const [domain, setDomain] = useState("kaff-api.vercel.app")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Try to detect the current domain
    if (typeof window !== "undefined") {
      setDomain(window.location.host)
    }
  }, [])

  function CopyButton({ text }: { text: string }) {
    const [isCopied, setIsCopied] = React.useState(false)

    async function copyText() {
      if (!navigator.clipboard) {
        toast({
          title: "Copying not supported",
          description: "Your browser does not support copying to the clipboard.",
        })
        return
      }

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        toast({
          title: "Copied!",
          description: "Text copied to clipboard.",
        })
        setTimeout(() => setIsCopied(false), 2000)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy text to clipboard.",
        })
      }
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-8 w-8 rounded-md p-0 data-[state=open]:bg-muted"
        onClick={copyText}
      >
        {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
        <span className="sr-only">Copy</span>
      </Button>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex flex-col items-center p-4 transition-colors duration-500">
      <div className="w-full max-w-4xl mx-auto py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">TikTok Downloader API</h1>
          <p className="text-blue-100 text-lg">Simple and powerful API to download TikTok videos without watermark</p>
        </div>

        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">API Endpoint</CardTitle>
                <CardDescription>Use this endpoint to download TikTok videos and images</CardDescription>
              </div>
              <Badge
                variant="outline"
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
              >
                GET
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Base URL</h3>
                <div className="relative">
                  <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
                    <span className="text-gray-800 dark:text-gray-200 break-all">
                      https://{domain}/api/download?url=
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 break-all">{"{tiktok_url}"}</span>
                  </div>
                  <CopyButton text={`https://${domain}/api/download?url={tiktok_url}`} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Parameter</th>
                        <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Type</th>
                        <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Required</th>
                        <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">url</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">string</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">Yes</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">
                          The TikTok video or image URL
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Tabs defaultValue="response">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="response">Response Format</TabsTrigger>
                  <TabsTrigger value="example">Example Response</TabsTrigger>
                </TabsList>
                <TabsContent value="response" className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                  <pre className="text-sm overflow-x-auto">
                    <code className="language-json text-gray-800 dark:text-gray-200">
                      {`{
  "status": number,
  "creator": string,
  "result": {
    "tipe": "video" | "gambar",
    "nama": string,
    "pengguna": string,
    "judul": string,
    "durasi": number,
    "putar": number,
    "suka": number,
    "komentar": number,
    "bagikan": number,
    "ukuran": {
      "bytes": number
    },
    "hd": {
      "bytes": number
    },
    "musik": string,
    "videoHD": string,
    "videoSD": string,
    "gambar": string[]
  }
}`}
                    </code>
                  </pre>
                </TabsContent>
                <TabsContent value="example" className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                  <pre className="text-sm overflow-x-auto">
                    <code className="language-json text-gray-800 dark:text-gray-200">
                      {`{
  "status": 200,
  "creator": "elkaff",
  "result": {
    "tipe": "video",
    "nama": "example_video",
    "pengguna": "username",
    "judul": "Example TikTok video",
    "durasi": 15,
    "putar": 10000,
    "suka": 1500,
    "komentar": 200,
    "bagikan": 50,
    "ukuran": {
      "bytes": 2048576
    },
    "hd": {
      "bytes": 4194304
    },
    "musik": "https://example.com/audio.mp3",
    "videoHD": "https://example.com/video_hd.mp4",
    "videoSD": "https://example.com/video_sd.mp4",
    "gambar": []
  }
}`}
                    </code>
                  </pre>
                </TabsContent>
              </Tabs>

              <div>
                <h3 className="text-lg font-medium mb-2">Error Responses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Status Code</th>
                        <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">400</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">
                          Bad Request - URL parameter is missing
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">500</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-700">
                          Internal Server Error - Failed to fetch from TikTok
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Try the API</CardTitle>
            <CardDescription>Test the API with your TikTok URL</CardDescription>
          </CardHeader>
          <CardContent>
            <ApiTester />
          </CardContent>
        </Card>

        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Code Examples</CardTitle>
            <CardDescription>How to use the API in different programming languages</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
              </TabsList>
              <TabsContent value="curl" className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-bash text-gray-800 dark:text-gray-200">
                    {`curl -X GET "https://${domain}/api/download?url=https%3A%2F%2Fwww.tiktok.com%2F%40username%2Fvideo%2F1234567890123456789" \\
  -H "Accept: application/json"`}
                  </code>
                </pre>
                <CopyButton
                  text={`curl -X GET "https://${domain}/api/download?url=https%3A%2F%2Fwww.tiktok.com%2F%40username%2Fvideo%2F1234567890123456789" \\
  -H "Accept: application/json"`}
                />
              </TabsContent>
              <TabsContent value="javascript" className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-javascript text-gray-800 dark:text-gray-200">
                    {`// Using fetch API
const fetchTikTokData = async (tiktokUrl) => {
  try {
    const response = await fetch(
      \`https://${domain}/api/download?url=\${encodeURIComponent(tiktokUrl)}\`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage
fetchTikTokData('https://www.tiktok.com/@username/video/1234567890123456789');`}
                  </code>
                </pre>
                <CopyButton
                  text={`// Using fetch API
const fetchTikTokData = async (tiktokUrl) => {
  try {
    const response = await fetch(
      \`https://${domain}/api/download?url=\${encodeURIComponent(tiktokUrl)}\`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage
fetchTikTokData('https://www.tiktok.com/@username/video/1234567890123456789');`}
                />
              </TabsContent>
              <TabsContent value="python" className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-python text-gray-800 dark:text-gray-200">
                    {`import requests
import urllib.parse

def fetch_tiktok_data(tiktok_url):
    try:
        encoded_url = urllib.parse.quote(tiktok_url)
        response = requests.get(f'https://${domain}/api/download?url={encoded_url}')
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        data = response.json()
        print(data)
        return data
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        return None

# Example usage
fetch_tiktok_data('https://www.tiktok.com/@username/video/1234567890123456789')`}
                  </code>
                </pre>
                <CopyButton
                  text={`import requests
import urllib.parse

def fetch_tiktok_data(tiktok_url):
    try:
        encoded_url = urllib.parse.quote(tiktok_url)
        response = requests.get(f'https://${domain}/api/download?url={encoded_url}')
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        data = response.json()
        print(data)
        return data
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        return None

# Example usage
fetch_tiktok_data('https://www.tiktok.com/@username/video/1234567890123456789')`}
                />
              </TabsContent>
              <TabsContent value="php" className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-php text-gray-800 dark:text-gray-200">
                    {`<?php
function fetchTikTokData($tiktokUrl) {
    $encodedUrl = urlencode($tiktokUrl);
    $apiUrl = "https://${domain}/api/download?url={$encodedUrl}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo 'Error: ' . curl_error($ch);
        return null;
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    print_r($data);
    return $data;
}

// Example usage
fetchTikTokData('https://www.tiktok.com/@username/video/1234567890123456789');
?>`}
                  </code>
                </pre>
                <CopyButton
                  text={`<?php
function fetchTikTokData($tiktokUrl) {
    $encodedUrl = urlencode($tiktokUrl);
    $apiUrl = "https://${domain}/api/download?url={$encodedUrl}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo 'Error: ' . curl_error($ch);
        return null;
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    print_r($data);
    return $data;
}

// Example usage
fetchTikTokData('https://www.tiktok.com/@username/video/1234567890123456789');
?>`}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
            >
              Back to Downloader
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
