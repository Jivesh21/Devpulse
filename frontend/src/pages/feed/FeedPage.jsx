import DashboardLayout from "@/layouts/DashboardLayout";

import CreatePostCard from "@/components/feed/CreatePostCard";
import FeedList from "@/components/feed/FeedList";

function FeedPage() {
  return (
    <DashboardLayout>
      <main className="page-enter space-y-6">
        {/* Feed Header */}
        <div className="px-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Your Feed
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Discover what developers in your
            community are building.
          </p>
        </div>

        {/* Create Post */}
        <section>
          <CreatePostCard />
        </section>

        {/* Posts */}
        <section>
          <FeedList />
        </section>
      </main>
    </DashboardLayout>
  );
}

export default FeedPage;