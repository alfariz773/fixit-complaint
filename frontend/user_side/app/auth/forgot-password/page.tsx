"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await apiFetch("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
        <p className="text-gray-500 text-sm mt-1">Account Recovery Service</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-900 to-blue-600" />
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
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
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none bg-gray-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center"
          >
            {isLoading ? "Sending link..." : "Send Reset Link"}
          </button>

          <div className="pt-4 border-t border-gray-100 text-center">
            <Link 
              href="/auth/login" 
              className="text-blue-600 text-sm font-bold hover:underline flex items-center justify-center gap-2"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>

      <p className="mt-8 text-gray-400 text-xs text-center">
        If you don't receive an email within 5 minutes, check your spam folder.
      </p>
    </main>
  );
}