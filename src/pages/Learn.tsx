
import { Card, CardContent } from "@/components/ui/card";
import SentimentExplainer from "@/components/SentimentExplainer";
import SentimentChart from "@/components/SentimentChart";
import { parks } from "@/data/parksData";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Symbol definitions with their correct sentiment values
const symbolSentiments = {
  "■": "happy",
  "✿": "sad",
  "✦": "sad",
  "⚑": "happy",
  "◁": "happy",
  "§": "happy",
  "♟": "sad",
  "0": "sad",
};

// Symbol combinations for the activity
const sentimentSymbols = [
  { id: 1, symbol: "■ ✿", symbols: ["■", "✿"] },
  { id: 2, symbol: "■ ✦", symbols: ["■", "✦"] },
  { id: 3, symbol: "■ ⚑", symbols: ["■", "⚑"] },
  { id: 4, symbol: "◁ ■", symbols: ["◁", "■"] },
  { id: 5, symbol: "§ ■ ✦", symbols: ["§", "■", "✦"] },
  { id: 6, symbol: "♟ ✿", symbols: ["♟", "✿"] },
  { id: 7, symbol: "♟ ✦", symbols: ["♟", "✦"] },
  { id: 8, symbol: "0 ■ ✿", symbols: ["0", "■", "✿"] },
  { id: 9, symbol: "■ ✦ 0", symbols: ["■", "✦", "0"] },
  { id: 10, symbol: "♟ ⚑", symbols: ["♟", "⚑"] },
];

const Learn = () => {
  // Combine all reviews for a comprehensive example
  const allReviews = parks.flatMap(park => park.reviews);
  
  // State for the sentiment matching activity
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSentimentSelect = (id: number, sentiment: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [id]: sentiment,
    }));
  };
  
  const checkAnswer = (item: typeof sentimentSymbols[0]) => {
    // Calculate if positive or negative based on the majority of symbols' sentiments
    let positiveCount = 0;
    let negativeCount = 0;
    
    item.symbols.forEach(symbol => {
      if (symbolSentiments[symbol as keyof typeof symbolSentiments] === "happy") {
        positiveCount++;
      } else {
        negativeCount++;
      }
    });
    
    return positiveCount > negativeCount ? "positive" : "negative";
  };
  
  const handleSubmit = () => {
    const totalQuestions = sentimentSymbols.length;
    const correctAnswers = sentimentSymbols.filter(item => 
      userAnswers[item.id] === checkAnswer(item)
    ).length;
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    toast.success(`You scored ${score}%! ${correctAnswers} out of ${totalQuestions} correct.`);
    setIsSubmitted(true);
  };
  
  const resetActivity = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };
  
  return (
    <div className="min-h-screen bg-nature-cream">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-nature-green-dark mb-2">Learning Center</h1>
          <p className="text-lg text-muted-foreground">
            Understanding sentiment analysis and community data
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <SentimentExplainer />
            
            <Card className="border-nature-green-dark/20 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-4 text-nature-green-dark">Example: Mill Creek Parks Sentiment Distribution</h3>
                <div className="h-40 w-full mb-4">
                  <SentimentChart reviews={allReviews} height={150} />
                </div>
                <p className="text-sm text-muted-foreground">
                  This chart shows the distribution of sentiment across all park reviews in our dataset. 
                  Each dot represents an individual review, positioned based on its sentiment score.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card className="border-nature-green-dark/20 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-4 text-nature-green-dark">Sentiment Matching Activity</h3>
                <p className="mb-2">First, understand which symbols represent positive or negative sentiment:</p>
                
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {Object.entries(symbolSentiments).map(([symbol, sentiment]) => (
                    <div key={symbol} className="flex items-center justify-center p-2 border rounded-md">
                      <span className="text-xl mr-2">{symbol}</span>
                      <span className={`text-sm ${sentiment === "happy" ? "text-green-500" : "text-red-500"}`}>
                        {sentiment === "happy" ? "Positive" : "Negative"}
                      </span>
                    </div>
                  ))}
                </div>
                
                <p className="mb-4">Now match each symbol combination with its correct overall sentiment (positive or negative):</p>
                
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2 text-center">Symbol Combination</TableHead>
                        <TableHead className="w-1/2 text-center">Sentiment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentimentSymbols.map((item) => (
                        <TableRow key={item.id} className="hover:bg-nature-green-light/10">
                          <TableCell className="font-medium text-center text-xl py-4">
                            {item.symbol}
                          </TableCell>
                          <TableCell className="text-center">
                            {isSubmitted ? (
                              <div className="flex justify-center items-center gap-2">
                                {userAnswers[item.id] === checkAnswer(item) ? (
                                  <Check className="text-green-500" />
                                ) : (
                                  <X className="text-red-500" />
                                )}
                                <span>{checkAnswer(item)}</span>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-2">
                                <Button 
                                  variant={userAnswers[item.id] === "positive" ? "default" : "outline"} 
                                  className={userAnswers[item.id] === "positive" ? "bg-nature-green-light" : ""}
                                  onClick={() => handleSentimentSelect(item.id, "positive")}
                                >
                                  Positive 😃
                                </Button>
                                <Button 
                                  variant={userAnswers[item.id] === "negative" ? "default" : "outline"} 
                                  className={userAnswers[item.id] === "negative" ? "bg-nature-orange" : ""}
                                  onClick={() => handleSentimentSelect(item.id, "negative")}
                                >
                                  Negative 😠
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 flex justify-center">
                  {isSubmitted ? (
                    <Button 
                      onClick={resetActivity} 
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Try Again
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={Object.keys(userAnswers).length !== sentimentSymbols.length}
                    >
                      Check Answers
                    </Button>
                  )}
                </div>
                
                {!isSubmitted && Object.keys(userAnswers).length !== sentimentSymbols.length && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Select a sentiment for all symbols before checking your answers.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
