"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Users, 
  UserX, 
  UserCheck, 
  Mail, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await apiFetch(`/admin/users?search=${search}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tighter italic uppercase">
            Citizen <span className="text-blue-600">Database</span>
          </h1>
          <p className="text-gray-500 font-medium">Manage registered accounts and portal access for Attingal.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Users className="text-blue-600" size={20} />
          <span className="font-black text-blue-950 text-sm">{users.length} Total Users</span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-blue-500 transition font-medium"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Info</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">View Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6 h-20 bg-gray-50/20"></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldAlert size={48} strokeWidth={1} className="text-gray-200" />
                    <p className="font-bold uppercase tracking-widest text-xs">No matching citizens found</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-blue-950 group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <Mail size={14} className="text-gray-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.status === "blocked"
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}>
                      {user.status === "blocked" ? <UserX size={12} /> : <UserCheck size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 hover:text-white transition shadow-sm"
                    >
                      Profile <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}