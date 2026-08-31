const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const server = express();

// =====================================================
// MIDDLEWARE
// =====================================================

server.use(cors());

server.use(express.json());

server.use(
  express.urlencoded({
    extended: true,
  })
);

server.use(bodyParser.json());

// =====================================================
// ROOT
// =====================================================

server.get("/", (req, res) => {
  res.status(200).send("Server is working fine.");
});

// =====================================================
// DEFAULT / ADMIN ROUTES
// =====================================================

require("./app/routes/admin/default.routes")(server);

require("./app/routes/admin/book.routes")(server);

require("./app/routes/admin/majmoon.routes")(server);

// =====================================================
// URDU ROUTES
// =====================================================

// Urdu Questions
const questionRoutes = require(
  "./app/routes/admin/question.routes"
);

server.use(
  "/api/questions",
  questionRoutes
);


// Urdu Categories
const categoryRoutes = require(
  "./app/routes/category.routes"
);

server.use(
  "/api/categories",
  categoryRoutes
);

// =====================================================
// WEBSITE / PUBLIC ROUTES
// =====================================================

const websiteCourseRoutes = require(
  "./app/routes/website/course.routes"
);

server.use(
  "/api/courses",
  websiteCourseRoutes
);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Admin Courses
const adminCourseRoutes = require(
  "./app/routes/admin/course.routes"
);

server.use(
  "/api/admin/courses",
  adminCourseRoutes
);


// Admin Authentication
const authRoutes = require(
  "./app/routes/admin/auth.routes"
);

server.use(
  "/api/admin/auth",
  authRoutes
);


// Admin Questions
const adminQuestionRoutes = require(
  "./app/routes/admin/question.routes"
);

server.use(
  "/api/admin/questions",
  adminQuestionRoutes
);

// =====================================================
// ENGLISH ROUTES
// =====================================================

// English Questions
const englishQuestionRoutes = require(
  "./app/routes/english/question.routes"
);

server.use(
  "/api/en/questions",
  englishQuestionRoutes
);


// English Categories
const englishCategoryRoutes = require(
  "./app/routes/english/category.routes"
);

server.use(
  "/api/en/categories",
  englishCategoryRoutes
);

// =====================================================
// BANGLA ROUTES
// =====================================================

// Bangla Questions
const banglaQuestionRoutes = require(
  "./app/routes/bangla/question.routes"
);

server.use(
  "/api/bn/questions",
  banglaQuestionRoutes
);


// Bangla Categories
const banglaCategoryRoutes = require(
  "./app/routes/bangla/category.routes"
);

server.use(
  "/api/bn/categories",
  banglaCategoryRoutes
);

// =====================================================
// 404 - ALWAYS LAST
// =====================================================

server.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// MONGODB CONNECTION
// =====================================================

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://......";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `🚀 Server Running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "❌ MongoDB Connection Error:",
      error
    );
  });