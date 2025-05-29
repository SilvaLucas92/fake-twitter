import React from "react";
import { Post } from "@/components/post";
import { CommentForm } from "@/components/comment-form";
import { Post as PostType } from "@/types/post";
import { cookies } from "next/headers";

async function getPostAndReplies(
  id: string
): Promise<{ replies: PostType[]; post: PostType }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const postResponse = await fetch(
    `https://tuiter.fragua.com.ar/api/v1/me/tuits/${id}`,
    {
      headers: {
        Authorization: token.value,
        "Application-Token":
          "79807de2e2ebe41709ff5bf444bc918a10062483d231a5a47d264692041e3597",
      },
      cache: "no-store",
    }
  );

  if (!postResponse.ok) {
    throw new Error("Failed to fetch post");
  }

  const post = await postResponse.json();

  const repliesResponse = await fetch(
    `https://tuiter.fragua.com.ar/api/v1/me/tuits/${id}/replies`,
    {
      headers: {
        Authorization: token.value,
        "Application-Token":
          "79807de2e2ebe41709ff5bf444bc918a10062483d231a5a47d264692041e3597",
      },
      cache: "no-store",
    }
  );

  if (!repliesResponse.ok) {
    throw new Error("Failed to fetch replies");
  }

  const replies = await repliesResponse.json();

  return { post, replies };
}

const fakePost: PostType = {
  author: "test",
  avatar_url: "https://ui-avatars.com/api/?name=test",
  date: "2025-05-29T03:04:14.986Z",
  id: 350,
  liked: false,
  likes: 0,
  message: "te",
  parent_id: 0,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PageProps) {
  const { id } = await params;
  const { replies } = await getPostAndReplies(id);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="border-b border-gray-200 pb-6">
        <Post item={fakePost} />
      </div>

      <div className="mt-6 border-b border-gray-200 pb-6">
        <CommentForm postId={id} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Replies ({replies.length})
        </h2>
        {replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="border-b border-gray-200 last:border-0"
              >
                <Post item={reply} />
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
