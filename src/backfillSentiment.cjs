// backfillSentiment.cjs
const admin = require("firebase-admin");
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// Load service account credentials
const serviceAccount = require("../serviceAccount.json"); // ✅ adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function backfillSentiment() {
  const snapshot = await db.collection("reviews").get();
  const updates = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const analysis = sentiment.analyze(data.comment || "");
    const sentimentScore = analysis.score;

    updates.push(doc.ref.update({ sentiment: sentimentScore }));
  });

  await Promise.all(updates);
  console.log(`✅ Backfilled sentiment for ${updates.length} reviews.`);
}

backfillSentiment().catch((err) => {
  console.error("❌ Error during backfill:", err);
});
