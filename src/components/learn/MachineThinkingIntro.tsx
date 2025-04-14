
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const MachineThinkingIntro = () => {
  return (
    <Card className="border-nature-green-dark/20 shadow-lg mb-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-4 text-nature-green-dark">How Do Computers Understand Feelings?</h3>
        <div className="prose max-w-none text-lg">
          <p className="mb-4">
            <strong>Let's be very clear:</strong> Computers don't actually understand words like we do!
          </p>
          
          <p className="mb-4">
            When we show a computer a review about a park, it doesn't "know" what the words mean. 
            It sees a bunch of code that it processes in its computer way.
          </p>
          
          <p className="mb-4">
            Think about this - it took you years to learn words and their meanings! 
            But computers can still figure out if someone liked or didn't like something by looking for patterns.
          </p>
          
          <p className="mb-4">
            In this activity, you'll get to think like a computer and see how it learns to tell the difference between positive and negative feelings!
          </p>
          
          <p>
            Don't worry about what the symbols mean - just like a computer, 
            you'll need to spot patterns by looking at how they're used together!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineThinkingIntro;
