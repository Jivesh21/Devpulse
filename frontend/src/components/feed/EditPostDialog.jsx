import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUpdatePost } from "@/hooks/usePosts";

function EditPostForm({ post, onOpenChange }) {
  const updatePostMutation = useUpdatePost();

  const [content, setContent] = useState(
    () => post.content || ""
  );

  function handleSubmit() {
    const formData = new FormData();

    formData.append("content", content);

    updatePostMutation.mutate(
      {
        postId: post._id,
        formData,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Post</DialogTitle>
      </DialogHeader>

      <Textarea
        rows={6}
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      <DialogFooter>
        <Button
          onClick={handleSubmit}
          disabled={
            updatePostMutation.isPending
          }
        >
          {updatePostMutation.isPending
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </DialogFooter>
    </>
  );
}

function EditPostDialog({
  open,
  onOpenChange,
  post,
}) {
  if (!post) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        {open ? (
          <EditPostForm
            key={post._id}
            post={post}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default EditPostDialog;
