import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, ImagePlus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useCreatePost } from "@/hooks/usePosts";

function CreatePostCard() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const imageInputRef = useRef(null);

  const createPostMutation = useCreatePost();

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      await createPostMutation.mutateAsync(formData);

      toast.success("Post created successfully");

      setContent("");
      setImage(null);
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

        {image && (
          <div className="overflow-hidden rounded-xl border">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="h-60 w-full object-cover"
            />
          </div>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            onClick={() =>
              imageInputRef.current.click()
            }
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