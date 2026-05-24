require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const reportRoutes = require("./routes/reports");
const webhookRoutes = require("./routes/webhooks");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Cevizli Sürücü Kursu Backend API", status: "running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/webhooks", webhookRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API Documentation:`);
  console.log(`  - Auth: POST /api/auth/admin/login`);
  console.log(`  - Appointments: GET/POST /api/appointments`);
  console.log(`  - Reports: GET /api/reports/summary`);
  console.log(`  - Webhooks: POST /api/webhooks/*`);
});
