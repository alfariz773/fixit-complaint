"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  UserCheck, 
  UserX, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  Activity
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function loadUser() {
    try {
      const data = await apiFetch(`/admin/users/${id}`);
      setUser(data);
    } catch (err) {
      alert("Failed to load user");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  }

  async function toggleBlock() {
    const newStatus = user.status === "active" ? "blocked" : "active";
    if (!confirm(`Are you sure you want to ${newStatus} this user?`)) return;

    setUpdating(true);
    try {
      await apiFetch(`/admin/users/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      loadUser();
    } catch (err) {
      alert("Failed to update user status");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="h-12 w-12 border-4 border-blue-900 border-t-yellow-400 rounded-full animate-spin" />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Citizen Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 mb-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-blue-900 transition mb-4 font-bold text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Users
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-[2rem] bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-black text-blue-950 tracking-tighter italic uppercase">
                  {user.name}
                </h1>
                <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                  <Mail size={16} className="text-gray-300" /> {user.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleBlock}
              disabled={updating}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center gap-2 ${
                user.status === "blocked"
                  ? "bg-green-500 text-white shadow-green-500/20 hover:bg-green-600"
                  : "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600"
              }`}
            >
              {updating ? "Updating..." : (
                <>
                  {user.status === "blocked" ? <UserCheck size={18} /> : <UserX size={18} />}
                  {user.status === "blocked" ? "Restore Access" : "Restrict Account"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Account Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6">Account Verification</h2>
            <div className="space-y-4">
               <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-sm font-bold text-gray-400">Status</span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.status === "blocked" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                  }`}>
                    {user.status}
                  </span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-sm font-bold text-gray-400">Total Reports</span>
                  <span className="text-sm font-black text-blue-950">{user.complaints.length}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">Joined</span>
                  <span className="text-sm font-black text-blue-950 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-300" /> Feb 2026
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Right: History of Complaints */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ml-4">
            <FileText size={16} /> Submission History
          </h2>

          <div className="space-y-4">
            {user.complaints.length === 0 ? (
              <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                <ShieldAlert size={48} className="mx-auto text-gray-100 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No historical data found</p>
              </div>
            ) : (
              user.complaints.map((c: any) => (
                <Link 
                  key={c.id} 
                  href={`/admin/tickets/${c.id}`}
                  className="block bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                       <div className={`p-3 rounded-2xl ${getStatusColor(c.status)}`}>
                          <StatusIcon status={c.status} />
                       </div>
                       <div>
                          <p className="font-black text-blue-950 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {c.title}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {c.category} • ID: #{c.id}
                          </p>
                       </div>
                    </div>
                    <ChevronRight className="text-gray-200 group-hover:text-blue-900 transition-colors" size={24} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helpers for visual consistency */
function StatusIcon({ status }: { status: string }) {
  if (status === "pending") return <Clock size={18} />;
  if (status === "in-progress") return <Activity size={18} />;
  return <CheckCircle2 size={18} />;
}

function getStatusColor(status: string) {
  if (status === "pending") return "bg-slate-50 text-slate-400";
  if (status === "in-progress") return "bg-yellow-50 text-yellow-600";
  return "bg-green-50 text-green-600";
}