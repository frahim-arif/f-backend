const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const server = express();

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());

// Root
server.get("/", (req, res) => {
  res.send("Server is working fine.");
});

// =========================
// Default Routes
// =========================

require("./app/routes/admin/default.routes")(server);
require("./app/routes/admin/book.routes")(server);
require("./app/routes/admin/majmoon.routes")(server); // 👈 Majameen Route

// =========================
// Public Routes
// =========================

const questionRoutes = require("./app/routes/admin/question.routes");
server.use("/api/questions", questionRoutes);

const categoryRoutes = require("./app/routes/category.routes");
server.use("/api/categories", categoryRoutes);

const websiteCourseRoutes = require("./app/routes/website/course.routes");
server.use("/api/courses", websiteCourseRoutes);

// =========================
// Admin Routes
// =========================

const adminCourseRoutes = require("./app/routes/admin/course.routes");
server.use("/api/admin/courses", adminCourseRoutes);

const authRoutes = require("./app/routes/admin/auth.routes");
server.use("/api/admin/auth", authRoutes);

const adminQuestionRoutes = require("./app/routes/admin/question.routes");
server.use("/api/admin/questions", adminQuestionRoutes);

const englishQuestionRoutes = require("./app/routes/english/question.routes");

server.use(
  "/api/en/questions",
  englishQuestionRoutes
);


const banglaQuestionRoutes = require("./app/routes/bangla/question.routes");

server.use(
  "/api/bn/questions",
  banglaQuestionRoutes
);

// =========================
// 404 (Always Last)
// =========================

server.get("*", (req, res) => {
  res.status(404).send("Page not found.");
});


// =========================
// MongoDB
// =========================

mongoose
  .connect(process.env.MONGO_URI || "mongodb://......")
  .then(() => {
    console.log("✅ Database Connected");
    console.log("📦 Database Name:", mongoose.connection.name);
    console.log("📚 Question Collection:", mongoose.connection.collection("questions").collectionName);

    server.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server Running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

