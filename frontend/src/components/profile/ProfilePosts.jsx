import {
  Loader2,
  PenSquare,
  Sparkles,
} from "lucide-react";

import PostCard from "@/components/feed/PostCard";

function ProfilePosts({
  posts = [],
  isLoading = false,
}) {
  // ====================================
  // Loading
  // ====================================

  if (isLoading) {
    return (
      <section className="p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <PenSquare className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Posts
            </h2>

            <p className="text-xs text-muted-foreground">
              Loading posts...
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </section>
    );
  }

  // ====================================
  // Empty
  // ====================================

  if (posts.length === 0) {
    return (
      <section className="p-6 sm:p-8">
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            py-8
            text-center
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <PenSquare className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-bold">
            No posts yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            This developer hasn't shared
            anything with the DevPulse community
            yet.
          </p>
        </div>
      </section>
    );
  }

  // ====================================
  // Posts
  // ====================================

  return (
    <section className="p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold">
            Posts
          </h2>

          <p className="text-xs text-muted-foreground">
            {posts.length}{" "}
            {posts.length === 1
              ? "post"
              : "posts"}{" "}
            shared with the community.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}

/* ====================================
   Loading Skeleton
==================================== */

function PostSkeleton() {
  return (
    <div
      className="
        animate-pulse
        rounded-2xl
        border
        border-border/50
        bg-muted/20
        p-5
      "
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-muted" />

        <div className="space-y-2">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="h-2.5 w-20 rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-4/5 rounded-full bg-muted" />
      </div>

      <div className="mt-5 h-10 rounded-xl bg-muted" />
    </div>
  );
}

export default ProfilePosts;