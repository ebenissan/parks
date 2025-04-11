
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
    id: "mcsp",
    name: "Mill Creek Sports Park",
    position: [47.8608, -122.2133],
    description: "This large sports complex features baseball fields, soccer fields, and a playground area.",
    reviews: [
      { text: "Great fields for baseball! My kids love playing here.", sentiment: 0.8 },
      { text: "Clean facilities and well-maintained grounds.", sentiment: 0.6 },
      { text: "Parking can be difficult during tournaments.", sentiment: -0.3 },
      { text: "The playground is a bit small compared to the sports fields.", sentiment: -0.1 },
      { text: "Love the open space and walking trails around the perimeter.", sentiment: 0.7 }
    ]
  },
  {
    id: "ntcp",
    name: "North Creek Trail Park",
    position: [47.8550, -122.2044],
    description: "Linear park with walking and biking trails that follows North Creek through Mill Creek.",
    reviews: [
      { text: "Beautiful trail for morning walks!", sentiment: 0.9 },
      { text: "I saw so much wildlife - ducks, herons, and even a beaver!", sentiment: 0.8 },
      { text: "Some sections flood during heavy rain.", sentiment: -0.4 },
      { text: "The trail is well-maintained and connects well with other paths.", sentiment: 0.6 },
      { text: "Wish there were more benches along the trail.", sentiment: -0.2 }
    ]
  },
  {
    id: "mcp",
    name: "Mill Creek Park",
    position: [47.8629, -122.2067],
    description: "Central community park with playground, picnic areas, and open space for events.",
    reviews: [
      { text: "The playground equipment is outdated and needs renovation.", sentiment: -0.5 },
      { text: "Great place for community gatherings and events!", sentiment: 0.7 },
      { text: "Beautiful flower gardens in spring and summer.", sentiment: 0.9 },
      { text: "The picnic shelters are always crowded on weekends.", sentiment: -0.3 },
      { text: "Love the seasonal decorations and community involvement here.", sentiment: 0.8 }
    ]
  },
  {
    id: "hmp",
    name: "Heron Meadows Park",
    position: [47.8440, -122.2189],
    description: "Natural wetland park with boardwalks and viewing areas for wildlife observation.",
    reviews: [
      { text: "Amazing place to see birds! Spotted several herons last visit.", sentiment: 0.9 },
      { text: "Boardwalks need repair in some sections.", sentiment: -0.4 },
      { text: "Very peaceful and serene environment.", sentiment: 0.7 },
      { text: "Educational signs about local ecosystem are informative and well-designed.", sentiment: 0.6 },
      { text: "Mosquitos can be really bad in summer months.", sentiment: -0.6 }
    ]
  },
  {
    id: "bwp",
    name: "Buffalo Park",
    position: [47.8513, -122.2236],
    description: "Small neighborhood park with playground and basketball courts.",
    reviews: [
      { text: "Perfect size for young children to play safely.", sentiment: 0.7 },
      { text: "Basketball courts need resurfacing.", sentiment: -0.5 },
      { text: "Love that it's within walking distance of our neighborhood.", sentiment: 0.6 },
      { text: "Could use more shade trees around the playground area.", sentiment: -0.2 },
      { text: "Great community atmosphere with friendly neighbors.", sentiment: 0.8 }
    ]
  },
  {
    id: "psp",
    name: "Pine Meadow Park",
    position: [47.8566, -122.2201],
    description: "Forested park with trails, picnic areas, and natural play elements.",
    reviews: [
      { text: "The natural playground is so creative! My kids love it.", sentiment: 0.9 },
      { text: "Some trails get very muddy after rain.", sentiment: -0.3 },
      { text: "Beautiful tall pines and peaceful atmosphere.", sentiment: 0.8 },
      { text: "Great for forest bathing and nature connection.", sentiment: 0.7 },
      { text: "Dog owners don't always clean up after their pets here.", sentiment: -0.7 }
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
