import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import ParkMarker from "@/components/ParkMarker";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";

// Component to handle map recenter
const RecenterMapView = ({ bounds }: { bounds: [[number, number], [number, number]] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  
  return null;
};

interface Park {
  id: number;
  name: string;
  total_reviews: number;
  avg_rating: number;
  overall_sentiment: string;
}

interface Review {
  id: number;
  park_id: number;
  username: string;
  rating: number;
  comment: string;
  positive_score: number;
  negative_score: number;
}

const Map = () => {
  const [parks, setParks] = useState<Park[]>([]);
  const [reviews, setReviews] = useState<{ [parkId: number]: Review[] }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  
  useEffect(() => {
    const fetchParksAndReviews = async () => {
      // Fetch parks
      const { data: parksData, error: parksError } = await supabase
        .from('parks')
        .select('*');

      if (parksError) {
        console.error('Error fetching parks:', parksError);
        return;
      }

      setParks(parksData || []);

      // Fetch reviews for each park
      const reviewsData: { [parkId: number]: Review[] } = {};
      for (const park of parksData || []) {
        const { data: parkReviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('park_id', park.id);

        if (reviewsError) {
          console.error(`Error fetching reviews for park ${park.id}:`, reviewsError);
          continue;
        }

        reviewsData[park.id] = parkReviews || [];
      }

      setReviews(reviewsData);
      setMapLoaded(true);
    };

    fetchParksAndReviews();
  }, []);
  
  // Calculate the bounds based on all park positions
  const calculateBounds = (): [[number, number], [number, number]] => {
    if (parks.length === 0) return [[36.1627, -86.7816], [36.1627, -86.7816]];
    
    // Placeholder for park positions - you'll need to add a geographic position column to your parks table
    const positions = [
      [36.11606399096618, -86.71331618629186],
      [36.091231473579406, -86.68602193066967],
      [35.962237683191226, -86.66724451846073]
    ];
    
    const latitudes = positions.map(pos => pos[0]);
    const longitudes = positions.map(pos => pos[1]);
    
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
  };
  
  const bounds = calculateBounds();
  
  // Use the center of Nashville as fallback
  const center: [number, number] = [36.1627, -86.7816];
  
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
              {mapLoaded && parks.length > 0 && (
                <MapContainer 
                  center={center} 
                  zoom={13} 
                  zoomControl={false}
                  className="h-full w-full rounded-md"
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ZoomControl position="bottomright" />
                  <RecenterMapView bounds={bounds} />
                  
                  {parks.map((park) => (
                    <ParkMarker 
                      key={park.id} 
                      park={{
                        id: park.id.toString(),
                        name: park.name,
                        position: [0, 0], // TODO: Add geographic position to parks table
                        description: '', // TODO: Add description to parks table
                        reviews: (reviews[park.id] || []).map(review => ({
                          text: review.comment,
                          sentiment: review.rating / 5 * 2 - 1, // Convert 1-5 rating to -1 to 1 sentiment
                          keywords: []
                        }))
                      }} 
                    />
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
