import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Loader2,
  MessageCircle,
  Heart,
  Bookmark,
  Pencil,
  Trash2,
  Check,
  X,
  UserPlus,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";

import {
  usePosts,
  useToggleLike,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/usePosts";

import {
  useToggleBookmark,
  useBookmarkStatus,
} from "@/hooks/useBookmark";

import {
  useFollowStatus,
  useToggleFollow,
} from "@/hooks/useFollow";

import { useAuthContext } from "@/context/AuthContext";

import CommentSection from "@/components/feed/CommentSection";

// ====================================
// Follow Button
// ====================================

function FollowButton({ authorId, isOwner }) {
  const {
    data: followStatusData,
  } = useFollowStatus(authorId);

  const toggleFollowMutation =
    useToggleFollow(authorId);

  if (isOwner || !authorId) {
    return null;
  }

  const isFollowing =
    followStatusData?.data?.isFollowing ||
    false;

  return (
    <button
      type="button"
      disabled={
        toggleFollowMutation.isPending
      }
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        toggleFollowMutation.mutate();
      }}
      className="
        relative
        z-20
        flex
        shrink-0
        items-center
        gap-1.5
        rounded-lg
        bg-primary/10
        px-3
        py-2
        text-xs
        font-medium
        text-primary
        transition-colors
        hover:bg-primary/15
        disabled:pointer-events-none
        disabled:opacity-50
      "
    >
      {toggleFollowMutation.isPending ? (
        <Loader2
          className="
            h-4
            w-4
            animate-spin
          "
        />
      ) : isFollowing ? (
        "Following"
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </button>
  );
}

// ====================================
// Feed List
// ====================================

function FeedList() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = usePosts();

  const toggleLikeMutation =
    useToggleLike();

  const updatePostMutation =
    useUpdatePost();

  const deletePostMutation =
    useDeletePost();

  const { user } = useAuthContext();

  // ====================================
  // Comment State
  // ====================================

  const [openComments, setOpenComments] =
    useState(null);

  const [editingPostId, setEditingPostId] =
    useState(null);

  const [editContent, setEditContent] =
    useState("");

  // ====================================
  // Extract Posts
  // ====================================

  let posts = [];

  if (Array.isArray(data?.data)) {
    posts = data.data;
  } else if (
    Array.isArray(data?.data?.posts)
  ) {
    posts = data.data.posts;
  } else if (
    Array.isArray(data?.data?.docs)
  ) {
    posts = data.data.docs;
  } else if (
    Array.isArray(data?.posts)
  ) {
    posts = data.posts;
  }

  // ====================================
  // Loading
  // ====================================

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 sm:py-12">
        <Loader2
          className="
            h-6
            w-6
            animate-spin
            text-primary
          "
        />
      </div>
    );
  }

  // ====================================
  // Error
  // ====================================

  if (isError) {
    return (
      <Card
        className="
          rounded-2xl
          border-destructive/20
          bg-card
          p-5
          text-center
          sm:p-8
        "
      >
        <h3 className="text-base font-semibold sm:text-lg">
          Unable to load posts
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while loading the feed."}
        </p>
      </Card>
    );
  }

  // ====================================
  // Empty Feed
  // ====================================

  if (posts.length === 0) {
    return (
      <Card
        className="
          rounded-2xl
          border-border/60
          bg-card
          p-5
          text-center
          sm:p-8
        "
      >
        <div className="mx-auto max-w-md">
          <div
            className="
              mx-auto
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-primary/10
              text-primary
              sm:h-12
              sm:w-12
            "
          >
            <MessageCircle className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-semibold sm:text-lg">
            No posts yet
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Be the first developer to share
            something with the community.
          </p>
        </div>
      </Card>
    );
  }

  // ====================================
  // Start Editing
  // ====================================

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content || "");
  };

  // ====================================
  // Cancel Editing
  // ====================================

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditContent("");
  };

  // ====================================
  // Save Edited Post
  // ====================================

  const handleUpdatePost = async (
    postId
  ) => {
    const trimmedContent =
      editContent.trim();

    if (!trimmedContent) {
      return;
    }

    const formData = new FormData();

    formData.append(
      "content",
      trimmedContent
    );

    try {
      await updatePostMutation.mutateAsync({
        postId,
        formData,
      });

      cancelEditing();
    } catch (error) {
      console.error(
        "Failed to update post:",
        error
      );
    }
  };

  // ====================================
  // Delete Post
  // ====================================

  const handleDeletePost = async (
    postId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(
        postId
      );
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error
      );
    }
  };

  // ====================================
  // Posts
  // ====================================

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const postId =
          post?._id || post?.id;

        const author =
          post?.author || post?.user;

        const authorName =
          author?.fullName ||
          author?.name ||
          "Developer";

        const authorUsername =
          author?.username ||
          "user";

        const authorAvatar =
          author?.avatar ||
          author?.profileImage ||
          "";

        // ====================================
        // Ownership
        // ====================================

        const currentUserId =
          user?._id || user?.id;

        const authorId =
          author?._id ||
          author?.id;

        const isOwner =
          String(currentUserId) ===
          String(authorId);

        // ====================================
        // Likes
        // ====================================

        const likes = Array.isArray(
          post?.likes
        )
          ? post.likes
          : [];

        const likesCount =
          likes.length;

        const isLiked = likes.some(
          (like) => {
            const likeUserId =
              like?._id ||
              like?.id ||
              like;

            return (
              String(likeUserId) ===
              String(currentUserId)
            );
          }
        );

        const isLiking =
          toggleLikeMutation.isPending &&
          toggleLikeMutation.variables ===
            postId;

        // ====================================
        // Comments
        // ====================================

        const isCommentsOpen =
          openComments === postId;

        // ====================================
        // Editing
        // ====================================

        const isEditing =
          editingPostId === postId;

        const isUpdating =
          updatePostMutation.isPending;

        const isDeleting =
          deletePostMutation.isPending &&
          deletePostMutation.variables ===
            postId;

        return (
          <Card
            key={postId}
            className="
              w-full
              min-w-0
              overflow-hidden
              rounded-2xl
              border-border/60
              bg-card
              shadow-sm
            "
          >
            <div className="min-w-0 p-4 sm:p-5">

              {/* ================================= */}
              {/* Post Header */}
              {/* ================================= */}

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2.5
                  sm:gap-3
                "
              >
                {/* ================================= */}
                {/* Author Profile */}
                {/* ================================= */}

                <Link
                  to={`/profile/${encodeURIComponent(
                    authorUsername
                  )}`}
                  className="
                    group
                    flex
                    min-w-0
                    flex-1
                    cursor-pointer
                    items-center
                    gap-2.5
                    rounded-xl
                    outline-none
                    transition-opacity
                    hover:opacity-90
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    sm:gap-3
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
                      src={authorAvatar}
                      alt={authorName}
                    />

                    <AvatarFallback
                      className="
                        bg-primary/10
                        text-primary
                      "
                    >
                      {authorName
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        transition-colors
                        group-hover:text-primary
                      "
                    >
                      {authorName}
                    </p>

                    <p
                      className="
                        truncate
                        text-xs
                        text-muted-foreground
                      "
                    >
                      @{authorUsername}
                    </p>
                  </div>
                </Link>

                {/* ================================= */}
                {/* Follow */}
                {/* ================================= */}

                <FollowButton
                  authorId={authorId}
                  isOwner={isOwner}
                />

                {/* ================================= */}
                {/* Owner Actions */}
                {/* ================================= */}

                {isOwner && !isEditing && (
                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-0.5
                      sm:gap-1
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        startEditing(post)
                      }
                      disabled={isDeleting}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-primary/10
                        hover:text-primary
                        disabled:opacity-50
                      "
                      aria-label="Edit post"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeletePost(
                          postId
                        )
                      }
                      disabled={isDeleting}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-destructive/10
                        hover:text-destructive
                        disabled:opacity-50
                      "
                      aria-label="Delete post"
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
                    </button>
                  </div>
                )}
              </div>

              {/* ================================= */}
              {/* Editing */}
              {/* ================================= */}

              {isEditing ? (
                <div className="mt-4">
                  <textarea
                    value={editContent}
                    onChange={(e) =>
                      setEditContent(
                        e.target.value
                      )
                    }
                    disabled={isUpdating}
                    rows={4}
                    maxLength={5000}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-border/60
                      bg-muted/20
                      px-3
                      py-3
                      text-sm
                      leading-6
                      outline-none
                      transition-colors
                      focus:border-primary/40
                      focus:ring-2
                      focus:ring-primary/10
                      sm:px-4
                    "
                  />

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      items-center
                      justify-end
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={isUpdating}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        text-muted-foreground
                        hover:bg-muted
                      "
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdatePost(
                          postId
                        )
                      }
                      disabled={
                        isUpdating ||
                        !editContent.trim()
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-primary
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-primary-foreground
                        hover:bg-primary/90
                        disabled:pointer-events-none
                        disabled:opacity-50
                      "
                    >
                      {isUpdating ? (
                        <>
                          <Loader2
                            className="
                              h-4
                              w-4
                              animate-spin
                            "
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Post Content */}

                  {post?.content && (
                    <p
                      className="
                        mt-4
                        min-w-0
                        whitespace-pre-wrap
                        break-words
                        text-sm
                        leading-6
                      "
                    >
                      {post.content}
                    </p>
                  )}

                  {post?.isEdited && (
                    <span
                      className="
                        mt-1
                        block
                        text-[11px]
                        text-muted-foreground
                      "
                    >
                      edited
                    </span>
                  )}
                </>
              )}

              {/* ================================= */}
              {/* Post Image */}
              {/* ================================= */}

              {post?.image && (
                <div
                  className="
                    mt-4
                    w-full
                    min-w-0
                    overflow-hidden
                    rounded-xl
                    border
                    border-border/40
                    bg-muted/20
                  "
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="
                      block
                      max-h-[500px]
                      w-full
                      max-w-full
                      object-contain
                    "
                    loading="lazy"
                  />
                </div>
              )}

              {/* ================================= */}
              {/* Actions */}
              {/* ================================= */}

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-1
                  border-t
                  border-border/50
                  pt-3
                  sm:gap-2
                "
              >
                {/* Like */}

                <button
                  type="button"
                  disabled={
                    isLiking ||
                    isEditing
                  }
                  onClick={() =>
                    toggleLikeMutation.mutate(
                      postId
                    )
                  }
                  className={`
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2.5
                    py-2
                    text-xs
                    transition-colors
                    disabled:pointer-events-none
                    disabled:opacity-50
                    sm:gap-2
                    sm:px-3
                    sm:text-sm

                    ${
                      isLiked
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    }
                  `}
                >
                  {isLiking ? (
                    <Loader2
                      className="
                        h-4
                        w-4
                        shrink-0
                        animate-spin
                      "
                    />
                  ) : (
                    <Heart
                      className="
                        h-4
                        w-4
                        shrink-0
                      "
                      fill={
                        isLiked
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )}

                  <span className="whitespace-nowrap">
                    {isLiked
                      ? "Liked"
                      : "Like"}

                    {likesCount > 0
                      ? ` ${likesCount}`
                      : ""}
                  </span>
                </button>

                {/* Comment */}

                <button
                  type="button"
                  disabled={isEditing}
                  onClick={() =>
                    setOpenComments(
                      isCommentsOpen
                        ? null
                        : postId
                    )
                  }
                  className={`
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2.5
                    py-2
                    text-xs
                    transition-colors
                    disabled:pointer-events-none
                    disabled:opacity-50
                    sm:gap-2
                    sm:px-3
                    sm:text-sm

                    ${
                      isCommentsOpen
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    }
                  `}
                >
                  <MessageCircle
                    className="
                      h-4
                      w-4
                      shrink-0
                    "
                  />

                  <span className="whitespace-nowrap">
                    {isCommentsOpen
                      ? "Hide comments"
                      : "Comment"}
                  </span>
                </button>

                {/* Bookmark */}

                <BookmarkButton
                  postId={postId}
                  isEditing={isEditing}
                />
              </div>
            </div>

            {/* ================================= */}
            {/* Comments */}
            {/* ================================= */}

            {isCommentsOpen && (
              <div
                className="
                  min-w-0
                  border-t
                  border-border/50
                  bg-muted/10
                "
              >
                <CommentSection
                  postId={postId}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ====================================
// Bookmark Button
// ====================================

function BookmarkButton({
  postId,
  isEditing = false,
}) {
  const {
    data: bookmarkData,
  } = useBookmarkStatus(postId);

  const toggleBookmarkMutation =
    useToggleBookmark();

  const isBookmarked =
    bookmarkData?.data?.isBookmarked ??
    bookmarkData?.data?.bookmarked ??
    false;

  const isBookmarking =
    toggleBookmarkMutation.isPending;

  return (
    <button
      type="button"
      disabled={
        isBookmarking ||
        isEditing
      }
      onClick={() =>
        toggleBookmarkMutation.mutate(
          postId
        )
      }
      className={`
        flex
        min-w-0
        items-center
        gap-1.5
        rounded-lg
        px-2.5
        py-2
        text-xs
        transition-colors
        disabled:pointer-events-none
        disabled:opacity-50
        sm:gap-2
        sm:px-3
        sm:text-sm

        ${
          isBookmarked
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
        }
      `}
    >
      {isBookmarking ? (
        <Loader2
          className="
            h-4
            w-4
            shrink-0
            animate-spin
          "
        />
      ) : (
        <Bookmark
          className="
            h-4
            w-4
            shrink-0
          "
          fill={
            isBookmarked
              ? "currentColor"
              : "none"
          }
        />
      )}

      <span className="whitespace-nowrap">
        {isBookmarked
          ? "Saved"
          : "Save"}
      </span>
    </button>
  );
}

export default FeedList;