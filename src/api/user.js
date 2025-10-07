import api from "./api";

// ✅ Get current logged-in user
export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// ✅ Update profile
export const updateProfile = async (data) => {
  const res = await api.put("/users/me", data);
  return res.data;
};

// ✅ Follow user
export const followUser = async (userId) => {
  const res = await api.post(`/users/follow/${userId}`);
  return res.data;
};

// ✅ Unfollow user
export const unfollowUser = async (userId) => {
  const res = await api.post(`/users/unfollow/${userId}`);
  return res.data;
};

// ✅ Get referrals
export const getReferrals = async () => {
  const res = await api.get("/users/referrals");
  return res.data;
};

// ✅ Get leaderboard
export const getLeaderboard = async (limit = 3) => {
  const res = await api.get(`/users/leaderboard?limit=${limit}`);
  return res.data.leaders;
};