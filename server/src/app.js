const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sweety API is running!",
  });
});

module.exports = app;
