import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getRenewingWithin, formatDate, daysUntil } from "@/lib/utils/dates"
import { formatKRW } from "@/lib/utils/currency"
import type { SubscriptionWithCategory } from "@/types/app"
import { cn } from "@/lib/utils"

interface Props {
  subscriptions: SubscriptionWithCategory[]
}

export function UpcomingRenewalsWidget({ subscriptions }: Props) {
  const upcoming = getRenewingWithin(subscriptions, 30).slice(0, 5)

  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">30일 내 갱신</h2>
        <Link
          href="/renewals"
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          전체 보기 <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">30일 내 갱신 예정 없음</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((sub) => {
            const days = daysUntil(sub.next_billing_date)
            return (
              <div key={sub.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: sub.categories?.color ?? "#6366f1" }}
                >
                  {sub.service_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{sub.service_name}</p>
                  <p className="text-xs text-gray-500">{formatDate(sub.next_billing_date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">{formatKRW(sub.cost)}</p>
                  <p className={cn(
                    "text-xs",
                    days <= 3 ? "text-orange-600 font-medium" : "text-gray-500"
                  )}>
                    {days === 0 ? "오늘" : `${days}일 후`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
