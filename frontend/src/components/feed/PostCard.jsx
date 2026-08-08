import { useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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

  // ================================
  // Like Hooks
  // ================================
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

  // ================================
  // Bookmark Hooks
  // ================================
  const toggleBookmarkMutation =
    useToggleBookmark();

  const {
    data: bookmarkStatusData,
  } = useBookmarkStatus(post._id);

  const isBookmarked =
    bookmarkStatusData?.data?.bookmarked ||
    false;

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      <CardContent className="p-0">

        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <Link
            to={`/profile/${post.author?.username}`}
            className="flex items-center gap-3"
          >
            <Avatar className="h-11 w-11">
              <AvatarImage
                src={post.author?.avatar}
              />

              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.author?.fullName?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold hover:text-primary">
                {post.author?.fullName}
              </h3>

              <p className="text-sm text-muted-foreground">
                @{post.author?.username}
              </p>
            </div>
          </Link>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    setEditOpen(true)
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setDeleteOpen(true)
                  }
                  className="text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        {post.content && (
          <div className="px-5 pb-4">
            <p className="whitespace-pre-wrap leading-7">
              {post.content}
            </p>
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div className="border-y bg-muted">
            <img
              src={post.image}
              alt="Post"
              className="max-h-[550px] w-full object-contain"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-around border-t p-2">

          {/* Like */}
          <Button
            variant="ghost"
            className={`flex-1 gap-2 ${
              isLiked
                ? "text-red-500 hover:text-red-600"
                : ""
            }`}
            onClick={() =>
              toggleLikeMutation.mutate()
            }
            disabled={
              toggleLikeMutation.isPending
            }
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked
                  ? "fill-current"
                  : ""
              }`}
            />
            {likeCount}
          </Button>

          {/* Comment */}
          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() =>
              setShowComments(
                !showComments
              )
            }
          >
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>

          {/* Bookmark */}
          <Button
            variant="ghost"
            className={`flex-1 gap-2 ${
              isBookmarked
                ? "text-primary hover:text-primary/80"
                : ""
            }`}
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
              className={`h-5 w-5 ${
                isBookmarked
                  ? "fill-current"
                  : ""
              }`}
            />

            {isBookmarked
              ? "Saved"
              : "Save"}
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            className="flex-1 gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <CommentSection
            postId={post._id}
          />
        )}

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

      </CardContent>
    </Card>
  );
}

export default PostCard;
