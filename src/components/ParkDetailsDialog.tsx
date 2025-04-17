import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { collection, query, where, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  PieChart,
  MapPin,
  Send,
  Star,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import ParkReviewsPieChart from "./ParkReviewsPieChart";
import { getSentimentColor, getSentimentDescription } from "@/data/parksData";
import { franc } from "franc";
import { iso6393 } from "iso-639-3";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

const supportedLangs = ["ur", "es", "fr", "hi", "ar", "de", "zh", "ru", "tr"];

const getSafeLang = (lang3: string): string | null => {
  const match = iso6393.find((l) => l.iso6393 === lang3);
  const iso1 = match?.iso6391;
  return supportedLangs.includes(iso1) ? iso1 : null;
};

interface ParkDetailsDialogProps {
  park: {
    id: string;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewFormValues {
  reviewText: string;
  stars: number;
}

const ParkDetailsDialog = ({ park, isOpen, onClose }: ParkDetailsDialogProps) => {
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviews, setReviews] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      reviewText: "",
      stars: 5,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const reviewsRef = collection(db, "final_reviews");
    const q = query(reviewsRef, where("park", "==", park.name));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewList = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          originalComment: data.originalComment || data.comment,
          translatedComment: data.translatedComment || null,
          showTranslated: false,
          stars: data.rating,
          date: data.timestamp?.toDate?.().toISOString?.() ?? new Date().toISOString(),
          sentiment: data.sentiment ?? 0,
          language: data.language ?? "unknown",
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first
    

      setReviews(reviewList);

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [isOpen, park.name]);

  const toggleTranslation = (index: number) => {
    setReviews((prev) =>
      prev.map((rev, i) =>
        i === index ? { ...rev, showTranslated: !rev.showTranslated } : rev
      )
    );
  };

  const handleSubmitReview = async (values: ReviewFormValues) => {
    try {
      const analysis = sentiment.analyze(values.reviewText);
      const sentimentScore = analysis.score;

      const lang3 = franc(values.reviewText || "");
      const sourceLang = getSafeLang(lang3);
      let translated = null;

      if (sourceLang && sourceLang !== "en") {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(values.reviewText)}&langpair=${sourceLang}|en`
        );
        const data = await response.json();
        translated = data?.responseData?.translatedText || null;
      }

      await addDoc(collection(db, "final_reviews"), {
        originalComment: values.reviewText,
        translatedComment: translated,
        rating: selectedRating,
        sentiment: sentimentScore,
        park: park.name,
        user: "Anonymous",
        timestamp: serverTimestamp(),
        language: sourceLang ?? "unknown",
        needsManualReview: sourceLang !== "en",
      });

      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience at this park!",
      });

      form.reset();
      setSelectedRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange?: (rating: number) => void }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`h-6 w-6 ${onRatingChange ? "cursor-pointer" : ""}`}
          >
            <Star className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} size={20} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] max-h-[95vh] w-[95vw] overflow-y-auto z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-nature-green-dark flex items-center gap-2">
            <MapPin className="h-5 w-5" /> {park.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and share community experiences at this location
          </DialogDescription>
        </DialogHeader>

        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Community Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]" ref={scrollRef}>
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
                      {reviews.map((review, index) => {
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
                            <TableCell>
                              {review.language !== "en" && review.translatedComment ? (
                                <>
                                  <p>{review.showTranslated ? review.translatedComment : review.originalComment}</p>
                                  <button
                                    onClick={() => toggleTranslation(index)}
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
                              <span className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sentimentColor }}></div>
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

          <div>
            <Card>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <PieChart className="h-4 w-4" /> Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ParkReviewsPieChart parkName={park.name} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
                    <StarRating rating={selectedRating} onRatingChange={setSelectedRating} />
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
                  <Button type="submit" className="w-full md:w-auto bg-nature-green-dark hover:bg-nature-green-dark/90">
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
