import { useEffect, useState } from "react";
import api from "../api/api";

export default function DashboardSummary({ reloadFlag }) {
  const [stats, setStats] = useState({
    today: 0,
    future: 0,
    past: 0,
    total: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  const loadStats = async () => {
    const res = await api.get("/appointments");
    const list = res.data;

    const todayCount = list.filter(a => a.date === today).length;
    const pastCount = list.filter(a => a.date < today).length;
    const futureCount = list.filter(a => a.date > today).length;

    setStats({
      today: todayCount,
      future: futureCount,
      past: pastCount,
      total: list.length,
    });
  };

  useEffect(() => {
    loadStats();
  }, [reloadFlag]);

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">📊 Appointment Summary</h5>

      <div className="row text-center">
        <div className="col">
          <div className="summary-box">
            <h3>{stats.today}</h3>
            <p>Today</p>
          </div>
        </div>

        <div className="col">
          <div className="summary-box">
            <h3>{stats.future}</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="col">
          <div className="summary-box">
            <h3>{stats.past}</h3>
            <p>Past</p>
          </div>
        </div>

        <div className="col">
          <div className="summary-box">
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
