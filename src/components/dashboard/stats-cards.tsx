import { CreditCard, TrendingUp, Activity, Calendar } from "lucide-react"
import { formatKRW } from "@/lib/utils/currency"
import { calculateTotalMonthly, calculateTotalYearly } from "@/lib/utils/spend"
import { daysUntil } from "@/lib/utils/dates"
import type { SubscriptionWithCategory } from "@/types/app"

interface Props {
  subscriptions: SubscriptionWithCategory[]
}

export function StatsCards({ subscriptions }: Props) {
  const activeCount = subscriptions.filter((s) => s.status === "active").length
  const totalMonthly = calculateTotalMonthly(subscriptions)
  const totalYearly = calculateTotalYearly(subscriptions)
  const nextRenewal = subscriptions
    .filter((s) => s.status === "active" && daysUntil(s.next_billing_date) >= 0)
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())[0]
  const nextDays = nextRenewal ? daysUntil(nextRenewal.next_billing_date) : null

  const cards = [
    {
      label: "월간 지출",
      value: formatKRW(totalMonthly),
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "연간 지출",
      value: formatKRW(totalYearly),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "활성 구독",
      value: `${activeCount}개`,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "다음 갱신",
      value: nextRenewal
        ? nextDays === 0 ? "오늘!" : `${nextDays}일 후`
        : "없음",
      sub: nextRenewal?.service_name,
      icon: Calendar,
      color: nextDays !== null && nextDays <= 3 ? "text-orange-600" : "text-purple-600",
      bg: nextDays !== null && nextDays <= 3 ? "bg-orange-50" : "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            {card.sub && (
              <p className="text-xs text-gray-500 mt-1 truncate">{card.sub}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
