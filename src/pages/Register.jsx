import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Register() {
  const location = useLocation();
  const [referral, setReferral] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ref = queryParams.get("ref");
    if (ref) setReferral(ref);
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect backend API here
    alert(`Registered successfully with referral: ${referral || "None"}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 py-10">
      <div className="max-w-md w-full">
        <Card className="shadow-lg border-none rounded-2xl bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-indigo-700">Create an Account</h1>
            <p className="text-gray-600">Join and start earning today!</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {referral && (
                <div>
                  <label className="text-sm text-gray-700">Referral Code</label>
                  <input
                    type="text"
                    value={referral}
                    readOnly
                    className="border p-2 rounded w-full bg-gray-100 text-gray-700"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-700">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  className="border p-2 rounded w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
              >
                Register
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}