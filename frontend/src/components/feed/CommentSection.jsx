import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import {
  useComments,
  useCommentCount,
} from "@/hooks/useComment";

function CommentSection({ postId }) {
  const { data, isLoading } = useComments(postId);

  const { data: countData } =
    useCommentCount(postId);

  const comments =
    data?.data?.comments || [];

  const commentCount =
    countData?.data?.commentCount || 0;

  return (
    <div className="border-t">
      <div className="px-4 pt-4">
        <h3 className="text-sm font-semibold">
          Comments ({commentCount})
        </h3>
      </div>

      <CommentInput postId={postId} />

      <div className="px-4 pb-4">
        {isLoading ? (
          <p className="py-4 text-sm text-muted-foreground">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Be the first to comment.
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;