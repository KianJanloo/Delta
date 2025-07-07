'use client';

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { customIcon } from "@/utils/helper/map/MapIcon";
import AddMarkerOnClick from "./AddMarkerOnClick";
import { MarkerType } from "../content/ReserveContent";
import { X } from "lucide-react";

interface ReserveMapProps {
  location?: MarkerType;
  marker?: MarkerType | null;
  setMarker?: React.Dispatch<React.SetStateAction<MarkerType | null>>;
}

const ReserveMap: React.FC<ReserveMapProps> = ({ location, marker, setMarker }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const checkDark = () => document.documentElement.classList.contains('dark');
      setIsDark(checkDark());

      const observer = new MutationObserver(() => {
        setIsDark(checkDark());
      });
      observer.observe(document.documentElement, { attributes: true });

      return () => observer.disconnect();
    }
  }, []);

  if (!isMounted) return null;

  const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const mapCenter: [number, number] = location
    ? [location.lat, location.lng]
    : marker
      ? [marker.lat, marker.lng]
      : [35.6892, 51.3890];

  return (
    <MapContainer
      style={{ height: '100%', width: '100%', borderRadius: '40px' }}
      center={mapCenter}
      zoom={13}
    >
      <TileLayer
        key={isDark ? 'dark' : 'light'}
        url={isDark ? darkTiles : lightTiles}
        attribution="&copy; OpenStreetMap contributors"
      />

      {!location && setMarker && <AddMarkerOnClick setMarker={setMarker} />}

      {location && (
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            موقعیت: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </Popup>
        </Marker>
      )}

      {marker && (
        <Marker position={[marker.lat, marker.lng]} icon={customIcon}>
          <Popup>
            موقعیت: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
          </Popup>
        </Marker>
      )}

      {marker && setMarker && (
        <button
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
          className="bg-danger"
          onClick={() => setMarker(null)}
        >
          <X size={20} className="" />
        </button>
      )}

    </MapContainer>
  );
};

export default ReserveMap;
