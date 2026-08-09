import DashboardLayout from "@/layouts/DashboardLayout";

import CreatePostCard from "@/components/feed/CreatePostCard";
import FeedList from "@/components/feed/FeedList";

function FeedPage() {
  return (
    <DashboardLayout>
      <main className="space-y-6">
        {/* ================================= */}
        {/* Feed Header */}
        {/* ================================= */}

        <header>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Your Feed
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Discover what developers in your community are building.
          </p>
        </header>

        {/* ================================= */}
        {/* Create Post */}
        {/* ================================= */}

        <section>
          <CreatePostCard />
        </section>

        {/* ================================= */}
        {/* Feed Posts */}
        {/* ================================= */}

        <section>
          <FeedList />
        </section>
      </main>
    </DashboardLayout>
  );
}

export default FeedPage;