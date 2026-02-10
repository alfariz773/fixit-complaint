"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const isNewUser = searchParams.get("registered");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(body),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      
      window.location.href = data.user.role === "admin" ? "/admin/admin_dashboard" : "/users/dashboard";
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Fixit <span className="text-blue-600 font-light">Municipal</span></h1>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-900 to-blue-600" />
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Sign In</h2>

          {isNewUser && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium text-center">Account created! Please login.</p>}
          {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">{error}</p>}

          <div className="space-y-4">
            <input name="email" type="email" placeholder="Email Address" required className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="password" type="password" placeholder="Password" required className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transition-all">
            Login
          </button>

          <div className="flex justify-between text-sm pt-4 border-t">
            <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
            <Link href="/auth/forgot-password" title="Recover Password" className="text-gray-500 hover:underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}