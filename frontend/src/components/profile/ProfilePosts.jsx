import PostCard from "@/components/feed/PostCard";
import { Card, CardContent } from "@/components/ui/card";

function ProfilePosts({
  posts = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-8 text-center">
          Loading posts...
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-8 text-center text-muted-foreground">
          No posts yet.
        </CardContent>
      </Card>
    );
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

export default ProfilePosts;