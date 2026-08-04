import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useCreateComment } from "@/hooks/useComment";

function CommentInput({ postId }) {
  const [content, setContent] = useState("");

  const createCommentMutation = useCreateComment(postId);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    createCommentMutation.mutate(content, {
      onSuccess: () => {
        setContent("");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t p-4"
    >
      <Input
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button
        type="submit"
        disabled={
          !content.trim() ||
          createCommentMutation.isPending
        }
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}

export default CommentInput;