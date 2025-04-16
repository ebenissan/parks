
import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { parks } from "@/data/parksData";
import ParkMarker from "@/components/ParkMarker";
import ParkDetailsDialog from "@/components/ParkDetailsDialog";
import "leaflet/dist/leaflet.css";
import { useIsMobile } from "@/hooks/use-mobile";

// Center of Mill Creek area
const MILL_CREEK_CENTER: [number, number] = [36.0965, -86.7162];
const ZOOM_LEVEL = 13;

interface MapCenterAnimatorProps {
  center: [number, number];
  zoom: number;
  selectedParkId: string | null;
}

const MapCenterAnimator = ({ center, zoom, selectedParkId }: MapCenterAnimatorProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedParkId) {
      const park = parks.find(p => p.id === selectedParkId);
      if (park) {
        map.flyTo(park.position, zoom + 1, {
          duration: 1
        });
      }
    } else {
      map.flyTo(center, zoom, {
        duration: 1
      });
    }
  }, [selectedParkId, center, zoom, map]);
  
  return null;
};

const Map = () => {
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Fix the TypeScript error by removing the parameter from the function
  const handleMapReady = useCallback(() => {
    // Add any map initialization code here if needed
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        <MapContainer 
          center={MILL_CREEK_CENTER} 
          zoom={ZOOM_LEVEL} 
          style={{ height: "100%", width: "100%" }}
          whenReady={handleMapReady}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapCenterAnimator 
            center={MILL_CREEK_CENTER}
            zoom={ZOOM_LEVEL}
            selectedParkId={selectedParkId}
          />
          
          {parks.map(park => (
            <ParkMarker
              key={park.id}
              park={park}
              onClick={() => setSelectedParkId(park.id)}
            />
          ))}
        </MapContainer>
        
        <ParkDetailsDialog
          park={parks.find(p => p.id === selectedParkId) || parks[0]}
          isOpen={!!selectedParkId}
          onClose={() => setSelectedParkId(null)}
        />
      </div>
    </div>
  );
};

export default Map;
