const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const server = express(); // ✔ Main Express App

// Middleware setup
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());

// Root check
server.get('/', (req, res) => {
  res.send('Server is working fine.');
});

// Admin Default Routes
require('./app/routes/admin/default.routes.js')(server);

// Public Question Routes (For Frontend)
const questionRoutes = require('./app/routes/question.routes.js');
server.use('/api/questions', questionRoutes);

const categoryRoutes = require('./app/routes/category.routes');
server.use('/api/categories', categoryRoutes);

// ---------------------------

// Public Courses (Website)
const websiteCourseRoutes = require("./app/routes/website/course.routes");
server.use("/api/courses", websiteCourseRoutes);

// Admin Courses
const adminCourseRoutes = require("./app/routes/admin/course.routes");
server.use("/api/admin/courses", adminCourseRoutes);

// ---------------------------
const authRoutes = require("./app/routes/admin/auth.routes");
server.use("/api/admin/auth", authRoutes); // ✔ app ❌ server ✔

// ✅ Admin Question Routes
const adminQuestionRoutes = require("./app/routes/admin/question.routes.js");
server.use("/api/admin/questions", adminQuestionRoutes);


// Handle undefined routes
server.get('*', (req, res) => {
  res.send('Page not found.');
});



mongoose.connect(
  "mongodb://frahim:frahim123@ac-xa9tri4-shard-00-00.hn7plmp.mongodb.net:27017,ac-xa9tri4-shard-00-01.hn7plmp.mongodb.net:27017,ac-xa9tri4-shard-00-02.hn7plmp.mongodb.net:27017/fatawa?ssl=true&replicaSet=atlas-y21xpi-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    serverSelectionTimeoutMS: 30000
  }
)
.then(() => {
  console.log("✅ Database Connected");

  server.listen(5000, () => {
    console.log("🚀 Server is running on http://localhost:5000");
  });
})
.catch((err) => {
  console.error("❌ Database Connection Error:", err.message);
});