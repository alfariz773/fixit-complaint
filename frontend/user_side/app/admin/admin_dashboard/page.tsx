"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { LayoutDashboard, Activity, CheckCircle2, Clock, FileText } from "lucide-react";

type DashboardStats = {
  total_complaints: number;
  pending_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  complaints_by_status: {
    pending: number;
    "in-progress": number;
    resolved: number;
  };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const chartData = [
    { name: "Pending", value: stats?.complaints_by_status.pending ?? 0, color: "#94a3b8" },
    { name: "In Progress", value: stats?.complaints_by_status["in-progress"] ?? 0, color: "#facc15" },
    { name: "Resolved", value: stats?.complaints_by_status.resolved ?? 0, color: "#22c55e" },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      {/* HEADER Section */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-900 p-2 rounded-lg text-yellow-400">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tighter italic uppercase">
            Admin <span className="text-blue-600">Dashboard</span>
          </h1>
        </div>
        <p className="text-gray-500 font-medium ml-1">Real-time municipal oversight for Attingal.</p>
      </header>

      {/* STAT CARDS - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Reports" 
          value={stats?.total_complaints} 
          loading={loading} 
          icon={<FileText size={20} />} 
          color="border-blue-500" 
        />
        <StatCard 
          title="Pending" 
          value={stats?.pending_complaints} 
          loading={loading} 
          icon={<Clock size={20} />} 
          color="border-slate-400" 
        />
        <StatCard 
          title="In Progress" 
          value={stats?.in_progress_complaints} 
          loading={loading} 
          icon={<Activity size={20} />} 
          color="border-yellow-400" 
        />
        <StatCard 
          title="Resolved" 
          value={stats?.resolved_complaints} 
          loading={loading} 
          icon={<CheckCircle2 size={20} />} 
          color="border-green-500" 
        />
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* PIE CHART CARD */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-blue-950 mb-8 uppercase tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
            Status Distribution
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={8}
                >
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART CARD */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-blue-950 mb-8 uppercase tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Progress Overview
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  loading,
  icon,
  color,
}: {
  title: string;
  value?: number;
  loading: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border-b-8 ${color} transition-all hover:-translate-y-1 hover:shadow-md group`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
        <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="h-10 bg-gray-50 animate-pulse rounded-xl" />
      ) : (
        <p className="text-4xl font-black text-blue-950 tracking-tighter">{value || 0}</p>
      )}
    </div>
  );
}