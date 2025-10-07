#!/usr/bin/env bash
set -e

mkdir -p src/{api,components,context,pages}
# write files

cat > src/api/api.js <<'JS'
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
JS

cat > src/context/AuthContext.jsx <<'JS'
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("auth load failed", err);
        localStorage.removeItem("token");
      }
    }
    load();
  }, []);

  async function login(identifier, password) {
    const res = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user || null);
    // reload me
    try {
      const me = await api.get("/auth/me");
      setUser(me.data.user);
    } catch {}
  }

  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user || null);
    try {
      const me = await api.get("/auth/me");
      setUser(me.data.user);
    } catch {}
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
JS

cat > src/main.jsx <<'JS'
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
JS

cat > src/App.jsx <<'JS'
import React, { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import History from "./pages/History";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPanel from "./pages/AdminPanel";
import { AuthContext } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">Social-Earn</Link>
          <nav className="space-x-4">
            <Link to="/">Home</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/wallet">Wallet</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <RequireAuth><Profile /></RequireAuth>
          } />
          <Route path="/wallet" element={
            <RequireAuth><Wallet /></RequireAuth>
          } />
          <Route path="/history" element={
            <RequireAuth><History /></RequireAuth>
          } />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}
JS

cat > src/index.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
.container { max-width: 1100px; margin-left: auto; margin-right: auto; }
CSS

cat > src/components/Navbar.jsx <<'JS'
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="bg-white p-4 shadow mb-6">
      <div className="container flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold">Social-Earn</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile">{user.username}</Link>
              <button onClick={logout} className="text-sm text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
JS

cat > src/components/VideoCard.jsx <<'JS'
import React from "react";
import VideoPlayerWithTimer from "../components/VideoPlayerWithTimer"; // optional: you can implement a richer player
export default function VideoCard({ task }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">{task.platform}</div>
        <div className="text-sm">{task.points} pts</div>
      </div>
      <div className="mb-2">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">Video preview</div>
      </div>
      <div className="text-sm text-gray-600">Duration: {task.duration}s</div>
    </div>
  );
}
JS

cat > src/components/ActionCard.jsx <<'JS'
import React from "react";
export default function ActionCard({ task }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{task.platform}</div>
          <div className="text-sm">{task.action} · {task.quantity}</div>
        </div>
        <div className="text-sm">{task.points} pts</div>
      </div>
    </div>
  );
}
JS

