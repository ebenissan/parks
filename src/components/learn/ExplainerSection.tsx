
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SentimentExplainer from "@/components/SentimentExplainer";
import SentimentChart from "@/components/SentimentChart";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { parks } from "@/data/parksData";

interface ExplainerSectionProps {
  onGoToActivity: () => void;
}

const ExplainerSection: React.FC<ExplainerSectionProps> = ({ onGoToActivity }) => {
  // Combine all reviews for a comprehensive example
  const allReviews = parks.flatMap(park => park.reviews);

  return (
    <div className="mb-10">
      <SentimentExplainer />
      
      <Card className="border-nature-green-dark/20 shadow-lg mt-6">
        <CardContent className="pt-6">
          <h3 className="text-xl font-medium mb-4 text-nature-green-dark">Example: Mill Creek Parks Sentiment Distribution</h3>
          <div className="h-40 w-full mb-4">
            <SentimentChart reviews={allReviews} height={150} />
          </div>
          <p className="text-sm text-muted-foreground">
            This chart shows the distribution of sentiment across all park reviews in our dataset. 
            Each dot represents an individual review, positioned based on its sentiment score.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={onGoToActivity}
              className="flex items-center gap-2"
              size="lg"
            >
              Go to Activity
              <ArrowDown size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplainerSection;
