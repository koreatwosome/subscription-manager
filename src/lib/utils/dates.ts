import { addDays, differenceInDays, format, isAfter, isBefore } from "date-fns"
import { ko } from "date-fns/locale"
import type { SubscriptionWithCategory } from "@/types/app"

export function getRenewingWithin(
  subscriptions: SubscriptionWithCategory[],
  days: number
): SubscriptionWithCategory[] {
  const now = new Date()
  const future = addDays(now, days)

  return subscriptions
    .filter((s) => s.status === "active")
    .filter((s) => {
      const d = new Date(s.next_billing_date)
      return !isBefore(d, now) && !isAfter(d, future)
    })
    .sort(
      (a, b) =>
        new Date(a.next_billing_date).getTime() -
        new Date(b.next_billing_date).getTime()
    )
}

export function daysUntil(dateStr: string): number {
  return differenceInDays(new Date(dateStr), new Date())
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "yyyy.MM.dd", { locale: ko })
}

export function formatRelativeDate(dateStr: string): string {
  const days = daysUntil(dateStr)
  if (days === 0) return "오늘"
  if (days === 1) return "내일"
  if (days < 0) return `${Math.abs(days)}일 전`
  return `${days}일 후`
}
