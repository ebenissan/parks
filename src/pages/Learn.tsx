
import { Card, CardContent } from "@/components/ui/card";
import SentimentExplainer from "@/components/SentimentExplainer";
import SentimentChart from "@/components/SentimentChart";
import { parks } from "@/data/parksData";

const Learn = () => {
  // Combine all reviews for a comprehensive example
  const allReviews = parks.flatMap(park => park.reviews);
  
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
                <h3 className="text-xl font-medium mb-4 text-nature-green-dark">Using Sentiment Analysis in Education</h3>
                <div className="prose max-w-none">
                  <p className="mb-4">
                    Sentiment analysis offers students several educational benefits:
                  </p>
                  
                  <ul className="space-y-3 list-disc pl-5">
                    <li>
                      <strong>Data Literacy:</strong> Students learn to interpret and analyze data, 
                      understanding how qualitative information (reviews) can be quantified.
                    </li>
                    <li>
                      <strong>Critical Thinking:</strong> By examining sentiment patterns, students 
                      develop critical thinking skills around subjective information.
                    </li>
                    <li>
                      <strong>Community Engagement:</strong> Students connect with local issues and 
                      community spaces through data analysis.
                    </li>
                    <li>
                      <strong>Technology Skills:</strong> Working with sentiment analysis introduces 
                      students to concepts in natural language processing and machine learning.
                    </li>
                  </ul>
                  
                  <p className="mt-4">
                    The Parks of Mill Creek project provides students with hands-on 
                    experience analyzing real community feedback, helping them understand 
                    the intersection of data science and community planning.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-nature-green-dark/20 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-4 text-nature-green-dark">Classroom Activities</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-nature-green-light/10 rounded-lg">
                    <h4 className="font-medium mb-1">Sentiment Analysis Challenge</h4>
                    <p className="text-sm">
                      Students try to manually assign sentiment scores to park reviews, 
                      then compare their analysis to the algorithm's results.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-nature-blue/10 rounded-lg">
                    <h4 className="font-medium mb-1">Community Improvement Proposal</h4>
                    <p className="text-sm">
                      Using sentiment data, students develop proposals for park improvements 
                      that address common concerns identified in negative reviews.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-nature-yellow/10 rounded-lg">
                    <h4 className="font-medium mb-1">Data Visualization Project</h4>
                    <p className="text-sm">
                      Students create their own visual representations of park sentiment 
                      data using different chart types and visualization techniques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
