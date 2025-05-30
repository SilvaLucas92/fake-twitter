"use client";

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Star } from "lucide-react";
import { Post as PostType } from "@/types/post";
import { getClientAuthToken } from "@/utils/client-auth";
import { BASE_URL } from "@/utils/apiUtils";

interface PostProps {
  item: PostType;
}

interface FavoriteUser {
  author: string;
  avatar_url: string;
}

export const Post: React.FC<PostProps> = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favorites: FavoriteUser[] = JSON.parse(
        localStorage.getItem("favorite_users") || "[]"
      );
      setIsFavorite(favorites.some((fav) => fav.author === item.author));
    } catch (error) {
      console.error("Error loading favorites:", error);
      localStorage.setItem("favorite_users", "[]");
    }
  }, [item.author]);

  const handleFavorite = () => {
    const favorites: FavoriteUser[] = JSON.parse(
      localStorage.getItem("favorite_users") || "[]"
    );

    const newFavorites = isFavorite
      ? favorites.filter((fav) => fav.author !== item.author)
      : [...favorites, { author: item.author, avatar_url: item.avatar_url }];

    localStorage.setItem("favorite_users", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    window.location.reload();
  };

  const handleLike = async () => {
    setIsLoading(true);

    try {
      const token = getClientAuthToken();
      const method = item.liked ? "DELETE" : "POST";

      const response = await fetch(`${BASE_URL}/me/tuits/${item.id}/likes`, {
        method,
        headers: {
          Authorization: token,
          "Application-Token": process.env.NEXT_PUBLIC_API_TOKEN as string,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className=" border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            src={item.avatar_url}
            alt={`${item.author}'s avatar`}
            className="rounded-full w-10 h-10"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-gray-900">{item.author}</h4>
            <button
              onClick={() => handleFavorite()}
              className={`transition-colors cursor-pointer ${
                isFavorite
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
            >
              <Star
                className="h-4 w-4"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-900">{item.message}</p>

          <div className="mt-3 flex items-center space-x-6">
            <button
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={() => (window.location.href = `/post/${item.id}`)}
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              disabled={isLoading}
              className={`flex items-center space-x-2 transition-colors cursor-pointer ${
                item.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleLike}
            >
              <Heart
                className={`h-5 w-5 ${item.liked ? "fill-current" : ""}`}
              />
              <span className="text-sm">{item.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
