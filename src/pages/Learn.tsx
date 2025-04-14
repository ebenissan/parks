
import { Card, CardContent } from "@/components/ui/card";
import SentimentExplainer from "@/components/SentimentExplainer";
import SentimentChart from "@/components/SentimentChart";
import { parks } from "@/data/parksData";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

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

// Symbol combinations for the activity with pre-calculated overall sentiment
const sentimentSymbols = [
  { id: 1, symbol: "■ ✿", sentiment: "positive", symbols: ["■", "✿"] },
  { id: 2, symbol: "■ ✦", sentiment: "positive", symbols: ["■", "✦"] },
  { id: 3, symbol: "■ ⚑", sentiment: "positive", symbols: ["■", "⚑"] },
  { id: 4, symbol: "◁ ■", sentiment: "positive", symbols: ["◁", "■"] },
  { id: 5, symbol: "§ ■ ✦", sentiment: "positive", symbols: ["§", "■", "✦"] },
  { id: 6, symbol: "♟ ✿", sentiment: "negative", symbols: ["♟", "✿"] },
  { id: 7, symbol: "♟ ✦", sentiment: "negative", symbols: ["♟", "✦"] },
  { id: 8, symbol: "0 ■ ✿", sentiment: "negative", symbols: ["0", "■", "✿"] },
  { id: 9, symbol: "■ ✦ 0", sentiment: "negative", symbols: ["■", "✦", "0"] },
  { id: 10, symbol: "♟ ⚑", sentiment: "negative", symbols: ["♟", "⚑"] },
];

// Get list of unique symbols used in the activity
const uniqueSymbols = Array.from(new Set(sentimentSymbols.flatMap(item => item.symbols)));

const Learn = () => {
  // Combine all reviews for a comprehensive example
  const allReviews = parks.flatMap(park => park.reviews);
  
  // State for the user's answers about individual symbols
  const [userSymbolSentiments, setUserSymbolSentiments] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  const handleSymbolSentimentSelect = (symbol: string, sentiment: string) => {
    setUserSymbolSentiments(prev => ({
      ...prev,
      [symbol]: sentiment,
    }));
  };
  
  const calculateCombinationSentiment = (symbols: string[]) => {
    let happyCount = 0;
    let sadCount = 0;
    
    symbols.forEach(symbol => {
      if (symbolSentiments[symbol as keyof typeof symbolSentiments] === "happy") {
        happyCount++;
      } else {
        sadCount++;
      }
    });
    
    return happyCount > sadCount ? "positive" : "negative";
  };
  
  const handleSubmit = () => {
    const totalSymbols = uniqueSymbols.length;
    const correctAnswers = uniqueSymbols.filter(symbol => 
      userSymbolSentiments[symbol] === symbolSentiments[symbol as keyof typeof symbolSentiments]
    ).length;
    
    const score = Math.round((correctAnswers / totalSymbols) * 100);
    
    toast.success(`You scored ${score}%! ${correctAnswers} out of ${totalSymbols} symbols correct.`);
    setIsSubmitted(true);
  };
  
  const resetActivity = () => {
    setUserSymbolSentiments({});
    setIsSubmitted(false);
    setShowHints(false);
  };
  
  const allSymbolsAnswered = uniqueSymbols.every(symbol => userSymbolSentiments[symbol]);
  
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
                <h3 className="text-xl font-medium mb-4 text-nature-green-dark">Symbol Sentiment Analysis Activity</h3>
                <p className="mb-4">Based on the combinations below, determine whether each individual symbol represents a positive or negative sentiment:</p>
                
                <div className="overflow-x-auto mb-6">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2 text-center">Symbol Combination</TableHead>
                        <TableHead className="w-1/2 text-center">Overall Sentiment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentimentSymbols.map((item) => (
                        <TableRow key={item.id} className="hover:bg-nature-green-light/10">
                          <TableCell className="font-medium text-center text-xl py-4">
                            {item.symbol}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`py-1 px-3 rounded-full ${
                              item.sentiment === "positive" 
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {item.sentiment === "positive" ? "Positive 😃" : "Negative 😠"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {showHints && !isSubmitted && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
                    <h4 className="font-medium text-blue-700 mb-2">Hints:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                      <li>When symbols appear together, the majority sentiment wins</li>
                      <li>If there are equal numbers of positive and negative symbols, the result is negative</li>
                      <li>Look for patterns in combinations that result in the same sentiment</li>
                    </ul>
                  </div>
                )}
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">For each symbol, select whether it represents a positive or negative sentiment:</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {uniqueSymbols.map((symbol) => (
                      <div key={symbol} className="flex items-center space-x-4 border rounded-md p-4">
                        <span className="text-2xl">{symbol}</span>
                        <RadioGroup 
                          value={userSymbolSentiments[symbol] || ""}
                          className="flex flex-row space-x-2"
                          onValueChange={(value) => handleSymbolSentimentSelect(symbol, value)}
                          disabled={isSubmitted}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="happy" id={`${symbol}-happy`} />
                            <label htmlFor={`${symbol}-happy`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Positive
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sad" id={`${symbol}-sad`} />
                            <label htmlFor={`${symbol}-sad`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Negative
                            </label>
                          </div>
                        </RadioGroup>
                        {isSubmitted && (
                          <div className="ml-auto">
                            {userSymbolSentiments[symbol] === symbolSentiments[symbol as keyof typeof symbolSentiments] ? (
                              <Check className="text-green-500" />
                            ) : (
                              <X className="text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  {!isSubmitted && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowHints(!showHints)}
                    >
                      {showHints ? "Hide Hints" : "Show Hints"}
                    </Button>
                  )}
                  
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
                      disabled={!allSymbolsAnswered}
                    >
                      Check Answers
                    </Button>
                  )}
                </div>
                
                {!isSubmitted && !allSymbolsAnswered && (
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
