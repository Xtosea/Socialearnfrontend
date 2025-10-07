// src/pages/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [country, setCountry] = useState(user?.country || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) return <div>Loading...</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/update", { username, email, country });
      setUser(res.data.user); // update context
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Username:</label>
          {editing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          ) : (
            <p>{user.username}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Email:</label>
          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Country:</label>
          {editing ? (
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          ) : (
            <p>{user.country || "Not set"}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Role:</label>
          <p>{user.role}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Points:</label>
          <p>{user.points}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setUsername(user.username);
                setEmail(user.email);
                setCountry(user.country);
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}