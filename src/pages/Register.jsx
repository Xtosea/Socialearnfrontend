import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { countriesPart1 } from "../data/countriesPart1";
import { countriesPart2 } from "../data/countriesPart2";
import { countriesPart3 } from "../data/countriesPart3";
import { countriesPart4 } from "../data/countriesPart4";
import { countriesPart5 } from "../data/countriesPart5";

const countries = [
  { code: "", name: "Select country" },
  ...countriesPart1,
  ...countriesPart2,
  ...countriesPart3,
  ...countriesPart4,
  ...countriesPart5,
];

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const dropdownRef = useRef();

  // ✅ Prefill referral code from URL
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setForm((prev) => ({ ...prev, referralCode: refFromUrl }));
    }
  }, [searchParams]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.country) {
      setError("Please select a country");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(form);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const referralLocked = !!searchParams.get("ref");

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">
        Register
      </h2>

      {/* 🔴 ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {/* Username */}
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />

        {/* Email */}
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Country Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className={`w-full p-3 border rounded-lg cursor-pointer ${
              form.country ? "border-gray-300" : "border-red-400"
            }`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {form.country
              ? countries.find((c) => c.code === form.country)?.name
              : "Select country"}
          </div>

          {dropdownOpen && (
            <ul className="absolute z-20 w-full max-h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
              {countries.map((c) => (
                <li
                  key={c.code}
                  className="p-3 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setForm({ ...form, country: c.code });
                    setDropdownOpen(false);
                  }}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Referral Code */}
        <input
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            referralLocked
              ? "bg-gray-100 cursor-not-allowed"
              : "border-gray-300"
          }`}
          placeholder="Referral Code (optional)"
          value={form.referralCode}
          onChange={(e) =>
            !referralLocked &&
            setForm({ ...form, referralCode: e.target.value })
          }
          readOnly={referralLocked}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-600">
        Already registered?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-medium hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}