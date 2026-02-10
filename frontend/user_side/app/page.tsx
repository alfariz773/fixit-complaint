

import Link from "next/link";
import { 
  MapPin, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Construction, 
  Lightbulb, 
  Trash2 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-blue-950 selection:bg-yellow-200">
      
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-900 p-2 rounded-lg">
            <ShieldCheck className="text-yellow-400" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter italic">
            ATTINGAL <span className="text-blue-600">FIXIT</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-gray-500">
          <a href="#features" className="hover:text-blue-900 transition">How it works</a>
          <a href="#services" className="hover:text-blue-900 transition">Services</a>
        </div>
        <Link 
          href="/auth/login" 
          className="bg-blue-50 text-blue-900 px-6 py-2.5 rounded-full font-bold hover:bg-blue-100 transition"
        >
          Portal Login
        </Link>
      </nav>

      
      <header className="relative px-6 pt-16 pb-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <MapPin size={14} /> Official Municipality Portal
          </div>
          <h1 className="text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter">
            Better Streets. <br />
            <span className="text-blue-600 font-outline-2">Faster Fixes.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md font-medium leading-relaxed">
            Empowering Attingal citizens to report potholes, failed streetlights, and garbage issues directly to the municipal council.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/auth/register" 
              className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-center shadow-2xl shadow-blue-900/20 hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              Start Reporting <ArrowRight size={20} />
            </Link>
            <Link 
              href="/auth/login" 
              className="border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-center hover:bg-gray-50 transition"
            >
              Track Complaint
            </Link>
          </div>
        </div>

       
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 opacity-10"></div>
          <div className="relative bg-gray-50 border border-gray-100 rounded-[3rem] p-8 shadow-2xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
             </div>
             <div className="space-y-4">
                <div className="h-8 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-32 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="h-48 w-full bg-blue-100 rounded-2xl flex items-center justify-center">
                   <MapPin className="text-blue-600 animate-bounce" size={48} />
                </div>
             </div>
          </div>
        </div>
      </header>

     
      <section id="features" className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-black tracking-tight mb-4">Reportable Issues</h2>
          <p className="text-gray-500 font-medium">Select a category and let us handle the rest.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Construction className="text-orange-500" />} 
            title="Road Damage" 
            desc="Report potholes, cracks, or illegal road blocks instantly."
          />
          <FeatureCard 
            icon={<Lightbulb className="text-yellow-500" />} 
            title="Streetlights" 
            desc="Ensure safety by reporting dark spots and broken lamps."
          />
          <FeatureCard 
            icon={<Trash2 className="text-green-500" />} 
            title="Sanitation" 
            desc="Help keep Attingal clean by reporting garbage pile-ups."
          />
        </div>
      </section>

     
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
          &copy; 2026 Attingal Municipality • Built with FixIt
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}