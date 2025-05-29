export interface Post {
  author: string;
  avatar_url: string;
  date: string;
  id: number;
  liked: boolean;
  likes: number;
  message: string;
  parent_id: number | null;
}
