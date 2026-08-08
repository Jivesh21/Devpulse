import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

import { useSuggestedDevelopers } from "@/hooks/useSuggestedDevelopers";
import {
  useToggleFollow,
  useFollowStatus,
} from "@/hooks/useFollow";

import {
  useTrending,
  useCommunityAnalytics,
} from "@/hooks/useTrending";

function RightSidebar() {
  const { data } = useSuggestedDevelopers();
const { data: trendingData } =
  useTrending();

const trending =
  trendingData?.data || [];
  const suggestedUsers =
    data?.data || [];
const { data: communityData } =
  useCommunityAnalytics();

const analytics =
  communityData?.data || {};
  return (
    <div className="space-y-5">
      {/* Trending */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />

            <h2 className="font-semibold">
              Trending Technologies
            </h2>
          </div>

          <div className="space-y-3">
           {trending.length > 0 ? (
  trending.map((item) => (
    <button
      key={item.name}
      type="button"
      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition hover:bg-muted"
    >
      <span className="text-sm font-medium">
        #{item.name}
      </span>

      <span className="text-xs font-semibold text-primary">
        {item.count}
      </span>
    </button>
  ))
) : (
  <p className="text-sm text-muted-foreground">
    No trending technologies yet.
  </p>
)}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Developers */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />

            <h2 className="font-semibold">
              Suggested Developers
            </h2>
          </div>

          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between"
              >
                <Link
                  to={`/profile/${user.username}`}
                  className="flex min-w-0 items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View ${user.fullName}'s profile`}
                >
                  <Avatar>
                    <AvatarImage
                      src={user.avatar}
                    />

                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.fullName}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </Link>

                <FollowButton user={user} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Activity */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />

            <h2 className="font-semibold">
              Community Activity
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Developers Online
              </span>

             <span className="font-semibold">
  {analytics.totalUsers ?? 0}
</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Posts Today
              </span>

              <span className="font-semibold">
                {analytics.totalPosts ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
              Bookmarkk
              </span>

              <span className="font-semibold">
                {analytics.totalBookmarks ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function FollowButton({ user }) {
  const { data: followData } = useFollowStatus(user._id);

  const toggleFollowMutation = useToggleFollow(user._id);

  const isFollowing =
    followData?.data?.isFollowing || false;

  return (
    <Button
      size="sm"
      variant={isFollowing ? "secondary" : "outline"}
      disabled={toggleFollowMutation.isPending}
      onClick={() =>
        toggleFollowMutation.mutate()
      }
    >
      {toggleFollowMutation.isPending
        ? "..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </Button>
  );
}

export default RightSidebar;
