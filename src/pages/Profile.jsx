// src/pages/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfile } from "../api/api";

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    country: user?.country || "",
    bio: user?.bio || "",
    dob: user?.dob || "",
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) return <div>Loading...</div>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 📸 Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "socialearn_unsigned"); // from your Cloudinary settings
    data.append("folder", "profile_pics");

    try {
      setSaving(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djt1zq25a/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setProfilePicture(uploaded.secure_url);
        await updateProfile({ profilePicture: uploaded.secure_url });
        setMessage("Profile picture updated!");
      } else {
        setMessage("Upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  // 💾 Handle Save Text Info
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const updatedUser = await updateProfile({ ...form, profilePicture });
      setMessage("Profile updated successfully!");
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

      {message && (
        <div className="p-2 mb-4 rounded bg-green-100 text-green-800">{message}</div>
      )}

      {/* Profile Picture */}
      <div className="mb-6 text-center">
        <img
          src={profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border"
        />
        <label className="block text-blue-600 cursor-pointer">
          Change Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Editable Fields */}
      <div className="space-y-3">
        {["username", "email", "country", "dob", "bio", "password"].map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1 capitalize">
              {field.replace("_", " ")}:
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}