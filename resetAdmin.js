const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./app/models/Admin");

const MONGO = "mongodb+srv://frahim:frahim123@cluster0.hn7plmp.mongodb.net/fatawa";
const USERNAME = "Frahim";   // Atlas > admins collection se dekhein
const NEW_PASSWORD = "Frahim@123";

(async () => {
  await mongoose.connect(MONGO);
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);
  const r = await Admin.updateOne({ username: USERNAME }, { password: hash });
  console.log(r.matchedCount ? "✅ Password badal gaya" : "❌ Username nahi mila");
  process.exit(0);
})();