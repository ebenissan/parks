
import { useState, useMemo } from "react";
import { parks, Park, calculateAverageSentiment, getFrequentKeywords } from "@/data/parksData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, BarChart, PieChart, MessageSquare, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import ParkReviewsPieChart from "@/components/ParkReviewsPieChart";

const ComparePage = () => {
  const [selectedParks, setSelectedParks] = useState<string[]>([]);
  const [expandedPark, setExpandedPark] = useState<string | null>(null);

  const handleParkSelection = (parkId: string) => {
    if (selectedParks.includes(parkId)) {
      setSelectedParks(selectedParks.filter(id => id !== parkId));
    } else if (selectedParks.length < 2) {
      setSelectedParks([...selectedParks, parkId]);
    }
  };

  const toggleExpand = (parkId: string) => {
    if (expandedPark === parkId) {
      setExpandedPark(null);
    } else {
      setExpandedPark(parkId);
    }
  };

  const selectedParkData = useMemo(() => {
    return parks.filter(park => selectedParks.includes(park.id));
  }, [selectedParks]);

  // Calculate statistics for each selected park
  const parkStats = useMemo(() => {
    return selectedParkData.map(park => ({
      id: park.id,
      name: park.name,
      totalReviews: park.reviews.length,
      averageRating: park.reviews.reduce((acc, review) => acc + review.stars, 0) / park.reviews.length,
      averageSentiment: calculateAverageSentiment(park.reviews),
      positiveReviews: park.reviews.filter(review => review.sentiment >= 0).length,
      negativeReviews: park.reviews.filter(review => review.sentiment < 0).length,
      keywords: getFrequentKeywords(park.reviews)
    }));
  }, [selectedParkData]);

  return (
    <div className="min-h-screen bg-nature-cream flex flex-col">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-nature-green-dark mb-2">Compare Parks</h1>
          <p className="text-lg text-muted-foreground">
            Select up to two parks to compare their reviews and sentiment
          </p>
        </div>

        {/* Park Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[0, 1].map((index) => (
            <Card key={index} className={!selectedParks[index] ? "border-dashed border-gray-300" : ""}>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Park {index + 1} Selection
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
                    {parks.map((park) => (
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

        {/* Comparison Section */}
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
                      <TableCell className="font-medium">Total Reviews</TableCell>
                      {parkStats.map((park) => (
                        <TableCell key={park.id}>{park.totalReviews}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average Rating</TableCell>
                      {parkStats.map((park) => (
                        <TableCell key={park.id}>{park.averageRating.toFixed(1)} ★</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sentiment Score</TableCell>
                      {parkStats.map((park) => (
                        <TableCell key={park.id} className={park.averageSentiment >= 0 ? "text-green-600" : "text-red-600"}>
                          {park.averageSentiment.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Positive Reviews</TableCell>
                      {parkStats.map((park) => (
                        <TableCell key={park.id} className="text-green-600">{park.positiveReviews}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Negative Reviews</TableCell>
                      {parkStats.map((park) => (
                        <TableCell key={park.id} className="text-red-600">{park.negativeReviews}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Common Keywords</TableCell>
                      {parkStats.map((park) => (
                        <TableCell key={park.id}>
                          <div className="flex flex-wrap gap-1">
                            {park.keywords.map((keyword, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 text-xs bg-nature-green-light/20 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed View */}
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
                    {/* Two-Column Layout: Sentiment Distribution and Reviews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sentiment Distribution */}
                      <div className="h-[300px]">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <PieChart className="h-4 w-4" /> Sentiment Distribution
                        </h3>
                        <ParkReviewsPieChart reviews={park.reviews} />
                      </div>
                      
                      {/* Reviews List */}
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" /> Review History
                        </h3>
                        <div className="max-h-[300px] overflow-auto">
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
                                    {format(parseISO(review.date), 'MMM d, yyyy')}
                                  </TableCell>
                                  <TableCell>{review.stars} ★</TableCell>
                                  <TableCell>{review.text}</TableCell>
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
