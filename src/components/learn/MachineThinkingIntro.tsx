import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MonitorSmartphone, Search, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
  return <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} transition={{
    duration: 0.3
  }} key={index} data-section={index} className="py-6 min-h-[300px] flex items-center px-12">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <motion.div className="flex flex-col space-y-4" initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4,
        delay: 0.1
      }}>
          <div className="flex items-center gap-2">
            <motion.div className="bg-nature-green-light/20 p-3 rounded-full" initial={{
            scale: 0.8
          }} animate={{
            scale: 1
          }} transition={{
            duration: 0.3,
            delay: 0.2
          }}>
              {icon}
            </motion.div>
            <h3 className="text-xl font-medium text-nature-green-dark">{title}</h3>
          </div>
          <p className="text-lg">{description}</p>
        </motion.div>
        
        <motion.div className="flex justify-center" initial={{
        opacity: 0,
        y: 15
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }}>
          <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-[300px]">
            <img src={`/images/sentiment-${index + 1}.svg`} alt={imageAlt} className="w-full h-auto" onError={e => {
            // Fallback if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder.svg";
          }} />
          </div>
        </motion.div>
      </div>
    </motion.div>;
};
const MachineThinkingIntro = () => {
  const [currentSection, setCurrentSection] = useState(0);

  // Array of scrollytelling sections
  const sections = [{
    icon: <Brain className="text-nature-green-dark" />,
    title: "Computers don't understand words like humans",
    description: "When a computer sees words, it doesn't really know what they mean. It doesn't understand language like we do after years of learning.",
    imageAlt: "Brain versus computer chip comparison"
  }, {
    icon: <MonitorSmartphone className="text-nature-green-dark" />,
    title: "They see reviews as patterns or code",
    description: "To a computer, your review about a park is just a bunch of symbols and patterns. It processes this information in its own computer way.",
    imageAlt: "User review transforming into code"
  }, {
    icon: <Search className="text-nature-green-dark" />,
    title: "Computers learn by spotting what shows up most often",
    description: "Words like 'great,' 'fun,' and 'awesome' often appear in positive reviews. Computers learn to recognize these patterns.",
    imageAlt: "Common positive words highlighted"
  }, {
    icon: <ThumbsUp className="text-nature-green-dark" />,
    title: "Your turn: Look for clues in the activity below",
    description: "In this activity, you'll think like a computer! You'll look for patterns to figure out which symbols mean positive or negative feelings.",
    imageAlt: "Activity preview"
  }];
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
  return <Card className="border-nature-green-dark/20 shadow-lg mb-6">
      <CardContent className="pt-6">
        <motion.h3 className="text-xl font-medium mb-6 text-nature-green-dark text-center" initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          How Do Computers Understand Feelings?
        </motion.h3>
        
        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {sections.map((section, index) => currentSection === index && <ScrollytellingSection key={index} icon={section.icon} title={section.title} description={section.description} imageAlt={section.imageAlt} index={index} isActive={index === currentSection} />)}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between items-center mt-4 relative">
          <Button onClick={handlePrevious} variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2" disabled={currentSection === 0}>
            <motion.div whileHover={{
            x: -3
          }} whileTap={{
            scale: 0.9
          }}>
              <ChevronLeft size={24} />
            </motion.div>
          </Button>
          
          <div className="flex gap-1 mx-auto">
            {sections.map((_, index) => <motion.div key={index} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
                <Button variant="ghost" size="sm" className={`w-8 h-8 p-0 ${currentSection === index ? 'bg-nature-green-dark text-white' : 'bg-gray-200'}`} onClick={() => setCurrentSection(index)}>
                  {index + 1}
                </Button>
              </motion.div>)}
          </div>
          
          <Button onClick={handleNext} variant="ghost" className="absolute right-0 top-1/2 -translate-y-1/2" disabled={currentSection === sections.length - 1}>
            <motion.div whileHover={{
            x: 3
          }} whileTap={{
            scale: 0.9
          }}>
              <ChevronRight size={24} />
            </motion.div>
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default MachineThinkingIntro;