// src/api/promotion.js
import api from "./api"; // axios instance

// Get promotion costs
export const getPromotionCosts = async () => {
  const res = await api.get("/tasks/promoted-costs"); // your backend endpoint
  return res.data;
};

// Get promoted task counts
export const getPromotedCounts = async () => {
  const res = await api.get("/tasks/promoted-counts");
  return res.data;
};

// Get promoted tasks by type + platform
export const getPromotedTasks = async (type, platform) => {
  const res = await api.get(`/tasks/promoted/${type}/${platform}`);
  return res.data;
};

export default api;