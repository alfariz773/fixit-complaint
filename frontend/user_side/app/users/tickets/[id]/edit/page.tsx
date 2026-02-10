"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../../../../components/Navbar";
import { ATTINGAL_CENTER, ATTINGAL_BOUNDS } from "@/lib/attingalmap";
import { apiFetch } from "@/lib/api";


const MapPicker = dynamic(
  () => import("../../../../components/MapPicker.client"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
        <span className="text-gray-400 font-medium text-sm">
          Loading Attingal Map...
        </span>
      </div>
    ),
  }
);

export default function EditComplaintPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [complaint, setComplaint] = useState<any>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);



  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiFetch(`/complaints/${id}`);

      
        const editable =
          !data.status ||
          data.status === "open" ||
          data.status === "pending" ||
          data.status === "unknown";

        if (!editable) {
          alert("This complaint can no longer be edited.");
          router.replace(`/users/tickets/${id}`);
          return;
        }

        setComplaint(data);

        if (data.lat && data.lng) {
          setLocation([Number(data.lat), Number(data.lng)]);
        }
      } catch (err) {
        console.error("Could not load complaint data", err);
        alert("Failed to load complaint.");
        router.replace("/users/dashboard");
      }
    }

    if (id) loadData();
  }, [id, router]);



  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);

    if (location) {
      formData.append("lat", location[0].toString());
      formData.append("lng", location[1].toString());
    }

    if (image) {
      formData.append("image", image);
    }

    // Laravel PUT with files
    formData.append("_method", "PUT");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/complaints/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      router.push(`/users/tickets/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  
  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900" />
      </div>
    );
  }

  

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Edit Complaint
          </h1>
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Cancel
          </button>
        </div>

        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-xl border"
        >
          {/* LEFT */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Complaint Title
              </label>
              <input
                name="title"
                required
                defaultValue={complaint.title}
                className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Category
              </label>
              <select
                name="category"
                required
                defaultValue={complaint.category}
                className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pothole">Pothole</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Garbage">Garbage</option>
                <option value="Drainage">Drainage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={5}
                required
                defaultValue={complaint.description}
                className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Update Photo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
              />
            </div>
          </div>

        
          <div className="flex flex-col">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Adjust Pin Location
            </label>

            <div className="flex-1 min-h-[350px] rounded-2xl overflow-hidden border">
              <MapPicker
                center={location || ATTINGAL_CENTER}
                bounds={ATTINGAL_BOUNDS}
                selectedPosition={location}
                onSelect={setLocation}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                type="button"
                onClick={() =>
                  router.push(`/users/tickets/${id}`)
                }
                className="bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-900 text-white font-bold py-4 rounded-2xl disabled:bg-gray-400"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
