const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./app/models/Admin");

const MONGO = "mongodb+srv://frahim:frahim123@cluster0.hn7plmp.mongodb.net/fatawa";
const USERNAME = "Frahim";
const NEW_PASSWORD = "Frahim@123";

(async () => {
  await mongoose.connect(MONGO);
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);
  await Admin.create({ username: USERNAME, password: hash });
  console.log("✅ Admin ban gaya");
  process.exit(0);
})();