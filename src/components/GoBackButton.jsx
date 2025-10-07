// src/components/GoBackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors mb-4"
    >
      <ArrowLeft className="w-5 h-5" />
      Go Back
    </button>
  );
}