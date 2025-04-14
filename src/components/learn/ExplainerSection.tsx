
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SentimentExplainer from "@/components/SentimentExplainer";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface ExplainerSectionProps {
  onGoToActivity: () => void;
}

const ExplainerSection: React.FC<ExplainerSectionProps> = ({ onGoToActivity }) => {
  return (
    <div className="mb-10">
      <SentimentExplainer 
        onGoToActivity={onGoToActivity}
      />
    </div>
  );
};

export default ExplainerSection;
