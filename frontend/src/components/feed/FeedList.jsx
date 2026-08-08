import { useInfinitePosts } from "@/hooks/usePosts";

import FeedSkeleton from "./FeedSkeleton";
import EmptyFeed from "./EmptyFeed";
import PostCard from "./PostCard";

import { Button } from "@/components/ui/button";

import {
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

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

  // ====================================
  // Loading
  // ====================================

  if (isLoading) {
    return (
      <div className="space-y-5">
        <FeedSkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
    );
  }

  // ====================================
  // Error
  // ====================================

  if (isError) {
    return (
      <div
        className="
          glass-card
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          p-8
          text-center
        "
      >
        <div
          className="
            mb-4
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-destructive/10
            text-destructive
          "
        >
          <AlertCircle className="h-6 w-6" />
        </div>

        <h3 className="font-semibold">
          Couldn't load your feed
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {error?.response?.data?.message ||
            "Please check your connection and try again."}
        </p>

        <Button
          variant="outline"
          className="
            interactive
            mt-5
            gap-2
            rounded-xl
          "
          onClick={() =>
            window.location.reload()
          }
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // ====================================
  // Flatten Infinite Query Pages
  // ====================================

  const posts =
    data?.pages.flatMap(
      (page) =>
        page?.data?.posts || []
    ) || [];

  // ====================================
  // Empty Feed
  // ====================================

  if (posts.length === 0) {
    return (
      <div className="page-enter">
        <EmptyFeed />
      </div>
    );
  }

  // ====================================
  // Posts
  // ====================================

  return (
    <div className="space-y-5">
      {/* Feed indicator */}
      <div className="flex items-center gap-2 px-1">
        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            bg-primary/10
            text-primary
          "
        >
          <Sparkles className="h-3.5 w-3.5" />
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          Latest from the community
        </span>
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className="page-enter"
            style={{
              animationDelay: `${Math.min(
                index * 60,
                300
              )}ms`,
            }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* ================================= */}
      {/* Load More */}
      {/* ================================= */}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() =>
              fetchNextPage()
            }
            disabled={
              isFetchingNextPage
            }
            className="
              interactive
              min-w-44
              gap-2
              rounded-xl
              border-primary/20
              bg-background/50
              backdrop-blur-sm
              hover:border-primary/40
              hover:bg-primary/5
              hover:text-primary
            "
          >
            {isFetchingNextPage ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load more posts
              </>
            )}
          </Button>
        </div>
      )}

      {/* End of feed */}
      {!hasNextPage && posts.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-5 text-xs text-muted-foreground">
          <div className="h-px w-8 bg-border" />

          <span>
            You're all caught up
          </span>

          <div className="h-px w-8 bg-border" />
        </div>
      )}
    </div>
  );
}

export default FeedList;