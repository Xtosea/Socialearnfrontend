import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Copy, CheckCircle, Globe, Users, Upload, Loader2 } from "lucide-react";
import FollowButton from "../components/FollowButton";
import api from "../api/api";

export default function Profile() {
  const { user, setUser, updateProfile } = useContext(AuthContext);
  const { id } = useParams(); // /profile/:id

  const isOwnProfile = !id || id === user?._id;

  const [viewedUser, setViewedUser] = useState(null);
  const profileUser = isOwnProfile ? user : viewedUser;

  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!user) return;

    if (isOwnProfile) {
      setEmail(user.email || "");
      setBio(user.bio || "");
      setDob(user.dob || "");
      setCountry(user.country || "");
      setProfilePicture(user.profilePicture || "");
    } else {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/users/${id}`);
          setViewedUser(res.data);
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      };
      fetchUser();
    }
  }, [user, id, isOwnProfile]);

  if (!profileUser) return <div>Loading profile...</div>;

  /* ================= HELPERS ================= */
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopyReferral = () => {
    const refLink = `${window.location.origin}/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= REFRESH PROFILE ================= */
  const refreshProfile = async () => {
    if (isOwnProfile) {
      const res = await api.get("/users/me");
      setUser(res.data);
    } else {
      const res = await api.get(`/users/${profileUser._id}`);
      setViewedUser(res.data);
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "socialearn_unsigned");
    data.append("folder", "profile_pics");

    try {
      setLoadingText("Uploading photo...");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djt1zq25a/image/upload",
        { method: "POST", body: data }
      );

      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setProfilePicture(uploaded.secure_url);
        const updatedUser = await updateProfile({
          profilePicture: uploaded.secure_url,
        });
        setUser(updatedUser);
        showToast("success", "Profile picture updated!");
      }
    } catch {
      showToast("error", "Upload failed.");
    } finally {
      setLoadingText("");
    }
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      setLoadingText("Saving changes...");
      const updatedFields = { email, bio, dob, country, profilePicture };
      if (password) updatedFields.password = password;

      const updatedUser = await updateProfile(updatedFields);
      setUser(updatedUser);
      setEditing(false);
      showToast("success", "Profile updated successfully!");
    } catch {
      showToast("error", "Failed to update profile.");
    } finally {
      setLoadingText("");
    }
  };

  return (
    <div className="relative p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded text-white shadow ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Loading Overlay */}
      {loadingText && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
          <p className="font-medium text-blue-700">{loadingText}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex gap-5">
        <div className="relative w-24 h-24">
          <img
            src={profileUser.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          {isOwnProfile && (
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold">@{profileUser.username}</h2>

          {!isOwnProfile && (
            <div className="mt-2">
              <FollowButton
                targetUserId={profileUser._id}
                isFollowing={user.following?.includes(profileUser._id)}
                onUpdate={refreshProfile}
              />
            </div>
          )}

          <div className="mt-3 space-y-1 text-gray-700">
            <p>
              <Globe className="inline w-4 h-4 mr-2 text-blue-500" />
              {profileUser.country || "Not set"}
            </p>

            <p>
              <Users className="inline w-4 h-4 mr-2 text-blue-500" />
              <strong>Followers:</strong>{" "}
              {profileUser.followers?.length || 0} ·{" "}
              <strong>Following:</strong>{" "}
              {profileUser.following?.length || 0}
            </p>

            <p>
              <strong>Points:</strong>{" "}
              <span className="text-green-600 font-semibold">
                {profileUser.points}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE (OWN PROFILE ONLY) */}
      {isOwnProfile && (
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Edit Details</h3>

          <div className="space-y-4">
            <input
              className="w-full border rounded p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
              placeholder="Email"
            />

            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!editing}
              placeholder="Bio"
            />

            <input
              className="w-full border rounded p-2"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={!editing}
            />

            <input
              className="w-full border rounded p-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={!editing}
              placeholder="Country"
            />

            {editing && (
              <input
                className="w-full border rounded p-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (optional)"
              />
            )}
          </div>

          <div className="mt-6 flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}