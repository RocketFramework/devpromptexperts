"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGoogle, FaFacebook, FaLinkedin, FaArrowRight, FaShekelSign } from "react-icons/fa";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string, callbackUrl: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setIsLoading(null);
    }
  };

  const oauthProviders = [
    {
      id: "google",
      name: "Google",
      icon: FaGoogle,
      color: "bg-white",
      textColor: "text-gray-700",
      hoverColor: "hover:bg-gray-50",
      borderColor: "border border-gray-300",
      callbackUrl: "/customer"
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-[#1877F2]",
      textColor: "text-white",
      hoverColor: "hover:bg-[#166FE5]",
      borderColor: "",
      callbackUrl: "/customer"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "bg-[#0A66C2]",
      textColor: "text-white",
      hoverColor: "hover:bg-[#004182]",
      borderColor: "",
      callbackUrl: "/customer"
    }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaShekelSign className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to your account
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-4 mb-6">
          {oauthProviders.map((provider) => {
            const Icon = provider.icon;
            return (
              <button
                key={provider.id}
                onClick={() => handleSignIn(provider.id, provider.callbackUrl)}
                disabled={isLoading !== null}
                className={`w-full flex items-center justify-center gap-4 ${provider.color} ${provider.textColor} ${provider.hoverColor} ${provider.borderColor} py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md group`}
              >
                {isLoading === provider.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Icon className="text-xl flex-shrink-0" />
                    <span className="font-semibold text-base flex-1 text-left">
                      Continue with {provider.name}
                    </span>
                    <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">Secure Authentication</span>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Bank-level security encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Your data is protected and private</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No password required with OAuth</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="fixed top-1/2 right-1/3 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-30 -z-10"></div>
    </div>
  );
}