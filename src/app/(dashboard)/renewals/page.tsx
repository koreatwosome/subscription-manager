import { createClient } from "@/lib/supabase/server"
import { Topbar } from "@/components/layout/topbar"
import { getRenewingWithin, formatDate, daysUntil } from "@/lib/utils/dates"
import { formatKRW } from "@/lib/utils/currency"
import { BILLING_CYCLE_LABELS } from "@/types/app"
import { cn } from "@/lib/utils"

export default async function RenewalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, categories(*)")
    .eq("user_id", user!.id)
    .order("next_billing_date", { ascending: true })

  const subs = subscriptions ?? []
  const thisWeek = getRenewingWithin(subs, 7)
  const next30 = getRenewingWithin(subs, 30).filter(
    (s) => !thisWeek.find((w) => w.id === s.id)
  )
  const next90 = getRenewingWithin(subs, 90).filter(
    (s) => !thisWeek.find((w) => w.id === s.id) && !next30.find((n) => n.id === s.id)
  )

  const sections = [
    { label: "이번 주 갱신", items: thisWeek, urgent: true },
    { label: "30일 내 갱신", items: next30, urgent: false },
    { label: "90일 내 갱신", items: next90, urgent: false },
  ]

  const total = thisWeek.length + next30.length + next90.length

  return (
    <>
      <Topbar title="갱신 예정" />
      <div className="p-6 space-y-8">
        {total === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">90일 내 갱신 예정이 없습니다</p>
          </div>
        ) : (
          sections.map((section) =>
            section.items.length > 0 ? (
              <div key={section.label}>
                <h2 className={cn(
                  "text-sm font-semibold uppercase tracking-wide mb-3",
                  section.urgent ? "text-orange-600" : "text-gray-500"
                )}>
                  {section.label} ({section.items.length})
                </h2>
                <div className="space-y-3">
                  {section.items.map((sub) => {
                    const days = daysUntil(sub.next_billing_date)
                    return (
                      <div
                        key={sub.id}
                        className={cn(
                          "bg-white rounded-xl border p-4 flex items-center gap-4",
                          section.urgent && "border-orange-200"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: sub.categories?.color ?? "#6366f1" }}
                        >
                          {sub.service_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{sub.service_name}</p>
                          <p className="text-sm text-gray-500">
                            {sub.categories?.name && `${sub.categories.name} · `}
                            {BILLING_CYCLE_LABELS[sub.billing_cycle]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatKRW(sub.cost)}</p>
                          <p className="text-sm text-gray-500">{formatDate(sub.next_billing_date)}</p>
                        </div>
                        <div className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full flex-shrink-0",
                          days === 0
                            ? "bg-red-100 text-red-700"
                            : days <= 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {days === 0 ? "오늘" : `${days}일 후`}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </>
  )
}
