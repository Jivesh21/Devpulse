import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";

import {
  useToggleLike,
  useLikeCount,
  useLikeStatus,
} from "@/hooks/useLike";

import {
  useToggleBookmark,
  useBookmarkStatus,
} from "@/hooks/useBookmark";

import CommentSection from "./CommentSection";
import EditPostDialog from "./EditPostDialog";
import DeletePostDialog from "./DeletePostDialog";

function PostCard({ post }) {
  const [showComments, setShowComments] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const { user } = useAuthContext();

  const isOwner =
    user?._id === post.author?._id;

  // ====================================
  // Like
  // ====================================

  const toggleLikeMutation =
    useToggleLike(post._id);

  const { data: likeCountData } =
    useLikeCount(post._id);

  const { data: likeStatusData } =
    useLikeStatus(post._id);

  const likeCount =
    likeCountData?.data?.likeCount || 0;

  const isLiked =
    likeStatusData?.data?.isLiked || false;

  // ====================================
  // Bookmark
  // ====================================

  const toggleBookmarkMutation =
    useToggleBookmark();

  const {
    data: bookmarkStatusData,
  } = useBookmarkStatus(post._id);

  const isBookmarked =
    bookmarkStatusData?.data?.bookmarked ||
    false;

  // ====================================
  // Render
  // ====================================

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-border/60
        bg-background/80
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-primary/15
        hover:shadow-md
      "
    >
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-4
        "
      >
        <Link
          to={`/profile/${post.author?.username}`}
          className="
            group/author
            relative
            z-10
            flex
            min-w-0
            cursor-pointer
            items-center
            gap-3
            rounded-xl
            outline-none
            transition-opacity
            hover:opacity-90
            focus-visible:ring-2
            focus-visible:ring-ring
          "
        >
          <Avatar
            className="
              h-10
              w-10
              border
              border-border/60
              transition-transform
              duration-200
              group-hover/author:scale-105
            "
          >
            <AvatarImage
              src={post.author?.avatar}
              alt={
                post.author?.fullName ||
                "Developer"
              }
            />

            <AvatarFallback
              className="
                bg-primary/10
                font-semibold
                text-primary
              "
            >
              {post.author?.fullName
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3
              className="
                truncate
                text-sm
                font-semibold
                transition-colors
                group-hover/author:text-primary
              "
            >
              {post.author?.fullName}
            </h3>

            <p
              className="
                truncate
                text-xs
                text-muted-foreground
              "
            >
              @{post.author?.username}
            </p>
          </div>
        </Link>

        {/* Owner Menu */}

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="
                  relative
                  z-20
                  h-8
                  w-8
                  rounded-lg
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40 rounded-xl"
            >
              <DropdownMenuItem
                onClick={() =>
                  setEditOpen(true)
                }
                className="cursor-pointer rounded-lg"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  setDeleteOpen(true)
                }
                className="
                  cursor-pointer
                  rounded-lg
                  text-red-500
                  focus:text-red-500
                "
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ================================= */}
      {/* Content */}
      {/* ================================= */}

      {post.content && (
        <div className="px-5 pb-4">
          <p
            className="
              whitespace-pre-wrap
              text-[15px]
              leading-7
              text-foreground/95
            "
          >
            {post.content}
          </p>
        </div>
      )}

      {/* ================================= */}
      {/* Image */}
      {/* ================================= */}

      {post.image && (
        <div
          className="
            overflow-hidden
            border-y
            border-border/60
            bg-muted/30
          "
        >
          <img
            src={post.image}
            alt="Post"
            loading="lazy"
            className="
              max-h-[560px]
              w-full
              object-contain
              transition-transform
              duration-500
              group-hover:scale-[1.005]
            "
          />
        </div>
      )}

      {/* ================================= */}
      {/* Actions */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-4
          gap-1
          border-t
          border-border/60
          p-1.5
        "
      >
        {/* Like */}

        <Button
          variant="ghost"
          className={`
            h-10
            gap-1.5
            rounded-xl
            text-xs
            font-medium
            transition-all

            ${
              isLiked
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/15 hover:text-red-500"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }
          `}
          onClick={() =>
            toggleLikeMutation.mutate()
          }
          disabled={
            toggleLikeMutation.isPending
          }
        >
          <Heart
            className={`
              h-4
              w-4
              transition-transform
              duration-200
              ${
                isLiked
                  ? "scale-110 fill-current"
                  : ""
              }
            `}
          />

          <span>{likeCount}</span>
        </Button>

        {/* Comment */}

        <Button
          variant="ghost"
          className="
            h-10
            gap-1.5
            rounded-xl
            text-xs
            font-medium
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
          "
          onClick={() =>
            setShowComments(
              (previous) => !previous
            )
          }
        >
          <MessageCircle className="h-4 w-4" />

          <span className="hidden sm:inline">
            Comment
          </span>
        </Button>

        {/* Bookmark */}

        <Button
          variant="ghost"
          className={`
            h-10
            gap-1.5
            rounded-xl
            text-xs
            font-medium
            transition-all

            ${
              isBookmarked
                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }
          `}
          onClick={() =>
            toggleBookmarkMutation.mutate(
              post._id
            )
          }
          disabled={
            toggleBookmarkMutation.isPending
          }
        >
          <Bookmark
            className={`
              h-4
              w-4
              ${
                isBookmarked
                  ? "fill-current"
                  : ""
              }
            `}
          />

          <span className="hidden sm:inline">
            {isBookmarked
              ? "Saved"
              : "Save"}
          </span>
        </Button>

        {/* Share */}

        <Button
          variant="ghost"
          className="
            h-10
            gap-1.5
            rounded-xl
            text-xs
            font-medium
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
          "
        >
          <Share2 className="h-4 w-4" />

          <span className="hidden sm:inline">
            Share
          </span>
        </Button>
      </div>

      {/* ================================= */}
      {/* Comments */}
      {/* ================================= */}

      {showComments && (
        <div
          className="
            border-t
            border-border/60
            bg-muted/20
            p-4
            sm:p-5
          "
        >
          <CommentSection
            postId={post._id}
          />
        </div>
      )}

      {/* ================================= */}
      {/* Dialogs */}
      {/* ================================= */}

      <EditPostDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        post={post}
      />

      <DeletePostDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        postId={post._id}
      />
    </article>
  );
}

export default PostCard;