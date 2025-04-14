
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MonitorSmartphone, Search, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollytellingSection = ({ 
  icon, 
  title, 
  description,
  imageAlt,
  index,
  isActive
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  imageAlt: string;
  index: number;
  isActive: boolean;
}) => {
  if (!isActive) return null;
  
  return (
    <div className="py-6 min-h-[300px] flex items-center animate-fade-in" data-section={index}>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-nature-green-light/20 p-3 rounded-full">{icon}</div>
            <h3 className="text-xl font-medium text-nature-green-dark">{title}</h3>
          </div>
          <p className="text-lg">{description}</p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-[300px]">
            <img 
              src={`/images/sentiment-${index + 1}.svg`} 
              alt={imageAlt}
              className="w-full h-auto"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MachineThinkingIntro = () => {
  const [currentSection, setCurrentSection] = useState(0);
  
  // Array of scrollytelling sections
  const sections = [
    {
      icon: <Brain className="text-nature-green-dark" />,
      title: "Computers don't understand words like humans",
      description: "When a computer sees words, it doesn't really know what they mean. It doesn't understand language like we do after years of learning.",
      imageAlt: "Brain versus computer chip comparison"
    },
    {
      icon: <MonitorSmartphone className="text-nature-green-dark" />,
      title: "They see reviews as patterns or code",
      description: "To a computer, your review about a park is just a bunch of symbols and patterns. It processes this information in its own computer way.",
      imageAlt: "User review transforming into code"
    },
    {
      icon: <Search className="text-nature-green-dark" />,
      title: "Computers learn by spotting what shows up most often",
      description: "Words like 'great,' 'fun,' and 'awesome' often appear in positive reviews. Computers learn to recognize these patterns.",
      imageAlt: "Common positive words highlighted"
    },
    {
      icon: <ThumbsUp className="text-nature-green-dark" />,
      title: "Your turn: Look for clues in the activity below",
      description: "In this activity, you'll think like a computer! You'll look for patterns to figure out which symbols mean positive or negative feelings.",
      imageAlt: "Activity preview"
    }
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <Card className="border-nature-green-dark/20 shadow-lg mb-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-6 text-nature-green-dark text-center">
          How Do Computers Understand Feelings?
        </h3>
        
        <div className="min-h-[400px] relative">
          {sections.map((section, index) => (
            <ScrollytellingSection
              key={index}
              icon={section.icon}
              title={section.title}
              description={section.description}
              imageAlt={section.imageAlt}
              index={index}
              isActive={index === currentSection}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            onClick={handlePrevious} 
            variant="outline" 
            className="flex items-center gap-1"
            disabled={currentSection === 0}
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          
          <div className="flex gap-1">
            {sections.map((_, index) => (
              <Button 
                key={index}
                variant="ghost" 
                size="sm"
                className={`w-8 h-8 p-0 ${currentSection === index ? 'bg-nature-green-dark text-white' : 'bg-gray-200'}`}
                onClick={() => setCurrentSection(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={handleNext} 
            variant="outline"
            className="flex items-center gap-1"
            disabled={currentSection === sections.length - 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineThinkingIntro;
