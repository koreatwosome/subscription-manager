"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteSubscription } from "@/actions/subscriptions"
import { formatKRW } from "@/lib/utils/currency"
import { formatDate, daysUntil } from "@/lib/utils/dates"
import { BILLING_CYCLE_LABELS, STATUS_LABELS } from "@/types/app"
import type { SubscriptionWithCategory } from "@/types/app"
import { cn } from "@/lib/utils"

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-600",
}

interface Props {
  subscription: SubscriptionWithCategory
}

export function SubscriptionCard({ subscription: sub }: Props) {
  const [deleting, setDeleting] = useState(false)
  const days = daysUntil(sub.next_billing_date)
  const isUrgent = days >= 0 && days <= 7 && sub.status === "active"

  async function handleDelete() {
    if (!confirm(`"${sub.service_name}" 구독을 삭제하시겠습니까?`)) return
    setDeleting(true)
    const result = await deleteSubscription(sub.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("구독이 삭제되었습니다.")
    }
    setDeleting(false)
  }

  return (
    <div className={cn(
      "bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow",
      isUrgent && "border-orange-200 bg-orange-50/30"
    )}>
      {/* 색상 아이콘 */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: sub.categories?.color ?? "#6366f1" }}
      >
        {sub.service_name.charAt(0).toUpperCase()}
      </div>

      {/* 메인 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 truncate">{sub.service_name}</p>
          {sub.categories && (
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ backgroundColor: sub.categories.color }}
            >
              {sub.categories.name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          다음 결제: {formatDate(sub.next_billing_date)}
          {isUrgent && (
            <span className="ml-1 text-orange-600 font-medium">
              ({days === 0 ? "오늘!" : `${days}일 후`})
            </span>
          )}
        </p>
      </div>

      {/* 금액 & 상태 */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-gray-900">{formatKRW(sub.cost)}</p>
        <p className="text-xs text-gray-500">{BILLING_CYCLE_LABELS[sub.billing_cycle]}</p>
      </div>

      <Badge className={cn("flex-shrink-0", STATUS_COLORS[sub.status])}>
        {STATUS_LABELS[sub.status]}
      </Badge>

      {/* 액션 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8" disabled={deleting}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/subscriptions/${sub.id}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              수정
            </Link>
          </DropdownMenuItem>
          {sub.website_url && (
            <DropdownMenuItem asChild>
              <a href={sub.website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                사이트 방문
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
