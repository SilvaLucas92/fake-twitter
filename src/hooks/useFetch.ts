import { useState, useCallback, useEffect } from "react";
import { clientCookies } from "@/utils/cookies";

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = clientCookies.get("auth_token");
      const applicationToken = process.env.NEXT_PUBLIC_API_TOKEN;

      if (!applicationToken) {
        throw new Error("Application token not found in environment variables");
      }

      const response = await fetch(url, {
        headers: {
          Authorization: token || "",
          "Application-Token": applicationToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
