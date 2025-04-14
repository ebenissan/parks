
import { useState, useRef } from "react";
import LearnHeader from "@/components/learn/LearnHeader";
import ExplainerSection from "@/components/learn/ExplainerSection";
import ActivitySection from "@/components/learn/ActivitySection";
import MachineThinkingIntro from "@/components/learn/MachineThinkingIntro";

const Learn = () => {
  const [showActivity, setShowActivity] = useState(false);
  const activityRef = useRef<HTMLDivElement>(null);

  const handleGoToActivity = () => {
    setShowActivity(true);
    setTimeout(() => {
      activityRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-nature-cream">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <LearnHeader />
        
        {/* Machine Thinking Intro with click-through sections */}
        <MachineThinkingIntro />
        
        {/* Explainer Section */}
        <ExplainerSection onGoToActivity={handleGoToActivity} />
        
        {/* Activity Section */}
        <div 
          ref={activityRef} 
          className={showActivity ? "" : "opacity-30 pointer-events-none transition-opacity duration-500"}
        >
          <ActivitySection id="activity" />
        </div>
      </div>
    </div>
  );
};

export default Learn;
