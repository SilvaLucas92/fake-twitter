"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getClientAuthToken } from "@/utils/client-auth";
import { ErrorMsg } from "./ui/error-msg";
import { BASE_URL } from "@/utils/apiUtils";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "./ui/spinner";
import Input from "./ui/input";
import Button from "./ui/button";

interface ProfileData {
  name: string;
  email: string;
  avatar_url: string;
}

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useFetch<ProfileData>(`${BASE_URL}/me/profile`);

  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    avatar_url: "",
  });

  React.useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.avatar_url.trim()) {
      newErrors.avatar_url = "Avatar URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          "Application-Token": process.env.NEXT_PUBLIC_API_TOKEN as string,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          avatar_url: formData.avatar_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isProfileLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="flex items-center justify-center min-h-[500px]">
          <Spinner />
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <ErrorMsg error={`Error loading profile: ${profileError}`} />
      </div>
    );
  }

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
