import { useState, useEffect } from "react";
import api from "../api/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AppointmentList({ reloadFlag }) {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  // Popup states
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Edit popup states
  const [editData, setEditData] = useState(null);
  const [showEditSuccess, setShowEditSuccess] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const loadAppointments = async () => {
    const res = await api.get("/appointments");

    const sorted = res.data.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );

    setAppointments(sorted);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadAppointments();
  }, [reloadFlag]);

  // DELETE
  const deleteAppointment = async () => {
    if (!confirmDeleteId) return;

    await api.delete(`/appointments/${confirmDeleteId}`);
    setConfirmDeleteId(null);
    setShowDeleteSuccess(true);
    loadAppointments();
  };

  // UPDATE
  const updateAppointment = async () => {
    if (!editData) return;

    await api.put(`/appointments/${editData._id}`, editData);
    setEditData(null);
    setShowEditSuccess(true);
    loadAppointments();
  };

  // Convert "13:30" → "1:30 PM"
  const formatTime = (time) => {
    if (!time) return "";
    if (time.includes("AM") || time.includes("PM")) return time;
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  // Date color coding
  const getDateColor = (date) => {
    const today = new Date().toISOString().split("T")[0];

    if (date < today) return "2px solid red";        // past
    if (date === today) return "2px solid green";    // today
    return "2px solid blue";                         // future
  };

  const filtered = appointments.filter((a) => {
    const full = `${a.firstName} ${a.lastName}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  // PAGINATION
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentPageRecords = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // EXPORT TO EXCEL
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(appointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "appointments.xlsx");
  };

  const containerStyle = {
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "5px",
  };

  return (
    <>
      {/* DELETE CONFIRMATION POPUP */}
      {confirmDeleteId && (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h5>Confirm Delete</h5>
            <p>Are you sure you want to delete this appointment?</p>

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>

              <button className="btn btn-danger" onClick={deleteAppointment}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SUCCESS POPUP */}
      {showDeleteSuccess && (
        <div className="modal-backdrop" onClick={() => setShowDeleteSuccess(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5>Deleted</h5>
            <p>The appointment was removed successfully.</p>
            <button className="btn btn-primary" onClick={() => setShowDeleteSuccess(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* EDIT POPUP */}
      {editData && (
        <div className="modal-backdrop" onClick={() => setEditData(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5>Edit Appointment</h5>

            <input
              className="form-control mb-2"
              value={editData.firstName}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
            />

            <input
              className="form-control mb-2"
              value={editData.lastName}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
            />

            <input
              className="form-control mb-2"
              value={editData.mobile}
              onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
            />

            <input
              className="form-control mb-2"
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />

            <input
              className="form-control mb-2"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
            />

            <button className="btn btn-primary w-100 mt-2" onClick={updateAppointment}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* EDIT SUCCESS POPUP */}
      {showEditSuccess && (
        <div className="modal-backdrop" onClick={() => setShowEditSuccess(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5>Updated</h5>
            <p>Appointment updated successfully.</p>

            <button className="btn btn-primary" onClick={() => setShowEditSuccess(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div className="card p-4">
        <h4>Appointments</h4>

        <div className="d-flex justify-content-between mb-3">
          <input
            className="form-control w-75"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button className="btn btn-success ms-2" onClick={exportToExcel}>
            Export
          </button>
        </div>

        {/* Scrollable List */}
        <div style={containerStyle}>
          {currentPageRecords.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            currentPageRecords.map((a) => (
              <div
                className="border p-3 mb-3 rounded appointment-card"
                key={a._id}
                style={{
                  background: "#f8f9fa",
                  borderLeft: getDateColor(a.date),
                }}
              >
                <h5>
                  {a.firstName} {a.lastName}
                </h5>

                <p><b>Mobile:</b> {a.mobile}</p>
                <p><b>Reason:</b> {a.reason}</p>
                <p><b>Date:</b> {a.date}</p>
                <p><b>Time:</b> {formatTime(a.time)}</p>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setEditData(a)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setConfirmDeleteId(a._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3 gap-2">

            <button
              className="btn btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn ${
                  currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>

          </div>
        )}
      </div>
    </>
  );
}
