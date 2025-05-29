"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { clientCookies } from "@/utils/cookies";
import { validateEmail } from "@/utils/validate-email";
import { API_TOKEN, BASE_URL } from "@/utils/apiUtils";
import { ErrorMsg } from "@/components/ui/error-msg";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format not válid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Application-token": API_TOKEN as string,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      clientCookies.set("auth_token", data.token, { expires: 7 });
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-left">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {error && <ErrorMsg error={error} />}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            label="Email"
            disabled={isLoading}
            error={errors.email}
          />

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            label="Password"
            disabled={isLoading}
            error={errors.password}
          />

          <Button
            type="submit"
            label={isLoading ? "Signing in..." : "Sign in"}
            loading={isLoading}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
