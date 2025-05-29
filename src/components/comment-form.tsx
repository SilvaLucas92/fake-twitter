"use client";

import React, { useState } from "react";
import { getClientAuthToken } from "@/utils/client-auth";
import Button from "./ui/button";
import Textarea from "./ui/textarea";
import { ErrorMsg } from "./ui/error-msg";
import { API_TOKEN, BASE_URL } from "@/utils/apiUtils";

interface CommentFormProps {
  postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setServerError("");

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
          "Application-Token": API_TOKEN as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      setComment("");
      setServerError("");
      window.location.reload();
    } catch (error) {
      console.error("Error posting comment:", error);
      setServerError("Failed to post comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitComment} className="space-y-2">
      {serverError && <ErrorMsg error={serverError} />}
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
