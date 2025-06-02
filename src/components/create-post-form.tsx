"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { getClientAuthToken } from "@/utils/client-auth";
import { Notification } from "./ui/notification";
import { BASE_URL } from "@/utils/apiUtils";
import { ArrowLeft } from "lucide-react";

interface Status {
  type: "error" | "success" | null;
  message: string;
}

export function CreatePostForm() {
  const router = useRouter();
  const [content, setContent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("draft_post") || "";
    }
    return "";
  });
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState<Status>({
    type: null,
    message: "",
  });
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
    setStatus({ type: null, message: "" });
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
        throw new Error("Failed to create post");
      }

      setStatus({
        type: "success",
        message: "Post created successfully! Redirecting...",
      });

      localStorage.removeItem("draft_post");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to create post",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h4 className="text-xl font-semibold text-gray-900">New Post</h4>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {status.type && (
          <Notification type={status.type} message={status.message} />
        )}
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={handleContentChange}
          rows={4}
          placeholder="Share your thoughts..."
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
