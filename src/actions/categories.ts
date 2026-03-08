"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return { supabase, user }
}

export async function getCategories() {
  const { supabase, user } = await getUser()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.eq.${user.id},is_default.eq.true`)
    .order("name")

  if (error) throw error
  return data
}

export async function createCategory(name: string, color: string) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from("categories")
    .insert({ name, color, user_id: user.id, is_default: false })

  if (error) return { error: error.message }

  revalidatePath("/settings")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("is_default", false)

  if (error) return { error: error.message }

  revalidatePath("/settings")
  return { success: true }
}
