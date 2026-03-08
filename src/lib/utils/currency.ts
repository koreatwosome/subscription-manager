export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(amount))
}
