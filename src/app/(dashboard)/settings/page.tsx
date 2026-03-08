import { createClient } from "@/lib/supabase/server"
import { Topbar } from "@/components/layout/topbar"
import { ProfileForm } from "@/components/settings/profile-form"
import { CategoryManager } from "@/components/settings/category-manager"
import { getCategories } from "@/actions/categories"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  const categories = await getCategories()
  const customCategories = categories.filter((c) => !c.is_default)

  return (
    <>
      <Topbar title="설정" />
      <div className="p-6 space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">프로필</h2>
          <ProfileForm profile={profile} />
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1">커스텀 카테고리</h2>
          <p className="text-sm text-gray-500 mb-4">직접 카테고리를 추가할 수 있습니다.</p>
          <CategoryManager categories={customCategories} />
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-2">계정 정보</h2>
          <p className="text-sm text-gray-600">이메일: <span className="font-medium">{profile?.email}</span></p>
        </div>
      </div>
    </>
  )
}
