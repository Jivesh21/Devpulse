import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  Loader2,
  Send,
  X,
  PenLine,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useAuthContext } from "@/context/AuthContext";
import { useCreatePost } from "@/hooks/usePosts";

function CreatePostCard() {
  const { user } = useAuthContext();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const imageInputRef = useRef(null);

  const createPostMutation = useCreatePost();

  const isPosting = createPostMutation.isPending;

  const isEmpty =
    !content.trim() && !image;

  // ====================================
  // Cleanup image preview
  // ====================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ====================================
  // Image Selection
  // ====================================

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");

      e.target.value = "";

      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be smaller than 5MB."
      );

      e.target.value = "";

      return;
    }

    // Revoke previous preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  // ====================================
  // Remove Image
  // ====================================

  function removeImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  // ====================================
  // Submit
  // ====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPosting) {
      return;
    }

    if (!content.trim() && !image) {
      toast.error(
        "Write something or add an image."
      );

      return;
    }

    try {
      const formData = new FormData();

      if (content.trim()) {
        formData.append(
          "content",
          content.trim()
        );
      }

      if (image) {
        formData.append("image", image);
      }

      await createPostMutation.mutateAsync(
        formData
      );

      toast.success(
        "Post published successfully!"
      );

      setContent("");

      removeImage();
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create post.";

      toast.error(message);
    }
  };

  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border/60
        bg-card
        shadow-sm
      "
    >
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          gap-3
          px-5
          pt-5
        "
      >
        <Avatar
          className="
            h-10
            w-10
            border
            border-border/60
          "
        >
          <AvatarImage
            src={user?.avatar}
            alt={
              user?.fullName || "You"
            }
          />

          <AvatarFallback
            className="
              bg-primary/10
              font-semibold
              text-primary
            "
          >
            {user?.fullName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {user?.fullName ||
              "Create a post"}
          </p>

          <p className="text-xs text-muted-foreground">
            Share something with the community
          </p>
        </div>

        <div
          className="
            ml-auto
            hidden
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-primary/10
            text-primary
            sm:flex
          "
        >
          <PenLine className="h-4 w-4" />
        </div>
      </div>

      {/* ================================= */}
      {/* Form */}
      {/* ================================= */}

      <form
        onSubmit={handleSubmit}
        className="px-5 pb-4 pt-4"
      >
        <Textarea
          rows={4}
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="What's on your mind?"
          disabled={isPosting}
          className="
            min-h-[110px]
            resize-none
            rounded-xl
            border-border/50
            bg-muted/20
            px-4
            py-3
            text-sm
            leading-6
            shadow-none
            transition-all
            placeholder:text-muted-foreground/70
            focus-visible:border-primary/30
            focus-visible:ring-2
            focus-visible:ring-primary/10
          "
        />

        {/* ================================= */}
        {/* Image Preview */}
        {/* ================================= */}

        {preview && (
          <div
            className="
              group
              relative
              mt-4
              overflow-hidden
              rounded-xl
              border
              border-border/60
              bg-muted/30
            "
          >
            <img
              src={preview}
              alt="Post preview"
              className="
                max-h-[320px]
                w-full
                object-contain
              "
            />

            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={removeImage}
              disabled={isPosting}
              className="
                absolute
                right-3
                top-3
                h-8
                w-8
                rounded-full
                bg-background/90
                shadow-md
                backdrop-blur-md
                transition-transform
                hover:scale-105
              "
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ================================= */}
        {/* Hidden Image Input */}
        {/* ================================= */}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={isPosting}
        />

        {/* ================================= */}
        {/* Actions */}
        {/* ================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-border/50
            pt-3
          "
        >
          <Button
            type="button"
            variant="ghost"
            disabled={isPosting}
            onClick={() =>
              imageInputRef.current?.click()
            }
            className="
              h-9
              gap-2
              rounded-xl
              px-3
              text-sm
              text-muted-foreground
              hover:bg-primary/5
              hover:text-primary
            "
          >
            <ImagePlus className="h-4 w-4" />

            <span>Image</span>
          </Button>

          <Button
            type="submit"
            disabled={
              isPosting || isEmpty
            }
            className="
              h-9
              gap-2
              rounded-xl
              px-4
              text-sm
              shadow-sm
              transition-all
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            {isPosting ? (
              <>
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />

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
    </article>
  );
}

export default CreatePostCard;