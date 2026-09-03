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
// Exact word matching is used first.
// This gives much better SEO slugs than character mapping.
// =====================================================

const BANGLA_WORD_MAP = {
  // ---------------------------------------------------
  // QUESTION WORDS
  // ---------------------------------------------------

  "প্রশ্ন": "proshno",
  "প্রশ্নঃ": "proshno",
  "প্রশ্ন:" : "proshno",

  "কি": "ki",
  "কী": "ki",
  "কেন": "keno",
  "কেনো": "keno",
  "কেমন": "kemon",
  "কীভাবে": "kibhabe",
  "কিভাবে": "kibhabe",
  "কীভাবে": "kibhabe",
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

  // ---------------------------------------------------
  // ISLAM / DEEN
  // ---------------------------------------------------

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
  "মাসআলা": "masala",
  "মাসায়েল": "masayel",
  "মাসায়েল": "masayel",
  "মাসআলা-মাসায়েল": "masala-masayel",
  "হুকুম": "hukum",
  "আহকাম": "ahkam",
  "বিধান": "bidhan",
  "বিধি": "bidhi",
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
  "ওয়াক্ত": "waqt",
  "ওয়াক্ত": "waqt",
  "ইবাদত": "ibadat",
  "আমল": "amal",
  "আকিদা": "aqidah",
  "আকীদা": "aqidah",
  "আকিদাহ": "aqidah",
  "আখিরাত": "akhirat",
  "দুনিয়া": "duniya",
  "দুনিয়া": "duniya",
  "জান্নাত": "jannat",
  "জাহান্নাম": "jahannam",

  // ---------------------------------------------------
  // NAMAZ
  // ---------------------------------------------------

  "নামাজ": "namaj",
  "নামায": "namaj",
  "নামাজে": "namaje",
  "নামাযে": "namaje",
  "নামাজের": "namajer",
  "নামাযের": "namajer",
  "নামাজকে": "namajke",
  "নামাযকে": "namajke",
  "নামাজে": "namaje",
  "নামাজও": "namajo",
  "নামাজেরও": "namajero",
  "নামাজে-ই": "namajei",
  "সালাত": "salat",
  "সালাতে": "salate",
  "সালাতের": "salater",
  "সালাতকে": "salatke",
  "তাকবির": "takbir",
  "তাকবীর": "takbir",
  "তাকবিরে": "takbire",
  "তাকবীরে": "takbire",
  "তাকবিরে-তাহরিমা": "takbire-tahrima",
  "তাকবীরে-তাহরিমা": "takbire-tahrima",
  "কিয়াম": "qiyam",
  "কিয়াম": "qiyam",
  "রুকু": "ruku",
  "রুকূ": "ruku",
  "সিজদা": "sijdah",
  "সিজদাহ": "sijdah",
  "সিজদায়": "sijdai",
  "সিজদায়": "sijdai",
  "কিরাআত": "qiraat",
  "কিরাত": "qirat",
  "তাশাহহুদ": "tashahhud",
  "দোয়া": "dua",
  "দোয়া": "dua",
  "দুআ": "dua",
  "দরুদ": "durood",
  "দরূদ": "durood",
  "কুনুত": "qunut",
  "বিতর": "witr",
  "এশা": "esha",
  "ফজর": "fajr",
  "যোহর": "zuhr",
  "জোহর": "zuhr",
  "আসর": "asr",
  "মাগরিব": "maghrib",
  "জুমা": "juma",
  "জুমআর": "jumar",
  "জুমার": "jumar",
  "তারাবি": "tarabi",
  "তারাবী": "tarabi",
  "ঈদ": "eid",
  "ঈদের": "eider",
  "ঈদাইন": "eidain",
  "জানাজা": "janaza",
  "জানাযা": "janaza",
  "জানাজার": "janazar",

  // ---------------------------------------------------
  // WUDU / PURIFICATION
  // ---------------------------------------------------

  "ওজু": "oju",
  "ওযু": "oju",
  "অজু": "oju",
  "অযু": "oju",
  "ওজুর": "ojur",
  "ওযুর": "ojur",
  "অজুর": "ojur",
  "অযুর": "ojur",
  "ওজুতে": "ojute",
  "ওযুতে": "ojute",
  "অজুতে": "ojute",
  "অযুতে": "ojute",
  "গোসল": "gosol",
  "গোসলের": "gosoler",
  "গোসলকে": "gosolke",
  "তায়াম্মুম": "tayammum",
  "তায়াম্মুম": "tayammum",
  "পবিত্রতা": "pobitrota",
  "পবিত্র": "pobitro",
  "নাপাক": "napak",
  "পাক": "pak",
  "পাক-পবিত্র": "pak-pobitro",
  "পবিত্রকরণ": "pobitrokoron",

  // ---------------------------------------------------
  // QURAN / HADITH
  // ---------------------------------------------------
  "মসজিদের": "mosjider",
"জামাত": "jamat",
"জামাতে": "jamate",
"জামাতের": "jamater",

"ছেড়ে": "chhere",
"ছাড়ার": "charar",
"ছাড়া": "chhara",

"বাড়িতে": "barite",
"বাড়ির": "barir",
"বাড়ি": "bari",

"সঙ্গে": "songe",
"সাথে": "sathe",

"নামাজ": "namaj",
"নামাজে": "namaje",
"নামাজের": "namajer",
"নামাজের": "namajer",
"নামাজ পড়া": "namaj-pora",
"নামাজ পড়ার": "namaj-porar",

"হুকুম": "hukum",
"হুকুম কী": "hukum-ki",
"কী": "ki",
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
  "হাদিসে": "hadise",
  "হাদীসে": "hadise",
  "সুন্নাহ": "sunnah",
  "আয়াত": "ayat",
  "আয়াত": "ayat",
  "আয়াতের": "ayater",
  "আয়াতের": "ayater",
  "সূরা": "surah",
  "সুরা": "surah",
  "সূরার": "surar",
  "সুরার": "surar",
  "তাফসির": "tafsir",
  "তাফসীর": "tafsir",
  "তাফসিরের": "tafsirer",
  "তাফসীরের": "tafsirer",

  // ---------------------------------------------------
  // ARABIC / ISLAMIC TERMS
  // ---------------------------------------------------

  "আল্লাহ": "allah",
  "আল্লাহর": "allahr",
  "আল্লাহকে": "allahke",
  "আল্লাহরও": "allahro",
  "রাসূল": "rasul",
  "রাসুল": "rasul",
  "রাসূলের": "rasuler",
  "রাসুলের": "rasuler",
  "নবী": "nabi",
  "নবীর": "nabir",
  "নবীজি": "nabiji",
  "সাহাবি": "sahabi",
  "সাহাবী": "sahabi",
  "সাহাবিদের": "sahabider",
  "সাহাবীগণ": "sahabigan",
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
  "ইমামতি": "imamat",
  "মুয়াজ্জিন": "muazzin",
  "মুয়াজ্জিন": "muazzin",
  "খতিব": "khatib",
  "খতীব": "khatib",

  // ---------------------------------------------------
  // FAMILY / SOCIAL
  // ---------------------------------------------------

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
  "মেয়ে": "meye",
  "মায়ের": "mayer",
  "মায়ের": "mayer",
  "মা": "ma",
  "বাবা": "baba",
  "পিতা": "pita",
  "মাতা": "mata",
  "ভাই": "bhai",
  "বোন": "bon",

  // ---------------------------------------------------
  // MONEY / BUSINESS
  // ---------------------------------------------------

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
  "সাদাকা": "sadaqah",
  "দান": "dan",
  "দান করা": "dan-kora",

  // ---------------------------------------------------
  // FOOD
  // ---------------------------------------------------

  "খাবার": "khabar",
  "খাবারের": "khabarer",
  "খাওয়া": "khaoa",
  "খাওয়া": "khaoa",
  "খেতে": "khete",
  "খেলে": "khele",
  "পান করা": "pan-kora",
  "পানি": "pani",
  "পানির": "panir",
  "মাংস": "mangsho",
  "মাছ": "machh",
  "দুধ": "dudh",
  "রোজা": "roja",
  "রোযা": "roja",
  "রোজার": "rojar",
  "রোযার": "rojar",
  "রোজায়": "rojay",
  "রোজায়": "rojay",
  "ইফতার": "iftar",
  "সেহরি": "sehri",
  "সেহরী": "sehri",

  // ---------------------------------------------------
  // COMMON BANGLA WORDS
  // ---------------------------------------------------

  "এবং": "ebong",
  "ও": "o",
  "আর": "ar",
  "অথবা": "othoba",
  "কিন্তু": "kintu",
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
  "নিচে": "niche",
  "আগে": "age",
  "পরে": "pore",
  "পর": "por",
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
  "উত্তরটি": "uttorti",
  "উত্তর কী": "uttor-ki",
  "ব্যাখ্যা": "byakkha",
  "ব্যাখ্যার": "byakkhar",
  "নিয়ম": "niyom",
  "নিয়ম": "niyom",
  "নিয়মের": "niyomer",
  "নিয়মের": "niyomer",
  "শর্ত": "shorto",
  "শর্তের": "shorter",
  "কার্যকর": "karyokor",
  "প্রযোজ্য": "projojjo",
  "প্রয়োজন": "proyojon",
  "প্রয়োজন": "proyojon",
  "প্রয়োজনীয়": "proyojoniyo",
  "প্রয়োজনীয়": "proyojoniyo",
  "সময়": "shomoy",
  "সময়": "shomoy",
  "সময়ের": "shomoyer",
  "সময়ের": "shomoyer",
  "দিন": "din",
  "দিনের": "diner",
  "রাত": "rat",
  "রাতে": "rate",
  "বছর": "bochor",
  "বছরের": "bochorer",
  "মাস": "mash",
  "মাসের": "masher",
  "তিন": "tin",
  "দুই": "dui",
  "এক": "ek",
  "একটি": "ekti",
  "একজন": "ekjon",
  "দশ": "dosh",
  "শত": "shot",
  "হাজার": "hajar",

  // ---------------------------------------------------
  // COMMON ACTIONS
  // ---------------------------------------------------

  "করা": "kora",
  "করার": "korar",
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
  "পাওয়ার": "paowar",
  "পাওয়ার": "paowar",
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
  "শোনা": "shona",
  "শুনলে": "shunle",
  "দেখা": "dekha",
  "দেখলে": "dekhle",
  "জানা": "jana",
  "জানলে": "janle",
  "জানানো": "janano",
  "মানা": "mana",
  "মানলে": "manle",
  "পড়া": "pora",
  "পড়া": "pora",
  "পড়লে": "porle",
  "পড়লে": "porle",
  "লেখা": "lekha",
  "লিখলে": "likhle",

  // ---------------------------------------------------
  // VERY COMMON FATAWA WORDS
  // ---------------------------------------------------

  "হাসলে": "hasle",
  "হাসা": "hasha",
  "হাসি": "hashi",
  "হাসির": "hashir",
  "কহকহা": "qahqaha",
  "কহকহা হাসলে": "qahqaha-hasle",
  "উচ্চস্বরে": "uchchosshore",
  "উচ্চস্বরে হাসলে": "uchchosshore-hasle",
  "নিম্নস্বরে": "nimnosshore",
  "আস্তে": "aste",
  "জোরে": "jore",
  "শব্দ": "shobdo",
  "শব্দে": "shobde",
  "শব্দের": "shobder",
  "শব্দ করা": "shobdo-kora",
  "ভুল": "bhul",
  "ভুলের": "bhuler",
  "ভুলভাবে": "bhulbhabe",
  "সঠিক": "shothik",
  "সঠিকভাবে": "shothikbhabe",
  "ঠিক": "thik",
  "ঠিকভাবে": "thikbhabe",
  "বৈধ": "boidho",
  "অবৈধ": "oboidho",
  "সহিহ": "sahih",
  "সহীহ": "sahih",
  "দুরস্ত": "durust",
  "শুদ্ধ": "shuddho",
  "নষ্ট": "noshto",
  "ভঙ্গ": "bhongo",
  "ভেঙে": "bhenge",
  "বাতিল": "batil",
  "বাতিল হবে": "batil-hobe",
  "ভেঙে যায়": "bhenge-jay",
  "ভেঙে যায়": "bhenge-jay",
  "ওয়াক্ত": "waqt",
  "ওয়াক্ত": "waqt",
  "নিয়ত": "niyat",
  "নিয়ত": "niyat",
  "নিয়তের": "niyoter",
  "নিয়তের": "niyoter",
  "ইচ্ছা": "iccha",
  "ইচ্ছার": "icchar",
  "শর্ত": "shorto",
  "শর্তসাপেক্ষে": "shortosapekkhe",
  "কারণ": "karon",
  "প্রমাণ": "proman",
  "দলিল": "dalil",
  "দলিলের": "daliler",
  "হাদিসের": "hadiser",
  "কিতাব": "kitab",
  "কিতাবের": "kitaber",
  "ফকিহ": "faqih",
  "ফকীহ": "faqih",
  "ফকিহদের": "faqihder",
  "ফতোয়ার": "fatwar",
  "ফতোয়ার": "fatwar",
  "ফতোয়ায়": "fatway",
  "ফতোয়ায়": "fatway",

  // ---------------------------------------------------
  // PLACE / PEOPLE
  // ---------------------------------------------------

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
  "স্থানীয়": "sthaniyo",
  "স্থানীয়": "sthaniyo",

  // ---------------------------------------------------
  // MODERN / GENERAL FATAWA
  // ---------------------------------------------------

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
  "প্রযুক্তির": "projukti-r",
  "আধুনিক": "adhunik",
  "আধুনিকতার": "adhunikotar",
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
// Dictionary word না থাকলে এই fallback কাজ করবে.
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

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const next = chars[i + 1];

    // Independent vowel
    if (BANGLA_VOWELS[char]) {
      result += BANGLA_VOWELS[char];
      continue;
    }

    // Consonant
    if (BANGLA_CONSONANTS[char]) {
      const consonant = BANGLA_CONSONANTS[char];

      // Hasanta means no inherent vowel
      if (next === "্") {
        result += consonant;
        i++;
        continue;
      }

      // Vowel sign
      if (BANGLA_MATRAS[next]) {
        result += consonant + BANGLA_MATRAS[next];
        i++;
        continue;
      }

      // Otherwise Bengali consonant has inherent "o"
      result += consonant + "o";
      continue;
    }

    // Bengali signs
    if (BANGLA_SIGNS[char]) {
      result += BANGLA_SIGNS[char];
      continue;
    }

    // Bengali numbers
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

    if (numbers[char]) {
      result += numbers[char];
      continue;
    }

    // Keep English letters/numbers
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

  // Split by whitespace but keep spaces
  const parts = normalizedText.split(/(\s+)/);

  return parts
    .map((part) => {
      // Space
      if (/^\s+$/.test(part)) {
        return part;
      }

      const word = normalizeBanglaWord(part);

      // Remove punctuation only for dictionary lookup
      const cleanWord = word
        .replace(/^[,،.!?؟:;؛"'“”‘’()[\]{}]+/, "")
        .replace(/[,،.!?؟:;؛"'“”‘’()[\]{}]+$/, "");

      // Dictionary match
      if (BANGLA_WORD_MAP[cleanWord]) {
        const roman = BANGLA_WORD_MAP[cleanWord];

        // Preserve basic punctuation
        const prefix = word.match(/^[,،.!?؟:;؛"'“”‘’()[\]{}]+/)?.[0] || "";
        const suffix = word.match(/[,،.!?؟:;؛"'“”‘’()[\]{}]+$/)?.[0] || "";

        return prefix + roman + suffix;
      }

      // Fallback transliteration
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

  // ---------------------------------------------------
  // Common multi-word corrections
  // ---------------------------------------------------

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
    romanText = romanText.replace(
      new RegExp(`\\b${from}\\b`, "gi"),
      to
    );
  }

  const slug = romanText
    .toLowerCase()
    .trim()

    // Bangla punctuation / unwanted punctuation
    .replace(/[।॥]/g, " ")

    // Keep only Roman letters, numbers, spaces and hyphen
    .replace(/[^a-z0-9\s-]/g, "")

    // Spaces → hyphen
    .replace(/\s+/g, "-")

    // Multiple hyphens
    .replace(/-+/g, "-")

    // Remove starting/ending hyphen
    .replace(/^-+|-+$/g, "")

    .split("-")
    .filter(Boolean)

    // Maximum 15 words
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
      metaTitle,
      metaDescription,
      keywords,
      category,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

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

    // -------------------------------------------------
    // ALWAYS GENERATE ROMAN SLUG FROM QUESTION
    // -------------------------------------------------

    const generatedSlug = createSimpleSlug(question);

    const finalSlug = await makeUniqueSlug(generatedSlug);

    console.log("Generated Roman Slug:", generatedSlug);
    console.log("Final Roman Slug:", finalSlug);

    // -------------------------------------------------
    // KEYWORDS
    // -------------------------------------------------

    const keywordArray = parseKeywords(keywords);

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------

    const newQuestion = await BanglaQuestion.create({
      question: question.trim(),

      answer: answer.trim(),

      hawala1: hawala1?.trim() || "",

      hawala2: hawala2?.trim() || "",

      hawala3: hawala3?.trim() || "",

      // ALWAYS ROMAN
      slug: finalSlug,

      metaTitle:
        metaTitle?.trim() ||
        question.trim(),

      metaDescription:
        metaDescription?.trim() ||
        stripHtml(answer).slice(0, 155),

      keywords: keywordArray,

      category,
    });

    return res.status(201).json({
      success: true,
      message: "Bangla question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("❌ BANGLA CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
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

      if (!metaTitle.trim() && question !== undefined) {
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
    // AUTO ROMAN SLUG
    // =================================================
    // If question changes:
    // 1. Generate new Roman slug
    // 2. Save old slug in oldSlugs
    // 3. New slug becomes active slug
    // =================================================

    if (questionChanged) {
      const generatedSlug =
        createSimpleSlug(existing.question);

      const finalSlug =
        await makeUniqueSlug(
          generatedSlug,
          id
        );

      console.log(
        "Updated Generated Slug:",
        generatedSlug
      );

      console.log(
        "Updated Final Slug:",
        finalSlug
      );

      // Save old slug
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

    return res.status(500).json({
      success: false,
      message: error.message,
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
      message: error.message,
    });
  }
};