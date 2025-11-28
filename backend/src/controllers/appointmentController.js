const Appointment = require("../models/Appointment");

// GET ALL APPOINTMENTS
exports.getAllAppointments = async (req, res) => {
  try {
    const list = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET AVAILABLE SLOTS (simple version)
exports.getAvailableSlots = async (req, res) => {
  try {
    const booked = await Appointment.find();
    res.json(booked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    const { firstName, lastName, mobile, reason, date, time } = req.body;

    if (!firstName || !lastName || !mobile || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prevent duplicate mobile numbers
    const mobileExists = await Appointment.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    // Prevent double booking at same date/time
    const slotExists = await Appointment.findOne({ date, time });
    if (slotExists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const newAppt = new Appointment({
      firstName,
      lastName,
      mobile,
      reason,
      date,
      time,
    });

    await newAppt.save();
    res.status(201).json(newAppt);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE APPOINTMENT
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE APPOINTMENT
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
