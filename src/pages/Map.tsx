
import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { parks } from "@/data/parksData";
import ParkMarker from "@/components/ParkMarker";
import ParkDetailsDialog from "@/components/ParkDetailsDialog";
import "leaflet/dist/leaflet.css";
import { useIsMobile } from "@/hooks/use-mobile";

// Fix Leaflet icon issue
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon issue which is a common problem with Leaflet in React
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  
  const handleMapReady = useCallback(() => {
    // Add any map initialization code here if needed
    console.log("Map is ready");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative" style={{ height: "100vh" }}>
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
              onSelect={() => setSelectedParkId(park.id)}
            />
          ))}
        </MapContainer>
        
        {selectedParkId && (
          <ParkDetailsDialog
            park={parks.find(p => p.id === selectedParkId) || parks[0]}
            isOpen={!!selectedParkId}
            onClose={() => setSelectedParkId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Map;
