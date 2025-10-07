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
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const dropdownRef = useRef();

  // ✅ Prefill referralCode from URL if present
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setForm((prev) => ({ ...prev, referralCode: refFromUrl }));
    }
  }, [searchParams]);

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
    setLoading(true);
    try {
      await register(form);
      nav("/dashboard"); // ✅ go to Dashboard after register
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const referralLocked = !!searchParams.get("ref"); // ✅ lock if from URL

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">Register</h2>
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
          <input
            type="text"
            placeholder="Select country"
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={
              form.country
                ? countries.find((c) => c.code === form.country)?.name
                : search
            }
            onChange={(e) => {
              setSearch(e.target.value);
              setDropdownOpen(true);
            }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            required
          />
          {dropdownOpen && (
            <ul className="absolute z-20 w-full max-h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <li
                    key={c.code}
                    className="p-3 hover:bg-blue-100 cursor-pointer transition-colors"
                    onClick={() => {
                      setForm({ ...form, country: c.code });
                      setSearch("");
                      setDropdownOpen(false);
                    }}
                  >
                    {c.name}
                  </li>
                ))
              ) : (
                <li className="p-3 text-gray-500">No countries found</li>
              )}
            </ul>
          )}
        </div>

        {/* Referral Code Input */}
        <input
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            referralLocked ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
          }`}
          placeholder="Referral Code (optional)"
          value={form.referralCode}
          onChange={(e) =>
            !referralLocked && setForm({ ...form, referralCode: e.target.value })
          }
          readOnly={referralLocked} // lock if from URL
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