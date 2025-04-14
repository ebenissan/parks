
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Park, calculateAverageSentiment, getSentimentColor, getSentimentDescription } from "@/data/parksData";
import SentimentChart from "./SentimentChart";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for leaflet icons in production environments
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ParkMarkerProps {
  park: Park;
}

const ParkMarker = ({ park }: ParkMarkerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const avgSentiment = calculateAverageSentiment(park.reviews);
  const sentimentColor = getSentimentColor(avgSentiment);
  const sentimentText = getSentimentDescription(avgSentiment);
  
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${sentimentColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker 
      position={park.position} 
      icon={customIcon}
      eventHandlers={{
        click: () => {
          setIsOpen(true);
        },
      }}
    >
      <Popup className="leaf-popup" maxWidth={300} minWidth={200}>
        <Card className="border-none shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-nature-green-dark">{park.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm mb-2">{park.description}</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Community Sentiment:</span>
              <span className="text-xs font-medium" style={{ color: sentimentColor }}>{sentimentText}</span>
            </div>
            <div className="h-24 w-full">
              <SentimentChart reviews={park.reviews} />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs border-nature-green-dark text-nature-green-dark hover:bg-nature-green-light/20"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </Popup>
    </Marker>
  );
};

export default ParkMarker;
