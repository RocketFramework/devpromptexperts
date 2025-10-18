"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const callbackUrl = "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      return;
    }

    if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow-md w-full max-w-sm"
    >
      <h1 className="mb-4 text-2xl font-semibold text-center">Admin Login</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </form>
  );
}
