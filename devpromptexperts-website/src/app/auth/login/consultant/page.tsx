// /auth/login/consultant/page.tsx
"use client"

import { signIn } from "next-auth/react"
import { FaLinkedin, FaArrowRight } from "react-icons/fa"
import { useState } from "react"

export default function ConsultantLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkedInLogin = async () => {
    setIsLoading(true)
    try {
      // Hardcode the redirect to /consultant after login
      await signIn("linkedin", { callbackUrl: "/consultant" })
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaLinkedin className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to access your consultant dashboard</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#0077B5] text-white py-4 px-6 rounded-xl hover:bg-[#00669A] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] group border border-[#00669A]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FaLinkedin className="text-xl" />
                <span className="font-semibold text-base">Continue with LinkedIn</span>
                <FaArrowRight className="ml-auto text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
