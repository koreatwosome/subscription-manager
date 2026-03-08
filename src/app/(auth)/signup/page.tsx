import { SignUpForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">구독 관리</h1>
          <p className="mt-2 text-gray-600">계정을 만들고 시작하세요</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <SignUpForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
