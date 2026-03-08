import type { Database } from "./database"

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
export type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"]
export type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type BillingCycle = Database["public"]["Enums"]["billing_cycle_enum"]
export type SubscriptionStatus = Database["public"]["Enums"]["status_enum"]

export type SubscriptionWithCategory = Subscription & {
  categories: Category | null
}

export type SpendSummary = {
  totalMonthly: number
  totalYearly: number
  activeCount: number
  pausedCount: number
  nextRenewal: SubscriptionWithCategory | null
  byCategory: { category: string; monthly: number; color: string }[]
}

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "월간",
  yearly: "연간",
  weekly: "주간",
  quarterly: "분기",
}

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "활성",
  paused: "일시정지",
  cancelled: "해지",
}
