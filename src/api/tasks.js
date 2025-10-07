// src/api/tasks.js
import api from "./api";

// ✅ Video tasks
export const getVideoTasks = async () => {
  const res = await api.get("/tasks/video");
  return res.data;
};

export const addVideoTask = async (taskData) => {
  const res = await api.post("/tasks/video", taskData);
  return res.data;
};

// ✅ Social tasks
export const getSocialTasks = async () => {
  const res = await api.get("/tasks/social");
  return res.data;
};

export const addSocialTask = async (taskData) => {
  const res = await api.post("/tasks/social", taskData);
  return res.data;
};

// ✅ Task completion
export const completeTask = async (taskId) => {
  const res = await api.post("/tasks/complete", { taskId });
  return res.data;
};

// ✅ User self-promote
export const selfPromoteTask = async (taskId) => {
  const res = await api.post("/tasks/promote/self", { taskId });
  return res.data;
};

// ✅ Admin promote/unpromote
export const promoteTask = async ({ taskId, type }) => {
  const res = await api.post("/tasks/promote", { taskId, type });
  return res.data;
};

// ✅ Promoted tasks
export const getPromotedCounts = async () => {
  const res = await api.get("/tasks/promoted-counts");
  return res.data;
};

export const getPromotedTasks = async (type, platform) => {
  const res = await api.get(`/tasks/promoted/${type}/${platform}`);
  return res.data;
};