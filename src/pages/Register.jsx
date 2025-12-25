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
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const dropdownRef = useRef();

  // Prefill referralCode from URL if present
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setForm((prev) => ({ ...prev, referralCode: refFromUrl }));
    }
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.username || !form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    if (!form.country || form.country === "") {
      alert("Please select a country");
      return;
    }

    setLoading(true);
    try {
      console.log("Registering with:", form); // Debug log
      await register(form);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const referralFromUrl = searchParams.get("ref");
  const referralLocked = !!referralFromUrl;

  // 🎄 Xmas Bonanza Dec 24-26
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 11 = Dec
  const date = now.getDate();
  const isXmasBonanza = month === 11 && date >= 24 && date <= 26;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">
        Register
      </h2>

      {/* Xmas Bonanza Banner */}
      {isXmasBonanza && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mb-4 text-center font-semibold">
          🎄 Xmas Referral Bonanza! Get 1500 points for using a referral code! 🎁
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium hover:text-gray-700"
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
              {countries
                .filter((c) => c.code)
                .map((c) => (
                  <li
                    key={c.code}
                    className="p-3 hover:bg-blue-100 cursor-pointer transition-colors"
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
            referralLocked ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
          }`}
          placeholder="Referral Code (optional)"
          value={form.referralCode}
          onChange={(e) =>
            !referralLocked && setForm({ ...form, referralCode: e.target.value })
          }
          readOnly={referralLocked}
        />

        <button
          type="submit"
          className={`w-full p-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2 transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-600">
        Already registered?{" "}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}