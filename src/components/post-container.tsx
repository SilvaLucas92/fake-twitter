"use client";

import { Post } from "./post";
import { Post as PostType } from "@/types/post";
import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { FavoriteUser } from "./favorite-user";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "@/components/ui/spinner";
import { Notification } from "./ui/notification";
import { BASE_URL } from "@/utils/apiUtils";

interface FavoriteUserType {
  author: string;
  avatar_url: string;
}

export const PostContainer = () => {
  const [activeTab, setActiveTab] = useState<"feed" | "favorites">("feed");
  const [favorites, setFavorites] = useState<FavoriteUserType[]>([]);
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useFetch<PostType[]>(`${BASE_URL}/me/feed?only_parents=true`);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorite_users") || "[]"
    );

    setFavorites(storedFavorites);
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[500px]">
          <Spinner />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Notification type="error" message={`Error loading posts: ${error}`} />
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab("feed")}
              className={`${
                activeTab === "feed"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 "
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`${
                activeTab === "favorites"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer`}
            >
              Favorites
            </button>
          </nav>
        </div>
      </div>

      <section>
        <article className="flex flex-col">
          {activeTab === "feed" && (
            <div>
              {posts && posts.length > 0 ? (
                posts.map((item) => (
                  <div key={item.id} className="border-b border-gray-200">
                    <Post item={item} refetch={refetch} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No posts available
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <FavoriteUser
                    key={fav.author}
                    author={fav.author}
                    avatar_url={fav.avatar_url}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No favorites yet
                </div>
              )}
            </div>
          )}
        </article>
      </section>
    </Container>
  );
};
