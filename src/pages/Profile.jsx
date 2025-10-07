// src/pages/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import GoBackButton from "../components/GoBackButton"; // adjust path if needed

export default function Profile() {
  const { user, setUser, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const BIO_MAX = 200;

  useEffect(() => {
    if (editing) setErrors({});
  }, [editing]);

  if (!user) return <div>Loading...</div>;

  const validate = () => {
    const errs = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Invalid email address";
    if (password && password.length < 6) errs.password = "Password must be at least 6 characters";
    if (bio.length > BIO_MAX) errs.bio = `Bio cannot exceed ${BIO_MAX} characters`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const updatedFields = { email, bio, dob };
      if (password) updatedFields.password = password;

      const updatedUser = await updateProfile(updatedFields);
      setUser(updatedUser);
      showToast("success", "Profile updated successfully!");
      setPassword("");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto relative">
      <GoBackButton />
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white transform transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email:</label>
          {editing ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border px-3 py-2 rounded ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </>
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block font-medium mb-1">Bio:</label>
          {editing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                className={`w-full border px-3 py-2 rounded ${errors.bio ? "border-red-500" : ""}`}
                rows={3}
                placeholder="Write a short bio"
              />
              <p className="text-gray-500 text-sm mt-1">{bio.length}/{BIO_MAX}</p>
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </>
          ) : (
            <p>{user.bio || "Not set"}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-medium mb-1">Date of Birth:</label>
          {editing ? (
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          ) : (
            <p>{user.dob || "Not set"}</p>
          )}
        </div>

        {/* Password */}
        {editing && (
          <div>
            <label className="block font-medium mb-1">Change Password:</label>
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className={`w-full border px-3 py-2 rounded ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        )}
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
                setEmail(user.email);
                setBio(user.bio || "");
                setDob(user.dob || "");
                setPassword("");
                setErrors({});
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