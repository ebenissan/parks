import { useEffect, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MillCreekIntroPage = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-nature-cream flex flex-col">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Card className="md:col-span-1">
            <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10">
              <CardTitle className="text-2xl text-nature-green-dark flex items-center gap-2">
                <MapPin className="h-6 w-6" /> Who Lives in Mill Creek?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-lg text-muted-foreground pb-6">
              <p className="mb-4">
                Before we see who lives in Mill Creek, it might be useful for us to ask:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Where do different racial and income groups live?</li>
                <li>Who is most/least vulnerable to environmental injustices?</li>
                <li>How do these patterns relate to the Mill Creek watershed?</li>
                <li>What trends stand out, and are they fair?</li>
                <li>Who bears the most burden in the watershed?</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10">
              <CardTitle className="text-2xl text-nature-green-dark flex items-center gap-2">
                <ExternalLink className="h-6 w-6" /> Mill Creek Map
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-white p-1 rounded-lg shadow-md border border-nature-green-dark/20 h-[70vh]">
                {iframeLoaded ? (
                  <iframe
                    src="https://vanderbilt.maps.arcgis.com/apps/mapviewer/index.html?webmap=c29464ec292340e4bf8aaee3a540d369"
                    className="w-full h-full border rounded-md shadow"
                    title="Mill Creek Map"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading map...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MillCreekIntroPage;