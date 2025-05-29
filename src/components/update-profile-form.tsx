"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { getClientAuthToken } from "@/utils/client-auth";
import { API_TOKEN, BASE_URL } from "@/utils/apiUtils";
import { ErrorMsg } from "./ui/error-msg";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    avatar_url: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
    avatar_url: initialData.avatar_url,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    avatar_url: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      avatar_url: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.avatar_url.trim()) {
      newErrors.avatar_url = "Avatar URL is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.avatar_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = getClientAuthToken();

      const response = await fetch(`${BASE_URL}/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "Application-Token": API_TOKEN as string,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          avatar_url: formData.avatar_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
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
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMsg error={error} />}

        <Input
          label="Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          error={errors.name}
          disabled={isLoading}
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          disabled={isLoading}
        />

        <Input
          label="Avatar URL"
          id="avatar_url"
          name="avatar_url"
          type="text"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="Enter your avatar URL"
          error={errors.avatar_url}
          disabled={isLoading}
        />

        <Button
          type="submit"
          label={isLoading ? "Updating Profile" : "Update Profile"}
          loading={isLoading}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
