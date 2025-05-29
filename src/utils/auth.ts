import { cookies } from "next/headers";

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return token.value;
};
