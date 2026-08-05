const Question = require("../../models/question.model");
const fetch = require("node-fetch"); // ✅ required if Node < 18
const corrections = {
  // basic
  soal: "sawal",
  swal: "sawal",

  aqeqah: "aqeeqah",
  aqiqah: "aqeeqah",

  roaiat: "riwayat",
  rwayat: "riwayat",

  shmar: "shumar",

  janor: "janwar",


  // tumhare naye words//
  
  ih: "yeh", dhli: "delhi", ja: "jaunga", mire: "mere", baozo: "bawuzu", mchhr: "machhar", kata: "kaata", khon: "khoon", chos: "choos",kimre: "camera", tsoir: "tasveer", kshi: "kashi", ajrt: "ujrat", hlal: "halal",
  atkaf: "itikaf", snt: "sunnat", frq: "farq", oazh: "wazeh", frmaie: "farmaiye", qsmi: "qismein", frz: "farz", oajb: "wajib", msthb: "mustahab", an: "aur",
  chlne: "chalne",lrka: "ladka", fon: "phone", oidio: "audio", kl: "call", zriah: "zariye", aijab: "ijab",oaldin: "walidain", sb: "sab", sath: "saath", rhte: "rahte", aolad: "aulad", km: "kama",
  phrne: "phirne",nkah: "nikah", moqa: "mauqa", lrki: "ladki", ajazt: "ijazat", line: "lene", okil: "wakeel", goahan: "gawahan",zamen: "zameen", gi: "gayi", js: "jis",
  sholt: "sahulat",hafz: "hafiz", qran: "quran", rmzan: "ramzan", ashrh: "ashrah", bith: "baith", gia: "gaya",dhato: "dhatuon", mjsmh: "mujassamah", khrid: "khareed", frokht: "farokht", nhi: "nahi", asi: "aisi",
  lie: "liye",zid: "zaid", amr: "umar", mkan: "makaan", khrida: "khareeda", khridar: "khareedar", kchh: "kuch",shdidh: "shadeed", ojh: "wajah", oqf: "waqf", zmin: "zameen", tbadlh: "tabadlah",
  shrai: "shar-i",jnazh: "janazah", tkbirat: "takbeerat", chhor: "chhod", slam: "salam", afzl: "afzal", khareda: "khareeda", jaunga: "ja raha", rha: "raha", kmi: "kami", bishi: "beshi",
  msjd: "masjid",bchh: "bachcha", tin: "teen", sghir: "sagheer", kse: "kise", khte: "kehte", hayya: "hayya", niz: "neez", kbir: "kabir",haf: "half", astin: "aasteen", chmpr: "champar", phnti: "pehanti",
  qnot: "qunoot",badh: "baaz", pysh: "pesh", nzr: "nazar", hdhrt: "hazrat", amam: "imam", abw: "abu", hnyf: "hanifa", rhm: "rahmat", all: "allah", nzdyk: "nazdeek", mshrwa: "mashroo", malwm: "maloom", wty: "hoti",
  jgh: "jagah",alm: "alim", sahb: "sahab", kha: "kaha", juma: "juma", dikh: "dekh", til: "teel", lga: "laga", jaz: "jaiz",aort: "aurat", mhine: "mahine", hml: "haml", oh: "woh", rozh: "roza",
  prh: "parh",khtib: "khateeb", khtbh: "khutbah", dine: "dene", mmbr: "mimber", pr: "par", chrh: "charh", jae: "jaye", hazrin: "hazireen", rkoa: "ruku", chla: "chala",hayya: "hai",
  da: "dua", bnoa: "banwa", srkari: "sarkari", nokri: "naukri", hasl: "hasil", kisa: "kaisa", agr: "agar",trin: "train", prhte: "parhte", qble: "qible", trf: "taraf", khial: "khayal",
  lia: "liya",mzn: "muazzin", azan: "azan", hi: "hayya", alsla: "alas-salah", alflah: "alal-falah",mozn: "muazzin", dite: "dete", oqt: "waqt", klmat: "kalimat", klmh: "kalimah",amt: "ummat", kn: "kaun", amto: "ummaton",
  phr: "phir",hzrt: "hazrat", noh: "nooh", alih: "alaihis-salam", lot: "loot", aiman: "imaan", laia: "laya",mrde: "murde", dfnane: "dafnane", bqrh: "baqarah", aol: "awwal", aiat: "ayat",
  iad: "yaad",jmah: "juma", nmaz: "namaz", sorh: "surah", ali: "al-ala", ghashih: "ghashiyah", prhna: "parhna",nmste: "namaste", khe: "kahe", joab: "jawab",rkat: "rakaat", sjd: "sajdah", sho: "sahw", drst: "durust", hogi: "hogi",
  aia: "aaya",rihanh: "rehanah", hzor: "huzoor", zojh: "zaujah", ozaht: "wazahat",fjr: "fajr", alslo: "as-salatu", khir: "khair", mn: "min", alnom: "an-naum", khna: "kehna", ks: "kis", hds: "hadith",
  althiat: "tahiyyat",bch: "bachche", wal: "wale", dn: "din", rka: "rakha", gya: "gaya", tyn: "teen", many: "maani",jlsh: "jalsah", bin: "bain", alsjdtin: "as-sajdatain", althit: "tahiyyat", yad: "yaad",
  mi: "mein",pir: "pair", kte: "katte", hoe: "huye", msnai: "masnoi", lgate: "lagate", ozo: "wuzu",bink: "bank", sodi: "soodi", rqm: "raqam", ghr: "ghar", bnaia: "banaya",dkan: "dukan", qran: "quran", parh: "parh", pise: "paise", lina: "lena",
  chtai: "chatai",asttat: "istitaat",krnsi: "currency", aoz: "iwaz", adhar: "udhar", khridna: "khareedna", hsh: "hissa", w: "aur", s: "se", k: "ke",sfr: "safar", hj: "hajj", rwangy: "rawangi", wqt: "waqt", wapsy: "wapasi", daa: "dua", shraa: "sharan", kysa: "kaisa",
  aor: "aur",ghnte: "ghante", oaste: "waste", bahr: "bahar", nkl: "nikal",mindk: "mendak", drhm: "dirham", ghir: "ghair", mslm: "muslim", pish: "paisa", kndidits: "candidates",
  qalin: "qaleen", zrort: "zarurat", zad: "ziyada", he: "hai", kia: "kiya", shkhs: "shakhs", anjmn: "anjuman", ia: "ya", akidmi: "academy", qam: "qaim", kya: "kya", as: "us",groi: "girvi", rkhe: "rakhe", zko: "zakat",
  bioi: "biwi", bad: "baad", jmaat: "jamaat", phle: "pehle", wzw: "wuzu", awr: "aur", abart: "ibarat",akbr: "akbar", asghr: "asghar", thrir: "tehreer", kri: "kari",hadith:"hadsh",azr: "uzr", ane: "aane", mqtdi: "muqtadi", karein: "kare",
  lrai: "larai", chl: "chal", rhi: "rahi", ayk: "aik", shkhs: "shakhs", sna: "suna", he: "hai", kh: "ke", awrty: "aurat", jb: "jab", sal: "saal", gzrne: "guzarne",srk: "sadak", chpl: "chappal", phn: "pehen", prhne: "parhne", hkm: "hukm",
  borhe: "boodhe", admi: "aadmi", rozo: "rozon", fdih: "fidyah", raqam: "raqam", ghair: "ghair", msthq: "mustahiq",krsi: "kursi", rkhi: "rakhi", chiz: "cheez", sjdh: "sajdah",mtadd: "mutaaddid", jmato: "jamaaton", hdis: "hadith",fatmh: "fatimah", prhai: "parhai", tjhiz: "tajheez", tkfin: "takfeen",
  mkbr: "mukabbir", fasd: "fasid", mqtdio: "muqtadiyon",ayat: "ayat", tlaot: "tilawat", kharji: "khariji", admi: "aadmi", qrat: "qiraat", sni: "suni", ojb: "wajib", nhi: "nahi",droazh: "darwazah",
  qari: "qari", samain: "sameen", ajtmai: "ijtimai", sjde: "sajde", mslh: "maslah",aidgah: "eidgah", fadh: "faida", athane: "uthane",aoli: "ula", trk: "tark", kafi: "kaafi",qad: "qa'dah",phla: "pehla", kb: "kab",adt: "iddat", doran: "dauran", zna: "zina", haml: "hamal", sort: "soorat",
  aslam: "islam",fanns: "finance", mshin: "machine",hoa: "hua",nazl: "nazil",hjrt: "hijrat",garia: "gaadiyan", pas: "paas",bia: "bai", mdt: "muddat", tain: "tayyun", zrori: "zaroori",tig: "tag", lge: "lage",aib: "aib", tarif: "tareef", ma: "maa", msal: "misal", tehrer: "tehreer", kari: "karein",
};

