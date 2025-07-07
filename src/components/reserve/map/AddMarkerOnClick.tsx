"use client";

import { useMapEvents } from 'react-leaflet';
import React from 'react';

interface MarkerType {
  lat: number;
  lng: number;
}

interface AddMarkerOnClickProps {
  setMarker: React.Dispatch<React.SetStateAction<MarkerType | null>>;
}

const AddMarkerOnClick: React.FC<AddMarkerOnClickProps> = ({ setMarker }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });
    },
  });
  return null;
};

export default AddMarkerOnClick; 