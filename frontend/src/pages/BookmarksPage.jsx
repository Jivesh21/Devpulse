import { Bookmark } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import PostCard from "@/components/feed/PostCard";
import { useBookmarkedPosts } from "@/hooks/useBookmark";

function BookmarksPage() {
  const { data, isLoading, isError } = useBookmarkedPosts();
  const posts = (data?.data || [])
    .map((bookmark) => bookmark.post)
    .filter(Boolean);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Bookmark className="h-6 w-6 text-primary" />
            Bookmarks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Posts you have saved for later.
          </p>
        </div>

        {isLoading ? (
          <FeedSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            Failed to load bookmarks.
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No saved posts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Use the bookmark button on a post to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default BookmarksPage;
