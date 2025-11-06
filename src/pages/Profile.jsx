// src/pages/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    country: user?.country || "",
    bio: user?.bio || "",
    dateOfBirth: user?.dateOfBirth || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await api.put("/auth/update", formData);
      setUser(res.data.user);
      setMessage("✅ Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // 📸 Profile picture upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "socialearn_unsigned"); // your Cloudinary preset
    formData.append("folder", "profile_pics");

    try {
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await cloudRes.json();

      // Now update user profile with the new image URL
      const res = await api.put("/auth/update", {
        profilePicture: data.secure_url,
      });
      setUser(res.data.user);
      setMessage("✅ Profile picture updated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {/* Profile Picture */}
      <div className="mb-4 flex items-center gap-4">
        <img
          src={user.profilePicture || "https://via.placeholder.com/120"}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <label className="block text-sm font-medium mb-1">
            Change Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-4">
        {["username", "email", "country", "bio", "dateOfBirth", "password"].map(
          (field) => (
            <div key={field}>
              <label className="block font-medium mb-1 capitalize">
                {field === "dateOfBirth"
                  ? "Date of Birth"
                  : field === "bio"
                  ? "Bio"
                  : field}
              </label>
              {editing ? (
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <p>
                  {field === "password"
                    ? "••••••••"
                    : formData[field] || "Not set"}
                </p>
              )}
            </div>
          )
        )}

        <div>
          <label className="block font-medium mb-1">Points:</label>
          <p>{user.points || 0}</p>
        </div>
      </div>

      {/* Action Buttons */}
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
                setFormData({
                  username: user.username,
                  email: user.email,
                  country: user.country,
                  bio: user.bio,
                  dateOfBirth: user.dateOfBirth,
                  password: "",
                });
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