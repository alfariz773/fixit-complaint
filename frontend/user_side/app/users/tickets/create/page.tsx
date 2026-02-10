"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Camera,
  MapPin,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { ATTINGAL_CENTER, ATTINGAL_BOUNDS } from "@/lib/attingalmap";

const MapPicker = dynamic(
  () => import("../../../components/MapPicker.client"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <MapPin size={32} className="text-blue-400 animate-bounce mb-2" />
        <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">
          Initializing Attingal Map...
        </span>
      </div>
    ),
  }
);

export default function CreateTicketPage() {
  const router = useRouter();

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      router.push("/auth/login");
      return;
    }

    if (!location) {
      alert("Please select a location on the map.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("lat", location[0].toString());
    formData.append("lng", location[1].toString());

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/complaints`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (response.ok) {
        router.push("/users/dashboard");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <Navbar />

   
      <div className="bg-white border-b border-gray-100 mb-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link
            href="/users/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-blue-900 transition mb-4 font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <h1 className="text-4xl font-black text-blue-950 tracking-tighter italic">
            REPORT AN <span className="text-blue-600">ISSUE</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Provide details to help the municipality take action.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
       
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertCircle size={16} /> Incident Details
              </h2>

              <input
                name="title"
                required
                placeholder="Issue title"
                className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="category"
                required
                className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="Pothole">Pothole</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Garbage">Garbage</option>
                <option value="Drainage">Drainage</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe the issue..."
                className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
              />

            
              <label className="border-2 border-dashed border-gray-200 rounded-2xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                <Camera className="text-gray-300 mb-2" />
                <span className="text-xs text-gray-400 font-bold uppercase truncate">
                  {image ? image.name : "Upload Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                />
              </label>
            </section>
          </div>

         
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-3 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="h-[480px] rounded-[2rem] overflow-hidden">
                <MapPicker
                  center={ATTINGAL_CENTER}
                  bounds={ATTINGAL_BOUNDS}
                  selectedPosition={location}
                  onSelect={setLocation}
                />
              </div>
            </div>

            <button
              disabled={isSubmitting || !location}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${
                isSubmitting
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Report <CheckCircle2 size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
