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

import {
  useFollowers,
  useFollowing,
} from "@/hooks/useFollow";

function FollowListDialog({
  open,
  onOpenChange,
  userId,
  type,
}) {
  const followersQuery =
    useFollowers(userId);

  const followingQuery =
    useFollowing(userId);

  const query =
    type === "followers"
      ? followersQuery
      : followingQuery;

  const isLoading = query.isLoading;

  const list =
    type === "followers"
      ? query.data?.data?.followers || []
      : query.data?.data?.following || [];

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
            <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
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

              return (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  onClick={() =>
                    onOpenChange(false)
                  }
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-muted"
                >
                  <Avatar>

                    <AvatarImage
                      src={user.avatar}
                    />

                    <AvatarFallback>
                      {user.fullName?.charAt(0)}
                    </AvatarFallback>

                  </Avatar>

                  <div>
                    <p className="font-medium">
                      {user.fullName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>

                </Link>
              );
            })}

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}

export default FollowListDialog;