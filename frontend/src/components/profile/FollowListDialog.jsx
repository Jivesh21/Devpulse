import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  useFollowers,
  useFollowing,
  useFollowStatus,
  useToggleFollow,
} from "@/hooks/useFollow";

function FollowListDialog({
  open,
  onOpenChange,
  userId,
  type,
}) {
  const [page, setPage] = useState(1);
  const followersQuery =
    useFollowers(userId, page);

  const followingQuery =
    useFollowing(userId, page);

  const query =
    type === "followers"
      ? followersQuery
      : followingQuery;

  const isLoading = query.isLoading;

  const list =
    type === "followers"
      ? query.data?.data?.followers || []
      : query.data?.data?.following || [];
  const pageData = query.data?.data;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            {type === "followers"
              ? "Followers"
              : "Following"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No {type} found.
          </div>
        ) : (
          <div className="space-y-4">

            {list.map((item) => {
              const user =
                type === "followers"
                  ? item.follower
                  : item.following;

              return <FollowListItem
                key={user._id}
                user={user}
                onProfileOpen={() => onOpenChange(false)}
              />;
            })}

            {pageData?.totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {pageData.currentPage} of {pageData.totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= pageData.totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button>
              </div>
            )}
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}

function FollowListItem({ user, onProfileOpen }) {
  const { data: statusData } = useFollowStatus(user._id);
  const toggleFollow = useToggleFollow(user._id);
  const isFollowing = statusData?.data?.isFollowing || false;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-muted">
      <Link
        to={`/profile/${user.username}`}
        onClick={onProfileOpen}
        className="flex min-w-0 items-center gap-3"
      >
        <Avatar>

                    <AvatarImage
                      src={user.avatar}
                    />

                    <AvatarFallback>
                      {user.fullName?.charAt(0)}
                    </AvatarFallback>

        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-medium">{user.fullName}</p>

          <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </Link>

      <Button
        size="sm"
        variant={isFollowing ? "secondary" : "outline"}
        disabled={toggleFollow.isPending}
        onClick={() => toggleFollow.mutate()}
      >
        {toggleFollow.isPending ? "..." : isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

export default FollowListDialog;
