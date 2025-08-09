"use client";

import { LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm, DemoCredentials } from "./fragments";

export default function LoginPage() {
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
          <LoginForm />
          <DemoCredentials />
        </CardContent>
      </Card>
    </main>
  );
}
