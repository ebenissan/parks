import admin from "firebase-admin";
import { franc } from "franc";
import fetch from "node-fetch";
import fs from "fs";
import { createRequire } from "module"; // ✅ this is the key!

const require = createRequire(import.meta.url);
const iso6393 = require("iso-639-3"); // ✅ load CommonJS module correctly

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccount.json", "utf-8"));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const supportedLangs = ["ur", "es", "fr", "hi", "ar", "de", "zh", "ru", "tr"];

function getSafeLang(lang3) {
  const match = iso6393.iso6393.find((l) => l.iso6393 === lang3); // ✅

  const iso1 = match?.iso6391;
  return supportedLangs.includes(iso1) ? iso1 : null;
}

async function translate(text, fromLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|en`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.responseData?.translatedText || null;
}

async function backfillTranslations() {
  const snapshot = await db.collection("reviews").get();
  const updates = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.translatedComment || !data.comment) continue;

    const lang3 = franc(data.comment);
    const sourceLang = getSafeLang(lang3);

    if (sourceLang && sourceLang !== "en") {
      const translated = await translate(data.comment, sourceLang);
      console.log(`🌍 ${data.comment} → ${translated}`);
      updates.push(doc.ref.update({
        translatedComment: translated,
        language: sourceLang,
      }));
    } else {
      await doc.ref.update({ language: sourceLang || "unknown" });
    }
  }

  await Promise.all(updates);
  console.log(`✅ Backfilled translations for ${updates.length} reviews.`);
}

backfillTranslations();
