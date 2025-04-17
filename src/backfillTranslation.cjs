// backfillTranslations.cjs
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function translate(text, fromLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${fromLang}|en`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
  });
  const data = await res.json();
  return data?.responseData?.translatedText || null;
}

async function backfillTranslations() {
  const snapshot = await db.collection("final_reviews").get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const { originalComment, translatedComment, language } = data;

    if (language && language !== "en" && !translatedComment && originalComment) {
      try {
        const translated = await translate(originalComment, language);
        if (translated && translated !== originalComment) {
          await doc.ref.update({
            translatedComment: translated,
            needsManualReview: false,
          });
          updated++;
          console.log(`✅ Translated [${language}]: ${originalComment} → ${translated}`);
        } else {
          await doc.ref.update({
            needsManualReview: true,
          });
          console.warn(`⚠️ Unchanged or failed translation for: ${originalComment}`);
        }
      } catch (err) {
        console.error("🔥 Error translating comment:", err);
      }

      await new Promise((r) => setTimeout(r, 1000)); // be polite to the API
    }
  }

  console.log(`
✅ Backfilled translations for ${updated} reviews.`);
}

backfillTranslations().catch(console.error);
