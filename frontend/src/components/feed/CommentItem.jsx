import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";
import { useDeleteComment } from "@/hooks/useComment";

function CommentItem({ comment, postId }) {
  const { user } = useAuthContext();

  const deleteCommentMutation = useDeleteComment(postId);

  const isOwner =
    user?._id === comment.author?._id;

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={comment.author?.avatar} />

        <AvatarFallback>
          {comment.author?.fullName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="rounded-xl bg-muted p-3">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">
                {comment.author?.fullName}
              </h4>

              <p className="text-xs text-muted-foreground">
                @{comment.author?.username}
              </p>
            </div>

            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  deleteCommentMutation.mutate(comment._id)
                }
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          <p className="text-sm leading-6">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;