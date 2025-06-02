"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { BASE_URL } from "@/utils/apiUtils";
import { validateEmail } from "@/utils/validate-email";
import { Notification } from "@/components/ui/notification";

interface Status {
  type: "error" | "success" | null;
  message: string;
}

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<Status>({
    type: null,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Application-Token": process.env
          .NEXT_PUBLIC_API_TOKEN as string as string,
      };

      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      setStatus({
        type: "success",
        message: "Account created successfully! Redirecting to login...",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to create account. Please try again.",
      });
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
    <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-left">
          <h4 className="mt-6 text-4xl font-extrabold text-gray-900">
            Create you account!
          </h4>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>

        {status.type && (
          <Notification type={status.type} message={status.message} />
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            label="Name"
            disabled={isLoading}
            error={errors.name}
          />

          <Input
            id="email"
            name="email"
            type="text"
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
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            label="Password"
            disabled={isLoading}
            error={errors.password}
          />

          <Button
            type="submit"
            label={isLoading ? "Creating account..." : "Create account"}
            loading={isLoading}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