cat > src/components/Leaderboard.jsx <<'JS'
import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Leaderboard({ limit = 10 }) {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/users/leaderboard?limit=${limit}`);
        setLeaders(res.data.leaders || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [limit]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Leaderboard</h3>
      <ol className="list-decimal pl-5">
        {leaders.map(u => <li key={u._id}>{u.username} — {u.points} pts</li>)}
      </ol>
    </div>
  );
}
JS

cat > src/pages/Login.jsx <<'JS'
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(identifier, password);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="email or username" value={identifier} onChange={e => setIdentifier(e.target.value)} />
        <input type="password" className="w-full p-2 border" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
JS

cat > src/pages/Register.jsx <<'JS'
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", country: "" });
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        <input className="w-full p-2 border" placeholder="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" className="w-full p-2 border" placeholder="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <select className="w-full p-2 border" value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
          <option value="">Select country</option>
          <option value="NG">Nigeria</option>
          <option value="US">United States</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
JS

cat > src/pages/Dashboard.jsx <<'JS'
import React, { useEffect, useState } from "react";
import api from "../api/api";
import VideoCard from "../components/VideoCard";
import ActionCard from "../components/ActionCard";
import Leaderboard from "../components/Leaderboard";

export default function Dashboard(){
  const [videos, setVideos] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tasks/video");
        setVideos(res.data.tasks || res.data || []);
      } catch (err) { console.error(err); }
      try {
        const res2 = await api.get("/tasks/social");
        setActions(res2.data || []);
      } catch {}
    })();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-4">Available Tasks</h2>
        {videos.map(v => <VideoCard key={v._id} task={v} />)}
        <h3 className="text-xl mt-6 mb-2">Social Actions</h3>
        {actions.map(a => <ActionCard key={a._id} task={a} />)}
      </div>
      <aside>
        <Leaderboard limit={10} />
      </aside>
    </div>
  );
}
JS

cat > src/pages/Profile.jsx <<'JS'
import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Profile(){
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {}
    })();
  }, []);

  if (!user) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl mb-4">Profile</h2>
      <div><strong>Username:</strong> {user.username}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Country:</strong> {user.profile?.country || user.country}</div>
      <div><strong>Points:</strong> {user.points}</div>
    </div>
  );
}
JS

cat > src/pages/Wallet.jsx <<'JS'
import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Wallet(){
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/wallet");
        setWallet(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const redeem = async () => {
    try {
      await api.post("/wallet/redeem", { amount: Number(amount) });
      const res = await api.get("/wallet");
      setWallet(res.data);
      setAmount("");
      alert("Redeemed");
    } catch (err) {
      alert(err.response?.data?.message || "Redeem failed");
    }
  };

  if (!wallet) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-xl mb-4">Wallet</h2>
      <div className="mb-2"><strong>Balance:</strong> {wallet.balance}</div>
      <div className="mb-2"><strong>Transactions:</strong></div>
      <ul className="mb-4">
        {wallet.history?.slice().reverse().map((t,i) => <li key={i} className="text-sm">{t.type} — {t.amount} — {new Date(t.date).toLocaleString()}</li>)}
      </ul>
      <div className="flex gap-2">
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="p-2 border" placeholder="Amount to redeem" />
        <button onClick={redeem} className="bg-blue-600 text-white px-3 py-2 rounded">Redeem</button>
      </div>
    </div>
  );
}
JS

cat > src/pages/History.jsx <<'JS'
import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function History(){
  const [history, setHistory] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/history");
        setHistory(res.data.history || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl">
      <h2 className="text-xl mb-4">History</h2>
      <ul>
        {history.map(h => (
          <li key={h._id} className="mb-2">
            <div className="text-sm">{h.taskType} — {h.amount} pts — {new Date(h.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
JS

cat > src/pages/LeaderboardPage.jsx <<'JS'
import React from "react";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage(){
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl mb-4">Leaderboard</h2>
        <Leaderboard limit={100} />
      </div>
      <div>
        <h2 className="text-2xl mb-4">About</h2>
        <p className="bg-white p-4 rounded shadow">Top users by points.</p>
      </div>
    </div>
  );
}
JS

cat > src/pages/AdminPanel.jsx <<'JS'
import React from "react";
import AdminNav from "../components/AdminNav";
import WalletManager from "./Admin/WalletManager";
import BulkTransfer from "./Admin/BulkTransfer";
import PostManager from "./Admin/PostManager";
import LeaderboardReward from "./Admin/LeaderboardReward";

export default function AdminPanel(){
  return (
    <div>
      <div className="mb-4"><h1 className="text-2xl">Admin Panel</h1></div>
      <div className="grid grid-cols-2 gap-6">
        <div><WalletManager /></div>
        <div><BulkTransfer /></div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div><PostManager /></div>
        <div><LeaderboardReward /></div>
      </div>
    </div>
  );
}
JS

# Admin sub-pages and AdminNav
mkdir -p src/pages/Admin
cat > src/components/AdminNav.jsx <<'JS'
export default function AdminNav({ setTab, active }) {
  return (
    <nav className="bg-white p-3 rounded shadow mb-4 flex gap-3">
      <button className={active==='wallet'?'font-bold':''} onClick={()=>setTab('wallet')}>Wallet</button>
      <button className={active==='bulk'?'font-bold':''} onClick={()=>setTab('bulk')}>Bulk</button>
      <button className={active==='posts'?'font-bold':''} onClick={()=>setTab('posts')}>Posts</button>
      <button className={active==='leaderboard'?'font-bold':''} onClick={()=>setTab('leaderboard')}>Leaderboard</button>
    </nav>
  );
}
JS

cat > src/pages/Admin/WalletManager.jsx <<'JS'
import { useState } from "react";
import api from "../../api/api";

export default function WalletManager(){
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("add");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = action === "add" ? "/admin/wallet/add" : "/admin/wallet/deduct";
      const res = await api.post(endpoint, { userId, amount: Number(amount) });
      setMsg(res.data.message || "Done");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Wallet Manager</h3>
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 border" placeholder="User ID" value={userId} onChange={e=>setUserId(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <select className="w-full p-2 border" value={action} onChange={e=>setAction(e.target.value)}>
          <option value="add">Add</option>
          <option value="deduct">Deduct</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
      </form>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
JS

cat > src/pages/Admin/BulkTransfer.jsx <<'JS'
import { useState } from "react";
import api from "../../api/api";

export default function BulkTransfer(){
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/wallet/transfer-all", { amount: Number(amount) });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Bulk Transfer</h3>
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 border" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Transfer to all users</button>
      </form>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
JS

cat > src/pages/Admin/PostManager.jsx <<'JS'
import { useState } from "react";
import api from "../../api/api";

export default function PostManager(){
  const [postId, setPostId] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.delete(`/admin/post/${postId}`);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Delete Post</h3>
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 border" placeholder="Post ID" value={postId} onChange={e=>setPostId(e.target.value)} />
        <button className="w-full bg-red-600 text-white p-2 rounded">Delete</button>
      </form>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
JS

cat > src/pages/Admin/LeaderboardReward.jsx <<'JS'
import { useState } from "react";
import api from "../../api/api";

export default function LeaderboardReward(){
  const [amount, setAmount] = useState("");
  const [top, setTop] = useState(3);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/leaderboard/reward", { amount: Number(amount), top: Number(top) });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Reward Leaderboard</h3>
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 border" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Top N" value={top} onChange={e=>setTop(e.target.value)} />
        <button className="w-full bg-purple-600 text-white p-2 rounded">Reward</button>
      </form>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
JS

echo "Frontend files created."
