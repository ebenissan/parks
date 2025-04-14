
import React from "react";
import MachineThinkingIntro from "./MachineThinkingIntro";
import SymbolActivityCard from "./SymbolActivityCard";

const ActivitySection: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div id={id}>
      <h2 className="text-2xl font-bold text-nature-green-dark mb-4">Think Like a Computer: Sentiment Analysis Challenge</h2>
      <MachineThinkingIntro />
      <SymbolActivityCard />
    </div>
  );
};

export default ActivitySection;
