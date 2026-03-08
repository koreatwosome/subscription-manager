import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingRenewalsWidget } from "@/components/dashboard/upcoming-renewals-widget"
import { SubscriptionCard } from "@/components/subscriptions/subscription-card"
import { Topbar } from "@/components/layout/topbar"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, categories(*)")
    .eq("user_id", user!.id)
    .order("next_billing_date", { ascending: true })

  const subs = subscriptions ?? []
  const recent = subs.slice(0, 5)

  return (
    <>
      <Topbar title="대시보드" />
      <div className="p-6 space-y-6">
        <StatsCards subscriptions={subs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">최근 구독</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/subscriptions/new">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Link>
              </Button>
            </div>
            {recent.length === 0 ? (
              <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
                <p>구독이 없습니다. 첫 번째 구독을 추가해보세요!</p>
                <Button asChild className="mt-4">
                  <Link href="/subscriptions/new">구독 추가</Link>
                </Button>
              </div>
            ) : (
              <>
                {recent.map((sub) => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
                {subs.length > 5 && (
                  <Link
                    href="/subscriptions"
                    className="block text-center text-sm text-indigo-600 hover:text-indigo-700 py-2"
                  >
                    전체 {subs.length}개 보기 →
                  </Link>
                )}
              </>
            )}
          </div>

          <div>
            <UpcomingRenewalsWidget subscriptions={subs} />
          </div>
        </div>
      </div>
    </>
  )
}
