const Question = require("../../models/question.model");
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
  prh: "parh",khtib: "khateeb", khtbh: "khutbah", dine: "dene", mmbr: "mimber", pr: "par", chrh: "charh", jae: "jaye", hazrin: "hazireen", rkoa: "ruku", chla: "chala",hayya: "hai",bghir: "baghair", ahram: "ihram",
  da: "dua", bnoa: "banwa", srkari: "sarkari", nokri: "naukri", hasl: "hasil", kisa: "kaisa", agr: "agar",trin: "train", prhte: "parhte", qble: "qible", trf: "taraf", khial: "khayal",
  lia: "liya",mzn: "muazzin", azan: "azan", hi: "hayya", alsla: "alas-salah", alflah: "alal-falah",mozn: "muazzin", dite: "dete", oqt: "waqt", klmat: "kalimat", klmh: "kalimah",amt: "ummat", kn: "kaun", amto: "ummaton",us: "is",
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
  tkbir: "takbeer", ula: "oola", fzilt: "fazilat",amdni: "aamdani", oali: "wali",sorto: "sooraton", khiar: "khiyar", shrt: "shart", baqi: "baqi", rhta: "rahta",mlazmt: "mulazmat", otn: "watan", aqamt: "iqamat", qrar: "qarar", dia: "diya", jaye: "jayega",lhaf: "lihaf", tr: "tar", kpre: "kapde",drmiani: "darmiyani", sf: "saff", rkh: "rakh",
  sizirin: "scissoring", bad: "baad", dami: "damai", mana: "mane", aprishn: "operation",tofan: "toofan", zlzlh: "zalzalah", msibt: "museebat",ahtlam: "ihtilam", takhir: "taakhir", qtre: "qatre", ane: "aane", sorat: "soorat", ghsl: "ghusl",
  rsol: "rasool", saih: "sayah", zamen: "zameen", prta: "parda",hoz: "hauz", tnki: "tank", pani: "paani", jari: "jaari",ten: "teen", sal: "saal", bche: "bachche", nam: "naam", tbdil: "tabdeel",sodi: "soodi", piso: "paise", qrbani: "qurbani", shrik: "shareek",mshtrkh: "mushtarka", panch: "paanch", afrad: "afraad", nbi: "nabi", krim: "kareem",
  khride: "khareede", mal: "maal", nqs: "naqs", nikal: "nikal", ae: "gaye", kiya: "kya", jayega: "jayega",hram: "haraam", mal: "maal", krne: "karne", saqt: "saaqit", hoga: "hoga",thike: "theke", mchhlia: "machhliyaan", pkrne: "pakadne",hiz: "haiz", drmia: "darmiyan", paki: "paaki",aghoa: "agwa", pkr: "pakda", mgr: "magar", bchcha: "bachcha", nh: "na",
  anjkshn: "injection", lgoane: "lagane", totta: "tootta",rkhsti: "rukhsati", ten: "teen", tlaq: "talaaq",jmai: "jamaai", lite: "liye",  la: "la", hol: "hawla", ola: "oola", qo: "quwwat", ala: "ala", ballh: "billah",oats: "Whats", aip: "App", thriri: "tehreeri", tor: "taur", ten: "teen", talaq: "talaaq",
  anglind: "England", ane: "aane", oale: "wale", dbiz: "dbeez", soti: "sooti", mozo: "moze", msh: "masah",ds: "das", bis: "bees", mnzlh: "manzilah", amart: "imarat", mnzl: "manzil", bnane: "banane",qrani: "qurani", aiat: "ayat", dai: "dua", lkhoane: "likhwane",
  goaho: "gawahon", qbol: "qubool", alim: "ilm", zarori: "zaroori", ksi: "kisi", qrz: "qarz", kr: "kar", krna: "karna", le: "le", sharan: "shar'an", alm : "aalim", jahl : "jahil",ne : "naye",naqabl: "na-qabil", astamal: "istemal", ashia: "ashya", jlane: "jalane", dfn: "dafn",kon: "kaun", aorti: "auratein", shaml: "shaamil", hayya: "hai",
  sria: "surya", tloa: "tulu",hndo: "hindu",dobarh: "dobarah",zkhm: "zakhm", pti: "patti",amrh : "umrah",toaf: "tawaf",ade: "yeade",sorat: "surat",sai: "saie",dioali: "diwali",astits: "status", lgana: "lagana",mslman: "muslim",talq: "taalluq",khtm: "khatm",kimrh: "camera", tasver: "tasveer",
  pora: "poora",sal: "saal",bad: "baad", nsab: "nisab", hlak: "halaak",  hojae: "ho jae",zakat :"zakaat",lazm: "laazim",amh: "aimmah", arbah: "arba'a", nzdik: "nazdeek", bes: "bees", rakat: "rakaat", kama: "kam", traoih: "taraweeh",bito: "beton",dm: "dam",hayya: "hai",qurbani: "qurbani",tmam: "tamaam", shrka: "shuraka",nam: "naam",
  mqdar: "miqdaar", fqha: "fuqaha", akhtlaf: "ikhtilaaf", rajh: "raajih", qol: "qaul",mhr: "mehr",qran: "quran",mqrr: "muqarrar",mtalq: "mutalliq",hoai: "hawai",mhrm: "mahram",mojodgi: "maujoodgi", zarori: "zaroori",hjr: "hajar", asod: "aswad",  bosh: "bosa", pthro: "pattharon", chomna: "choomna",mhrmat: "mahramaat", abdih: "abadiyah", mtlb: "matlab",
  ozn: "wazan", kie: "kiye", bndl: "bundle", dbe: "dabbe", saman: "samaan",mdrsh: "madrasa", albnat: "al-banaat", lrkio: "ladkiyon",qsda: "qasdan", bajmat: "ba-jamaat",admi: "aadmi",  msafr: "musaafir", bnta: "banta", nit: "niyyat",amin: "aameen", baljhr: "bil-jahr", aur: "aur", balsr: "bis-sirr",mnh: "munh",chhlh: "chhalla", dal: "daal", shfa: "shifa", amid: "umeed",
  joaz: "jawaaz", ten: "teen", admio: "aadmiyon", alaoh: "alaawa", shhr: "shahr",mstaml: "musta'mal",hndostani: "hindustani", zamen: "zameen", ashri: "ushri", khraji: "kharaaji",aik: "ek", zla: "zila", pndrh: "pandrah", ziadh: "zyada", qiam: "qiyaam",tjhe: "tujhe", tino: "teeno",  hayya: "hai", khne: "kahne", ktni: "kitni", oaqa: "waaqe",
  mlne: "milne",  suna: "sana", prhni: "parhni", chahie: "chaahiye",mft: "muft",mrdar: "murda",msoak: "miswaak", ke: "ke", qaim: "qaaim", mqam: "muqaam", brsh: "brush",sor: "surah", se: "soad",ait: "aayat",tisho: "tissue", pipr: "paper", soad: "se", astnja: "istinja",prane: "purane", aur: "aur", phte: "phate", not: "note", qimt: "qeemat",  bichna: "bechna",  bdlna: "badalna",
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





