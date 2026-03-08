import { createClient } from "@/lib/supabase/server"
import { Topbar } from "@/components/layout/topbar"
import { CategoryPieChart } from "@/components/analytics/category-pie-chart"
import { calculateByCategory, calculateTotalMonthly, calculateTotalYearly } from "@/lib/utils/spend"
import { formatKRW } from "@/lib/utils/currency"
import { BILLING_CYCLE_LABELS } from "@/types/app"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, categories(*)")
    .eq("user_id", user!.id)
    .order("cost", { ascending: false })

  const subs = subscriptions ?? []
  const byCategory = calculateByCategory(subs)
  const totalMonthly = calculateTotalMonthly(subs)
  const totalYearly = calculateTotalYearly(subs)

  return (
    <>
      <Topbar title="분석" />
      <div className="p-6 space-y-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500 mb-1">월간 총 지출</p>
            <p className="text-3xl font-bold text-indigo-600">{formatKRW(totalMonthly)}</p>
            <p className="text-xs text-gray-400 mt-1">활성 구독 기준</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500 mb-1">연간 총 지출</p>
            <p className="text-3xl font-bold text-emerald-600">{formatKRW(totalYearly)}</p>
            <p className="text-xs text-gray-400 mt-1">활성 구독 기준</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 카테고리별 파이차트 */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold text-gray-900 mb-4">카테고리별 지출</h2>
            <CategoryPieChart data={byCategory} />
          </div>

          {/* 카테고리별 테이블 */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold text-gray-900 mb-4">카테고리 상세</h2>
            {byCategory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">데이터 없음</p>
            ) : (
              <div className="space-y-3">
                {byCategory.map((item) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 flex-1">{item.category}</span>
                    <span className="text-sm font-semibold">{formatKRW(item.monthly)}</span>
                    <span className="text-xs text-gray-400 w-12 text-right">
                      {totalMonthly > 0 ? Math.round((item.monthly / totalMonthly) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 구독별 상세 */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">구독별 비용</h2>
          {subs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">구독이 없습니다</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">서비스</th>
                  <th className="pb-3 font-medium">카테고리</th>
                  <th className="pb-3 font-medium">주기</th>
                  <th className="pb-3 font-medium text-right">결제금액</th>
                  <th className="pb-3 font-medium text-right">월 환산</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subs
                  .filter((s) => s.status === "active")
                  .map((sub) => {
                    const monthly = sub.billing_cycle === "yearly"
                      ? sub.cost / 12
                      : sub.billing_cycle === "quarterly"
                      ? sub.cost / 3
                      : sub.billing_cycle === "weekly"
                      ? sub.cost * (52 / 12)
                      : sub.cost
                    return (
                      <tr key={sub.id}>
                        <td className="py-3 font-medium text-gray-900">{sub.service_name}</td>
                        <td className="py-3 text-gray-500">{sub.categories?.name ?? "-"}</td>
                        <td className="py-3 text-gray-500">{BILLING_CYCLE_LABELS[sub.billing_cycle]}</td>
                        <td className="py-3 text-right">{formatKRW(sub.cost)}</td>
                        <td className="py-3 text-right font-semibold">{formatKRW(monthly)}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
