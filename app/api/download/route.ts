import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const apiUrl = `https://kaff-api.vercel.app/api/tiktok-dl?url=${encodeURIComponent(url)}`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch from API")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching TikTok data:", error)
    return NextResponse.json({ error: "Failed to download. Please check the URL and try again." }, { status: 500 })
  }
}
