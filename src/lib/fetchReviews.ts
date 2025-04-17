import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export interface Review {
  text: string;
  stars: number;
  date: string;
  user: string;
  sentiment?: number;
  translated?: string;
  keywords?: string[];
}

export interface Park {
  id: string;
  name: string;
  reviews: Review[];
}

export async function fetchReviewsByPark(): Promise<Park[]> {
  const reviewsCol = collection(db, "reviews");
  const snapshot = await getDocs(reviewsCol);

  const parkMap: Record<string, Review[]> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const parkName = data.park;

    const review: Review = {
      text: data.comment,
      stars: data.rating,
      date: data.timestamp?.toDate?.().toISOString?.() ?? new Date().toISOString(),
      user: data.user ?? "Anonymous",
      sentiment: data.sentiment,
      translated: data.translatedComment ?? null,
      keywords: data.keywords ?? [],
    };

    if (!parkMap[parkName]) {
      parkMap[parkName] = [];
    }

    parkMap[parkName].push(review);
  });

  return Object.entries(parkMap).map(([name, reviews]) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    reviews,
  }));
}
