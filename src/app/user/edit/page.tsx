import React from "react";
import { ProfileForm } from "@/components/update-profile-form";
import { getAuthToken } from "@/utils/auth";

async function getProfile() {
  const token = await getAuthToken();

  const response = await fetch(
    "https://tuiter.fragua.com.ar/api/v1/me/profile",
    {
      headers: {
        Authorization: token,
        "Application-Token": process.env.NEXT_PUBLIC_API_TOKEN as string,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export default async function ProfilePage() {
  const profile = await getProfile();
  return <ProfileForm initialData={profile} />;
}
