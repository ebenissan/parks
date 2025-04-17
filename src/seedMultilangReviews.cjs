// seedMultilangReviews.cjs
const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const parks = [
  "Ezell Road Park",
  "Whitsett Park",
  "Nolensville Park",
];

const sampleComments = {
  en: [
    "The park is huge, lots to explore!",
    "Loved the walking trails and the fresh air.",
    "Great place to bring the kids on weekends.",
    "Peaceful and clean, ideal for a morning run.",
    "Plenty of open space for picnics and sports.",
    "Nice facilities and friendly environment.",
    "Good shade and lots of benches to relax.",
    "Not very crowded on weekdays, love it!",
    "Would recommend for a casual weekend outing.",
    "Trash bins could be more frequent but still a great park."
  ],
  es: [
    "El parque es enorme, ¡mucho por explorar!",
    "Me encantaron los senderos y el aire fresco.",
    "Un gran lugar para llevar a los niños los fines de semana.",
    "Muy tranquilo y limpio, perfecto para correr por la mañana.",
    "Buena sombra y muchas zonas verdes para descansar.",
  ],
  fr: [
    "Le parc est immense, plein de choses à explorer !",
    "J'ai adoré les sentiers et l'air frais.",
    "Super endroit pour amener les enfants le week-end.",
    "Très calme, parfait pour une promenade.",
    "Des bancs partout, très pratique.",
  ],
  de: [
    "Der Park ist riesig, viel zu entdecken!",
    "Ich liebte die Wanderwege und die frische Luft.",
    "Toller Ort, um am Wochenende mit den Kindern hinzugehen.",
    "Ruhig und gepflegt, ideal für Spaziergänge.",
    "Viele Sitzgelegenheiten und Spielplätze.",
  ],
  hi: [
    "यह पार्क बहुत बड़ा है, घूमने के लिए बेहतरीन जगह है।",
    "सुबह की दौड़ के लिए एक शांत और स्वच्छ जगह।",
    "बच्चों के लिए अच्छा मनोरंजन स्थल।",
  ],
  ar: [
    "الحديقة كبيرة جدًا، الكثير لاكتشافه!",
    "مكان رائع لقضاء عطلة نهاية الأسبوع مع العائلة.",
    "مناسب للجري والتنزه الصباحي.",
  ]
};

function getRatingWithBias() {
  const roll = Math.random();
  if (roll < 0.6) return faker.number.int({ min: 4, max: 5 }); // 60% positive
  if (roll < 0.85) return 3; // 25% neutral
  return faker.number.int({ min: 1, max: 2 }); // 15% negative
}

function getSentimentFromRating(rating) {
  return rating >= 4 ? 1 : rating <= 2 ? -1 : 0;
}

async function seedMultilangReviews() {
  const langCounts = {
    en: 60,
    es: 15,
    fr: 10,
    de: 10,
    hi: 5,
    ar: 5
  };

  for (const [lang, total] of Object.entries(langCounts)) {
    const comments = sampleComments[lang];
    for (let i = 0; i < total; i++) {
      const comment = faker.helpers.arrayElement(comments);
      const rating = getRatingWithBias();

      const review = {
        park: faker.helpers.arrayElement(parks),
        originalComment: comment,
        translatedComment: lang === "en" ? comment : null,
        rating,
        sentiment: getSentimentFromRating(rating),
        user: faker.person.firstName(),
        timestamp: admin.firestore.Timestamp.fromDate(
          faker.date.between({ from: "2024-01-01", to: new Date() })
        ),
        language: lang,
        needsManualReview: lang !== "en",
      };

      await db.collection("final_reviews").add(review);
      console.log(`✅ Added [${lang}] to ${review.park}:`, comment);
    }
  }

  console.log("🎉 All multilingual reviews added!");
}

seedMultilangReviews();
