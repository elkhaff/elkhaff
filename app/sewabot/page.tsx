import { redirect } from "next/navigation"

export default function SewaBot() {
  redirect("https://wa.me/6285179836134?text=bang%20mau%20sewa%20bot")

  // This return is unreachable but required for TypeScript
  return null
}
