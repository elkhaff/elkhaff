export async function downloadFile(url: string, filename: string) {
  try {
    // Use our stream endpoint instead of direct download
    const streamUrl = `/api/download/stream?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`

    // Create and click a download link
    const link = document.createElement("a")
    link.href = streamUrl
    link.download = filename
    link.target = "_blank"
    link.rel = "noopener noreferrer"

    // Append to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Download failed:", error)
    // Fallback to opening in new tab
    window.open(url, "_blank")
  }
}
