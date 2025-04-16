
import { useMemo } from "react";
import { Park } from "@/data/parksData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ParkReviewsPieChartProps {
  reviews: Park["reviews"];
}

const ParkReviewsPieChart = ({ reviews }: ParkReviewsPieChartProps) => {
  // Process review data for the chart
  const chartData = useMemo(() => {
    // Count reviews by sentiment category
    const sentimentCounts = {
      "Very Positive": 0,
      "Positive": 0, 
      "Neutral": 0,
      "Negative": 0,
      "Very Negative": 0
    };
    
    reviews.forEach(review => {
      if (review.sentiment >= 0.6) {
        sentimentCounts["Very Positive"]++;
      } else if (review.sentiment >= 0.2) {
        sentimentCounts["Positive"]++;
      } else if (review.sentiment >= -0.2) {
        sentimentCounts["Neutral"]++;
      } else if (review.sentiment >= -0.6) {
        sentimentCounts["Negative"]++;
      } else {
        sentimentCounts["Very Negative"]++;
      }
    });
    
    // Convert to chart data format
    return [
      { name: "Very Positive", value: sentimentCounts["Very Positive"], color: "#8CB369" },
      { name: "Positive", value: sentimentCounts["Positive"], color: "#F4D35E" },
      { name: "Neutral", value: sentimentCounts["Neutral"], color: "#A4937C" },
      { name: "Negative", value: sentimentCounts["Negative"], color: "#F78C6B" },
      { name: "Very Negative", value: sentimentCounts["Very Negative"], color: "#E56B6F" }
    ].filter(item => item.value > 0); // Only include categories with values
  }, [reviews]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">No review data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} reviews`, 'Count']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ParkReviewsPieChart;
