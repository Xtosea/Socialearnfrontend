import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(identifier, password);
      navigate("/dashboard");
      alert(`Welcome back, ${user.username}!`);
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={submit}
        className={`bg-white p-6 rounded shadow w-full max-w-md space-y-4 transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full p-2 text-white font-semibold rounded flex justify-center items-center gap-2 ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="flex justify-between text-sm text-gray-600 mt-3">
          <Link to="/forgot-password" className="underline">
            Forgot password?
          </Link>
          <Link to="/register" className="underline">
            Don't have an account? Register
          </Link>
        </div>
      </form>

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        .animate-shake { animation: shake 0.5s; }
      `}</style>
    </div>
  );
}