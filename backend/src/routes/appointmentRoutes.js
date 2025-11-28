const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  getAvailableSlots,
  createAppointment,
  deleteAppointment,
  updateAppointment
} = require("../controllers/appointmentController");

router.get("/", getAllAppointments);
router.get("/slots", getAvailableSlots);
router.post("/", createAppointment);
router.delete("/:id", deleteAppointment);
router.put("/:id", updateAppointment);

module.exports = router;
