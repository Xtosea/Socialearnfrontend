import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // backend should send reset token in URL
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMsg("Passwords do not match.");
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });
      setMsg(res.data.message || "Password reset successful. Redirecting...");
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          required
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {msg && (
        <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>
      )}

      <div className="mt-4 text-sm flex justify-between">
        <Link to="/login" className="text-blue-600 underline">Back to Login</Link>
        <Link to="/register" className="text-blue-600 underline">Register</Link>
      </div>
    </div>
  );
}