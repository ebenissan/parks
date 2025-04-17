// seedReviews.cjs
const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const parks = [
  "Antioch Park",
  "Ezell Road Park",
  "Mill Creek Greenway",
  "Whitsett Park",
  "Seven Mile Creek Park",
];

function getRandomRating() {
  return faker.number.int({ min: 1, max: 5 });
}

async function seedReviews(count = 50) {
  for (let i = 0; i < count; i++) {
    const review = {
      park: faker.helpers.arrayElement(parks),
      comment: faker.lorem.sentence({ min: 3, max: 10 }),
      rating: getRandomRating(),
      user: faker.person.firstName(),
      timestamp: admin.firestore.Timestamp.fromDate(
        faker.date.between({ from: "2024-01-01", to: new Date() })
      ),
    };

    await db.collection("reviews").add(review);
    console.log(`✅ Added to ${review.park}:`, review.comment);
  }

  console.log("🎉 All fake reviews added!");
}

seedReviews();
