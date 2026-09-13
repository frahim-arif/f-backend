
const BanglaQuestion = require("../../models/banglaQuestion.model");

// =====================================================
// STRIP HTML
// =====================================================

function stripHtml(text = "") {
  return text
    .toString()
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// PARSE KEYWORDS
// =====================================================

function parseKeywords(keywords) {
  if (!keywords) return [];

  if (Array.isArray(keywords)) {
    return keywords
      .map((keyword) => keyword.toString().trim())
      .filter(Boolean);
  }

  return keywords
    .toString()
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

// =====================================================
// BANGLA COMMON WORD DICTIONARY
// =====================================================

const BANGLA_WORD_MAP = {
  "প্রশ্ন": "proshno",
  "প্রশ্নঃ": "proshno",
  "প্রশ্ন:": "proshno",

  "কি": "ki",
  "কী": "ki",
  "কেন": "keno",
  "কেনো": "keno",
  "কেমন": "kemon",
  "কীভাবে": "kibhabe",
  "কিভাবে": "kibhabe",
  "কোন": "kon",
  "কোনো": "kono",
  "কোনটি": "konti",
  "কোনটা": "konta",
  "কখন": "kokhon",
  "কত": "koto",
  "কতটা": "kotota",
  "কার": "kar",
  "কারা": "kara",
  "কারও": "karor",
  "কারো": "karo",

  "যে": "je",
  "যা": "ja",
  "যিনি": "jini",
  "যারা": "jara",
  "যেটা": "jeta",
  "যেটি": "jeti",
  "যেমন": "jemon",
  "যদি": "jodi",
  "তবে": "tobe",
  "তাহলে": "tahole",
  "তাই": "tai",

  // ISLAM
  "ইসলাম": "islam",
  "ইসলামী": "islami",
  "ইসলামি": "islami",
  "মুসলিম": "muslim",
  "মুসলমান": "musolman",
  "দীন": "din",
  "দ্বীন": "din",
  "দ্বীনি": "dini",
  "দীনি": "dini",
  "শরীয়ত": "shariyat",
  "শরিয়ত": "shariyat",
  "শরীয়াহ": "shariah",
  "শরিয়াহ": "shariah",
  "ফিকহ": "fiqh",
  "ফিকহি": "fiqhi",

  "ফতোয়া": "fatwa",
  "ফতোয়া": "fatwa",
  "ফতওয়া": "fatwa",
  "ফতওয়া": "fatwa",

  "মাসআলা": "masala",
  "মাসায়েল": "masayel",
  "মাসায়েল": "masayel",

  "হুকুম": "hukum",
  "আহকাম": "ahkam",
  "বিধান": "bidhan",
  "জায়েজ": "jaiz",
  "জায়েজ": "jaiz",
  "নাজায়েজ": "najayez",
  "নাজায়েজ": "najayez",
  "হারাম": "haram",
  "হালাল": "halal",
  "মাকরূহ": "makruh",
  "মাকরুহ": "makruh",
  "মুস্তাহাব": "mustahab",
  "ফরজ": "farz",
  "ফরয": "farz",
  "ওয়াজিব": "wajib",
  "ওয়াজিব": "wajib",
  "সুন্নত": "sunnat",
  "সুন্নাহ": "sunnah",
  "নফল": "nafl",

  // NAMAZ
  "নামাজ": "namaj",
  "নামায": "namaj",
  "নামাজে": "namaje",
  "নামাযে": "namaje",
  "নামাজের": "namajer",
  "নামাযের": "namajer",
  "নামাজকে": "namajke",
  "নামাযকে": "namajke",
  "নামাজও": "namajo",
  "নামাজেরও": "namajero",
  "নামাজে-ই": "namajei",

  "সালাত": "salat",
  "সালাতে": "salate",
  "সালাতের": "salater",

  "তাকবির": "takbir",
  "তাকবীর": "takbir",
  "তাকবিরে": "takbire",
  "তাকবীরে": "takbire",

  "কিয়াম": "qiyam",
  "কিয়াম": "qiyam",
  "রুকু": "ruku",
  "রুকূ": "ruku",
  "সিজদা": "sijdah",
  "সিজদাহ": "sijdah",

  "দোয়া": "dua",
  "দোয়া": "dua",
  "দুআ": "dua",
  "দরুদ": "durood",
  "দরূদ": "durood",
  "কুনুত": "qunut",
  "বিতর": "witr",

  "ফজর": "fajr",
  "যোহর": "zuhr",
  "জোহর": "zuhr",
  "আসর": "asr",
  "মাগরিব": "maghrib",
  "এশা": "esha",
  "জুমা": "juma",
  "জুমার": "jumar",
  "জানাজা": "janaza",
  "জানাযা": "janaza",

  // QURAN / HADITH
  "কুরআন": "quran",
  "কোরআন": "quran",
  "কুরআনের": "quraner",
  "কোরআনের": "quraner",
  "কুরআনে": "qurane",
  "কোরআনে": "qurane",

  "হাদিস": "hadis",
  "হাদীস": "hadis",
  "হাদিসের": "hadiser",
  "হাদীসের": "hadiser",

  "আয়াত": "ayat",
  "আয়াত": "ayat",
  "আয়াতের": "ayater",
  "আয়াতের": "ayater",

  "সূরা": "surah",
  "সুরা": "surah",
  "সূরার": "surar",
  "সুরার": "surar",

  // ISLAMIC PEOPLE
  "আল্লাহ": "allah",
  "আল্লাহর": "allahr",
  "আল্লাহকে": "allahke",

  "রাসূল": "rasul",
  "রাসুল": "rasul",
  "রাসূলের": "rasuler",
  "রাসুলের": "rasuler",

  "নবী": "nabi",
  "নবীর": "nabir",

  "সাহাবি": "sahabi",
  "সাহাবী": "sahabi",

  "উলামা": "ulama",
  "ওলামা": "ulama",
  "আলেম": "alem",
  "আলেমদের": "alemdEr",
  "মুফতি": "mufti",
  "মুফতী": "mufti",
  "মাওলানা": "maulana",
  "হযরত": "hazrat",
  "হজরত": "hazrat",
  "হুজুর": "huzur",
  "ইমাম": "imam",
  "ইমামের": "imamer",

  // FAMILY
  "বিয়ে": "biye",
  "বিয়ে": "biye",
  "বিয়ের": "biyer",
  "বিয়ের": "biyer",
  "বিবাহ": "bibah",
  "বিবাহের": "bibaher",

  "তালাক": "talak",
  "তালাকের": "talaker",
  "খোলা": "khula",
  "নিকাহ": "nikah",
  "নিকাহের": "nikaher",

  "স্বামী": "shami",
  "স্বামীর": "shamir",
  "স্ত্রী": "stri",
  "স্ত্রীর": "strir",

  "সন্তান": "shontan",
  "সন্তানের": "shontaner",
  "শিশু": "shishu",
  "শিশুর": "shishur",
  "ছেলে": "chele",
  "ছেলের": "cheler",
  "মেয়ে": "meye",
  "মেয়ের": "meyer",
  "মা": "ma",
  "মায়ের": "mayer",
  "মায়ের": "mayer",
  "বাবা": "baba",
  "পিতা": "pita",
  "মাতা": "mata",
  "ভাই": "bhai",
  "বোন": "bon",

  // MONEY
  "টাকা": "taka",
  "টাকার": "takar",
  "সম্পদ": "shompod",
  "সম্পদের": "shompoder",
  "মাল": "mal",
  "মালের": "maler",
  "ব্যবসা": "byabsha",
  "ব্যবসায়": "byabshay",
  "ব্যবসায়": "byabshay",
  "ব্যবসার": "byabshar",
  "বেচাকেনা": "bechakena",
  "ক্রয়": "kroy",
  "ক্রয়": "kroy",
  "বিক্রয়": "bikroy",
  "বিক্রয়": "bikroy",
  "সুদ": "sud",
  "সুদের": "suder",
  "ঋণ": "rin",
  "ঋণের": "riner",
  "যাকাত": "zakat",
  "যাকাতের": "zakater",
  "সদকা": "sadaqah",
  "দান": "dan",

  // FOOD
  "খাবার": "khabar",
  "খাবারের": "khabarer",
  "খাওয়া": "khaoa",
  "খাওয়া": "khaoa",
  "খেতে": "khete",
  "খেলে": "khele",
  "পানি": "pani",
  "পানির": "panir",
  "মাংস": "mangsho",
  "মাছ": "machh",
  "দুধ": "dudh",
  "রোজা": "roja",
  "রোযা": "roja",
  "রোজার": "rojar",
  "রোযার": "rojar",
  "ইফতার": "iftar",
  "সেহরি": "sehri",
  "সেহরী": "sehri",

  // COMMON
  "ফল": "phol",
  "আসার": "ashar",
  "পর": "por",
  "বদু": "budu",
  "সালাহ": "salah",
  "আগে": "age",
  "তা": "ta",
  "বিক্রি": "bikri",
  "করার": "korar",
  "বিধান": "bidhan",
  "তবে": "tobe",
  "যেহেতু": "jehetu",
  "কারণ": "karon",
  "জন্য": "jonno",
  "জন্যই": "jonnoi",
  "সঙ্গে": "shonge",
  "সাথে": "sathe",
  "মধ্যে": "moddhe",
  "ভিতরে": "bhitore",
  "বাইরে": "baire",
  "উপর": "upar",
  "এবং": "ebong",
  "ও": "o",
  "আর": "ar",
  "অথবা": "othoba",
  "কিন্তু": "kintu",
  "থেকে": "theke",
  "পর্যন্ত": "porjonto",
  "মতো": "moto",
  "মত": "moto",
  "সম্পর্কে": "shomporke",
  "বিষয়ে": "bishoye",
  "বিষয়ে": "bishoye",
  "বিষয়": "bishoy",
  "বিষয়": "bishoy",
  "সমস্যা": "shomoshsha",
  "সমস্যার": "shomoshshar",
  "সমাধান": "shomadhan",
  "সমাধানের": "shomadhaner",
  "উত্তর": "uttor",
  "ব্যাখ্যা": "byakkha",
  "নিয়ম": "niyom",
  "নিয়ম": "niyom",
  "নিয়মের": "niyomer",
  "নিয়মের": "niyomer",
  "শর্ত": "shorto",
  "প্রয়োজন": "proyojon",
  "প্রয়োজন": "proyojon",
  "সময়": "shomoy",
  "সময়": "shomoy",
  "দিন": "din",
  "দিনের": "diner",
  "রাত": "rat",
  "রাতে": "rate",
  "বছর": "bochor",
  "বছরের": "bochorer",
  "মাস": "mash",
  "মাসের": "masher",

  // ACTIONS
  "করা": "kora",
  "করতে": "korte",
  "করলে": "korle",
  "করেন": "koren",
  "করেছে": "koreche",
  "করেছেন": "korechen",
  "করবেন": "korben",

  "হওয়া": "howa",
  "হওয়া": "howa",
  "হলে": "hole",
  "হয়": "hoy",
  "হয়": "hoy",
  "হয়ে": "hoye",
  "হয়ে": "hoye",
  "হওয়ার": "howar",
  "হওয়ার": "howar",

  "থাকা": "thaka",
  "থাকে": "thake",
  "থাকলে": "thakle",
  "থাকার": "thakar",

  "দেওয়া": "deoa",
  "দেওয়া": "deoa",
  "দিয়ে": "diye",
  "দিয়ে": "diye",
  "দেওয়ার": "dewar",
  "দেওয়ার": "dewar",

  "নেওয়া": "neoa",
  "নেওয়া": "neoa",
  "নিয়ে": "niye",
  "নিয়ে": "niye",

  "পাওয়া": "paoa",
  "পাওয়া": "paoa",
  "পেলে": "pele",

  "যাওয়া": "jaoa",
  "যাওয়া": "jaoa",
  "যায়": "jay",
  "যায়": "jay",

  "আসা": "asha",
  "আসে": "ashe",
  "আসলে": "ashole",

  "বলা": "bola",
  "বলেন": "bolen",
  "বলেছেন": "bolechen",

  "জানা": "jana",
  "জানলে": "janle",
  "জানানো": "janano",

  "পড়া": "pora",
  "পড়া": "pora",
  "লেখা": "lekha",

  // PLACES
  "মসজিদ": "mosjid",
  "মসজিদের": "mosjider",
  "মাদরাসা": "madrasah",
  "মাদ্রাসা": "madrasah",
  "মাদরাসার": "madrasar",
  "মাদ্রাসার": "madrasar",
  "বাড়ি": "bari",
  "বাড়ি": "bari",
  "বাড়ির": "barir",
  "বাড়ির": "barir",
  "ঘর": "ghor",
  "ঘরের": "ghorer",
  "স্থান": "sthan",
  "স্থানে": "sthane",

  // MODERN
  "মোবাইল": "mobile",
  "মোবাইলের": "mobiler",
  "ফোন": "phone",
  "ফোনের": "phoner",
  "ইন্টারনেট": "internet",
  "অনলাইন": "online",
  "অফলাইন": "offline",
  "ফেসবুক": "facebook",
  "হোয়াটসঅ্যাপ": "whatsapp",
  "হোয়াটসঅ্যাপ": "whatsapp",
  "ইউটিউব": "youtube",
  "কম্পিউটার": "computer",
  "প্রযুক্তি": "projukti",
  "আধুনিক": "adhunik",
  "নতুন": "notun",
  "পুরাতন": "puraton",
  "পুরনো": "purono",
  "বর্তমান": "bortoman",
  "বর্তমানে": "bortomane",
  "সমকালীন": "shomokalin",
  "সমাজ": "shomaj",
  "সমাজের": "shomajer",
  "সামাজিক": "shamajik",
};

// =====================================================
// BANGLA CHARACTER FALLBACK
// =====================================================

const BANGLA_CONSONANTS = {
  "ক": "k",
  "খ": "kh",
  "গ": "g",
  "ঘ": "gh",
  "ঙ": "ng",
  "চ": "ch",
  "ছ": "chh",
  "জ": "j",
  "ঝ": "jh",
  "ঞ": "n",
  "ট": "t",
  "ঠ": "th",
  "ড": "d",
  "ঢ": "dh",
  "ণ": "n",
  "ত": "t",
  "থ": "th",
  "দ": "d",
  "ধ": "dh",
  "ন": "n",
  "প": "p",
  "ফ": "ph",
  "ব": "b",
  "ভ": "bh",
  "ম": "m",
  "য": "j",
  "র": "r",
  "ল": "l",
  "শ": "sh",
  "ষ": "sh",
  "স": "s",
  "হ": "h",
  "ড়": "r",
  "ঢ়": "rh",
  "য়": "y",
  "ৎ": "t",
};

const BANGLA_VOWELS = {
  "অ": "o",
  "আ": "a",
  "ই": "i",
  "ঈ": "i",
  "উ": "u",
  "ঊ": "u",
  "ঋ": "ri",
  "এ": "e",
  "ঐ": "oi",
  "ও": "o",
  "ঔ": "ou",
};

const BANGLA_MATRAS = {
  "া": "a",
  "ি": "i",
  "ী": "i",
  "ু": "u",
  "ূ": "u",
  "ৃ": "ri",
  "ে": "e",
  "ৈ": "oi",
  "ো": "o",
  "ৌ": "ou",
};

const BANGLA_SIGNS = {
  "ং": "ng",
  "ঃ": "h",
  "ঁ": "n",
  "ৎ": "t",
};

// =====================================================
// FALLBACK BANGLA → ROMAN
// =====================================================

function transliterateBanglaFallback(text = "") {
  let result = "";
  const chars = [...text];

  const numbers = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const next = chars[i + 1];

    if (BANGLA_VOWELS[char]) {
      result += BANGLA_VOWELS[char];
      continue;
    }

    if (BANGLA_CONSONANTS[char]) {
      const consonant = BANGLA_CONSONANTS[char];

      if (next === "্") {
        result += consonant;
        i++;
        continue;
      }

      if (BANGLA_MATRAS[next]) {
        result += consonant + BANGLA_MATRAS[next];
        i++;
        continue;
      }

      result += consonant + "o";
      continue;
    }

    if (BANGLA_SIGNS[char]) {
      result += BANGLA_SIGNS[char];
      continue;
    }

    if (numbers[char]) {
      result += numbers[char];
      continue;
    }

    result += char;
  }

  return result;
}

// =====================================================
// NORMALIZE BANGLA WORD
// =====================================================

function normalizeBanglaWord(word = "") {
  return word
    .normalize("NFC")
    .replace(/[“”‘’]/g, "")
    .trim();
}

// =====================================================
// BANGLA → ROMAN
// =====================================================

function banglaToRoman(text = "") {
  if (!text) return "";

  const normalizedText = text
    .toString()
    .normalize("NFC")
    .trim();

  const parts = normalizedText.split(/(\s+)/);

  return parts
    .map((part) => {
      if (/^\s+$/.test(part)) {
        return part;
      }

      const word = normalizeBanglaWord(part);

      const cleanWord = word
        .replace(/^[,،.!?؟:;؛"'“”‘’()[\]{}]+/, "")
        .replace(/[,،.!?؟:;؛"'“”‘’()[\]{}]+$/, "");

      if (BANGLA_WORD_MAP[cleanWord]) {
        const roman = BANGLA_WORD_MAP[cleanWord];

        const prefix =
          word.match(/^[,،.!?؟:;؛"'“”‘’()[\]{}]+/)?.[0] || "";

        const suffix =
          word.match(/[,،.!?؟:;؛"'“”‘’()[\]{}]+$/)?.[0] || "";

        return prefix + roman + suffix;
      }

      return transliterateBanglaFallback(word);
    })
    .join("");
}

// =====================================================
// CREATE SIMPLE ROMAN SLUG
// =====================================================

function createSimpleSlug(text) {
  if (!text) return "no-slug";

  let romanText = banglaToRoman(text);

  const phraseMap = [
    ["qahqaha diye", "qahqaha-diye"],
    ["uchchosshore qahqaha", "uchchosshore-qahqaha"],
    ["uchchosshore qahqaha diye", "uchchosshore-qahqaha-diye"],
    ["o namajer", "o-namajer"],
    ["o namaje", "o-namaje"],
    ["namajer hukum", "namajer-hukum"],
    ["namaje hukum", "namaje-hukum"],
  ];

  for (const [from, to] of phraseMap) {
    const regex = new RegExp(
      `\\b${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi"
    );

    romanText = romanText.replace(regex, to);
  }

  const slug = romanText
    .toLowerCase()
    .trim()
    .replace(/[।॥]/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter(Boolean)
    .slice(0, 15)
    .join("-");

  return slug || "no-slug";
}

// =====================================================
// MAKE UNIQUE SLUG
// =====================================================

async function makeUniqueSlug(baseSlug, id = null) {
  const cleanBaseSlug = baseSlug || "no-slug";

  let finalSlug = cleanBaseSlug;
  let count = 1;

  while (
    await BanglaQuestion.findOne({
      slug: finalSlug,
      ...(id
        ? {
            _id: {
              $ne: id,
            },
          }
        : {}),
    })
  ) {
    finalSlug = `${cleanBaseSlug}-${count}`;
    count++;
  }

  return finalSlug;
}

// =====================================================
// CREATE BANGLA QUESTION
// POST /api/bn/questions
// =====================================================

exports.createBanglaQuestion = async (req, res) => {
  try {
    console.log("=================================");
    console.log("BANGLA QUESTION BODY:", req.body);
    console.log("=================================");

    const {
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      category,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla question is required",
      });
    }

    if (!answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla answer is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Bangla category is required",
      });
    }

    // =================================================
    // SLUG
    // =================================================

    let baseSlug = "";

    if (slug?.trim()) {
      baseSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    } else {
      baseSlug = createSimpleSlug(question);
    }

    if (!baseSlug) {
      baseSlug = createSimpleSlug(question);
    }

    const finalSlug = await makeUniqueSlug(baseSlug);

    console.log("Manual/Generated Base Slug:", baseSlug);
    console.log("Final Roman Slug:", finalSlug);

    // =================================================
    // KEYWORDS
    // =================================================

    const keywordArray = parseKeywords(keywords);

    // =================================================
    // CREATE
    // =================================================

    const newQuestion = await BanglaQuestion.create({
      question: question.trim(),

      answer: answer.trim(),

      hawala1: hawala1?.trim() || "",

      hawala2: hawala2?.trim() || "",

      hawala3: hawala3?.trim() || "",

      slug: finalSlug,

      metaTitle:
        metaTitle?.trim() || question.trim(),

      metaDescription:
        metaDescription?.trim() ||
        stripHtml(answer).slice(0, 155),

      keywords: keywordArray,

      category,
    });

    console.log("✅ BANGLA QUESTION CREATED:");
    console.log(newQuestion);

    return res.status(201).json({
      success: true,
      message: "Bangla question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("❌ BANGLA CREATE ERROR:", error);

    // Duplicate slug
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
        error: error.message,
      });
    }

    // Mongoose validation
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to add Bangla question",
    });
  }
};

// =====================================================
// GET ALL BANGLA QUESTIONS
// GET /api/bn/questions
// =====================================================

exports.getBanglaQuestions = async (req, res) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;

    const questions =
      await BanglaQuestion.find()
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate("category");

    const total =
      await BanglaQuestion.countDocuments();

    return res.json({
      success: true,
      data: questions,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error("❌ BANGLA GET ERROR:", error);

    return res.status(500).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
};

// =====================================================
// GET BANGLA QUESTION BY SLUG
// GET /api/bn/questions/slug/:slug
// =====================================================

exports.getBanglaQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const question =
      await BanglaQuestion.findOne({
        $or: [
          {
            slug: slug,
          },
          {
            oldSlugs: slug,
          },
        ],
      }).populate("category");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Bangla question not found",
      });
    }

    return res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("❌ BANGLA SLUG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE BANGLA QUESTION
// PUT /api/bn/questions/:id
// =====================================================

exports.updateBanglaQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const existing =
      await BanglaQuestion.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bangla question not found",
      });
    }

    const {
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      category,
    } = req.body;

    // =================================================
    // QUESTION
    // =================================================

    let questionChanged = false;

    if (question !== undefined) {
      if (!question.trim()) {
        return res.status(400).json({
          success: false,
          message: "Bangla question is required",
        });
      }

      const newQuestion = question.trim();

      if (existing.question !== newQuestion) {
        questionChanged = true;
      }

      existing.question = newQuestion;
    }

    // =================================================
    // ANSWER
    // =================================================

    if (answer !== undefined) {
      if (!answer.trim()) {
        return res.status(400).json({
          success: false,
          message: "Bangla answer is required",
        });
      }

      existing.answer = answer.trim();
    }

    // =================================================
    // HAWALA
    // =================================================

    if (hawala1 !== undefined) {
      existing.hawala1 = hawala1.trim();
    }

    if (hawala2 !== undefined) {
      existing.hawala2 = hawala2.trim();
    }

    if (hawala3 !== undefined) {
      existing.hawala3 = hawala3.trim();
    }

    // =================================================
    // CATEGORY
    // =================================================

    if (category !== undefined) {
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Bangla category is required",
        });
      }

      existing.category = category;
    }

    // =================================================
    // META TITLE
    // =================================================

    if (metaTitle !== undefined) {
      existing.metaTitle =
        metaTitle.trim();

      if (
        !metaTitle.trim() &&
        question !== undefined
      ) {
        existing.metaTitle =
          question.trim();
      }
    }

    // =================================================
    // META DESCRIPTION
    // =================================================

    if (metaDescription !== undefined) {
      existing.metaDescription =
        metaDescription.trim();

      if (
        !metaDescription.trim() &&
        answer !== undefined
      ) {
        existing.metaDescription =
          stripHtml(answer).slice(0, 155);
      }
    }

    // =================================================
    // KEYWORDS
    // =================================================

    if (keywords !== undefined) {
      existing.keywords =
        parseKeywords(keywords);
    }

    // =================================================
    // MANUAL SLUG
    // =================================================

    if (slug !== undefined && slug.trim()) {
      const requestedSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (
        requestedSlug &&
        requestedSlug !== existing.slug
      ) {
        const finalSlug =
          await makeUniqueSlug(
            requestedSlug,
            id
          );

        if (existing.slug) {
          existing.oldSlugs =
            existing.oldSlugs || [];

          if (
            !existing.oldSlugs.includes(
              existing.slug
            )
          ) {
            existing.oldSlugs.push(
              existing.slug
            );
          }
        }

        existing.slug = finalSlug;
      }
    } else if (questionChanged) {
      // =================================================
      // QUESTION CHANGED → GENERATE NEW SLUG
      // =================================================

      const generatedSlug =
        createSimpleSlug(existing.question);

      const finalSlug =
        await makeUniqueSlug(
          generatedSlug,
          id
        );

      if (
        existing.slug &&
        existing.slug !== finalSlug
      ) {
        existing.oldSlugs =
          existing.oldSlugs || [];

        if (
          !existing.oldSlugs.includes(
            existing.slug
          )
        ) {
          existing.oldSlugs.push(
            existing.slug
          );
        }
      }

      existing.slug = finalSlug;
    }

    // =================================================
    // SAVE
    // =================================================

    await existing.save();

    return res.json({
      success: true,
      message:
        "Bangla question updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error(
      "❌ BANGLA UPDATE ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update Bangla question",
    });
  }
};

// =====================================================
// DELETE BANGLA QUESTION
// DELETE /api/bn/questions/:id
// =====================================================

exports.deleteBanglaQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question =
      await BanglaQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Bangla question not found",
      });
    }

    await BanglaQuestion.findByIdAndDelete(id);

    return res.json({
      success: true,
      message:
        "Bangla question deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ BANGLA DELETE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete Bangla question",
    });
  }
};

