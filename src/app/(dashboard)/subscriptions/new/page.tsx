import { getCategories } from "@/actions/categories"
import { SubscriptionForm } from "@/components/subscriptions/subscription-form"
import { Topbar } from "@/components/layout/topbar"

export default async function NewSubscriptionPage() {
  const categories = await getCategories()

  return (
    <>
      <Topbar title="구독 추가" />
      <div className="p-6 max-w-2xl">
        <div className="bg-white rounded-2xl border p-6">
          <SubscriptionForm categories={categories} />
        </div>
      </div>
    </>
  )
}
