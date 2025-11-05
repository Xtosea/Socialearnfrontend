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

    // Upload to Cloudinary
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
        showToast("success", "Profile picture uploaded!");
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>

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
            className="w-28 h-28 rounded-full object-cover border shadow"
          />
          {editing && (
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
          )}
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

      {/* Other profile sections remain exactly the same (bio, country, referral, etc.) */}

      {/* Editable Details */}
      {/* ... same as your code above ... */}
    </div>
  );
}