"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { SubscriptionInsert, SubscriptionUpdate } from "@/types/app"

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return { supabase, user }
}

export async function createSubscription(data: Omit<SubscriptionInsert, "user_id">) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from("subscriptions")
    .insert({ ...data, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/subscriptions")
  revalidatePath("/renewals")
  return { success: true }
}

export async function updateSubscription(id: string, data: SubscriptionUpdate) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from("subscriptions")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/subscriptions")
  revalidatePath(`/subscriptions/${id}`)
  revalidatePath("/renewals")
  return { success: true }
}

export async function deleteSubscription(id: string) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/subscriptions")
  revalidatePath("/renewals")
  return { success: true }
}

export async function getSubscriptions() {
  const { supabase, user } = await getUser()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .order("next_billing_date", { ascending: true })

  if (error) throw error
  return data
}
