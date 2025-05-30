"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { getClientAuthToken } from "@/utils/client-auth";
import { ErrorMsg } from "./ui/error-msg";
import { BASE_URL } from "@/utils/apiUtils";

export function CreatePostForm() {
  const router = useRouter();
  const [content, setContent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("draft_post") || "";
    }
    return "";
  });
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    setContent(newContent);
    setValidationError("");
    localStorage.setItem("draft_post", newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setServerError("");
    setIsLoading(true);

    if (!content.trim()) {
      setValidationError("Post content cannot be empty");
      setIsLoading(false);
      return;
    }

    try {
      const token = getClientAuthToken();
      const response = await fetch(`${BASE_URL}/me/tuits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "Application-Token": process.env.NEXT_PUBLIC_API_TOKEN as string,
        },
        body: JSON.stringify({
          message: content.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      localStorage.removeItem("draft_post");
      router.refresh();
      router.push("/");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create post"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && <ErrorMsg error={serverError} />}
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={handleContentChange}
          rows={4}
          placeholder="Share your thoughts..."
          label="What's on your mind?"
          error={validationError}
        />

        <Button
          type="submit"
          label={isLoading ? "Submitting" : "Submit"}
          loading={isLoading}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
