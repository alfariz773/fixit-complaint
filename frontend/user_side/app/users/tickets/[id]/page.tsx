"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../../../components/Navbar";
import { apiFetch } from "@/lib/api";
import { ATTINGAL_BOUNDS } from "@/lib/attingalmap";
import Link from "next/link";


const MapView = dynamic(
  () => import("../../../components/MapPicker.client"),
  { ssr: false }
);

export default function UserComplaintDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [complaint, setComplaint] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await apiFetch(`/complaints/${id}`);
        setComplaint(data);
      } catch {
        console.error("Failed to load complaint");
      }
    }
    fetchDetails();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    setIsDeleting(true);
    try {
      await apiFetch(`/complaints/${id}`, { method: "DELETE" });
      router.push("/users/dashboard");
    } catch {
      alert("Failed to delete complaint");
      setIsDeleting(false);
    }
  }

  if (!complaint) {
    return (
      <div className="p-20 text-center animate-pulse">
        Loading Report…
      </div>
    );
  }



  const isPendingLike =
    !complaint.status ||
    complaint.status === "open" ||
    complaint.status === "pending" ||
    complaint.status === "unknown";

  const canEditOrDelete = isPendingLike;

  const statusLabel = (status: string | null) => {
    if (!status || status === "open" || status === "pending" || status === "unknown")
      return "Pending";
    if (status === "in-progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    return "Pending";
  };

  const statusBadge = (status: string | null) => {
    if (!status || status === "open" || status === "pending" || status === "unknown")
      return "bg-gray-200 text-gray-800";
    if (status === "in-progress")
      return "bg-yellow-400 text-yellow-900";
    if (status === "resolved")
      return "bg-green-500 text-white";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

         
          <div className="bg-blue-900 p-8 text-white flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{complaint.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${statusBadge(
                    complaint.status
                  )}`}
                >
                  {statusLabel(complaint.status)}
                </span>
              </div>
              <p className="text-blue-200 mt-1">
                Ref ID: #FIX-{complaint.id} • {complaint.category}
              </p>
            </div>

            
            <div className="flex gap-3 items-center">
              {canEditOrDelete ? (
                <>
                  <Link
                    href={`/users/tickets/${id}/edit`}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl font-bold transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-xl font-bold transition disabled:bg-gray-400"
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                </>
              ) : (
                <span className="text-xs italic text-blue-200">
                  Editing disabled after admin action
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
           
            <div className="p-8 space-y-8">
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Description
                </label>
                <p className="text-gray-700 text-lg">
                  {complaint.description}
                </p>
              </div>

              
              {complaint.image && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
                    Attached Evidence
                  </label>
                  <div className="rounded-2xl overflow-hidden border shadow-sm">
                    <img
                      src={`http://127.0.0.1:8000/storage/${complaint.image}`}
                      alt="Complaint Evidence"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

            
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Administration Response
                </label>

                {complaint.admin_note ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-700">
                    {complaint.admin_note}
                  </div>
                ) : isPendingLike ? (
                  <p className="text-gray-400 italic">
                    Waiting for response from municipal administration.
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    No additional note provided by administration.
                  </p>
                )}
              </div>
            </div>

           
            <div className="bg-gray-50 p-8 border-l space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">
                  Incident Location
                </label>

                <div className="h-[350px] rounded-2xl overflow-hidden border">
                  {complaint.lat && complaint.lng && (
                    <MapView
                      center={[complaint.lat, complaint.lng]}
                      bounds={ATTINGAL_BOUNDS}
                      selectedPosition={[complaint.lat, complaint.lng]}
                      onSelect={() => {}}
                    />
                  )}
                </div>
              </div>

              <div className="pt-6 border-t text-sm text-gray-500">
                <p>
                  Submitted on:{" "}
                  {new Date(complaint.created_at).toLocaleDateString("en-IN", {
                    dateStyle: "full",
                  })}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
