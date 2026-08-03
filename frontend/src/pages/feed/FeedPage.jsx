import DashboardLayout from "@/layouts/DashboardLayout";
import CreatePostCard from "@/components/feed/CreatePostCard";
import FeedList from "@/components/feed/FeedList";

function FeedPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CreatePostCard />
        <FeedList />
      </div>
    </DashboardLayout>
  );
}

export default FeedPage;