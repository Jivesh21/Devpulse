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
        w-full
        min-w-0
        max-w-full
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
          min-w-0
          items-center
          gap-2.5
          px-4
          pt-4
          sm:gap-3
          sm:px-5
          sm:pt-5
        "
      >
        <Avatar
          className="
            h-9
            w-9
            shrink-0
            border
            border-border/60
            sm:h-10
            sm:w-10
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

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {user?.fullName ||
              "Create a post"}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            Share something with the community
          </p>
        </div>

        <div
          className="
            ml-auto
            hidden
            h-8
            w-8
            shrink-0
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
        className="
          min-w-0
          px-4
          pb-4
          pt-4
          sm:px-5
        "
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
            box-border
            min-h-[100px]
            w-full
            min-w-0
            max-w-full
            resize-none
            rounded-xl
            border-border/50
            bg-muted/20
            px-3
            py-3
            text-sm
            leading-6
            shadow-none
            transition-all
            placeholder:text-muted-foreground/70
            focus-visible:border-primary/30
            focus-visible:ring-2
            focus-visible:ring-primary/10
            sm:min-h-[110px]
            sm:px-4
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
              w-full
              min-w-0
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
                block
                max-h-[320px]
                w-full
                max-w-full
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
                right-2
                top-2
                h-8
                w-8
                rounded-full
                bg-background/90
                shadow-md
                backdrop-blur-md
                transition-transform
                hover:scale-105
                sm:right-3
                sm:top-3
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
            min-w-0
            items-center
            justify-between
            gap-2
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
              shrink-0
              gap-1.5
              rounded-xl
              px-2.5
              text-xs
              text-muted-foreground
              hover:bg-primary/5
              hover:text-primary
              sm:gap-2
              sm:px-3
              sm:text-sm
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
              shrink-0
              gap-1.5
              rounded-xl
              px-3
              text-xs
              shadow-sm
              transition-all
              hover:shadow-md
              active:scale-[0.98]
              sm:gap-2
              sm:px-4
              sm:text-sm
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

                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />

                <span>Post</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </article>
  );
}

export default CreatePostCard;