function createSlug(text) {
  if (!text) return "no-slug";

  const urduMap = {
    ا: "a", آ: "aa", ب: "b", پ: "p", ت: "t", ٹ: "t",
    ث: "s", ج: "j", چ: "ch", ح: "h", خ: "kh",
    د: "d", ڈ: "d", ذ: "z", ر: "r", ڑ: "r",
    ز: "z", ژ: "zh", س: "s", ش: "sh", ص: "s",
    ض: "z", ط: "t", ظ: "z", ع: "a", غ: "gh",
    ف: "f", ق: "q", ک: "k", گ: "g", ل: "l",
    م: "m", ن: "n",
    و: "o",
    ہ: "h", ھ: "h",
    ء: "",
    ی: "i",
    ے: "e"
  };

  let slug = text
    .split("")
    .map(char => urduMap[char] || char)
    .join("");

  slug = slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, "");

  // ✅ dictionary apply
  Object.keys(corrections).forEach(word => {
    slug = slug.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      corrections[word]
    );
  });

  slug = slug
    .replace(/aa+/g, "a")
    .replace(/ii+/g, "i")
    .replace(/ee+/g, "e")
    .replace(/oo+/g, "o")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug
    .split("-")
    .filter(Boolean)
    .slice(0, 12)
    .join("-");
}

