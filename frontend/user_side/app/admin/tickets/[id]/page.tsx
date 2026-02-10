"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  FileText,
  MessageSquare,
  Save,
  Camera,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const AdminMap = dynamic(
  () => import("../../../components/Adminmap"),
  { ssr: false }
);

type Complaint = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved";
  admin_note?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  image?: string | null; 
  created_at?: string;
};

export default function AdminComplaintDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState<Complaint["status"]>("pending");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadComplaint() {
      try {
        const data = await apiFetch(`/admin/complaints/${id}`);
        setComplaint(data);
        setStatus(data.status);
        setAdminNote(data.admin_note || "");
      } catch {
        router.push("/admin/complaints");
      }
    }
    loadComplaint();
  }, [id, router]);

  async function handleUpdate() {
    if (status === "resolved" && adminNote.trim() === "") {
      alert("Admin note is required when resolving a complaint.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch(`/admin/complaints/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          admin_note: adminNote,
        }),
      });
      router.push("/admin/complaints");
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-blue-900 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}>
              <ArrowLeft />
            </button>
            <h1 className="font-black text-blue-900">
              Ticket #{complaint.id}
            </h1>
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-blue-900 text-white px-6 py-2 rounded-xl font-bold"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <Tag size={14} /> {complaint.category}
              <span>•</span>
              <Calendar size={14} />
              {new Date(complaint.created_at || "").toLocaleDateString()}
            </div>

            <h2 className="text-2xl font-black mb-4">
              {complaint.title}
            </h2>

            <p className="text-gray-600 mb-6">
              {complaint.description}
            </p>

            {/* ✅ FIXED IMAGE SECTION */}
            <div>
              <h3 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                <Camera size={14} /> Evidence Photo
              </h3>

              {complaint.image ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${complaint.image}`}
                  alt="Evidence"
                  className="rounded-2xl border w-full max-h-[400px] object-cover"
                />
              ) : (
                <div className="border-2 border-dashed rounded-2xl p-10 text-center text-gray-400">
                  No photo attached
                </div>
              )}
            </div>
          </section>

          {/* ADMIN ACTION */}
          <section className="bg-white p-8 rounded-3xl border">
            <label className="text-xs font-black uppercase block mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Complaint["status"])
              }
              className="w-full p-3 border rounded-xl mb-6"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <label className="text-xs font-black uppercase block mb-2">
              Admin Note
            </label>

            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
              className="w-full p-4 border rounded-xl"
              placeholder="Internal note..."
            />
          </section>
        </div>

        {/* RIGHT MAP */}
        <div className="bg-white p-4 rounded-3xl border h-[500px]">
          {complaint.lat && complaint.lng ? (
            <AdminMap
              lat={Number(complaint.lat)}
              lng={Number(complaint.lng)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No location provided
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