// =====================================================
// HELPER FUNCTIONS FOR ENGLISH / BANGLA
// =====================================================

// Remove HTML tags from answer
function stripHtml(text = "") {
  return text
    .toString()
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


// Convert comma-separated keywords into array
function parseKeywords(keywords) {
  if (!keywords) return [];

  // Already an array
  if (Array.isArray(keywords)) {
    return keywords
      .map((keyword) => keyword.toString().trim())
      .filter(Boolean);
  }

  // Comma separated string
  return keywords
    .toString()
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}


// =====================================================
// SIMPLE ENGLISH / BANGLA SLUG GENERATOR
// =====================================================

function createSimpleSlug(text) {
  if (!text) return "no-slug";

  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

    // Keep only English letters, numbers, spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, "")

    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

    .split("-")
    .filter(Boolean)
    .slice(0, 12)
    .join("-");
}


// =====================================================
// UNIQUE SLUG GENERATOR
// =====================================================

async function makeUniqueSlug(field, baseSlug, id = null) {
  const cleanBaseSlug = baseSlug || "no-slug";

  let slug = cleanBaseSlug;
  let count = 1;

  while (
    await Question.findOne({
      [field]: slug,
      ...(id ? { _id: { $ne: id } } : {}),
    })
  ) {
    slug = `${cleanBaseSlug}-${count}`;
    count++;
  }

  return slug;
}


// =====================================================
// CREATE ENGLISH QUESTION
// =====================================================

exports.createEnglishQuestion = async (req, res) => {
  try {
    const {
      englishQuestion,
      englishAnswer,
      englishHawala1,
      englishHawala2,
      englishHawala3,
      category,
      englishMetaTitle,
      englishMetaDescription,
      englishKeywords,
      englishSlug,
    } = req.body;


    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!englishQuestion?.trim()) {
      return res.status(400).json({
        success: false,
        message: "English question is required",
      });
    }


    // ---------------------------------------------
    // CREATE SLUG
    // ---------------------------------------------

    const baseSlug = createSimpleSlug(
      englishSlug ||
      englishMetaTitle ||
      englishQuestion
    );

    const finalSlug = await makeUniqueSlug(
      "englishSlug",
      baseSlug
    );


    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    const keywordArray = parseKeywords(
      englishKeywords
    );


    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    const metaDescription =
      englishMetaDescription?.trim() ||
      stripHtml(englishAnswer).slice(0, 155);


    // ---------------------------------------------
    // CREATE DOCUMENT
    // ---------------------------------------------

    const question = new Question({
      englishQuestion: englishQuestion.trim(),

      englishAnswer,

      englishHawala1,
      englishHawala2,
      englishHawala3,

      englishSlug: finalSlug,

      englishMetaTitle:
        englishMetaTitle?.trim() ||
        englishQuestion.trim(),

      englishMetaDescription: metaDescription,

      englishKeywords: keywordArray,

      category,
    });


    await question.save();


    return res.status(201).json({
      success: true,
      message: "English question added successfully",
      data: question,
    });

  } catch (error) {
    console.error(
      "❌ ENGLISH CREATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL ENGLISH QUESTIONS
// =====================================================

exports.getEnglishQuestions = async (req, res) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;


    const questions = await Question.find({
      englishQuestion: {
        $exists: true,
        $ne: "",
      },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category");


    return res.json({
      success: true,
      data: questions,
    });

  } catch (error) {
    console.error(
      "❌ ENGLISH GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ENGLISH QUESTION BY SLUG
// =====================================================

exports.getEnglishQuestionBySlug = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;


    const question = await Question.findOne({
      $or: [
        {
          englishSlug: slug,
        },
        {
          oldEnglishSlugs: slug,
        },
      ],
    }).populate("category");


    if (!question) {
      return res.status(404).json({
        success: false,
        message: "English question not found",
      });
    }


    return res.json({
      success: true,
      data: question,
    });

  } catch (error) {
    console.error(
      "❌ ENGLISH SLUG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE ENGLISH QUESTION
// =====================================================

exports.updateEnglishQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;


    const existing =
      await Question.findById(id);


    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "English question not found",
      });
    }


    // ---------------------------------------------
    // ENGLISH SLUG
    // ---------------------------------------------

    if (
      req.body.englishQuestion ||
      req.body.englishSlug ||
      req.body.englishMetaTitle
    ) {

      const baseSlug = createSimpleSlug(
        req.body.englishSlug ||
        req.body.englishMetaTitle ||
        req.body.englishQuestion ||
        existing.englishQuestion
      );


      const newSlug =
        await makeUniqueSlug(
          "englishSlug",
          baseSlug,
          id
        );


      // Save previous slug
      if (
        existing.englishSlug &&
        existing.englishSlug !== newSlug
      ) {

        existing.oldEnglishSlugs =
          existing.oldEnglishSlugs || [];


        if (
          !existing.oldEnglishSlugs.includes(
            existing.englishSlug
          )
        ) {
          existing.oldEnglishSlugs.push(
            existing.englishSlug
          );
        }
      }


      req.body.englishSlug =
        newSlug;
    }


    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    if (
      req.body.englishKeywords !== undefined
    ) {
      req.body.englishKeywords =
        parseKeywords(
          req.body.englishKeywords
        );
    }


    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    if (
      !req.body.englishMetaDescription &&
      req.body.englishAnswer
    ) {
      req.body.englishMetaDescription =
        stripHtml(
          req.body.englishAnswer
        ).slice(0, 155);
    }


    // ---------------------------------------------
    // META TITLE
    // ---------------------------------------------

    if (
      !req.body.englishMetaTitle &&
      req.body.englishQuestion
    ) {
      req.body.englishMetaTitle =
        req.body.englishQuestion;
    }


    // ---------------------------------------------
    // UPDATE
    // ---------------------------------------------

    Object.assign(
      existing,
      req.body
    );


    await existing.save();


    return res.json({
      success: true,
      message:
        "English question updated successfully",
      data: existing,
    });

  } catch (error) {
    console.error(
      "❌ ENGLISH UPDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE ENGLISH CONTENT ONLY
// =====================================================
// IMPORTANT:
// Pura Question delete nahi hoga.
// Sirf English content remove hoga.
// Urdu + Bangla safe rahenge.
// =====================================================

exports.deleteEnglishQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;


    const existing =
      await Question.findById(id);


    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }


    existing.englishQuestion = undefined;
    existing.englishAnswer = undefined;

    existing.englishHawala1 = undefined;
    existing.englishHawala2 = undefined;
    existing.englishHawala3 = undefined;

    existing.englishSlug = undefined;

    existing.englishMetaTitle = undefined;
    existing.englishMetaDescription = undefined;

    existing.englishKeywords = undefined;

    existing.oldEnglishSlugs = undefined;


    await existing.save();


    return res.json({
      success: true,
      message:
        "English content deleted successfully",
      data: existing,
    });

  } catch (error) {
    console.error(
      "❌ ENGLISH DELETE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE BANGLA QUESTION
// =====================================================

exports.createBanglaQuestion = async (
  req,
  res
) => {
  try {
    const {
      banglaQuestion,
      banglaAnswer,
      banglaHawala1,
      banglaHawala2,
      banglaHawala3,
      category,
      banglaMetaTitle,
      banglaMetaDescription,
      banglaKeywords,
      banglaSlug,
    } = req.body;


    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!banglaQuestion?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Bangla question is required",
      });
    }


    // ---------------------------------------------
    // CREATE SLUG
    // ---------------------------------------------

    const baseSlug = createSimpleSlug(
      banglaSlug ||
      banglaMetaTitle ||
      banglaQuestion
    );


    const finalSlug =
      await makeUniqueSlug(
        "banglaSlug",
        baseSlug
      );


    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    const keywordArray =
      parseKeywords(
        banglaKeywords
      );


    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    const metaDescription =
      banglaMetaDescription?.trim() ||
      stripHtml(banglaAnswer).slice(0, 155);


    // ---------------------------------------------
    // CREATE DOCUMENT
    // ---------------------------------------------

    const question = new Question({

      banglaQuestion:
        banglaQuestion.trim(),

      banglaAnswer,

      banglaHawala1,
      banglaHawala2,
      banglaHawala3,

      banglaSlug:
        finalSlug,

      banglaMetaTitle:
        banglaMetaTitle?.trim() ||
        banglaQuestion.trim(),

      banglaMetaDescription:
        metaDescription,

      banglaKeywords:
        keywordArray,

      category,
    });


    await question.save();


    return res.status(201).json({
      success: true,
      message:
        "Bangla question added successfully",
      data: question,
    });

  } catch (error) {
    console.error(
      "❌ BANGLA CREATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL BANGLA QUESTIONS
// =====================================================

exports.getBanglaQuestions = async (
  req,
  res
) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;


    const questions =
      await Question.find({
        banglaQuestion: {
          $exists: true,
          $ne: "",
        },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category");


    return res.json({
      success: true,
      data: questions,
    });

  } catch (error) {
    console.error(
      "❌ BANGLA GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
};


// =====================================================
// GET BANGLA QUESTION BY SLUG
// =====================================================

exports.getBanglaQuestionBySlug = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;


    const question =
      await Question.findOne({
        $or: [
          {
            banglaSlug: slug,
          },
          {
            oldBanglaSlugs: slug,
          },
        ],
      }).populate("category");


    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla question not found",
      });
    }


    return res.json({
      success: true,
      data: question,
    });

  } catch (error) {
    console.error(
      "❌ BANGLA SLUG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE BANGLA QUESTION
// =====================================================

exports.updateBanglaQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;


    const existing =
      await Question.findById(id);


    if (!existing) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla question not found",
      });
    }


    // ---------------------------------------------
    // BANGLA SLUG
    // ---------------------------------------------

    if (
      req.body.banglaQuestion ||
      req.body.banglaSlug ||
      req.body.banglaMetaTitle
    ) {

      const baseSlug =
        createSimpleSlug(
          req.body.banglaSlug ||
          req.body.banglaMetaTitle ||
          req.body.banglaQuestion ||
          existing.banglaQuestion
        );


      const newSlug =
        await makeUniqueSlug(
          "banglaSlug",
          baseSlug,
          id
        );


      // Save previous slug
      if (
        existing.banglaSlug &&
        existing.banglaSlug !== newSlug
      ) {

        existing.oldBanglaSlugs =
          existing.oldBanglaSlugs || [];


        if (
          !existing.oldBanglaSlugs.includes(
            existing.banglaSlug
          )
        ) {
          existing.oldBanglaSlugs.push(
            existing.banglaSlug
          );
        }
      }


      req.body.banglaSlug =
        newSlug;
    }


    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    if (
      req.body.banglaKeywords !== undefined
    ) {
      req.body.banglaKeywords =
        parseKeywords(
          req.body.banglaKeywords
        );
    }


    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    if (
      !req.body.banglaMetaDescription &&
      req.body.banglaAnswer
    ) {
      req.body.banglaMetaDescription =
        stripHtml(
          req.body.banglaAnswer
        ).slice(0, 155);
    }


    // ---------------------------------------------
    // META TITLE
    // ---------------------------------------------

    if (
      !req.body.banglaMetaTitle &&
      req.body.banglaQuestion
    ) {
      req.body.banglaMetaTitle =
        req.body.banglaQuestion;
    }


    // ---------------------------------------------
    // UPDATE
    // ---------------------------------------------

    Object.assign(
      existing,
      req.body
    );


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
// DELETE BANGLA CONTENT ONLY
// =====================================================
// IMPORTANT:
// Pura Question delete nahi hoga.
// Sirf Bangla content remove hoga.
// Urdu + English safe rahenge.
// =====================================================

exports.deleteBanglaQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;


    const existing =
      await Question.findById(id);


    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }


    existing.banglaQuestion = undefined;
    existing.banglaAnswer = undefined;

    existing.banglaHawala1 = undefined;
    existing.banglaHawala2 = undefined;
    existing.banglaHawala3 = undefined;

    existing.banglaSlug = undefined;

    existing.banglaMetaTitle = undefined;
    existing.banglaMetaDescription = undefined;

    existing.banglaKeywords = undefined;

    existing.oldBanglaSlugs = undefined;


    await existing.save();


    return res.json({
      success: true,
      message:
        "Bangla content deleted successfully",
      data: existing,
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

