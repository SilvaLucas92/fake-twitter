"use client";

import { useState, useEffect } from "react";
import { clientCookies } from "@/utils/cookies";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = clientCookies.get("auth_token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated };
};
