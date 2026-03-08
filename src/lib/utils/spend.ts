import type { BillingCycle, SubscriptionWithCategory } from "@/types/app"

export function toMonthlyCost(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "monthly":   return cost
    case "yearly":    return cost / 12
    case "quarterly": return cost / 3
    case "weekly":    return cost * (52 / 12)
  }
}

export function toYearlyCost(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "monthly":   return cost * 12
    case "yearly":    return cost
    case "quarterly": return cost * 4
    case "weekly":    return cost * 52
  }
}

export function calculateTotalMonthly(subscriptions: SubscriptionWithCategory[]): number {
  return subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + toMonthlyCost(s.cost, s.billing_cycle), 0)
}

export function calculateTotalYearly(subscriptions: SubscriptionWithCategory[]): number {
  return subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + toYearlyCost(s.cost, s.billing_cycle), 0)
}

export function calculateByCategory(
  subscriptions: SubscriptionWithCategory[]
): { category: string; monthly: number; color: string }[] {
  const map = new Map<string, { monthly: number; color: string }>()

  subscriptions
    .filter((s) => s.status === "active")
    .forEach((s) => {
      const key = s.categories?.name ?? "기타"
      const color = s.categories?.color ?? "#94a3b8"
      const monthly = toMonthlyCost(s.cost, s.billing_cycle)
      const existing = map.get(key)
      if (existing) {
        existing.monthly += monthly
      } else {
        map.set(key, { monthly, color })
      }
    })

  return Array.from(map.entries())
    .map(([category, { monthly, color }]) => ({ category, monthly, color }))
    .sort((a, b) => b.monthly - a.monthly)
}
