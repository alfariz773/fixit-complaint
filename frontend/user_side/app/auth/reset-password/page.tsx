"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    const e = searchParams.get("email");
    if (t) setToken(t);
    if (e) setEmail(e);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await apiFetch("/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: confirm,
        }),
      });

      setMessage(res.message || "Password reset successful! Redirecting...");
      
      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may be expired.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
          Fixit <span className="text-blue-600 font-light">Municipal</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Secure Credential Update</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-900 to-blue-600" />
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
            <p className="text-sm text-gray-500 mt-1">Create a strong password for your account</p>
          </div>

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-pulse">
              <p className="text-sm text-green-700 font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Account Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-200 px-4 py-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none bg-gray-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!message}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}

// Next.js requires Suspense for useSearchParams in static rendering
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}