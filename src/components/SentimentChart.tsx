
import { useEffect, useRef } from "react";
import { Park } from "@/data/parksData";

interface SentimentChartProps {
  reviews: Park["reviews"];
  height?: number;
}

const SentimentChart = ({ reviews, height = 80 }: SentimentChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort reviews by sentiment
    const sortedReviews = [...reviews].sort((a, b) => a.sentiment - b.sentiment);
    
    // Draw axis
    const centerY = canvas.height / 2;
    ctx.strokeStyle = "#A4937C";
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw markers for each review
    const markerRadius = 6;
    const markerSpacing = canvas.width / (sortedReviews.length + 1);
    
    sortedReviews.forEach((review, index) => {
      // Map sentiment from [-1, 1] to [canvas.height, 0]
      const y = centerY - (review.sentiment * centerY * 0.8);
      const x = markerSpacing * (index + 1);
      
      // Determine color based on sentiment
      const color = review.sentiment >= 0 ? "#8CB369" : "#E56B6F";
      
      // Draw circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, markerRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = "#4A7C59";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Negative", 5, canvas.height - 5);
    ctx.textAlign = "right";
    ctx.fillText("Positive", canvas.width - 5, canvas.height - 5);
    
  }, [reviews]);

  return (
    <div className="w-full h-full">
      <canvas 
        ref={chartRef} 
        width={200} 
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};

export default SentimentChart;
