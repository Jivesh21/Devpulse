import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ImagePlus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useCreatePost } from "@/hooks/usePosts";

function CreatePostCard() {
  const [content, setContent] = useState("");

  const createPostMutation = useCreatePost();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);

      await createPostMutation.mutateAsync(formData);

      toast.success("Post created successfully");

      setContent("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create post"
      );
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Textarea
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            Image
          </Button>

          <Button
            type="submit"
            disabled={
              createPostMutation.isPending
            }
            className="gap-2"
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostCard;