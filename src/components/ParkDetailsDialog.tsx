
import { useState } from "react";
import { Park, getSentimentColor, getSentimentDescription } from "@/data/parksData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, PieChart, MapPin, Send, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import ParkReviewsPieChart from "./ParkReviewsPieChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

interface ParkDetailsDialogProps {
  park: Park;
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewFormValues {
  reviewText: string;
  stars: number;
}

const ParkDetailsDialog = ({ park, isOpen, onClose }: ParkDetailsDialogProps) => {
  const [selectedRating, setSelectedRating] = useState(5);
  
  // Set up form with react-hook-form
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      reviewText: "",
      stars: 5
    },
  });

  const handleSubmitReview = (values: ReviewFormValues) => {
    // This is a mock submission - in a real app, this would connect to a backend
    console.log("Review submitted:", values.reviewText, "Stars:", selectedRating);
    
    // Show success toast
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your experience at this park!"
    });
    
    // Reset the form
    form.reset();
    setSelectedRating(5);
  };

  // Render star rating component
  const StarRating = ({ rating, onRatingChange }: { rating: number, onRatingChange?: (rating: number) => void }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`h-6 w-6 ${onRatingChange ? 'cursor-pointer' : ''}`}
          >
            <Star 
              className={star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
              } 
              size={20} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-nature-green-dark flex items-center gap-2">
            <MapPin className="h-5 w-5" /> {park.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and share community experiences at this location
          </DialogDescription>
        </DialogHeader>
        
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviews Section */}
          <div>
            <Card>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Community Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
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
                      {park.reviews.map((review, index) => {
                        const sentimentColor = getSentimentColor(review.sentiment);
                        const sentimentText = getSentimentDescription(review.sentiment);
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="whitespace-nowrap">
                              {format(parseISO(review.date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <StarRating rating={review.stars} />
                            </TableCell>
                            <TableCell>{review.text}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: sentimentColor }}
                                ></div>
                                <span style={{ color: sentimentColor }}>{sentimentText}</span>
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Sentiment Analysis Section */}
          <div>
            <Card>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <PieChart className="h-4 w-4" /> Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ParkReviewsPieChart reviews={park.reviews} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review Input Form */}
        <div className="mt-6">
          <Card>
            <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
              <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Share Your Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel>Your Rating</FormLabel>
                    <StarRating 
                      rating={selectedRating} 
                      onRatingChange={(rating) => setSelectedRating(rating)}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="reviewText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts about this park..." 
                            className="min-h-[100px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-nature-green-dark hover:bg-nature-green-dark/90"
                  >
                    Submit Review <Send className="ml-1 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParkDetailsDialog;
