import React, { useEffect, useState } from "react";
import api from "../api/api";
import { io } from "socket.io-client";
import { CSVLink } from "react-csv";
import { toast, Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function History() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [dailySummary, setDailySummary] = useState({});

  // Helper: Calculate daily points
  const calculateDailySummary = (hist) => {
    const summary = {};
    hist.forEach((h) => {
      const dateKey = new Date(h.date || h.createdAt).toLocaleDateString();
      if (!summary[dateKey]) summary[dateKey] = 0;
      summary[dateKey] += h.amount;
    });
    setDailySummary(summary);
  };

  // Fetch wallet/history
  const fetchHistory = async () => {
    try {
      const res = await api.get("/wallet");
      const hist = res.data.history || [];
      setCurrentPoints(res.data.balance || 0);
      setHistory(hist);
      calculateDailySummary(hist);
    } catch (err) {
      console.error("History fetch error:", err);
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    fetchHistory();

    const socket = io("http://localhost:5000");

    socket.on("walletUpdated", (data) => {
      if (data.userId === localStorage.getItem("userId")) {
        setCurrentPoints(data.balance);
        setHistory(data.history);
        calculateDailySummary(data.history);
        toast.success("Wallet updated!");
      }
    });

    return () => socket.disconnect();
  }, []);

  // Group by type
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

  // CSV Export
  const csvData = history.map((h) => ({
    Type: typeLabels[h.type] || h.type,
    Amount: h.amount,
    Description: h.description || "",
    Date: new Date(h.date || h.createdAt).toLocaleString(),
  }));

  // PDF Export
  const exportPDF = async () => {
    if (!history.length) return toast.error("No history to export");
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable"); // plugin for tables

    const doc = new jsPDF();
    doc.text("Wallet History", 14, 15);

    const rows = history.map((h) => [
      typeLabels[h.type] || h.type,
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

  // Helper: Get today and yesterday points
  const todayKey = new Date().toLocaleDateString();
  const yesterdayKey = new Date(Date.now() - 86400000).toLocaleDateString();

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto mt-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4 text-purple-700">📜 History</h2>

      {/* Current Points */}
      <div className="mb-4 p-4 rounded-lg bg-green-100 shadow-inner flex justify-between items-center">
        <span className="font-semibold text-lg text-green-800">Current Points:</span>
        <span className="font-bold text-xl text-green-700">{currentPoints} pts</span>
      </div>

      {/* Daily Summary */}
      <div className="mb-4 p-4 rounded-lg bg-yellow-100 shadow-inner flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="font-semibold text-lg text-yellow-800">
          Today: <span className="font-bold">{dailySummary[todayKey] || 0} pts</span>
        </span>
        <span className="font-semibold text-lg text-yellow-800">
          Yesterday: <span className="font-bold">{dailySummary[yesterdayKey] || 0} pts</span>
        </span>
      </div>

      {/* Grand Totals */}
      <div className="mb-4 p-4 rounded-lg bg-gray-100 shadow-inner flex justify-between items-center">
        <span className="font-semibold text-lg text-gray-800">
          Total Records: {grandTotals.count}
        </span>
        <span
          className={`font-bold text-lg ${
            grandTotals.points >= 0 ? "text-green-700" : "text-red-700"
          }`}
        >
          {grandTotals.points} pts
        </span>
      </div>

      {/* Filter + Export */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div>
          <label className="mr-2 font-medium">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            {Object.keys(typeLabels).map((key) => (
              <option key={key} value={key}>
                {typeLabels[key]}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportPDF}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export PDF
        </button>

        <CSVLink
          data={csvData}
          filename={"wallet-history.csv"}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </CSVLink>
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
                    <span
                      className={`font-bold ${
                        totals.points >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {totals.points} pts
                    </span>
                  </span>
                </h3>

                <ul className="space-y-4">
                  <AnimatePresence>
                    {items.map((h) => (
                      <motion.li
                        key={h._id || `${h.type}-${Math.random()}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-blue-700">{h.type}</span>
                          <span
                            className={`font-bold ${
                              h.amount >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {h.amount} pts
                          </span>
                        </div>

                        {h.description && (
                          <div className="text-gray-600 italic">{h.description}</div>
                        )}

                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(h.date || h.createdAt).toLocaleString()}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}