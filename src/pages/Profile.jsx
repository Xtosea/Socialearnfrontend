import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Copy, CheckCircle, Globe, Users } from "lucide-react";
import GoBackButton from "../components/GoBackButton";

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

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setBio(user.bio || "");
      setDob(user.dob || "");
      setCountry(user.country || "");
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

  const handleSave = async () => {
    try {
      const updatedFields = { email, bio, dob, country };
      if (password) updatedFields.password = password;
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
      <GoBackButton />
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

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          @{user.username}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <Globe className="inline w-4 h-4 mr-2 text-blue-500" />
            <strong>Country:</strong> {user.country || "Not set"}
          </p>
          <p>
            <Users className="inline w-4 h-4 mr-2 text-blue-500" />
            <strong>Followers:</strong> {user.followers?.length || 0}
            {" · "}
            <strong>Following:</strong> {user.following?.length || 0}
          </p>
          <p>
            <strong>Points:</strong>{" "}
            <span className="text-green-600 font-semibold">{user.points}</span>
          </p>
        </div>

        {/* Referral Link Section */}
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
              className="ml-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editable Profile Details */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Edit Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              className="w-full border rounded p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
            />
          </div>

          <div>
            <label className="block font-medium">Bio</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!editing}
            />
          </div>

          <div>
            <label className="block font-medium">Date of Birth</label>
            <input
              className="w-full border rounded p-2"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={!editing}
            />
          </div>

          <div>
            <label className="block font-medium">Country</label>
            <input
              className="w-full border rounded p-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={!editing}
              placeholder="Country of origin"
            />
          </div>

          {editing && (
            <div>
              <label className="block font-medium">Change Password</label>
              <input
                className="w-full border rounded p-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (optional)"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEmail(user.email);
                  setBio(user.bio || "");
                  setDob(user.dob || "");
                  setCountry(user.country || "");
                  setPassword("");
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
    </div>
  );
}