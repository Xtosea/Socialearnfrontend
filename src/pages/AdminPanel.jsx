import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast, Toaster } from "react-hot-toast";

const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [wallet, setWallet] = useState(0);

  const [walletAmount, setWalletAmount] = useState("");
  const [userAmount, setUserAmount] = useState("");
  const [leaderboardAmount, setLeaderboardAmount] = useState("");

  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH WALLET =================
  const fetchWallet = async () => {
    setLoadingWallet(true);
    try {
      const res = await api.get("/admin/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data.points);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWallet();

    // Socket.IO
    const socket = io("http://localhost:5000");

    socket.on("walletUpdated", ({ userId, balance }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, points: balance } : u))
      );
      if (userId === selectedUser) setWallet(balance);
    });

    return () => socket.disconnect();
  }, [selectedUser]);

  // ================= WALLET ACTIONS =================
  const addToWallet = async () => {
    if (!walletAmount) return toast.error("Enter amount");
    try {
      await api.post(
        "/admin/wallet/add",
        { amount: walletAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWalletAmount("");
      fetchWallet();
      toast.success("Wallet updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const resetWallet = async () => {
    try {
      await api.post(
        "/admin/wallet/reset",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet();
      toast.success("Wallet reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // ================= USER POINTS =================
  const addPoints = async () => {
    if (!selectedUser || !userAmount)
      return toast.error("Select user and enter amount");
    setLoadingUser(true);
    try {
      await api.post(
        "/admin/points/add",
        { username: selectedUser, amount: userAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserAmount("");
      fetchUsers();
      toast.success("Points added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoadingUser(false);
    }
  };

  const deductPoints = async () => {
    if (!selectedUser || !userAmount)
      return toast.error("Select user and enter amount");
    setLoadingUser(true);
    try {
      await api.post(
        "/admin/points/deduct",
        { username: selectedUser, amount: userAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserAmount("");
      fetchUsers();
      toast.success("Points deducted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoadingUser(false);
    }
  };

  // ================= LEADERBOARD =================
  const rewardLeaderboard = async () => {
    if (!leaderboardAmount) return toast.error("Enter amount");
    setLoadingLeaderboard(true);
    try {
      await api.post(
        "/admin/points/reward-leaderboard",
        { amount: leaderboardAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaderboardAmount("");
      fetchUsers();
      toast.success("Leaderboard rewarded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      {/* WALLET */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Admin Wallet</h3>
        <p className="mb-2">
          Balance: <strong>{wallet}</strong> pts
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)}
            className="border p-2 flex-1"
          />
          <button
            onClick={addToWallet}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Points
          </button>
          <button
            onClick={resetWallet}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* USER POINTS */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Manage User Points</h3>
        <div className="flex gap-2 mb-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border p-2 flex-1"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u.username}>
                {u.username} — {u.points} pts
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={userAmount}
            onChange={(e) => setUserAmount(e.target.value)}
            className="border p-2 flex-1"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={addPoints}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Points
          </button>
          <button
            onClick={deductPoints}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Deduct Points
          </button>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Reward Leaderboard</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Reward Amount"
            value={leaderboardAmount}
            onChange={(e) => setLeaderboardAmount(e.target.value)}
            className="border p-2 flex-1"
          />
          <button
            onClick={rewardLeaderboard}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Reward Top 3
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;