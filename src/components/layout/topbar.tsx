import { signOut } from "@/actions/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export async function Topbar({ title }: { title: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single()

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <span>{profile?.full_name ?? profile?.email}</span>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="text-gray-600">
            <LogOut className="w-4 h-4 mr-1" />
            로그아웃
          </Button>
        </form>
      </div>
    </header>
  )
}
