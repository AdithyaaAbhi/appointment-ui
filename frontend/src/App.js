import { useState } from "react";
import AddAppointment from "./components/AddAppointment";
import AppointmentList from "./components/AppointmentList";
import DashboardSummary from "./components/DashboardSummary";
import "./App.css";

function App() {
  const [reloadFlag, setReloadFlag] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const refresh = () => setReloadFlag((prev) => prev + 1);

  return (
    <div className={darkMode ? "dark-mode container mt-5" : "container mt-5"}>

      {/* TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Appointment Booking System</h2>

        {/* DARK MODE TOGGLE */}
        <button
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* SUMMARY DASHBOARD */}
      <DashboardSummary reloadFlag={reloadFlag} />

      {/* MAIN UI */}
      <AddAppointment refresh={refresh} />
      <AppointmentList reloadFlag={reloadFlag} />
    </div>
  );
}

export default App;
