const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  reason: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
