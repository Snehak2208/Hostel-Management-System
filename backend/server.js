const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config"); // Ensure this is correctly set up

dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(bodyParser.json());

// Import Routes
const roomRoutes = require("./routes/roomRoutes");
const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Use Routes
app.use("/rooms", roomRoutes);
app.use("/students", studentRoutes);
app.use("/payments", paymentRoutes);

// 404 Handler (for undefined routes)
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start Server After Database Sync
const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        console.log("✅ Database connected & synchronized.");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Database sync failed:", err);
    });