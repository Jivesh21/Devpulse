import { useInfinitePosts } from "@/hooks/usePosts";
import FeedSkeleton from "./FeedSkeleton";
import EmptyFeed from "./EmptyFeed";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";

function FeedList() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p>Failed to load posts.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.response?.data?.message || "Please check your connection and try again."}
        </p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page?.data?.posts || []) || [];

  if (posts.length === 0) {
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

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more posts..." : "Load more posts"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default FeedList;
