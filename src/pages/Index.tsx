
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, BookOpen, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-nature-cream to-nature-blue/10 py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-nature-green-dark mb-6">
            Discover Mill Creek Parks <br />
            <span className="text-nature-green-light">Through Data</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-foreground/80">
            An educational tool for students to explore local parks and learn about
            sentiment analysis through community reviews.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-nature-green-dark hover:bg-nature-green-dark/90">
              <Link to="/map" className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Explore Parks Map
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-nature-green-dark text-nature-green-dark hover:bg-nature-green-light/20">
              <Link to="/learn" className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn About Sentiment Analysis
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-nature-green-dark">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-nature-cream rounded-lg p-6 shadow-md border border-nature-green-light/20">
              <div className="bg-nature-green-light/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-nature-green-dark" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-nature-green-dark">Interactive Map</h3>
              <p className="text-foreground/80">
                Explore Mill Creek parks visually with an interactive map showing locations and sentiment ratings.
              </p>
              <Link to="/map" className="mt-4 inline-flex items-center text-sm text-nature-green-dark hover:underline">
                View Map <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-nature-cream rounded-lg p-6 shadow-md border border-nature-green-light/20">
              <div className="bg-nature-blue/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-nature-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 text-nature-green-dark">Park Reviews</h3>
              <p className="text-foreground/80">
                Read and analyze community reviews to understand what people love and areas for improvement.
              </p>
              <Link to="/map" className="mt-4 inline-flex items-center text-sm text-nature-green-dark hover:underline">
                See Reviews <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-nature-cream rounded-lg p-6 shadow-md border border-nature-green-light/20">
              <div className="bg-nature-yellow/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-nature-green-dark" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-nature-green-dark">Educational Resources</h3>
              <p className="text-foreground/80">
                Learn how sentiment analysis works and why it's important for community planning.
              </p>
              <Link to="/learn" className="mt-4 inline-flex items-center text-sm text-nature-green-dark hover:underline">
                Start Learning <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project Purpose */}
      <section className="py-16 px-4 md:px-6 bg-nature-green-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Project Purpose</h2>
          <p className="text-lg mb-8">
            Parks of Mill Creek is an educational tool designed to help students understand 
            data analysis through the lens of community engagement. By exploring 
            sentiment analysis of park reviews, students learn valuable skills in 
            data interpretation while connecting with their local community.
          </p>
          <Button asChild variant="secondary" className="bg-white text-nature-green-dark hover:bg-white/90">
            <Link to="/learn">
              Learn More About The Project
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-nature-cream border-t border-nature-green-dark/20 py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-foreground/70">
          <p>© 2025 Parks of Mill Creek - An Educational Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
