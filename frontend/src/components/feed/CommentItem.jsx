import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Trash2, Loader2 } from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";
import { useDeleteComment } from "@/hooks/useComment";

function CommentItem({ comment, postId }) {
  const { user } = useAuthContext();

  const deleteCommentMutation =
    useDeleteComment(postId);

  const isOwner =
    String(user?._id || user?.id) ===
    String(
      comment?.author?._id ||
        comment?.author?.id
    );

  const isDeleting =
    deleteCommentMutation.isPending &&
    deleteCommentMutation.variables ===
      comment?._id;

  return (
    <div className="flex gap-3 py-3">
      {/* ================================= */}
      {/* Avatar */}
      {/* ================================= */}

      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage
          src={comment?.author?.avatar}
          alt={
            comment?.author?.fullName ||
            "User"
          }
        />

        <AvatarFallback
          className="
            bg-primary/10
            text-primary
          "
        >
          {comment?.author?.fullName
            ?.charAt(0)
            ?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* ================================= */}
      {/* Comment */}
      {/* ================================= */}

      <div className="min-w-0 flex-1">
        <div
          className="
            rounded-xl
            bg-muted/50
            p-3
          "
        >
          <div
            className="
              mb-1
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold">
                {comment?.author?.fullName ||
                  "User"}
              </h4>

              <p className="truncate text-xs text-muted-foreground">
                @
                {comment?.author?.username ||
                  "user"}
              </p>
            </div>

            {/* Delete own comment */}

            {isOwner && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                onClick={() =>
                  deleteCommentMutation.mutate(
                    comment._id
                  )
                }
                className="
                  h-8
                  w-8
                  shrink-0
                  rounded-lg
                  text-muted-foreground
                  hover:bg-destructive/10
                  hover:text-destructive
                "
                aria-label="Delete comment"
              >
                {isDeleting ? (
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                    "
                  />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <p className="whitespace-pre-wrap text-sm leading-6">
            {comment?.content}
          </p>

          {comment?.isEdited && (
            <span className="mt-1 block text-[11px] text-muted-foreground">
              edited
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;