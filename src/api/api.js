// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ================== REQUEST INTERCEPTOR ==================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ================== RESPONSE INTERCEPTOR ==================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ================== AUTH ==================
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const getCurrentUser = () => api.get("/users/me");
export const updateUserProfile = (data) => api.put("/users/me", data);

// ================== USERS ==================
export const followUser = (userId) => api.post(`/users/follow/${userId}`);
export const unfollowUser = (userId) => api.post(`/users/unfollow/${userId}`);
export const getReferrals = () => api.get("/users/referrals");
export const getLeaderboard = (limit = 3) =>
  api.get(`/users/leaderboard?limit=${limit}`);

// ================== TASKS ==================
export const submitVideo = (data) => api.post("/tasks/video", data);
export const getVideoTasks = () => api.get("/tasks/video");
export const completeWatch = (taskId) =>
  api.post(`/tasks/watch/${taskId}/complete`);
export const completeAction = (taskId) =>
  api.post(`/tasks/action/${taskId}/complete`); // fixed typo

// ================== SOCIAL TASKS ==================
export const submitAction = (data) => api.post("/tasks/social", data);
export const getSocialTasks = () => api.get("/tasks/social");

// ================== PROMOTIONS ==================
export const getPromotedTasks = (type, platform) =>
  api.get(`/tasks/promoted/${type}/${platform}`);
export const getPromotionCosts = () => api.get("/tasks/promoted-costs");
export const getPromotedCounts = () => api.get("/tasks/promoted-counts");

// ================== WALLET (USERS) ==================
export const redeemPoints = (amount) =>
  api.post("/users/redeem", { amount });
export const transferPoints = (data) => api.post("/users/transfer", data);

// ================== ADMIN ==================
export const getWallet = () => api.get("/admin/wallet");
export const resetWallet = () => api.post("/admin/wallet/reset");
export const adminAddPoints = (data) => api.post("/admin/points/add", data);
export const adminDeductPoints = (data) =>
  api.post("/admin/points/deduct", data);
export const rewardLeaderboard = () =>
  api.post("/admin/points/reward-leaderboard");
export const getAllUsers = () => api.get("/admin/users");

export default api;