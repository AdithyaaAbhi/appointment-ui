const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/appointments", appointmentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
