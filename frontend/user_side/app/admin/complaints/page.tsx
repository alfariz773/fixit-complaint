"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Inbox,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Complaint = {
  id: number;
  title: string;
  status: "pending" | "in-progress" | "resolved";
  category: string;
  created_at: string;
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  async function fetchComplaints(pageNum = 1) {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (category) params.append("category", category);
    params.append("page", pageNum.toString());

    try {
      const res = await apiFetch(`/admin/complaints?${params.toString()}`);
      setComplaints(res.data);
      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints(1);
  }, [search, status, category]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tighter italic uppercase">
            Complaint <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-gray-500 font-medium">Review and track all municipal reports in Attingal.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition font-medium"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition font-bold text-xs uppercase appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-6 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition font-bold text-xs uppercase appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Garbage">Garbage</option>
            <option value="Drainage">Drainage</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Complaint Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6 h-20 bg-gray-50/30"></td>
                </tr>
              ))
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <Inbox size={48} strokeWidth={1} />
                    <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-blue-950 group-hover:text-blue-600 transition-colors">{c.title}</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Ticket ID: #{c.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tighter">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/tickets/${c.id}`}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 hover:text-white transition shadow-sm"
                    >
                      Manage <MoreHorizontal size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {!loading && lastPage > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white px-8 py-4 rounded-3xl shadow-sm border border-gray-100">
          <button
            disabled={page === 1}
            onClick={() => fetchComplaints(page - 1)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-900 disabled:opacity-30 transition"
          >
            <ChevronLeft size={18} /> Prev
          </button>

          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
              {page}
            </span>
            <span className="text-gray-300 font-bold">/</span>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{lastPage} Pages</span>
          </div>

          <button
            disabled={page === lastPage}
            onClick={() => fetchComplaints(page + 1)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-900 disabled:opacity-30 transition"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "in-progress" | "resolved" }) {
  const config = {
    pending: "bg-slate-100 text-slate-500",
    "in-progress": "bg-yellow-100 text-yellow-600",
    resolved: "bg-green-100 text-green-600",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${config[status]}`}>
      {status === "in-progress" ? "Ongoing" : status}
    </span>
  );
}