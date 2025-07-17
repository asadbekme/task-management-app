"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    login(username);
    toast.success("Login successful");
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="justify-center items-center">
          <LogIn className="size-8 text-blue-600" />
          <CardTitle className="text-2xl">
            <h1>Task Manager</h1>
          </CardTitle>
          <CardDescription className="text-gray-600">
            <p>Sign in to manage your tasks</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                name="username"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <Button type="submit" className="w-full" aria-label="Sign in">
              Sign in
            </Button>

            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium">Demo credentials:</p>
              <p>Admin: username "asadbek"</p>
              <p>User: any username except "asadbek"</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
