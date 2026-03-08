"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createSubscription, updateSubscription } from "@/actions/subscriptions"
import type { Category, SubscriptionWithCategory } from "@/types/app"

interface Props {
  subscription?: SubscriptionWithCategory
  categories: Category[]
}

export function SubscriptionForm({ subscription, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEdit = !!subscription

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = {
      service_name: (form.elements.namedItem("service_name") as HTMLInputElement).value,
      cost: Number((form.elements.namedItem("cost") as HTMLInputElement).value),
      billing_cycle: (form.elements.namedItem("billing_cycle") as HTMLSelectElement).value as "monthly" | "yearly" | "weekly" | "quarterly",
      next_billing_date: (form.elements.namedItem("next_billing_date") as HTMLInputElement).value,
      category_id: (form.elements.namedItem("category_id") as HTMLSelectElement).value || null,
      status: (form.elements.namedItem("status") as HTMLSelectElement).value as "active" | "paused" | "cancelled",
      website_url: (form.elements.namedItem("website_url") as HTMLInputElement).value || null,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value || null,
      description: null,
      logo_url: null,
      started_at: null,
    }

    const result = isEdit
      ? await updateSubscription(subscription.id, data)
      : await createSubscription(data)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(isEdit ? "구독이 수정되었습니다." : "구독이 추가되었습니다.")
      router.push("/subscriptions")
    }
    setLoading(false)
  }

  const defaultDate = subscription?.next_billing_date
    ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="service_name">서비스 이름 *</Label>
          <Input
            id="service_name"
            name="service_name"
            placeholder="Netflix, YouTube Premium..."
            required
            defaultValue={subscription?.service_name}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cost">금액 (₩) *</Label>
          <Input
            id="cost"
            name="cost"
            type="number"
            min="0"
            step="100"
            placeholder="17000"
            required
            defaultValue={subscription?.cost}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="billing_cycle">결제 주기 *</Label>
          <Select name="billing_cycle" defaultValue={subscription?.billing_cycle ?? "monthly"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">월간</SelectItem>
              <SelectItem value="yearly">연간</SelectItem>
              <SelectItem value="quarterly">분기</SelectItem>
              <SelectItem value="weekly">주간</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="next_billing_date">다음 결제일 *</Label>
          <Input
            id="next_billing_date"
            name="next_billing_date"
            type="date"
            required
            defaultValue={defaultDate}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id">카테고리</Label>
          <Select name="category_id" defaultValue={subscription?.category_id ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="선택 (선택사항)" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">상태</Label>
          <Select name="status" defaultValue={subscription?.status ?? "active"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="paused">일시정지</SelectItem>
              <SelectItem value="cancelled">해지</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="website_url">웹사이트 URL</Label>
          <Input
            id="website_url"
            name="website_url"
            type="url"
            placeholder="https://..."
            defaultValue={subscription?.website_url ?? ""}
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="notes">메모</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="추가 메모..."
            rows={3}
            defaultValue={subscription?.notes ?? ""}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          취소
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "저장 중..." : isEdit ? "수정하기" : "추가하기"}
        </Button>
      </div>
    </form>
  )
}
