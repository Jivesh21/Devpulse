import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/feed/PostCard";
import { usePost } from "@/hooks/usePosts";

function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = usePost(postId);

  const post = data?.data;

  // ====================================
  // Loading
  // ====================================

  if (isLoading) {
    return (
      <DashboardLayout>
        <main className="mx-auto w-full max-w-3xl px-4 py-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading post...</span>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  // ====================================
  // Error / Not Found
  // ====================================

  if (isError || !post) {
    return (
      <DashboardLayout>
        <main className="mx-auto w-full max-w-3xl px-4 py-6">
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="rounded-2xl border border-border/60 bg-background/60 p-8 shadow-sm">
              <h1 className="text-xl font-bold">
                Post not found
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                This post may have been deleted or is no
                longer available.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-xl"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
              </Button>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  // ====================================
  // Render
  // ====================================

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        {/* ================================= */}
        {/* Back */}
        {/* ================================= */}

        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(-1)}
          className="
            mb-4
            rounded-xl
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
          "
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* ================================= */}
        {/* Post */}
        {/* ================================= */}

        <PostCard post={post} />
      </main>
    </DashboardLayout>
  );
}

export default PostPage;