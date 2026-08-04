import { Loader2, PenSquare } from "lucide-react";

import PostCard from "@/components/feed/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ProfilePosts({
  posts = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-muted-foreground">
            Loading posts...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">

          <div className="rounded-full bg-violet-100 p-5 dark:bg-violet-500/20">
            <PenSquare className="h-8 w-8 text-violet-600" />
          </div>

          <h2 className="text-2xl font-bold">
            No Posts Yet
          </h2>

          <p className="max-w-sm text-muted-foreground">
            Share your first post with the DevPulse
            community and start building your developer
            presence.
          </p>

          <Button className="mt-2">
            Create Your First Post
          </Button>

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