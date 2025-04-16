
import { useState } from "react";
import { Park, getSentimentColor, getSentimentDescription } from "@/data/parksData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, PieChart, MapPin, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import ParkReviewsPieChart from "./ParkReviewsPieChart";

interface ParkDetailsDialogProps {
  park: Park;
  isOpen: boolean;
  onClose: () => void;
}

const ParkDetailsDialog = ({ park, isOpen, onClose }: ParkDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-nature-green-dark flex items-center gap-2">
            <MapPin className="h-5 w-5" /> {park.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="reviews" className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="sentiments" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Sentiment Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader className="bg-nature-green-light/10 border-b border-nature-green-dark/10 pb-2">
                <CardTitle className="text-lg text-nature-green-dark flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Community Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
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
                            {format(new Date(review.date), 'MMM d, yyyy')}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiments">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ParkDetailsDialog;
