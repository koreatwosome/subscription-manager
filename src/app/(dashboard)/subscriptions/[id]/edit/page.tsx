import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCategories } from "@/actions/categories"
import { SubscriptionForm } from "@/components/subscriptions/subscription-form"
import { Topbar } from "@/components/layout/topbar"

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, categories(*)")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single()

  if (!subscription) notFound()

  const categories = await getCategories()

  return (
    <>
      <Topbar title="구독 수정" />
      <div className="p-6 max-w-2xl">
        <div className="bg-white rounded-2xl border p-6">
          <SubscriptionForm subscription={subscription} categories={categories} />
        </div>
      </div>
    </>
  )
}
