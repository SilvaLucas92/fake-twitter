import React from "react";
import { ProfileForm } from "@/components/update-profile-form";
import { cookies } from "next/headers";

async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    "https://tuiter.fragua.com.ar/api/v1/me/profile",
    {
      headers: {
        Authorization: token.value,
        "Application-Token":
          "79807de2e2ebe41709ff5bf444bc918a10062483d231a5a47d264692041e3597",
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
