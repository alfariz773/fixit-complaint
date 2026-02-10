"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  center: [number, number];
  bounds: [[number, number], [number, number]];
  selectedPosition: [number, number] | null;
  onSelect: (pos: [number, number]) => void;
};

function ClickHandler({ onSelect }: { onSelect: Props["onSelect"] }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapPicker({
  center,
  bounds,
  selectedPosition,
  onSelect,
}: Props) {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border">
      <MapContainer
        center={center}
        zoom={14}
        className="h-full w-full"
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickHandler onSelect={onSelect} />

        {selectedPosition && <Marker position={selectedPosition} />}
      </MapContainer>
    </div>
  );
}
