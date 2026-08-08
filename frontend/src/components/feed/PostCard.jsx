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
  // Like Hooks
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
  // Bookmark Hooks
  // ====================================

  const toggleBookmarkMutation =
    useToggleBookmark();

  const {
    data: bookmarkStatusData,
  } = useBookmarkStatus(post._id);

  const isBookmarked =
    bookmarkStatusData?.data?.bookmarked ||
    false;

  return (
    <article
      className="
        glass-card
        glass-hover
        overflow-hidden
        transition-all
        duration-300
      "
    >
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="flex items-center justify-between p-5">
        <Link
          to={`/profile/${post.author?.username}`}
          className="
            group
            flex
            min-w-0
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
              h-11
              w-11
              border
              border-primary/10
              shadow-sm
              transition-transform
              duration-200
              group-hover:scale-105
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
                font-semibold
                transition-colors
                group-hover:text-primary
              "
            >
              {post.author?.fullName}
            </h3>

            <p className="truncate text-sm text-muted-foreground">
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
                  h-9
                  w-9
                  rounded-xl
                  text-muted-foreground
                  transition-all
                  duration-200
                  hover:bg-primary/10
                  hover:text-foreground
                  active:scale-95
                "
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                glass
                w-40
                rounded-xl
                p-1.5
              "
            >
              <DropdownMenuItem
                onClick={() =>
                  setEditOpen(true)
                }
                className="
                  cursor-pointer
                  rounded-lg
                "
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
        <div className="px-5 pb-5">
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
            bg-muted/40
          "
        >
          <img
            src={post.image}
            alt="Post"
            loading="lazy"
            className="
              max-h-[550px]
              w-full
              object-contain
              transition-transform
              duration-500
              hover:scale-[1.01]
            "
          />
        </div>
      )}

      {/* ================================= */}
      {/* Actions */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          gap-1
          border-t
          border-border/60
          p-2
        "
      >
        {/* Like */}
        <Button
          variant="ghost"
          className={`
            interactive
            flex-1
            gap-2
            rounded-xl
            text-muted-foreground
            transition-colors

            ${
              isLiked
                ? "text-red-500 hover:bg-red-500/10 hover:text-red-500"
                : "hover:bg-muted/70 hover:text-foreground"
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
              h-5
              w-5
              transition-transform
              duration-200

              ${
                isLiked
                  ? "fill-current scale-110"
                  : ""
              }
            `}
          />

          <span className="hidden sm:inline">
            {likeCount}
          </span>

          <span className="sm:hidden">
            {likeCount}
          </span>
        </Button>

        {/* Comment */}
        <Button
          variant="ghost"
          className={`
            interactive
            flex-1
            gap-2
            rounded-xl
            text-muted-foreground
            hover:bg-muted/70
            hover:text-foreground
          `}
          onClick={() =>
            setShowComments(
              (previous) => !previous
            )
          }
        >
          <MessageCircle className="h-5 w-5" />

          <span className="hidden sm:inline">
            Comment
          </span>
        </Button>

        {/* Bookmark */}
        <Button
          variant="ghost"
          className={`
            interactive
            flex-1
            gap-2
            rounded-xl
            text-muted-foreground

            ${
              isBookmarked
                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                : "hover:bg-muted/70 hover:text-foreground"
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
              h-5
              w-5
              transition-transform
              duration-200

              ${
                isBookmarked
                  ? "fill-current scale-105"
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
            interactive
            flex-1
            gap-2
            rounded-xl
            text-muted-foreground
            hover:bg-muted/70
            hover:text-foreground
          "
        >
          <Share2 className="h-5 w-5" />

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