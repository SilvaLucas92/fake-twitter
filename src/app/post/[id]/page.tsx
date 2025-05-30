import { PostDetail } from "@/components/post-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  return <PostDetail postId={id} />;
}
