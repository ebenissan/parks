
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SentimentExplainer = () => {
  return (
    <Card className="border-nature-green-dark/20 shadow-lg">
      <CardHeader className="bg-nature-green-light/10">
        <CardTitle className="text-nature-green-dark">Understanding Sentiment Analysis</CardTitle>
        <CardDescription>
          How computers understand our feelings about parks
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="what">
          <TabsList className="bg-nature-cream border border-nature-green-light/30">
            <TabsTrigger value="what">What Is It?</TabsTrigger>
            <TabsTrigger value="how">How It Works</TabsTrigger>
            <TabsTrigger value="why">Why It Matters</TabsTrigger>
          </TabsList>
          <TabsContent value="what" className="mt-4 animate-fade-in">
            <div className="prose">
              <h3 className="text-lg font-medium text-nature-green-dark mb-2">What is Sentiment Analysis?</h3>
              <p className="mb-4">
                Sentiment analysis is a technique used to identify and extract subjective information from text. 
                It determines whether the writer's attitude towards a topic is positive, negative, or neutral.
              </p>
              <p>
                In our Parks of Mill Creek project, we use sentiment analysis to understand how community members 
                feel about different parks based on their reviews and comments.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="how" className="mt-4 animate-fade-in">
            <div className="prose">
              <h3 className="text-lg font-medium text-nature-green-dark mb-2">How Sentiment Analysis Works</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Text Processing:</strong> Reviews are broken down into parts for analysis.</li>
                <li><strong>Feature Extraction:</strong> Words and phrases that express opinions are identified.</li>
                <li><strong>Classification:</strong> Each review is scored on a scale from negative to positive (-1 to +1).</li>
                <li><strong>Aggregation:</strong> Individual scores are combined to determine overall sentiment.</li>
              </ol>
              <p className="mt-4 text-sm">
                Our system uses a combination of machine learning algorithms and natural language processing 
                techniques to analyze park reviews.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="why" className="mt-4 animate-fade-in">
            <div className="prose">
              <h3 className="text-lg font-medium text-nature-green-dark mb-2">Why Sentiment Analysis Matters</h3>
              <p className="mb-4">
                Understanding community sentiment helps:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Park planners prioritize improvements based on public feedback</li>
                <li>Community members discover parks that align with their interests</li>
                <li>Local government allocate resources more effectively</li>
                <li>Students learn about data analysis and community engagement</li>
              </ul>
              <p className="mt-4 text-sm">
                By analyzing patterns in reviews over time, we can track changes in community 
                sentiment and measure the impact of park improvements.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SentimentExplainer;
