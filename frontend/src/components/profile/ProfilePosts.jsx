import {
  PenSquare,
  Sparkles,
} from "lucide-react";

import PostCard from "@/components/feed/PostCard";

function ProfilePosts({
  posts = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <section
        className="
          rounded-2xl
          border
          border-border/60
          bg-background/70
          p-5
          shadow-sm
          backdrop-blur-xl
          sm:p-6
        "
      >
        <SectionHeader
          icon={PenSquare}
          title="Posts"
          description="Loading posts..."
        />

        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section
        className="
          rounded-2xl
          border
          border-border/60
          bg-background/70
          p-5
          shadow-sm
          backdrop-blur-xl
          sm:p-6
        "
      >
        <SectionHeader
          icon={PenSquare}
          title="Posts"
          description="No posts shared yet."
        />

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-border
            bg-muted/20
            px-6
            py-12
            text-center
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <PenSquare className="h-6 w-6" />
          </div>

          <h2 className="mt-4 font-semibold">
            No posts yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            This developer hasn't shared
            anything with the DevPulse community yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-2xl
        border
        border-border/60
        bg-background/70
        p-5
        shadow-sm
        backdrop-blur-xl
        sm:p-6
      "
    >
      <SectionHeader
        icon={Sparkles}
        title="Posts"
        description={`${posts.length} ${
          posts.length === 1
            ? "post"
            : "posts"
        } shared with the community.`}
      />

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

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
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
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="font-semibold">
          {title}
        </h2>

        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div
      className="
        animate-pulse
        rounded-xl
        border
        border-border/50
        bg-muted/20
        p-5
      "
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />

        <div className="space-y-2">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="h-2.5 w-20 rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-4/5 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default ProfilePosts;