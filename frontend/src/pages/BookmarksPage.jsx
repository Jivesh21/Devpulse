import {
  Bookmark,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import FeedSkeleton from "@/components/feed/FeedSkeleton";
import PostCard from "@/components/feed/PostCard";

import { Button } from "@/components/ui/button";

import { useBookmarkedPosts } from "@/hooks/useBookmark";

function BookmarksPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBookmarkedPosts();

  const posts =
    (data?.data || [])
      .map((bookmark) => bookmark.post)
      .filter(Boolean);

  return (
    <DashboardLayout>
      <main className="page-enter space-y-6">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <section
          className="
            glass-card
            glass-hover
            relative
            overflow-hidden
            rounded-3xl
            p-6
            sm:p-8
          "
        >
          {/* Decorative glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-primary/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
                shadow-sm
              "
            >
              <Bookmark className="h-7 w-7" />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                "
              >
                Bookmarks
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Posts you've saved to come
                back to later.
              </p>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* Loading */}
        {/* ================================= */}

        {isLoading && (
          <section
            className="
              glass-card
              overflow-hidden
              rounded-3xl
              p-4
              sm:p-5
            "
          >
            <FeedSkeleton />
          </section>
        )}

        {/* ================================= */}
        {/* Error */}
        {/* ================================= */}

        {!isLoading && isError && (
          <section
            className="
              glass-card
              flex
              flex-col
              items-center
              justify-center
              rounded-3xl
              px-6
              py-14
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
                bg-destructive/10
                text-destructive
              "
            >
              <Bookmark className="h-7 w-7" />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
              "
            >
              Couldn't load bookmarks
            </h2>

            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Something went wrong while
              loading your saved posts.
            </p>

            <Button
              variant="outline"
              onClick={() => refetch()}
              className="
                interactive
                mt-5
                gap-2
                rounded-xl
              "
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </section>
        )}

        {/* ================================= */}
        {/* Empty */}
        {/* ================================= */}

        {!isLoading &&
          !isError &&
          posts.length === 0 && (
            <section
              className="
                glass-card
                flex
                flex-col
                items-center
                justify-center
                rounded-3xl
                px-6
                py-16
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <Bookmark className="h-8 w-8" />
              </div>

              <h2
                className="
                  mt-5
                  text-xl
                  font-bold
                "
              >
                No saved posts yet
              </h2>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                When you find something useful
                in your developer feed, bookmark
                it and it'll appear here.
              </p>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-primary
                "
              >
                <Sparkles className="h-3.5 w-3.5" />
                Build your personal knowledge
                library
              </div>
            </section>
          )}

        {/* ================================= */}
        {/* Saved Posts */}
        {/* ================================= */}

        {!isLoading &&
          !isError &&
          posts.length > 0 && (
            <section>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
                  px-1
                "
              >
                <Bookmark
                  className="
                    h-4
                    w-4
                    text-primary
                  "
                />

                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  {posts.length}{" "}
                  {posts.length === 1
                    ? "saved post"
                    : "saved posts"}
                </p>
              </div>

              <div className="space-y-5">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="
                      page-enter
                    "
                  >
                    <PostCard
                      post={post}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
      </main>
    </DashboardLayout>
  );
}

export default BookmarksPage;