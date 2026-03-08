"use client"

import { useState } from "react"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await signUp(formData)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.pending) {
      setEmailSent(true)
    }
    setLoading(false)
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-2 py-4">
        <p className="font-medium">이메일을 확인해주세요</p>
        <p className="text-sm text-gray-500">가입 확인 링크를 이메일로 보냈습니다.</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">이름</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="홍길동"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  )
}