// ===========================
// 📌 Create New Question
// ===========================
exports.createQuestion = async (req, res) => {
  try {
    const {
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      category,
      metaTitle,
      metaDescription,
      keywords,
      slug: frontendSlug
    } = req.body;

    // 🔥 1. Generate clean slug
    let baseSlug = frontendSlug?.trim()
  ? createSlug(frontendSlug)
  : createSlug(metaTitle || question);
    let slug = baseSlug;

    const keywordArray = keywords
      ? keywords.split(",").map(k => k.trim())
      : [];

    // 🔥 2. Ensure unique slug
    let count = 1;
    while (await Question.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // 🔥 3. Create question
    const newQuestion = new Question({
      question,
      slug,
      answer,
      hawala1,
      hawala2,
      hawala3,
      category,
      metaTitle: metaTitle || question,
      metaDescription: metaDescription || answer?.slice(0, 150),
      keywords: keywordArray,
    });

    await newQuestion.save();

    // 🔥 4. Google Sitemap Ping
    try {
      await fetch(
        "https://www.google.com/ping?sitemap=https://www.maslakedeoband.in/sitemap.xml"
      );
      console.log("✅ Google ping sent");
    } catch (err) {
      console.log("⚠️ Ping failed (ignore):", err.message);
    }

    return res.json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// 📌 Get All Questions
// ===========================
exports.getQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 📌 Get Questions by Category
// ===========================
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await Question.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: questions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// 📌 Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await Question.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // 🔥 OLD SLUG SAVE SYSTEM
if (req.body.question || req.body.slug) {
  let baseSlug = req.body.slug?.trim()
    ? createSlug(req.body.slug)
    : createSlug(req.body.question);

  let slug = baseSlug;

  let count = 1;
  while (await Question.findOne({ slug, _id: { $ne: id } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  if (existing.slug && existing.slug !== slug) {
    if (!existing.oldSlugs) {
      existing.oldSlugs = [];
    }

    existing.oldSlugs.push(existing.slug);
  }

  req.body.slug = slug;
}

    // keywords conversion
    if (req.body.keywords) {
      req.body.keywords = req.body.keywords
        .split(",")
        .map((k) => k.trim());
    }

    Object.assign(existing, req.body);

    await existing.save();

    return res.json({
      success: true,
      message: "Question updated successfully",
      data: existing,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 📌 Delete Question
// ===========================
exports.deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    await Question.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 📌 Get Question by Slug
// ===========================
exports.getQuestionBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    const question = await Question.findOne({ slug });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.json({
      success: true,
      data: question,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};