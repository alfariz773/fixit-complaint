"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { apiFetch } from "@/lib/api";

type Complaint = {
  id: number;
  title: string;
  status: string; 
  category: string;
  created_at: string;
};

export default function UserDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  async function fetchComplaints(query = "", pageNum = 1) {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/complaints?search=${query}&page=${pageNum}`
      );

      setComplaints(res?.data ?? []);
      setLastPage(res?.last_page ?? 1);
    } catch (err: any) {
      if (err.message?.includes("401")) {
        window.location.href = "/login";
        return;
      }
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints(search, page);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchComplaints(search, 1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white pt-10 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              मेरो उजुरीहरू (My Complaints)
            </h1>
            <p className="text-blue-100 mt-1 opacity-80">
              Track and manage your reported municipal issues.
            </p>
          </div>

          <Link
            href="/users/tickets/create"
            className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition"
          >
            + Create Complaint
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 -mt-10">
        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="flex gap-3 mb-8 bg-white p-3 rounded-2xl shadow border"
        >
          <input
            type="text"
            placeholder="Search by title or category..."
            className="flex-1 px-4 py-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">
            Search
          </button>
        </form>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="p-5 border-b bg-gray-50 flex justify-between">
            <h2 className="font-bold">Recent Activity</h2>
            <span className="text-xs font-bold text-gray-400 uppercase">
              Page {page} of {lastPage}
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center">Loading…</div>
          ) : complaints.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              No complaints found.
            </div>
          ) : (
            <div className="divide-y">
              {complaints.map((c) => (
                <Link
                  key={c.id}
                  href={`/users/tickets/${c.id}`}
                  className="p-5 flex justify-between items-center hover:bg-blue-50"
                >
                  <div>
                    <p className="font-bold">{c.title}</p>
                    <div className="text-sm text-gray-500 flex gap-2">
                      <span className="bg-gray-100 px-2 rounded text-xs">
                        {c.category}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1 text-xs font-bold rounded-full border ${getStatusStyles(
                      c.status
                    )}`}
                  >
                    {getStatusLabel(c.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

      
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page === lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}



function getStatusLabel(status: string) {
  if (status === "pending") return "Pending";
  if (status === "in-progress") return "In Progress";
  if (status === "resolved") return "Resolved";
  return "Pending";
}

function getStatusStyles(status: string) {
  if (status === "pending")
    return "bg-gray-50 text-gray-700 border-gray-200";
  if (status === "in-progress")
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (status === "resolved")
    return "bg-green-50 text-green-700 border-green-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}
