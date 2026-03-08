"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatKRW } from "@/lib/utils/currency"

interface Props {
  data: { category: string; monthly: number; color: string }[]
}

export function CategoryPieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        데이터 없음
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="monthly"
          nameKey="category"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatKRW(Number(value)), "월간 지출"]}
        />
        <Legend
          formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
