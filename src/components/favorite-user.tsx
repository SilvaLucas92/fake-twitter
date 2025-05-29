"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface FavoriteUserProps {
  author: string;
  avatar_url: string;
}

export const FavoriteUser = ({ author, avatar_url }: FavoriteUserProps) => {
  const [isFavorite, setIsFavorite] = useState(true);

  const handleRemoveFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("favorite_users") || "[]"
    );
    const newFavorites = favorites.filter(
      (fav: FavoriteUserProps) => fav.author !== author
    );
    localStorage.setItem("favorite_users", JSON.stringify(newFavorites));
    setIsFavorite(false);
    window.location.reload();
  };

  if (!isFavorite) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <img
          src={avatar_url}
          alt={`${author}'s avatar`}
          className="rounded-full w-10 h-10"
        />
        <span className="font-medium text-gray-900">{author}</span>
      </div>
      <button
        onClick={handleRemoveFavorite}
        className="text-yellow-500 hover:text-yellow-600 transition-colors cursor-pointer"
      >
        <Star className="h-5 w-5" fill="currentColor" />
      </button>
    </div>
  );
};
