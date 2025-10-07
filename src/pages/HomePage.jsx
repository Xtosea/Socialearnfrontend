import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Welcome to Social-Earn 🎉</h1>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Earn points by completing tasks, watching videos, and engaging with
            content. Compete on the leaderboard and grow your wallet!
          </p>
        </CardContent>
        <CardFooter className="space-x-4">
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}