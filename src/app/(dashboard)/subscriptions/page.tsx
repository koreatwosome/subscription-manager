import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { SubscriptionCard } from "@/components/subscriptions/subscription-card"
import { Topbar } from "@/components/layout/topbar"

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, categories(*)")
    .eq("user_id", user!.id)
    .order("next_billing_date", { ascending: true })

  const active = subscriptions?.filter((s) => s.status === "active") ?? []
  const others = subscriptions?.filter((s) => s.status !== "active") ?? []

  return (
    <>
      <Topbar title="구독 목록" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{subscriptions?.length ?? 0}</span>개의 구독
          </p>
          <Button asChild>
            <Link href="/subscriptions/new">
              <Plus className="w-4 h-4 mr-2" />
              구독 추가
            </Link>
          </Button>
        </div>

        {subscriptions?.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">구독이 없습니다</p>
            <p className="mt-1 text-sm">첫 번째 구독을 추가해보세요!</p>
            <Button asChild className="mt-4">
              <Link href="/subscriptions/new">
                <Plus className="w-4 h-4 mr-2" />
                구독 추가
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  활성 ({active.length})
                </h2>
                {active.map((sub) => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
              </div>
            )}
            {others.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  비활성 ({others.length})
                </h2>
                {others.map((sub) => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
