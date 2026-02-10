"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout request failed");
    } finally {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/admin_dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Complaints", href: "/admin/complaints", icon: <ClipboardList size={20} /> },
    { label: "Users", href: "/admin/users", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col justify-between h-screen sticky top-0 shadow-sm">
      <div className="p-8">
       
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-900 p-2 rounded-xl text-yellow-400">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter italic uppercase text-blue-950">
            ADMIN <span className="text-blue-600">FIXIT</span>
          </span>
        </div>

       
        <nav className="space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-900 text-white shadow-lg shadow-blue-900/20" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-blue-950"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>


      <div className="p-8">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 group shadow-sm active:scale-[0.98]"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Logout Account
        </button>
        <p className="text-[10px] text-center text-gray-300 font-bold uppercase tracking-widest mt-6 italic">
          v1.0 • Attingal Municipality
        </p>
      </div>
    </aside>
  );
}