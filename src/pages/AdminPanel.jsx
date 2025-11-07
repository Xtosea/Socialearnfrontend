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

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
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
      toast.error("Failed to fetch wallet");
    } finally {
      setLoadingWallet(false);
    }
  };

  // ================= FETCH VIDEO TASKS =================
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await api.get("/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Tasks fetched:", res.data); // Debug
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWallet();
    fetchTasks();

    // Socket.IO
    const socket = io("http://localhost:5000"); // Replace with local IP if needed

    socket.on("walletUpdated", ({ userId, balance }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, points: balance } : u))
      );
      if (selectedUser === userId) setWallet(balance);
    });

    socket.on("userDeleted", ({ userId }) => {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (selectedUser && users.find((u) => u._id === userId)) setSelectedUser("");
      toast.success("User deleted");
    });

    socket.on("taskDeleted", ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
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

  // ================= DELETE USER =================
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // ================= DELETE TASK =================
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      {/* WALLET */}
      <div className="p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Admin Wallet</h3>
        <p className="mb-2">Balance: <strong>{wallet}</strong> pts</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)}
            className="border p-2 flex-1"
          />
          <button onClick={addToWallet} className="bg-green-500 text-white px-4 py-2 rounded">Add Points</button>
          <button onClick={resetWallet} className="bg-red-500 text-white px-4 py-2 rounded">Reset</button>
        </div>
      </div>

      {/* USER POINTS & DELETE */}
      <div className="p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Manage Users</h3>
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
        <div className="flex gap-2 mb-2">
          <button onClick={addPoints} className="bg-blue-500 text-white px-4 py-2 rounded">Add Points</button>
          <button onClick={deductPoints} className="bg-yellow-500 text-white px-4 py-2 rounded">Deduct Points</button>
        </div>
        <div className="space-y-1">
          {users.map((u) => (
            <div key={u._id} className="flex justify-between items-center bg-white p-2 border rounded">
              <span>{u.username} — {u.points} pts</span>
              <button onClick={() => handleDeleteUser(u._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete User</button>
            </div>
          ))}
        </div>
      </div>

      {/* VIDEO TASKS */}
      <div className="p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Manage Video Tasks</h3>
        {loadingTasks ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <div className="space-y-1">
            {tasks.map((t) => (
              <div key={t._id} className="flex justify-between items-center bg-white p-2 border rounded">
                <span>{t.title || t.name || t.taskTitle}</span>
                <button onClick={() => handleDeleteTask(t._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete Task</button>
              </div>
            ))}
          </div>
        )}
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
          <button onClick={rewardLeaderboard} className="bg-purple-500 text-white px-4 py-2 rounded">Reward Top 3</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;