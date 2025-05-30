"use client";

import { useRouter } from "next/navigation";
import { clientCookies } from "@/utils/cookies";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    clientCookies.remove("auth_token");
    router.push("/auth/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800 transition-colors font-medium cursor-pointer bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md text-sm md:text-base"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
