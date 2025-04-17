import { useEffect, useMemo, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ParkReviewsPieChartProps {
  parkName: string;
}

const ParkReviewsPieChart = ({ parkName }: ParkReviewsPieChartProps) => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!parkName) return;

    const q = query(collection(db, "reviews"), where("park", "==", parkName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data());
      setReviews(fetched);
    });

    return () => unsubscribe();
  }, [parkName]);

  const chartData = useMemo(() => {
    const sentimentCounts = {
      Positive: 0,
      Negative: 0,
    };

    reviews.forEach((review) => {
      const score = review.sentiment;
      if (typeof score !== "number") return;

      if (score >= 0) sentimentCounts.Positive++;
      else sentimentCounts.Negative++;
    });

    return [
      { name: "Positive", value: sentimentCounts.Positive, color: "#8CB369" },
      { name: "Negative", value: sentimentCounts.Negative, color: "#E56B6F" },
    ].filter((item) => item.value > 0);
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
          labelLine
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ParkReviewsPieChart;
