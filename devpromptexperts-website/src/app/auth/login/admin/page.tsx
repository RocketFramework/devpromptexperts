"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGoogle, FaFacebook, FaLinkedin, FaUserShield } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const adminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  await signIn("credentials", {
    username,
    password,
    callbackUrl: "/admin",
  })
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <div className="border-t border-gray-300 my-4"></div>

        {/* Admin Credentials */}
        <form onSubmit={adminLogin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
          >
            <FaUserShield /> Admin Login
          </button>
        </form>
      </div>
    </div>
  );
}
