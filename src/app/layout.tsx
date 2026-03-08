import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "구독 관리",
  description: "나만의 구독 서비스 관리 대시보드",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${geist.className} antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
