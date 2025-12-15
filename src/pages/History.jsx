import React, { useEffect, useState } from "react";
import api from "../api/api";
import { io } from "socket.io-client";
import jsPDF from "jspdf";
import "jspdf-autotable";

// CSV export helper
const exportCSVHelper = (history) => {
  if (!history.length) return alert("No history to export");

  const headers = ["Type", "Amount", "Description", "Date"];
  const rows = history.map((h) => [
    h.type,
    h.amount,
    h.description || "",
    new Date(h.date || h.createdAt).toLocaleString(),
  ]);

  const csvContent =
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wallet_history.csv";
  link.click();
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [newItemIds, setNewItemIds] = useState(new Set());

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/wallet");
        setCurrentPoints(res.data.balance || 0);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };

    fetchHistory();

    const socket = io("http://localhost:5000");

    socket.on("pointsUpdate", (data) => {
      if (data.userId === localStorage.getItem("userId")) {
        setCurrentPoints(data.points);
        if (data.history) {
          const existingIds = new Set(history.map((h) => h._id));
          const newIds = new Set();
          data.history.forEach((h) => {
            if (!existingIds.has(h._id)) newIds.add(h._id);
          });
          setNewItemIds(newIds);
          setHistory(data.history);
        }
      }
    });

    return () => socket.disconnect();
  }, [history]);

  const grouped = history.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const typeLabels = {
    "video-view": "🎥 Video Views",
    action: "👍 Social Actions",
    redeem: "💰 Redeems",
    transfer_in: "🔄 Received Transfers",
    transfer_out: "↗️ Sent Transfers",
    admin_add: "🛠️ Admin Added",
    admin_deduct: "🛠️ Admin Deducted",
  };

  const grandTotals = history.reduce(
    (acc, h) => {
      acc.count += 1;
      acc.points += h.amount;
      return acc;
    },
    { count: 0, points: 0 }
  );

  const filteredKeys =
    filter === "all" ? Object.keys(grouped) : [filter].filter((f) => grouped[f]);

  // Monthly totals
  const monthlyTotals = history.reduce((acc, h) => {
    const d = new Date(h.date || h.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + h.amount;
    return acc;
  }, {});

  // Daily totals for last 7 days
  const dailyTotals = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyTotals[key] = 0;
  }
  history.forEach((h) => {
    const dateKey = new Date(h.date || h.createdAt).toISOString().split("T")[0];
    if (dailyTotals.hasOwnProperty(dateKey)) dailyTotals[dateKey] += h.amount;
  });

  const exportPDF = () => {
    if (!history.length) return alert("No history to export");
    const doc = new jsPDF();
    doc.text("Wallet History", 14, 15);

    const rows = history.map((h) => [
      h.type,
      h.amount,
      h.description || "",
      new Date(h.date || h.createdAt).toLocaleString(),
    ]);

    doc.autoTable({
      startY: 20,
      head: [["Type", "Amount", "Description", "Date"]],
      body: rows,
      styles: { fontSize: 9 },
    });

    doc.save("wallet-history.pdf");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">📜 History</h2>

      {/* Current Points */}
      <div className="mb-4 p-4 rounded-lg bg-green-100 shadow-inner flex justify-between items-center">
        <span className="font-semibold text-lg text-green-800">Current Points:</span>
        <span className="font-bold text-xl text-green-700">{currentPoints} pts</span>
      </div>

      {/* Grand Totals */}
      <div className="mb-6 p-4 rounded-lg bg-gray-100 shadow-inner flex justify-between items-center">
        <span className="font-semibold text-lg text-gray-800">
          Total Records: {grandTotals.count}
        </span>
        <span className={`font-bold text-lg ${grandTotals.points >= 0 ? "text-green-700" : "text-red-700"}`}>
          {grandTotals.points} pts
        </span>
      </div>

      {/* Monthly Summary */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="font-semibold text-indigo-800 mb-3">📈 Monthly Earnings</h3>
        <div className="space-y-3">
          {Object.entries(monthlyTotals)
            .slice(-6)
            .map(([month, total]) => (
              <div key={month}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{month}</span>
                  <span className={`font-bold ${total >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {total} pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                  <div
                    className={`h-3 transition-all ${total >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(Math.abs(total) / 10, 100)}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg shadow-inner">
        <h3 className="font-semibold text-yellow-800 mb-3">📊 Daily Earnings (Last 7 Days)</h3>
        <div className="space-y-3">
          {Object.entries(dailyTotals).map(([day, total]) => (
            <div key={day}>
              <div className="flex justify-between text-sm mb-1">
                <span>{day}</span>
                <span className={`font-bold ${total >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {total} pts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                <div
                  className={`h-3 transition-all ${total >= 0 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(Math.abs(total) / 10, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Export */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          {Object.keys(typeLabels).map((key) => (
            <option key={key} value={key}>{typeLabels[key]}</option>
          ))}
        </select>

        <button
          onClick={() => exportCSVHelper(history)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
        >
          📤 CSV
        </button>

        <button
          onClick={exportPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          📄 PDF
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500">No history yet.</p>
      ) : (
        <div className="space-y-6">
          {filteredKeys.map((type) => {
            const items = grouped[type] || [];
            const totals = items.reduce(
              (acc, h) => {
                acc.count += 1;
                acc.points += h.amount;
                return acc;
              },
              { count: 0, points: 0 }
            );

            return (
              <div key={type}>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-1 flex justify-between items-center">
                  <span>{typeLabels[type] || type}</span>
                  <span className="text-sm text-gray-600">
                    {totals.count} items •{" "}
                    <span className={`font-bold ${totals.points >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {totals.points} pts
                    </span>
                  </span>
                </h3>

                <ul className="space-y-4">
                  {items.map((h) => (
                    <li
                      key={h._id || `${h.type}-${Math.random()}`}
                      className={`border rounded-lg p-4 shadow-sm transition transform duration-500 ${
                        newItemIds.has(h._id) ? "bg-yellow-100 animate-pulse" : "bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-blue-700">{h.type}</span>
                        <span className={`font-bold ${h.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {h.amount} pts
                        </span>
                      </div>

                      {h.description && (
                        <div className="text-gray-600 italic">{h.description}</div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(h.date || h.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}