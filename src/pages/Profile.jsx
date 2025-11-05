import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Copy, CheckCircle, Globe, Users, Camera } from "lucide-react";

export default function Profile() {
  const { user, setUser, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setBio(user.bio || "");
      setDob(user.dob || "");
      setCountry(user.country || "");
      setProfilePic(user.profilePicture || "");
    }
  }, [user]);

  if (!user) return <div>Loading profile...</div>;

  const handleCopyReferral = () => {
    const refLink = `${window.location.origin}/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast(null), 2500);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        setProfilePic(data.secure_url);

        // Automatically update profile after successful upload
        const updatedUser = await updateProfile({ profilePicture: data.secure_url });
        setUser(updatedUser);

        showToast("success", "Profile picture updated successfully!");
      } else {
        showToast("error", "Image upload failed.");
      }
    } catch {
      showToast("error", "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedFields = { email, bio, dob, country };
      if (password) updatedFields.password = password;
      if (profilePic) updatedFields.profilePicture = profilePic;

      const updatedUser = await updateProfile(updatedFields);
      setUser(updatedUser);
      setEditing(false);
      showToast("success", "Profile updated successfully!");
    } catch {
      showToast("error", "Failed to update profile.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Profile</h1>

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded text-white shadow transition ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={
              preview
                ? preview
                : user.profilePicture ||
                  "https://via.placeholder.com/120x120.png?text=Profile"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
          />
          <label
            htmlFor="profileUpload"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
          >
            <Camera className="w-4 h-4" />
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        {uploading && (
          <p className="text-sm text-blue-600 mt-2 animate-pulse">
            Uploading image...
          </p>
        )}
        <h2 className="text-lg font-semibold text-gray-700 mt-3">
          @{user.username}
        </h2>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border rounded-lg p-2"
            disabled={!editing}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows="3"
            disabled={!editing}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border rounded-lg p-2"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
            disabled={!editing}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setEditing(!editing)}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>

        {editing && (
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Referral Link Section */}
      <div className="mt-10 p-4 bg-gray-50 rounded-lg border flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Your referral link</p>
          <p className="font-semibold text-blue-700 text-sm break-all">
            {`${window.location.origin}/register?ref=${user.referralCode}`}
          </p>
        </div>
        <button
          onClick={handleCopyReferral}
          className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
        >
          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}