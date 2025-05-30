"use client";

import React, { useState } from "react";
import { getClientAuthToken } from "@/utils/client-auth";
import Button from "./ui/button";
import Textarea from "./ui/textarea";
import { Notification } from "./ui/notification";
import { BASE_URL } from "@/utils/apiUtils";

interface Status {
  type: "error" | "success" | null;
  message: string;
}

interface CommentFormProps {
  postId: string;
  refetchReplies: () => Promise<void>;
}

export const CommentForm = ({ postId, refetchReplies }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState<Status>({
    type: null,
    message: "",
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setStatus({ type: null, message: "" });

    if (!comment.trim()) {
      setValidationError("Please write a comment before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const token = getClientAuthToken();

      const response = await fetch(`${BASE_URL}/me/tuits/${postId}/replies`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Application-Token": process.env.NEXT_PUBLIC_API_TOKEN as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      setComment("");
      setStatus({
        type: "success",
        message: "Comment posted successfully!",
      });
      setTimeout(
        () =>
          setStatus({
            type: null,
            message: "",
          }),
        2500
      );
      await refetchReplies();
    } catch (error) {
      console.error("Error posting comment:", error);
      setStatus({
        type: "error",
        message: "Failed to post comment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitComment} className="space-y-2">
      {status.type && (
        <Notification type={status.type} message={status.message} />
      )}
      <Textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setValidationError("");
        }}
        placeholder="Write a comment..."
        rows={3}
        disabled={isLoading}
        error={validationError}
      />
      <Button
        type="submit"
        label={isLoading ? "Submitting" : "Submit"}
        loading={isLoading}
        disabled={isLoading}
      />
    </form>
  );
};
