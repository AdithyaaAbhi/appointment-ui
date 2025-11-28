import { useState, useEffect } from "react";
import api from "../api/api";
import "../App.css"; // IMPORTANT

export default function AddAppointment({ refresh }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    reason: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // today's date restriction
  const today = new Date().toISOString().split("T")[0];

  // auto-capitalize first letter
  const capitalize = (v) =>
    v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();

  // generate time slots (15 mins interval)
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 9;
    let minutes = 0;

    while (hour < 20 || (hour === 20 && minutes === 0)) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinutes = minutes === 0 ? "00" : minutes;

      const slot = `${displayHour}:${displayMinutes} ${ampm}`;
      slots.push(slot);

      minutes += 15;
      if (minutes === 60) {
        minutes = 0;
        hour++;
      }
    }
    return slots;
  };

  const allSlots = generateTimeSlots();

  // Fetch booked slots on date change
  const fetchBookedSlots = async (selectedDate) => {
    try {
      const res = await api.get("/appointments");
      const filtered = res.data
        .filter((a) => a.date === selectedDate)
        .map((a) => a.time);
      setBookedSlots(filtered);
    } catch (err) {
      console.log("Error loading booked slots", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newVal = value;

    if (name === "firstName" || name === "lastName") {
      newVal = capitalize(newVal).slice(0, 15);
    }
    if (name === "mobile") {
      newVal = newVal.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "reason") {
      newVal = newVal.slice(0, 200);
    }

    if (name === "date") {
      if (newVal < today) {
        setErrors((prev) => ({ ...prev, date: "Date cannot be in the past." }));
      } else {
        setErrors((prev) => ({ ...prev, date: "" }));
        fetchBookedSlots(newVal);
      }
    }

    setForm({ ...form, [name]: newVal });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // validations
  const validateForm = () => {
    let e = {};

    if (!form.firstName) e.firstName = "First name is required.";
    if (!form.lastName) e.lastName = "Last name is required.";

    if (!form.mobile) e.mobile = "Mobile number is required.";
    else if (form.mobile.length !== 10)
      e.mobile = "Mobile number must be 10 digits.";

    if (!form.date) e.date = "Date is required.";
    else if (form.date < today) e.date = "Date cannot be in the past.";

    if (!form.time) e.time = "Time is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.post("/appointments", form);

      setShowSuccess(true);

      setForm({
        firstName: "",
        lastName: "",
        mobile: "",
        reason: "",
        date: "",
        time: "",
      });

      refresh();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error adding appointment";

      setErrors({ apiError: msg });
    }
  };

  const inputStyle = (field) => ({
    border: errors[field] ? "1px solid red" : "1px solid #ced4da",
    borderRadius: "4px",
  });

  return (
    <>
      {/* ERROR POPUP */}
      {errors.apiError && (
        <div
          className="modal-backdrop"
          onClick={() => setErrors({})}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h5>Error</h5>
            <p>{errors.apiError}</p>
            <button
              className="btn btn-danger"
              onClick={() => setErrors({})}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h5>Appointment Added</h5>
            <p>Your appointment has been added successfully.</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => setShowSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="card p-4 mb-4">
        <h4>Add Appointment</h4>

        <form onSubmit={handleSubmit}>
          {/* FIRST & LAST NAME */}
          <div className="row mb-3">
            <div className="col">
              <input
                style={inputStyle("firstName")}
                className="form-control"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <small style={{ color: "red" }}>{errors.firstName}</small>
              )}
            </div>

            <div className="col">
              <input
                style={inputStyle("lastName")}
                className="form-control"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <small style={{ color: "red" }}>{errors.lastName}</small>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <div className="mb-3">
            <input
              style={inputStyle("mobile")}
              className="form-control"
              name="mobile"
              placeholder="Mobile 10 digits"
              value={form.mobile}
              onChange={handleChange}
            />
            {errors.mobile && (
              <small style={{ color: "red" }}>{errors.mobile}</small>
            )}
          </div>

          {/* REASON */}
          <div className="mb-3">
            <textarea
              style={inputStyle("reason")}
              className="form-control"
              name="reason"
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={handleChange}
            />
            <div style={{ textAlign: "right", fontSize: "12px" }}>
              {form.reason.length}/200
            </div>
          </div>

          {/* DATE / TIME */}
          <div className="row mb-3">
            <div className="col">
              <input
                style={inputStyle("date")}
                type="date"
                min={today}
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && (
                <small style={{ color: "red" }}>{errors.date}</small>
              )}
            </div>

            <div className="col">
              <select
                style={inputStyle("time")}
                className="form-control"
                name="time"
                value={form.time}
                onChange={handleChange}
              >
                <option value="">Select Time</option>
                {allSlots.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                    disabled={bookedSlots.includes(slot)}
                  >
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>

              {errors.time && (
                <small style={{ color: "red" }}>{errors.time}</small>
              )}
            </div>
          </div>

          <button className="btn btn-primary w-100">Add Appointment</button>
        </form>
      </div>
    </>
  );
}
