
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, MonitorSmartphone, Search, ThumbsUp } from "lucide-react";

const ScrollytellingSection = ({ 
  icon, 
  title, 
  description,
  imageAlt,
  index
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  imageAlt: string;
  index: number;
}) => {
  return (
    <div className="py-12 min-h-[300px] flex items-center" data-section={index}>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div 
          className="flex flex-col space-y-4 animate-fade-in"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-nature-green-light/20 p-3 rounded-full">{icon}</div>
            <h3 className="text-xl font-medium text-nature-green-dark">{title}</h3>
          </div>
          <p className="text-lg">{description}</p>
        </div>
        
        <div 
          className="flex justify-center animate-fade-in" 
          style={{ animationDelay: `${index * 0.2 + 0.1}s` }}
        >
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

  return (
    <Card className="border-nature-green-dark/20 shadow-lg mb-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-6 text-nature-green-dark text-center">
          How Do Computers Understand Feelings?
        </h3>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <ScrollytellingSection
                key={index}
                icon={section.icon}
                title={section.title}
                description={section.description}
                imageAlt={section.imageAlt}
                index={index}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MachineThinkingIntro;
