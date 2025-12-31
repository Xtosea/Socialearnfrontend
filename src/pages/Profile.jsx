import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Copy, CheckCircle, Globe, Users, Upload, Loader2 } from "lucide-react";
import FollowButton from "../components/FollowButton";
import UserRow from "../components/UserRow";
import api from "../api/api";

export default function Profile() {
  const { user, setUser, updateProfile } = useContext(AuthContext);
  const { id } = useParams();
  const isOwnProfile = !id || id === user?._id;

  const [viewedUser, setViewedUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

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

  const profileUser = isOwnProfile ? user : viewedUser;

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!user) return;

    if (isOwnProfile) {
      setEmail(user.email || "");
      setBio(user.bio || "");
      setDob(user.dob || "");
      setCountry(user.country || "");
      setProfilePicture(user.profilePicture || "");
      fetchSuggestedUsers();
    } else {
      fetchViewedUser();
    }
  }, [user, id]);

  const fetchViewedUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setViewedUser(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  /* ================= SUGGESTED USERS ================= */
  const fetchSuggestedUsers = async () => {
    try {
      const res = await api.get("/users/suggested");
      setSuggestedUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch suggested users", err);
    }
  };

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

  const refreshProfile = async () => {
    if (isOwnProfile) {
      const res = await api.get("/users/me");
      setUser(res.data);
      fetchSuggestedUsers();
    } else {
      fetchViewedUser();
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

  /* ================= LOADING CHECK ================= */
  if (!user || (!isOwnProfile && !viewedUser)) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

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

      {/* PROFILE CARD */}
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
              <strong>Followers:</strong> {profileUser.followers?.length || 0} ·{" "}
              <strong>Following:</strong> {profileUser.following?.length || 0}
            </p>

            <p>
              <strong>Points:</strong>{" "}
              <span className="text-green-600 font-semibold">
                {profileUser.points || 0}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* REFERRAL */}
      {isOwnProfile && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Invite friends and earn rewards
          </p>
          <div className="flex items-center justify-between bg-white border rounded-lg p-2">
            <span className="truncate text-gray-700 text-sm">
              {`${window.location.origin}/register?ref=${user.referralCode}`}
            </span>
            <button
              onClick={handleCopyReferral}
              className="ml-3 px-3 py-1 bg-blue-600 text-white rounded"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* EDIT PROFILE */}
      {isOwnProfile && profileUser && (
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
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

          <div className="mt-4 flex gap-3">
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

      {/* SUGGESTED USERS */}
      {isOwnProfile && suggestedUsers.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Suggested Users to Follow
          </h3>

          <div className="flex flex-col gap-3">
            {suggestedUsers.map((u) => {
              const alreadyFollowing = user.following?.includes(u._id);
              const isFollower = user.followers?.includes(u._id);

              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <UserRow user={u} />

                    {isFollower && !alreadyFollowing && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        Follows you
                      </span>
                    )}
                  </div>

                  <FollowButton
                    targetUserId={u._id}
                    isFollowing={alreadyFollowing}
                    onUpdate={refreshProfile}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}