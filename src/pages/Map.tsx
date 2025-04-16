
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import ParkMarker from "@/components/ParkMarker";
import { Park, parks } from "@/data/parksData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";

// Component to handle map recenter
const RecenterMapView = ({ bounds }: { bounds: [[number, number], [number, number]] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds);
    }
  }, [map, bounds]);
  
  return null;
};

// Creating a client-side only component to handle Leaflet
const MapComponent = ({ 
  bounds, 
  parks 
}: { 
  bounds: [[number, number], [number, number]];
  parks: Park[];
}) => {
  // Use the center of Nashville as fallback
  const center: [number, number] = [36.1627, -86.7816];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      zoomControl={false}
      className="h-full w-full rounded-md"
      whenReady={(mapInstance: any) => {
        // Add click handler to reset view
        mapInstance.target.on('click', () => {
          mapInstance.target.fitBounds(bounds);
        });
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <RecenterMapView bounds={bounds} />
      
      {parks.map((park: Park) => (
        <ParkMarker key={park.id} park={park} />
      ))}
    </MapContainer>
  );
};

const Map = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // This ensures the map loads only on the client side
    setMapLoaded(true);
  }, []);
  
  // Calculate the bounds based on all park positions
  const bounds = useMemo((): [[number, number], [number, number]] => {
    if (parks.length === 0) return [[36.1627, -86.7816], [36.1627, -86.7816]];
    
    const latitudes = parks.map(park => park.position[0]);
    const longitudes = parks.map(park => park.position[1]);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    // Add some padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;
    
    return [
      [minLat - latPadding, minLng - lngPadding],
      [maxLat + latPadding, maxLng + lngPadding]
    ] as [[number, number], [number, number]];
  }, []);
  
  return (
    <div className="min-h-screen bg-nature-cream flex flex-col">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-nature-green-dark mb-2">Nashville Parks Map</h1>
          <p className="text-lg text-muted-foreground">
            Explore local parks and their community sentiment
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Map Legend */}
          <div className="md:col-span-1 order-2 md:order-1">
            <Card className="sticky top-24 border-nature-green-dark/20">
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10">
                <CardTitle className="text-xl text-nature-green-dark">Map Legend</CardTitle>
                <CardDescription>Understanding the sentiment colors</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#8CB369] mr-3"></div>
                    <span>Very Positive Sentiment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#F4D35E] mr-3"></div>
                    <span>Positive Sentiment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#A4937C] mr-3"></div>
                    <span>Neutral Sentiment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#F78C6B] mr-3"></div>
                    <span>Negative Sentiment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#E56B6F] mr-3"></div>
                    <span>Very Negative Sentiment</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">How to use this map:</h4>
                  <ul className="text-sm space-y-2">
                    <li>• Click on a park marker to see details</li>
                    <li>• Colors indicate overall sentiment</li>
                    <li>• Zoom in/out to explore different areas</li>
                    <li>• View detailed sentiment analysis for each park</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Map */}
          <div className="md:col-span-3 order-1 md:order-2">
            <div className="bg-white p-1 rounded-lg shadow-md border border-nature-green-dark/20 h-[70vh]">
              {mapLoaded ? (
                <MapComponent bounds={bounds} parks={parks} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Loading map...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
