import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [country, setCountry] = useState(user?.country || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [preview, setPreview] = useState(user?.profilePicture || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) return <div>Loading...</div>;

  // =================== HANDLE FILE CHANGE ===================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file)); // local preview
    }
  };

  // =================== SAVE PROFILE ===================
  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedFields = { username, email, country };

      // if a new image is selected
      if (profilePicture instanceof File) {
        updatedFields.profilePicture = profilePicture;
      }

      const updatedUser = await updateProfile(updatedFields);
      setMessage("✅ Profile updated successfully!");
      setEditing(false);

      // Update preview after save
      if (updatedUser?.profilePicture) {
        setPreview(updatedUser.profilePicture);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src={
              preview ||
              "https://res.cloudinary.com/demo/image/upload/v1691234567/default-avatar.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />

          {editing && (
            <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Username */}
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

        {/* Email */}
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

        {/* Country */}
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

        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role:</label>
          <p>{user.role}</p>
        </div>

        {/* Points */}
        <div>
          <label className="block font-medium mb-1">Points:</label>
          <p>{user.points}</p>
        </div>
      </div>

      {/* Buttons */}
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
                setPreview(user.profilePicture);
                setMessage("");
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