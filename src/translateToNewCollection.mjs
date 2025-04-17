import admin from "firebase-admin";
import { franc } from "franc";
import fetch from "node-fetch";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const iso6393 = require("iso-639-3").iso6393;

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccount.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function getSafeLang(lang3) {
  const match = iso6393.find((l) => l.iso6393 === lang3);
  const fallbackMap = {
    quy: "es",
    sco: "en",
    nob: "no",
    mad: "en",
    lvs: "lv",
    ban: "id"
  };
  const iso1 = match?.iso6391 || fallbackMap[lang3];
  return iso1 || null;
}

async function translateWithMyMemory(text, fromLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|en`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
  });
  const data = await res.json();
  return data?.responseData?.translatedText || null;
}

async function transferWithTranslation() {
  const snapshot = await db.collection("reviews").get()

  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const { comment, rating, user, timestamp, park, sentiment } = data;

    if (!comment || !park) continue;

    const lang3 = franc(comment);
    console.log(`🧠 Detected lang3: ${lang3} for "${comment}"`);

    const sourceLang = getSafeLang(lang3);
    let translatedComment = null;
    let needsManualReview = false;

    if (sourceLang && sourceLang !== "en") {
      try {
        const translation = await translateWithMyMemory(comment, sourceLang);
        if (translation && translation !== comment) {
          translatedComment = translation;
          console.log(`🌍 ${comment} → ${translatedComment}`);
        } else {
          needsManualReview = true;
          console.warn(`⚠️ Translation not useful: "${comment}"`);
        }
      } catch (err) {
        console.error("🔥 Translation API error:", err.message);
        needsManualReview = true;
      }
    } else {
      translatedComment = comment;
      console.log(`🔤 Skipped translation: "${comment}" [lang=${sourceLang ?? "unknown"}]`);
    }

    await db.collection("final_final_reviews").add({
      originalComment: comment,
      translatedComment,
      needsManualReview,
      park,
      rating,
      user: user || "Anonymous",
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      sentiment: sentiment ?? null,
      language: sourceLang ?? "unknown",
    });

    count++;
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`✅ Transferred and translated ${count} reviews.`);
}

transferWithTranslation().catch(console.error);
