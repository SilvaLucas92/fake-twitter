"use client";

import React from "react";
import { Post } from "@/components/post";
import { CommentForm } from "@/components/comment-form";
import { Post as PostType } from "@/types/post";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "@/components/ui/spinner";
import { Notification } from "./ui/notification";
import { BASE_URL } from "@/utils/apiUtils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostDetailProps {
  postId: string;
}

export function PostDetail({ postId }: PostDetailProps) {
  const router = useRouter();
  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
    refetch: refetchPost,
  } = useFetch<PostType>(`${BASE_URL}/me/tuits/${postId}`);

  const {
    data: replies,
    isLoading: isRepliesLoading,
    error: repliesError,
    refetch: refetchReplies,
  } = useFetch<PostType[]>(`${BASE_URL}/me/tuits/${postId}/replies`);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h4 className="text-xl font-semibold text-gray-900">Post</h4>
      </div>
      <div className="border-b border-gray-200 pb-6">
        {isPostLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : postError ? (
          <Notification
            type="error"
            message={`Error loading post: ${postError}`}
          />
        ) : !post ? (
          <div className="text-center py-8 text-gray-500">Post not found</div>
        ) : (
          <Post item={post} refetch={refetchPost} isDetail={true} />
        )}
      </div>

      <div className="mt-6 border-b border-gray-200 pb-6">
        <CommentForm postId={postId} refetchReplies={refetchReplies} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Replies {replies && `(${replies.length})`}
        </h2>

        {isRepliesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : repliesError ? (
          <Notification
            type="error"
            message={`Error loading replies: ${repliesError}`}
          />
        ) : replies && replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="border-b border-gray-200 last:border-0"
              >
                <Post item={reply} refetch={refetchReplies} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No replies yet. Be the first to reply!
          </div>
        )}
      </div>
    </div>
  );
}
