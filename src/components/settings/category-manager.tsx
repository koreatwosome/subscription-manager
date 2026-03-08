"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createCategory, deleteCategory } from "@/actions/categories"
import type { Category } from "@/types/app"

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981",
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
  "#64748b", "#06b6d4",
]

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const result = await createCategory(name.trim(), color)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("카테고리가 추가되었습니다.")
      setName("")
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    const result = await deleteCategory(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("카테고리가 삭제되었습니다.")
    }
  }

  return (
    <div className="space-y-4">
      {/* 추가 폼 */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="flex gap-1.5 flex-shrink-0">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "black" : "transparent",
              }}
            />
          ))}
        </div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="카테고리 이름"
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !name.trim()} size="sm">
          추가
        </Button>
      </form>

      {/* 커스텀 카테고리 목록 */}
      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">커스텀 카테고리가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 py-1">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm flex-1">{cat.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-red-500"
                onClick={() => handleDelete(cat.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
