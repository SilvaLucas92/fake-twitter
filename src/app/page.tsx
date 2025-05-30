"use client";

import { PostContainer } from "@/components/post-container";
import { Spinner } from "@/components/ui/spinner";
import { Post } from "@/types/post";
import { clientCookies } from "@/utils/cookies";
import { useEffect, useState } from "react";

async function getFeed(token: string): Promise<Post[]> {
  const response = await fetch("https://tuiter.fragua.com.ar/api/v1/me/feed", {
    headers: {
      Authorization: token,
      "Application-Token":
        "79807de2e2ebe41709ff5bf444bc918a10062483d231a5a47d264692041e3597",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch feed");
  }

  return response.json();
}

export default function Home() {
  const [feedData, setFeedData] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = clientCookies.get("auth_token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const data = await getFeed(token);
        setFeedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <PostContainer initialData={feedData} />;
}
