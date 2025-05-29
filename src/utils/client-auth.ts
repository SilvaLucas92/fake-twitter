import { clientCookies } from "./cookies";

export const getClientAuthToken = () => {
  const token = clientCookies.get("auth_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return token;
};
