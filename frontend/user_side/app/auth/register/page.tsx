"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
     
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Fixit <span className="text-blue-600 font-light">Municipal</span></h1>
        <p className="text-gray-500 text-sm mt-1">Citizen Registration Portal</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-900 to-blue-600" />
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>
          
          {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          <input name="name" type="text" placeholder="Full Name" required className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="email" type="email" placeholder="Email Address" required className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
          
          <div className="grid grid-cols-2 gap-4">
            <input name="password" type="password" placeholder="Password" required className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="password_confirmation" type="password" placeholder="Confirm" required className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transition-all">
            Register Now
          </button>

          <p className="text-center text-sm text-gray-600 pt-4 border-t">
            Already have an account? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </main>
  );
}