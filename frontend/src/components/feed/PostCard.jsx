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

import EditPostDialog from "./EditPostDialog";
import DeletePostDialog from "./DeletePostDialog";

import { useAuthContext } from "@/context/AuthContext";

import { Pencil, Trash2 } from "lucide-react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";

import {
  useToggleLike,
  useLikeCount,
  useLikeStatus,
} from "@/hooks/useLike";

import CommentSection from "./CommentSection";

function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

const [deleteOpen, setDeleteOpen] =
  useState(false);

const { user } = useAuthContext();

const isOwner =
  user?._id === post.author?._id;

  const toggleLikeMutation = useToggleLike(post._id);

  const { data: likeCountData } = useLikeCount(post._id);

  const { data: likeStatusData } = useLikeStatus(post._id);

  const likeCount =
    likeCountData?.data?.likeCount || 0;

  const isLiked =
    likeStatusData?.data?.isLiked || false;

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
              <AvatarImage src={post.author?.avatar} />

              <AvatarFallback className="bg-violet-600 text-white">
                {post.author?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold leading-none hover:text-violet-600">
                {post.author?.fullName}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
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
        onClick={() => setEditOpen(true)}
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
            className={`flex-1 gap-2 transition-colors ${
              isLiked
                ? "text-red-500 hover:text-red-600"
                : ""
            }`}
            onClick={() =>
              toggleLikeMutation.mutate()
            }
            disabled={toggleLikeMutation.isPending}
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked ? "fill-current" : ""
              }`}
            />

            {likeCount}
          </Button>

          {/* Comment */}
          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() =>
              setShowComments(!showComments)
            }
          >
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>

          {/* Bookmark */}
          <Button
            variant="ghost"
            className="flex-1 gap-2"
          >
            <Bookmark className="h-5 w-5" />
            Save
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