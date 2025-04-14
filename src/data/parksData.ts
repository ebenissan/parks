export interface Park {
  id: string;
  name: string;
  position: [number, number]; // [latitude, longitude]
  description: string;
  imageUrl?: string;
  reviews: {
    text: string;
    sentiment: number; // -1 to 1 (negative to positive)
    keywords?: string[];
  }[];
}

export const parks: Park[] = [
  {
    id: "whitsett",
    name: "Whitsett Park",
    position: [36.11606399096618, -86.71331618629186],
    description: "A neighborhood park located at 375 Wimpole Dr, Nashville, TN 37211 with recreational facilities.",
    reviews: [
      { text: "Great local park with plenty of space for the kids to play.", sentiment: 0.7 },
      { text: "The walking trails are well maintained and scenic.", sentiment: 0.6 },
      { text: "Limited parking available during busy weekends.", sentiment: -0.3 },
      { text: "Some areas could use better lighting in the evenings.", sentiment: -0.2 },
      { text: "Love the open fields for sports and picnics.", sentiment: 0.8 }
    ]
  },
  {
    id: "ezell",
    name: "Ezell Road Park",
    position: [36.091231473579406, -86.68602193066967],
    description: "Community park located at 5135 Harding Pl, Nashville, TN 37211 with various amenities.",
    reviews: [
      { text: "The playground equipment is modern and safe for children.", sentiment: 0.8 },
      { text: "Beautiful trees provide great shade during summer months.", sentiment: 0.7 },
      { text: "The basketball courts need resurfacing.", sentiment: -0.4 },
      { text: "Peaceful atmosphere for morning walks.", sentiment: 0.6 },
      { text: "Wish there were more benches throughout the park.", sentiment: -0.2 }
    ]
  },
  {
    id: "nolensville",
    name: "Nolensville Park",
    position: [35.962237683191226, -86.66724451846073],
    description: "Large recreational area located at 2310 Nolensville Park Rd, Nolensville, TN 37135 with diverse facilities.",
    reviews: [
      { text: "Excellent sports facilities and well-maintained fields.", sentiment: 0.9 },
      { text: "The nature trails are beautiful in all seasons.", sentiment: 0.8 },
      { text: "Restrooms could be cleaner and better maintained.", sentiment: -0.5 },
      { text: "Great place for community events and gatherings.", sentiment: 0.7 },
      { text: "Limited shade in some areas makes it difficult during hot days.", sentiment: -0.3 }
    ]
  }
];

export const calculateAverageSentiment = (reviews: Park["reviews"]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.sentiment, 0);
  return sum / reviews.length;
};

export const getSentimentColor = (sentiment: number) => {
  if (sentiment >= 0.6) return "#8CB369"; // Positive - green
  if (sentiment >= 0.2) return "#F4D35E"; // Somewhat positive - yellow
  if (sentiment >= -0.2) return "#A4937C"; // Neutral - brown/earth
  if (sentiment >= -0.6) return "#F78C6B"; // Somewhat negative - orange
  return "#E56B6F"; // Negative - red
};

export const getSentimentDescription = (sentiment: number) => {
  if (sentiment >= 0.6) return "Very Positive";
  if (sentiment >= 0.2) return "Positive";
  if (sentiment >= -0.2) return "Neutral";
  if (sentiment >= -0.6) return "Negative";
  return "Very Negative";
};

export const getFrequentKeywords = (reviews: Park["reviews"]) => {
  const allWords = reviews
    .map(review => review.text.toLowerCase().split(/\W+/))
    .flat()
    .filter(word => word.length > 3);
  
  const wordCount: Record<string, number> = {};
  allWords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Filter out common stop words
  const stopWords = ["this", "that", "they", "their", "there", "these", "those", "with"];
  const filteredCount = Object.entries(wordCount)
    .filter(([word]) => !stopWords.includes(word));
  
  return filteredCount
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};
