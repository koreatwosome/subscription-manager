"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/actions/profile"
import type { Profile } from "@/types/app"

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fullName = (e.currentTarget.elements.namedItem("fullName") as HTMLInputElement).value
    const result = await updateProfile(fullName)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("프로필이 저장되었습니다.")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">이름</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile?.full_name ?? ""}
          placeholder="홍길동"
        />
      </div>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? "저장 중..." : "저장"}
      </Button>
    </form>
  )
}
