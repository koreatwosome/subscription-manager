"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  BarChart2,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/dashboard",      label: "대시보드",   icon: LayoutDashboard },
  { href: "/subscriptions",  label: "구독 목록",  icon: CreditCard },
  { href: "/renewals",       label: "갱신 예정",  icon: Calendar },
  { href: "/analytics",      label: "분석",       icon: BarChart2 },
  { href: "/settings",       label: "설정",       icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r flex flex-col z-10">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-lg font-bold text-indigo-600">구독 관리</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
