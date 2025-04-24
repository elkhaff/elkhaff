import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")
  const filename = searchParams.get("filename") || "download"

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    // Fetch the file as a stream
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch file")
    }

    // Get content type and size
    const contentType = response.headers.get("content-type") || "application/octet-stream"
    const contentLength = response.headers.get("content-length")

    // Create headers for the streaming response
    const headers = new Headers()
    headers.set("Content-Type", contentType)
    headers.set("Content-Disposition", `attachment; filename="${filename}"`)

    if (contentLength) {
      headers.set("Content-Length", contentLength)
    }

    // Stream the response
    const stream = response.body

    return new Response(stream, {
      headers,
      status: 200,
    })
  } catch (error) {
    console.error("Error streaming file:", error)
    return NextResponse.json({ error: "Failed to stream file. Please try again." }, { status: 500 })
  }
}
