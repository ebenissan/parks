import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  BarChart,
  PieChart,
  MessageSquare,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import ParkReviewsPieChart from "@/components/ParkReviewsPieChart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface Review {
  park: string;
  originalComment: string;
  translatedComment: string;
  rating: number;
  sentiment: number;
  timestamp: any;
  language: string;
  showTranslated: boolean;
}

interface ParkData {
  id: string;
  name: string;
  reviews: Review[];
}

const ComparePage = () => {
  const [parkData, setParkData] = useState<ParkData[]>([]);
  const [selectedParks, setSelectedParks] = useState<string[]>([]);
  const [expandedPark, setExpandedPark] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "final_reviews"));
      const grouped: Record<string, Review[]> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const park = data.park;
        if (!grouped[park]) grouped[park] = [];
        grouped[park].push({
          originalComment: data.originalComment,
          translatedComment: data.translatedComment,
          rating: data.rating,
          sentiment: data.sentiment,
          timestamp: data.timestamp?.toDate()?.toISOString?.() ?? new Date().toISOString(),
          language: data.language ?? "unknown",
          showTranslated: false,
          park,
        });
      });

      const parksArr: ParkData[] = Object.entries(grouped).map(([name, reviews]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        reviews,
      }));

      setParkData(parksArr);
    };

    fetchReviews();
  }, []);

  const handleParkSelection = (parkId: string) => {
    setSelectedParks((prev) => {
      if (prev.includes(parkId)) {
        return prev.filter((id) => id !== parkId);
      } else if (prev.length < 2) {
        return [...prev, parkId];
      }
      return prev;
    });
  };

  const toggleExpand = (parkId: string) => {
    setExpandedPark((prev) => (prev === parkId ? null : parkId));
  };

  const selectedParkData = useMemo(() => {
    return parkData.filter((park) => selectedParks.includes(park.id));
  }, [selectedParks, parkData]);

  const parkStats = useMemo(() => {
    return selectedParkData.map((park) => ({
      id: park.id,
      name: park.name,
      totalReviews: park.reviews.length,
      averageRating:
        park.reviews.reduce((acc, r) => acc + r.rating, 0) / park.reviews.length,
      averageSentiment:
        park.reviews.reduce((acc, r) => acc + r.sentiment, 0) / park.reviews.length,
      positiveReviews: park.reviews.filter((r) => r.sentiment >= 0).length,
      negativeReviews: park.reviews.filter((r) => r.sentiment < 0).length,
      keywords: [],
    }));
  }, [selectedParkData]);

  return (
    <div className="min-h-screen bg-nature-cream flex flex-col">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-nature-green-dark mb-2">
            Compare Parks
          </h1>
          <p className="text-lg text-muted-foreground">
            Select up to two parks to compare their reviews and sentiment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[0, 1].map((index) => (
            <Card
              key={index}
              className={!selectedParks[index] ? "border-dashed border-gray-300" : ""}
            >
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Park {index + 1} Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select
                  value={selectedParks[index] || ""}
                  onValueChange={(value) => {
                    const newSelected = [...selectedParks];
                    newSelected[index] = value;
                    setSelectedParks(newSelected.filter(Boolean));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a park..." />
                  </SelectTrigger>
                  <SelectContent>
                    {parkData.map((park) => (
                      <SelectItem
                        key={park.id}
                        value={park.id}
                        disabled={selectedParks.includes(park.id) && selectedParks.indexOf(park.id) !== index}
                      >
                        {park.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>

        {parkStats.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10">
                <CardTitle className="text-xl text-nature-green-dark flex items-center gap-2">
                  <BarChart className="h-5 w-5" /> Park Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      {parkStats.map((park) => (
                        <TableHead key={park.id}>{park.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Reviews</TableCell>
                      {parkStats.map((p) => (
                        <TableCell key={p.id}>{p.totalReviews}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Rating</TableCell>
                      {parkStats.map((p) => (
                        <TableCell key={p.id}>{p.averageRating.toFixed(1)} ★</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Sentiment Score</TableCell>
                      {parkStats.map((p) => (
                        <TableCell key={p.id} className={p.averageSentiment >= 0 ? "text-green-600" : "text-red-600"}>
                          {p.averageSentiment.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Positive Reviews</TableCell>
                      {parkStats.map((p) => (
                        <TableCell key={p.id} className="text-green-600">{p.positiveReviews}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Negative Reviews</TableCell>
                      {parkStats.map((p) => (
                        <TableCell key={p.id} className="text-red-600">{p.negativeReviews}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedParkData.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {selectedParkData.map((park) => (
              <Card key={park.id}>
                <CardHeader
                  className="bg-nature-green-light/10 border-b border-nature-green-dark/10 cursor-pointer"
                  onClick={() => toggleExpand(park.id)}
                >
                  <CardTitle className="text-lg text-nature-green-dark flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {park.name} Details
                    </div>
                    {expandedPark === park.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </CardTitle>
                </CardHeader>
                {expandedPark === park.id && (
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-[300px]">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <PieChart className="h-4 w-4" /> Sentiment Distribution
                        </h3>
                        <ParkReviewsPieChart parkName={park.name} />
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" /> Review History
                        </h3>
                        <div className="max-h-[300px] overflow-y-auto border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Sentiment</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {park.reviews.map((review, index) => (
                                <TableRow key={index}>
                                  <TableCell className="whitespace-nowrap">
                                    {format(parseISO(review.timestamp), 'MMM d, yyyy')}
                                  </TableCell>
                                  <TableCell>{review.rating} ★</TableCell>
                                  <TableCell>
                                    {review.language !== "en" && review.translatedComment ? (
                                      <>
                                        <p>{review.showTranslated ? review.translatedComment : review.originalComment}</p>
                                        <button
                                          onClick={() => {
                                            setParkData((prev) =>
                                              prev.map((p) =>
                                                p.id === park.id
                                                  ? {
                                                      ...p,
                                                      reviews: p.reviews.map((r, i) =>
                                                        i === index
                                                          ? { ...r, showTranslated: !r.showTranslated }
                                                          : r
                                                      ),
                                                    }
                                                  : p
                                              )
                                            );
                                          }}
                                          className="text-blue-600 hover:underline text-sm mt-1"
                                        >
                                          {review.showTranslated ? "🔁 Show Original" : "🌐 Show Translation"}
                                        </button>
                                      </>
                                    ) : (
                                      <p>{review.originalComment}</p>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <span className={review.sentiment >= 0 ? "text-green-600" : "text-red-600"}>
                                      {review.sentiment >= 0 ? "Positive" : "Negative"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;