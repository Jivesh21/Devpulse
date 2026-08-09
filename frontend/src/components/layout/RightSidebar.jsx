import { Button } from "@/components/ui/button";
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
  Bookmark,
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
  const { data } =
    useSuggestedDevelopers();

  const { data: trendingData } =
    useTrending();

  const { data: communityData } =
    useCommunityAnalytics();

  const trending =
    trendingData?.data || [];

  const suggestedUsers =
    data?.data || [];

  const analytics =
    communityData?.data || {};

  return (
    <aside className="space-y-5">
      {/* ================================= */}
      {/* Trending Technologies */}
      {/* ================================= */}

      <section
        className="
          glass-card
          glass-hover
          p-5
        "
      >
        <div className="mb-4 flex items-center gap-2">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <TrendingUp className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-semibold">
              Trending Technologies
            </h2>

            <p className="text-xs text-muted-foreground">
              What's hot in the community
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {trending.length > 0 ? (
            trending.map((item) => (
              <button
                key={item.name}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  duration-200
                  hover:bg-primary/8
                "
              >
                <span className="text-sm font-medium transition-colors group-hover:text-primary">
                  #{item.name}
                </span>

                <span
                  className="
                    rounded-full
                    bg-primary/10
                    px-2
                    py-0.5
                    text-xs
                    font-semibold
                    text-primary
                  "
                >
                  {item.count}
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No trending technologies yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================= */}
      {/* Suggested Developers */}
      {/* ================================= */}

      <section
        className="
          glass-card
          glass-hover
          p-5
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Users className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-semibold">
              Suggested Developers
            </h2>

            <p className="text-xs text-muted-foreground">
              People you may know
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <div
                key={user._id}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <Link
                  to={`/profile/${user.username}`}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                    rounded-xl
                    outline-none
                    transition-all
                    duration-200
                    hover:opacity-80
                    focus-visible:ring-2
                    focus-visible:ring-ring
                  "
                  aria-label={`View ${user.fullName}'s profile`}
                >
                  <Avatar
                    className="
                      h-10
                      w-10
                      border
                      border-primary/10
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                  >
                    <AvatarImage
                      src={user.avatar}
                      alt={user.fullName}
                    />

                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.fullName
                        ?.split(" ")
                        .map(
                          (n) => n[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
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
            ))
          ) : (
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No developer suggestions yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================= */}
      {/* Community Activity */}
      {/* ================================= */}

      <section
        className="
          glass-card
          glass-hover
          p-5
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Activity className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-semibold">
              Community Activity
            </h2>

            <p className="text-xs text-muted-foreground">
              DevPulse at a glance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <AnalyticsRow
            label="Developers Online"
            value={analytics.totalUsers ?? 0}
          />

          <AnalyticsRow
            label="Posts Today"
            value={analytics.totalPosts ?? 0}
          />

          <AnalyticsRow
            label="Bookmarks"
            value={
              analytics.totalBookmarks ?? 0
            }
            icon={
              <Bookmark className="h-3.5 w-3.5" />
            }
          />
        </div>
      </section>
    </aside>
  );
}

/* ====================================
   Analytics Row
==================================== */

function AnalyticsRow({
  label,
  value,
  icon,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        bg-muted/40
        px-3
        py-3
        transition-colors
        duration-200
        hover:bg-muted/70
      "
    >
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

/* ====================================
   Follow Button
==================================== */

function FollowButton({ user }) {
  const { data: followData } =
    useFollowStatus(user._id);

  const toggleFollowMutation =
    useToggleFollow(user._id);

  const isFollowing =
    followData?.data?.isFollowing || false;

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={toggleFollowMutation.isPending}
      onClick={() =>
        toggleFollowMutation.mutate()
      }
      className={`
        shrink-0
        rounded-full
        border-primary/30
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-sm
        active:scale-95

        ${
          isFollowing
            ? `
              bg-primary/10
              text-primary
              hover:bg-primary/15
            `
            : `
              bg-background
              hover:border-primary/50
              hover:bg-primary/5
              hover:text-primary
            `
        }
      `}
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