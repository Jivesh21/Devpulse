import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ImagePlus,
  Send,
  X,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useCreatePost } from "@/hooks/usePosts";

function CreatePostCard() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const imageInputRef = useRef(null);

  const createPostMutation =
    useCreatePost();

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image"
      );
      return;
    }

    setImage(file);
  }

  const removeImage = () => {
    setImage(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "content",
        content.trim()
      );

      if (image) {
        formData.append("image", image);
      }

      await createPostMutation.mutateAsync(
        formData
      );

      toast.success(
        "Post created successfully"
      );

      setContent("");
      setImage(null);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create post"
      );
    }
  };

  return (
    <section
      className="
        glass-card
        glass-hover
        overflow-hidden
      "
    >
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6"
      >
        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Create a post
            </h2>

            <p className="text-xs text-muted-foreground">
              Share something with the developer
              community.
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* Textarea */}
        {/* ================================= */}

        <div className="relative">
          <Textarea
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            className="
              resize-none
              rounded-2xl
              border-border/60
              bg-background/40
              px-4
              py-3
              text-[15px]
              leading-6
              shadow-none
              transition-all
              duration-200
              placeholder:text-muted-foreground/70
              focus:border-primary/40
              focus:bg-background/60
              focus:ring-2
              focus:ring-primary/10
            "
          />

          {/* Character count */}
          <span
            className="
              pointer-events-none
              absolute
              bottom-3
              right-3
              text-[11px]
              text-muted-foreground/60
            "
          >
            {content.length}
          </span>
        </div>

        {/* ================================= */}
        {/* Image Preview */}
        {/* ================================= */}

        {image && (
          <div
            className="
              relative
              mt-4
              overflow-hidden
              rounded-2xl
              border
              border-border/60
              bg-muted/30
            "
          >
            <img
              src={URL.createObjectURL(image)}
              alt="Selected preview"
              className="
                max-h-72
                w-full
                object-cover
                transition-transform
                duration-500
              "
            />

            {/* Remove Image */}
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={removeImage}
              className="
                absolute
                right-3
                top-3
                h-8
                w-8
                rounded-full
                bg-background/80
                shadow-lg
                backdrop-blur-md
                transition-transform
                hover:scale-105
                hover:bg-background
                active:scale-95
              "
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* ================================= */}
        {/* Footer */}
        {/* ================================= */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            border-t
            border-border/50
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Image Button */}
          <Button
            type="button"
            variant="ghost"
            className="
              interactive
              w-full
              gap-2
              rounded-xl
              text-muted-foreground
              hover:bg-primary/10
              hover:text-primary
              sm:w-auto
            "
            onClick={() =>
              imageInputRef.current?.click()
            }
          >
            <ImagePlus className="h-4 w-4" />

            {image
              ? "Change Image"
              : "Add Image"}
          </Button>

          {/* Post Button */}
          <Button
            type="submit"
            disabled={
              createPostMutation.isPending
            }
            className="
              interactive
              w-full
              gap-2
              rounded-xl
              px-5
              shadow-md
              shadow-primary/15
              sm:w-auto
            "
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
    </section>
  );
}

export default CreatePostCard;