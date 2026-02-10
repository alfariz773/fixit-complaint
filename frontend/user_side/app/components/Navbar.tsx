"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  User 
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }

  const navLinks = [
    { label: "Dashboard", href: "/users/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Report Issue", href: "/users/tickets/create", icon: <PlusCircle size={18} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link href="/users/dashboard" className="flex items-center gap-2 group">
          <div className="bg-blue-900 p-1.5 rounded-lg text-yellow-400 transition-transform group-hover:rotate-12">
            <ShieldCheck size={20} />
          </div>
          <span className="text-lg font-black tracking-tighter italic uppercase text-blue-950">
            ATTINGAL <span className="text-blue-600">FIXIT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? "bg-white text-blue-900 shadow-sm" 
                    : "text-gray-400 hover:text-blue-900"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-blue-900 transition md:hidden">
            <LayoutDashboard size={24} />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all active:scale-95"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
}