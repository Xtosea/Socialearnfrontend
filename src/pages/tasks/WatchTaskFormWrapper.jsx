// src/pages/tasks/WatchTaskFormWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import WatchTaskForm from "../../components/WatchTaskForm";

export default function WatchTaskFormWrapper() {
  const { platform } = useParams();
  return <WatchTaskForm platform={platform} />;
}