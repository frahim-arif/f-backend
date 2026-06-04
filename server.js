const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const server = express();

/* Middleware */
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

/* Root Route */
server.get("/", (req, res) => {
  res.send("Recharge API Running 🚀");
});

/* Routes */
const authRoutes = require("./app/routes/auth.routes.js");
server.use("/api/auth", authRoutes);

/* MongoDB Connect */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => {

  console.log("✅ MongoDB Connected");

  server.listen(5000, () => {
    console.log("🚀 Server Running On Port 5000");
  });

})
.catch((err) => {
  console.error("❌ Database Error:", err.message);
});


