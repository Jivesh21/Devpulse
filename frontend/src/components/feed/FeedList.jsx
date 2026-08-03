import { usePosts } from "@/hooks/usePosts";
import FeedSkeleton from "./FeedSkeleton";
import EmptyFeed from "./EmptyFeed";
import PostCard from "./PostCard";

function FeedList() {
  const { data, isLoading, isError } = usePosts();

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        Failed to load posts.
      </div>
    );
  }

  const posts = data?.data?.docs || data?.data || [];

  if (!posts.length) {
    return <EmptyFeed />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
        />
      ))}
    </div>
  );
}

export default FeedList;