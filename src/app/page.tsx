import { PostContainer } from "@/components/post-container";
import { Post } from "@/types/post";
import { getAuthToken } from "@/utils/auth";

async function getFeed(): Promise<Post[]> {
  const token = await getAuthToken();

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

export default async function Home() {
  const feedData = await getFeed();
  return <PostContainer initialData={feedData} />;
}
