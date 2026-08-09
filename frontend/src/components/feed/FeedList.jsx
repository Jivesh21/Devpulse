import { useState } from "react";

import {
  Loader2,
  MessageCircle,
  Heart,
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
} from "@/hooks/usePosts";

import { useAuthContext } from "@/context/AuthContext";

import CommentSection from "@/components/feed/CommentSection";

function FeedList() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = usePosts();

  const toggleLikeMutation =
    useToggleLike();

  const { user } = useAuthContext();

  // ====================================
  // Comment State
  // ====================================

  const [openComments, setOpenComments] =
    useState(null);

  // ====================================
  // Extract posts from API response
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
      <div className="flex justify-center py-12">
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
          p-8
          text-center
        "
      >
        <h3 className="text-lg font-semibold">
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
          p-8
          text-center
        "
      >
        <div className="mx-auto max-w-md">
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-primary/10
              text-primary
            "
          >
            <MessageCircle className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">
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
        // Likes
        // ====================================

        const likes = Array.isArray(
          post?.likes
        )
          ? post.likes
          : [];

        const likesCount =
          likes.length;

        const currentUserId =
          user?._id || user?.id;

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

        const isCommentsOpen =
          openComments === postId;

        return (
          <Card
            key={postId}
            className="
              overflow-hidden
              rounded-2xl
              border-border/60
              bg-card
              shadow-sm
            "
          >
            {/* ================================= */}
            {/* Post Content */}
            {/* ================================= */}

            <div className="p-5">
              {/* Post Header */}

              <div className="flex items-center gap-3">
                <Avatar
                  className="
                    h-10
                    w-10
                    border
                    border-border/60
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
                      ?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {authorName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    @{authorUsername}
                  </p>
                </div>
              </div>

              {/* Post Text */}

              {post?.content && (
                <p
                  className="
                    mt-4
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                  "
                >
                  {post.content}
                </p>
              )}

              {/* Post Image */}

              {post?.image && (
                <div
                  className="
                    mt-4
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
                      max-h-[500px]
                      w-full
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
                  items-center
                  gap-2
                  border-t
                  border-border/50
                  pt-3
                "
              >
                {/* Like */}

                <button
                  type="button"
                  disabled={isLiking}
                  onClick={() =>
                    toggleLikeMutation.mutate(
                      postId
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    transition-colors
                    disabled:pointer-events-none
                    disabled:opacity-50

                    ${
                      isLiked
                        ? `
                          bg-primary/10
                          text-primary
                          hover:bg-primary/15
                        `
                        : `
                          text-muted-foreground
                          hover:bg-primary/5
                          hover:text-primary
                        `
                    }
                  `}
                >
                  {isLiking ? (
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />
                  ) : (
                    <Heart
                      className="h-4 w-4"
                      fill={
                        isLiked
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )}

                  <span>
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
                  onClick={() =>
                    setOpenComments(
                      isCommentsOpen
                        ? null
                        : postId
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    transition-colors

                    ${
                      isCommentsOpen
                        ? `
                          bg-primary/10
                          text-primary
                        `
                        : `
                          text-muted-foreground
                          hover:bg-primary/5
                          hover:text-primary
                        `
                    }
                  `}
                >
                  <MessageCircle className="h-4 w-4" />

                  <span>
                    {isCommentsOpen
                      ? "Hide comments"
                      : "Comment"}
                  </span>
                </button>
              </div>
            </div>

            {/* ================================= */}
            {/* Comments */}
            {/* ================================= */}

            {isCommentsOpen && (
              <div
                className="
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

export default FeedList;